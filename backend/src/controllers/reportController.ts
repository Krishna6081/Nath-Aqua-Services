import { Request, Response } from 'express';
import { prisma } from '../config/db';

export const getDailyReport = async (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const orders = await prisma.order.findMany({
      where: { deliveryDate: today },
      include: { items: { include: { product: true } } },
    });

    const totalOrders = orders.length;
    const deliveredOrders = orders.filter((o) => o.orderStatus === 'DELIVERED').length;
    const cancelledOrders = orders.filter((o) => o.orderStatus === 'CANCELLED').length;
    const revenue = orders
      .filter((o) => o.orderStatus === 'DELIVERED')
      .reduce((acc, o) => acc + o.totalAmount, 0);

    return res.status(200).json({
      success: true,
      period: 'daily',
      date: today,
      metrics: {
        totalOrders,
        deliveredOrders,
        cancelledOrders,
        revenue,
      },
      orders,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error generating daily report',
    });
  }
};

export const getMonthlyReport = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const totalOrders = orders.length;
    const deliveredOrders = orders.filter((o) => o.orderStatus === 'DELIVERED').length;
    const revenue = orders
      .filter((o) => o.orderStatus === 'DELIVERED')
      .reduce((acc, o) => acc + o.totalAmount, 0);

    return res.status(200).json({
      success: true,
      period: 'monthly',
      metrics: {
        totalOrders,
        deliveredOrders,
        revenue,
        avgOrderValue: totalOrders > 0 ? (revenue / totalOrders).toFixed(2) : 0,
      },
      orders,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error generating monthly report',
    });
  }
};
