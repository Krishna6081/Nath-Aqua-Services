import { prisma } from '../config/db';
import { generateOTP } from '../utils/otp';

export const processRecurringSubscriptions = async () => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];

    // Find active subscriptions where nextDeliveryDate is today or past
    const activeSubscriptions = await prisma.subscription.findMany({
      where: {
        status: 'ACTIVE',
        nextDeliveryDate: { lte: todayStr },
      },
      include: {
        product: true,
        address: true,
        user: true,
      },
    });

    console.log(`🔄 [Subscription Scheduler] Found ${activeSubscriptions.length} active subscription(s) due for order generation.`);

    for (const sub of activeSubscriptions) {
      if (!sub.product || !sub.product.isAvailable) continue;

      // Prevent duplicate order creation if order was already generated today for this subscription
      const existingOrder = await prisma.order.findFirst({
        where: {
          userId: sub.userId,
          deliveryDate: sub.nextDeliveryDate,
          items: {
            some: { productId: sub.productId },
          },
        },
      });

      if (existingOrder) {
        console.log(`⚠️ Subscription #${sub.id} order already generated for ${sub.nextDeliveryDate}. Skipping duplicate.`);
        await updateNextDeliveryDate(sub);
        continue;
      }

      // Calculate order totals
      const subtotal = sub.product.price * sub.quantity;
      const deliveryCharge = sub.product.deliveryCharge;
      const totalAmount = subtotal + deliveryCharge;
      const orderNumber = 'SUB' + Date.now().toString().slice(-8);
      const deliveryOtp = generateOTP();

      // Transaction: create order, deduct stock, create notification
      await prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
          data: {
            orderNumber,
            userId: sub.userId,
            addressId: sub.addressId,
            subtotal,
            deliveryCharge,
            discount: 0,
            totalAmount,
            paymentMethod: 'COD',
            paymentStatus: 'PENDING',
            orderStatus: 'PENDING',
            deliveryDate: sub.nextDeliveryDate,
            deliveryTime: sub.deliveryTime,
            deliveryOtp,
            items: {
              create: [
                {
                  productId: sub.productId,
                  quantity: sub.quantity,
                  unitPrice: sub.product.price,
                  totalPrice: subtotal,
                },
              ],
            },
          },
        });

        // Deduct product stock
        await tx.product.update({
          where: { id: sub.productId },
          data: { stock: { decrement: sub.quantity } },
        });

        // Notify Customer
        await tx.notification.create({
          data: {
            userId: sub.userId,
            title: 'Recurring Water Order Scheduled 💧',
            message: `Order #${orderNumber} for your subscription has been automatically created for ${sub.nextDeliveryDate}.`,
            type: 'SUBSCRIPTION_ORDER_GENERATED',
          },
        });

        // Calculate next delivery date
        const nextDate = calculateNextDate(sub.nextDeliveryDate, sub.frequency);

        // Update Subscription record
        await tx.subscription.update({
          where: { id: sub.id },
          data: {
            lastGeneratedOrder: order.id,
            nextDeliveryDate: nextDate,
          },
        });
      });

      console.log(`✅ Subscription #${sub.id} generated Order #${orderNumber} for ${sub.nextDeliveryDate}`);
    }
  } catch (error) {
    console.error('❌ Error processing recurring subscriptions:', error);
  }
};

const calculateNextDate = (currentDateStr: string, frequency: string): string => {
  const date = new Date(currentDateStr);
  switch (frequency) {
    case 'DAILY':
      date.setDate(date.getDate() + 1);
      break;
    case 'ALTERNATE_DAYS':
      date.setDate(date.getDate() + 2);
      break;
    case 'WEEKLY':
      date.setDate(date.getDate() + 7);
      break;
    case 'MONTHLY':
      date.setDate(date.getDate() + 30);
      break;
    default:
      date.setDate(date.getDate() + 1);
  }
  return date.toISOString().split('T')[0];
};

const updateNextDeliveryDate = async (sub: any) => {
  const nextDate = calculateNextDate(sub.nextDeliveryDate, sub.frequency);
  await prisma.subscription.update({
    where: { id: sub.id },
    data: { nextDeliveryDate: nextDate },
  });
};
