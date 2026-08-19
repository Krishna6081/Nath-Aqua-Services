import { Router } from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  verifyDeliveryOtp,
  cancelOrder,
} from '../controllers/orderController';
import { authenticate } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

router.use(authenticate);

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/:id/cancel', cancelOrder);

// Delivery & Admin routes
router.put(
  '/:id/status',
  requireRole(['DELIVERY_PERSON', 'ADMIN']),
  updateOrderStatus
);

router.post(
  '/:id/verify-otp',
  requireRole(['DELIVERY_PERSON', 'ADMIN']),
  verifyDeliveryOtp
);

export default router;
