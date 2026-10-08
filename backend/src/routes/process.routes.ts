import { Router } from 'express';
import { ProcessController } from '../controllers/process.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize as requireRole } from '../middleware/role.middleware';

const router = Router();

router.use(authenticate);

router.post('/drums', requireRole(['OWNER', 'WORKER']), ProcessController.createDrum);
router.get('/drums', requireRole(['OWNER', 'WORKER', 'ACCOUNTANT']), ProcessController.getAllDrums);

router.post('/lots', requireRole(['OWNER', 'WORKER']), ProcessController.createLot);
router.get('/lots', requireRole(['OWNER', 'WORKER', 'ACCOUNTANT']), ProcessController.getAllLots);

router.post('/allocate', requireRole(['OWNER', 'WORKER']), ProcessController.allocateDrum);
router.post('/release', requireRole(['OWNER', 'WORKER']), ProcessController.releaseDrum);

export default router;
