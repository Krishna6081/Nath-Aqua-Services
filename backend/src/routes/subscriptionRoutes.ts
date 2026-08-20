import { Router } from 'express';
import {
  getSubscriptions,
  createSubscription,
  pauseSubscription,
  resumeSubscription,
  updateSubscriptionStatus,
  deleteSubscription,
} from '../controllers/subscriptionController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', getSubscriptions);
router.post('/', createSubscription);
router.post('/:id/pause', pauseSubscription);
router.post('/:id/resume', resumeSubscription);
router.put('/:id/status', updateSubscriptionStatus);
router.delete('/:id', deleteSubscription);

export default router;
