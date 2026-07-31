import { Router } from 'express';
import {
    createReward,
    getRewards,
    getRewardById,
    updateReward,
    deleteReward,
} from '../controllers/reward.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', createReward);
router.get('/', getRewards);
router.get('/:id', getRewardById);
router.patch('/:id', updateReward);
router.delete('/:id', deleteReward);

export default router;