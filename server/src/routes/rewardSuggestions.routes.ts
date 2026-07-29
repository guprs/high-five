import { Router } from 'express';
import { getRewardSuggestions } from '../controllers/rewardSuggestions.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/suggestions', getRewardSuggestions);

export default router;