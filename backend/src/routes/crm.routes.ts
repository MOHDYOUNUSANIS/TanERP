import { Router } from 'express';
import { CrmController } from '../controllers/crm.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize as requireRole } from '../middleware/role.middleware';

const router = Router();
router.use(authenticate);

router.post('/suppliers', requireRole(['OWNER', 'WORKER']), CrmController.createSupplier);
router.get('/suppliers', requireRole(['OWNER', 'WORKER', 'ACCOUNTANT']), CrmController.getSuppliers);

router.post('/customers', requireRole(['OWNER', 'WORKER']), CrmController.createCustomer);
router.get('/customers', requireRole(['OWNER', 'WORKER', 'ACCOUNTANT']), CrmController.getCustomers);

export default router;
