import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { prisma } from '../config/db';

export const getSubscriptions = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role;

    const where: any = {};
    if (role !== 'ADMIN' && userId) {
      where.userId = userId;
    }

    const subscriptions = await prisma.subscription.findMany({
      where,
      include: {
        product: true,
        address: true,
        user: { select: { id: true, name: true, phone: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({
      success: true,
      count: subscriptions.length,
      subscriptions,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching subscriptions',
    });
  }
};

export const createSubscription = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId!;
    const { productId, quantity, frequency, startDate, endDate, deliveryTime, addressId } = req.body;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(400).json({ success: false, message: 'Product not found' });
    }

    const address = await prisma.address.findUnique({ where: { id: addressId } });
    if (!address) {
      return res.status(400).json({ success: false, message: 'Address not found' });
    }

    const start = startDate || new Date().toISOString().split('T')[0];

    const subscription = await prisma.subscription.create({
      data: {
        userId,
        productId,
        quantity: parseInt(quantity) || 1,
        frequency: frequency || 'DAILY',
        startDate: start,
        endDate,
        deliveryTime: deliveryTime || '08:00 AM - 10:00 AM',
        addressId,
        nextDeliveryDate: start,
        status: 'ACTIVE',
      },
      include: { product: true, address: true },
    });

    await prisma.notification.create({
      data: {
        userId,
        title: 'Subscription Activated! 💧',
        message: `Your recurring water delivery subscription for ${product.name} (${frequency}) is active.`,
        type: 'SUBSCRIPTION_ACTIVE',
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Recurring water subscription created successfully',
      subscription,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error creating subscription',
    });
  }
};

export const pauseSubscription = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const subscription = await prisma.subscription.update({
      where: { id },
      data: { status: 'PAUSED' },
      include: { product: true },
    });

    return res.status(200).json({
      success: true,
      message: 'Subscription paused successfully',
      subscription,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error pausing subscription',
    });
  }
};

export const resumeSubscription = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const subscription = await prisma.subscription.update({
      where: { id },
      data: { status: 'ACTIVE' },
      include: { product: true },
    });

    return res.status(200).json({
      success: true,
      message: 'Subscription resumed successfully',
      subscription,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error resuming subscription',
    });
  }
};

export const updateSubscriptionStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const subscription = await prisma.subscription.update({
      where: { id },
      data: { status },
      include: { product: true, address: true },
    });

    return res.status(200).json({
      success: true,
      message: `Subscription status updated to ${status}`,
      subscription,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating subscription status',
    });
  }
};

export const deleteSubscription = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.subscription.delete({ where: { id } });

    return res.status(200).json({
      success: true,
      message: 'Subscription cancelled and removed successfully',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error deleting subscription',
    });
  }
};
