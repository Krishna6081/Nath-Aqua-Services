import { Router } from 'express';
import { getDailyReport, getMonthlyReport } from '../controllers/reportController';
import { authenticate } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

router.use(authenticate, requireRole(['ADMIN']));

router.get('/daily', getDailyReport);
router.get('/monthly', getMonthlyReport);

export default router;
