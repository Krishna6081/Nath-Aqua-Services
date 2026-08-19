import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { authenticate } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin-only endpoints
router.post('/', authenticate, requireRole(['ADMIN']), createProduct);
router.put('/:id', authenticate, requireRole(['ADMIN']), updateProduct);
router.delete('/:id', authenticate, requireRole(['ADMIN']), deleteProduct);

export default router;
