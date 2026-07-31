import { Router } from 'express';
import {
    getFamilyInviteCode,
    joinFamily,
    leaveFamily,
    setFamilyPin,
    verifyFamilyPin,
    getFamilyMembers,
} from '../controllers/family.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.patch('/pin', authenticate, setFamilyPin);
router.post('/pin/verify', authenticate, verifyFamilyPin);
router.get('/invite', authenticate, getFamilyInviteCode);
router.post('/join', authenticate, joinFamily);
router.post('/leave', authenticate, leaveFamily);
router.get('/members', authenticate, getFamilyMembers);

export default router;