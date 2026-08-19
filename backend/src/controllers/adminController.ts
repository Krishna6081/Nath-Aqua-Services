import { Request, Response } from 'express';
import { prisma } from '../config/db';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalCustomers = await prisma.user.count({ where: { role: 'CUSTOMER' } });
    const totalDeliveryStaff = await prisma.user.count({ where: { role: 'DELIVERY_PERSON' } });
    const totalOrders = await prisma.order.count();
    const pendingOrders = await prisma.order.count({ where: { orderStatus: 'PENDING' } });
    const deliveredOrders = await prisma.order.count({ where: { orderStatus: 'DELIVERED' } });
    const cancelledOrders = await prisma.order.count({ where: { orderStatus: 'CANCELLED' } });
    const activeSubscriptions = await prisma.subscription.count({ where: { status: 'ACTIVE' } });

    const totalRevenueResult = await prisma.order.aggregate({
      where: { orderStatus: 'DELIVERED' },
      _sum: { totalAmount: true },
    });

    const todayStr = new Date().toISOString().split('T')[0];
    const todayRevenueResult = await prisma.order.aggregate({
      where: {
        orderStatus: 'DELIVERED',
        deliveryDate: todayStr,
      },
      _sum: { totalAmount: true },
    });

    const totalRevenue = totalRevenueResult._sum.totalAmount || 0;
    const todayRevenue = todayRevenueResult._sum.totalAmount || 0;

    const lowStockProducts = await prisma.product.findMany({
      where: { stock: { lte: 20 } },
      select: { id: true, name: true, stock: true },
    });

    return res.status(200).json({
      success: true,
      stats: {
        totalCustomers,
        totalDeliveryStaff,
        totalOrders,
        pendingOrders,
        deliveredOrders,
        cancelledOrders,
        activeSubscriptions,
        totalRevenue,
        todayRevenue,
        lowStockCount: lowStockProducts.length,
      },
      lowStockProducts,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching admin dashboard statistics',
    });
  }
};

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isActive: true,
        createdAt: true,
        _count: { select: { orders: true, subscriptions: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({
      success: true,
      customers,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching customers',
    });
  }
};

export const toggleUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
    });

    return res.status(200).json({
      success: true,
      message: `User status changed to ${updated.isActive ? 'ACTIVE' : 'BLOCKED'}`,
      user: updated,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating user status',
    });
  }
};

export const getDeliveryStaff = async (req: Request, res: Response) => {
  try {
    const staff = await prisma.user.findMany({
      where: { role: 'DELIVERY_PERSON' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isActive: true,
        createdAt: true,
        _count: { select: { assignedDeliveries: true } },
      },
    });

    return res.status(200).json({
      success: true,
      staff,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching delivery staff',
    });
  }
};

export const getInventory = async (req: Request, res: Response) => {
  try {
    const inventory = await prisma.inventory.findMany({
      include: { product: true },
    });

    return res.status(200).json({
      success: true,
      inventory,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching inventory',
    });
  }
};
