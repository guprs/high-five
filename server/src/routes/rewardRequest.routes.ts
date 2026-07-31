import { Router } from 'express';
import {
    createRewardRequest,
    getRewardRequests,
    approveRewardRequest,
    rejectRewardRequest,
    cancelRewardRequest,
} from '../controllers/rewardRequest.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', createRewardRequest);
router.get('/', getRewardRequests);
router.patch('/:id/approve', approveRewardRequest);
router.patch('/:id/reject', rejectRewardRequest);
router.delete('/:id', cancelRewardRequest);

export default router;