import { Router } from 'express';
import { getCoupons, validateCoupon, createCoupon } from '../controllers/couponController';
import { authenticate } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

router.get('/', getCoupons);
router.post('/validate', authenticate, validateCoupon);
router.post('/', authenticate, requireRole(['ADMIN']), createCoupon);

export default router;
