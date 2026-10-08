import { Router } from 'express';
import { InventoryController } from '../controllers/inventory.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize as requireRole } from '../middleware/role.middleware';

const router = Router();

router.use(authenticate);

router.post('/', requireRole(['OWNER', 'WORKER']), InventoryController.createChemical);
router.get('/', requireRole(['OWNER', 'WORKER', 'ACCOUNTANT']), InventoryController.getAllChemicals);
router.post('/issue', requireRole(['OWNER', 'WORKER']), InventoryController.issueChemical);

export default router;
