import { Router } from 'express';
import {
  getDashboardStats,
  getCustomers,
  toggleUserStatus,
  getDeliveryStaff,
  getInventory,
} from '../controllers/adminController';
import { authenticate } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

router.use(authenticate, requireRole(['ADMIN']));

router.get('/dashboard', getDashboardStats);
router.get('/customers', getCustomers);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.get('/delivery-staff', getDeliveryStaff);
router.get('/inventory', getInventory);

export default router;
