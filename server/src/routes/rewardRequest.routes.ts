import { Router } from 'express';
import {
    createRewardRequest,
    getRewardRequests,
    approveRewardRequest,
    rejectRewardRequest,
} from '../controllers/rewardRequest.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', createRewardRequest);
router.get('/', getRewardRequests);
router.patch('/:id/approve', approveRewardRequest);
router.patch('/:id/reject', rejectRewardRequest);

export default router;