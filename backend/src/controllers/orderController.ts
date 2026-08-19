import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { prisma } from '../config/db';
import { generateOTP } from '../utils/otp';

export const createOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to place an order.',
      });
    }

    const { items, addressId, deliveryDate, deliveryTime, paymentMethod, couponCode } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order items cannot be empty.',
      });
    }

    if (!addressId) {
      return res.status(400).json({
        success: false,
        message: 'Delivery address selection is required.',
      });
    }

    // Verify Address
    const address = await prisma.address.findUnique({ where: { id: addressId } });
    if (!address) {
      return res.status(400).json({
        success: false,
        message: 'Selected delivery address does not exist.',
      });
    }

    // Calculate subtotal & delivery charges securely on backend
    let subtotal = 0;
    let totalDeliveryCharge = 0;
    const verifiedItems: any[] = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product || !product.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `Product "${product?.name || item.productId}" is currently unavailable.`,
        });
      }

      const qty = parseInt(item.quantity) || 1;
      if (product.stock < qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product "${product.name}".`,
        });
      }

      const itemTotal = product.price * qty;
      subtotal += itemTotal;
      totalDeliveryCharge += product.deliveryCharge;

      verifiedItems.push({
        productId: product.id,
        quantity: qty,
        unitPrice: product.price,
        totalPrice: itemTotal,
        currentStock: product.stock,
      });
    }

    // Coupon discount verification
    let discount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
      if (coupon && coupon.isActive && new Date() <= new Date(coupon.endDate)) {
        if (subtotal >= coupon.minOrderAmount) {
          if (coupon.discountType === 'PERCENTAGE') {
            discount = (subtotal * coupon.discountValue) / 100;
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
              discount = coupon.maxDiscount;
            }
          } else {
            discount = coupon.discountValue;
          }
        }
      }
    }

    const totalAmount = Math.max(0, subtotal + totalDeliveryCharge - discount);
    const orderNumber = 'NWS' + Date.now().toString().slice(-8);
    const deliveryOtp = generateOTP();

    const orderItemsData = verifiedItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
    }));

    // Create Order with Transaction
    const order = await prisma.$transaction(async (tx) => {
      // 1. Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          addressId,
          subtotal,
          deliveryCharge: totalDeliveryCharge,
          discount,
          totalAmount,
          paymentMethod: paymentMethod || 'COD',
          paymentStatus: 'PENDING',
          orderStatus: 'PENDING',
          deliveryDate: deliveryDate || new Date().toISOString().split('T')[0],
          deliveryTime: deliveryTime || '08:00 AM - 10:00 AM',
          deliveryOtp,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: { include: { product: true } },
          address: true,
        },
      });

      // 2. Safely deduct stock in Product & Inventory
      for (const item of verifiedItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });

        const inv = await tx.inventory.findUnique({ where: { productId: item.productId } });
        if (inv) {
          await tx.inventory.update({
            where: { productId: item.productId },
            data: { availableStock: { decrement: item.quantity } },
          });
        } else {
          await tx.inventory.create({
            data: {
              productId: item.productId,
              totalStock: Math.max(0, item.currentStock - item.quantity),
              availableStock: Math.max(0, item.currentStock - item.quantity),
            },
          });
        }
      }

      // 3. Create Notification for customer
      await tx.notification.create({
        data: {
          userId,
          title: 'Order Placed Successfully! 💧',
          message: `Your order #${orderNumber} for total ₹${totalAmount} has been placed.`,
          type: 'ORDER_PLACED',
        },
      });

      return newOrder;
    });

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order,
    });
  } catch (error: any) {
    console.error('Create order error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error creating order',
    });
  }
};

export const getOrders = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role;
    const { status } = req.query;

    const where: any = {};

    if (role === 'CUSTOMER') {
      where.userId = userId;
    } else if (role === 'DELIVERY_PERSON') {
      where.OR = [
        { deliveryPersonId: userId },
        { orderStatus: { in: ['PENDING', 'CONFIRMED', 'PREPARING', 'ASSIGNED', 'OUT_FOR_DELIVERY'] } },
      ];
    }

    if (status) {
      where.orderStatus = status as string;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: { include: { product: true } },
        address: true,
        user: { select: { id: true, name: true, phone: true, email: true } },
        deliveryPerson: { select: { id: true, name: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching orders',
    });
  }
};

export const getOrderById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        address: true,
        user: { select: { id: true, name: true, phone: true, email: true } },
        deliveryPerson: { select: { id: true, name: true, phone: true } },
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching order details',
    });
  }
};

export const updateOrderStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, deliveryPersonId } = req.body;
    const userId = req.user?.userId;

    const existingOrder = await prisma.order.findUnique({ where: { id } });
    if (!existingOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const updateData: any = {};
    if (status) updateData.orderStatus = status;
    if (deliveryPersonId) {
      updateData.deliveryPersonId = deliveryPersonId;
    } else if (req.user?.role === 'DELIVERY_PERSON') {
      updateData.deliveryPersonId = userId;
    }

    if (status === 'DELIVERED') {
      updateData.paymentStatus = 'SUCCESS';
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        items: { include: { product: true } },
        address: true,
      },
    });

    await prisma.notification.create({
      data: {
        userId: existingOrder.userId,
        title: `Order Update #${existingOrder.orderNumber}`,
        message: `Your order status changed to ${status}`,
        type: 'ORDER_UPDATE',
      },
    });

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order: updatedOrder,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating order status',
    });
  }
};

export const verifyDeliveryOtp = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { otp } = req.body;

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.deliveryOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP code. Please ask customer for correct 4-digit code.',
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        orderStatus: 'DELIVERED',
        paymentStatus: 'SUCCESS',
      },
    });

    await prisma.notification.create({
      data: {
        userId: order.userId,
        title: 'Order Delivered! 🎉',
        message: `Your water delivery #${order.orderNumber} has been verified and completed. Thank you!`,
        type: 'ORDER_DELIVERED',
      },
    });

    return res.status(200).json({
      success: true,
      message: 'OTP verified! Order successfully marked as DELIVERED.',
      order: updatedOrder,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error verifying OTP',
    });
  }
};

export const cancelOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const role = req.user?.role;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (role === 'CUSTOMER' && order.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to cancel this order' });
    }

    if (order.orderStatus === 'OUT_FOR_DELIVERY' || order.orderStatus === 'DELIVERED') {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled after dispatch or delivery.',
      });
    }

    const cancelledOrder = await prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: { id },
        data: { orderStatus: 'CANCELLED' },
      });

      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });

        const inv = await tx.inventory.findUnique({ where: { productId: item.productId } });
        if (inv) {
          await tx.inventory.update({
            where: { productId: item.productId },
            data: { availableStock: { increment: item.quantity } },
          });
        }
      }

      return updated;
    });

    return res.status(200).json({
      success: true,
      message: 'Order cancelled successfully and stock restored.',
      order: cancelledOrder,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error cancelling order',
    });
  }
};
