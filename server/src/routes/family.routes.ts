import { Router } from 'express';
import { setFamilyPin, verifyFamilyPin } from '../controllers/family.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.patch('/pin', authenticate, setFamilyPin);
router.post('/pin/verify', authenticate, verifyFamilyPin);

export default router;