import { Router } from 'express';
import { VoucherController } from '../controllers/voucher.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize as requireRole } from '../middleware/role.middleware';

const router = Router();

router.use(authenticate);

router.post('/', requireRole(['OWNER', 'ACCOUNTANT']), VoucherController.create);
router.get('/', requireRole(['OWNER', 'ACCOUNTANT']), VoucherController.getAll);

export default router;
