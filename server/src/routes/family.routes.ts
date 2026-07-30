import { Router } from 'express';
import { getFamilyInviteCode, getFamilyMembers, joinFamily, setFamilyPin, verifyFamilyPin } from '../controllers/family.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.patch('/pin', authenticate, setFamilyPin);
router.post('/pin/verify', authenticate, verifyFamilyPin);
router.get('/invite', authenticate, getFamilyInviteCode);
router.get('/members', authenticate, getFamilyMembers);
router.post('/join', authenticate, joinFamily);

export default router;
