import { Router } from 'express';
import { AccountController } from '../controllers/account.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
// Note: We use require for role middleware to avoid circular deps if any, or just import it.
import { authorize as requireRole } from '../middleware/role.middleware';

const router = Router();

// Protect routes
router.use(authenticate);

router.post('/', requireRole(['OWNER', 'ACCOUNTANT']), AccountController.create);
router.get('/', requireRole(['OWNER', 'ACCOUNTANT', 'WORKER']), AccountController.getAll);

export default router;
