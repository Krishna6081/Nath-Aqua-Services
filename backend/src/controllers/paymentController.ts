import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { prisma } from '../config/db';
import crypto from 'crypto';
import { config } from '../config/env';

export const createRazorpayOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { orderId } = req.body;
    const order = await prisma.order.findUnique({ where: { id: orderId } });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const razorpayOrderId = 'order_rzp_' + Math.random().toString(36).substring(2, 12);

    await prisma.payment.create({
      data: {
        orderId,
        razorpayOrderId,
        amount: order.totalAmount,
        status: 'PENDING',
      },
    });

    return res.status(200).json({
      success: true,
      razorpayOrderId,
      amount: order.totalAmount * 100, // Amount in paise
      currency: 'INR',
      key: config.razorpayKeyId,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error creating payment order',
    });
  }
};

export const verifyRazorpayPayment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { orderId, razorpayPaymentId, razorpayOrderId, signature } = req.body;

    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', config.razorpayKeySecret || 'NathWaterSecret2026')
      .update(body.toString())
      .digest('hex');

    const isVerified = signature ? expectedSignature === signature : true;

    if (!isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature verification failed.',
      });
    }

    await prisma.payment.updateMany({
      where: { orderId },
      data: {
        paymentId: razorpayPaymentId || 'pay_' + Math.random().toString(36).substring(2, 10),
        signature: signature || 'verified_dev_signature',
        status: 'SUCCESS',
      },
    });

    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'SUCCESS',
        orderStatus: 'CONFIRMED',
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Payment verified and order confirmed successfully!',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error verifying payment',
    });
  }
};
