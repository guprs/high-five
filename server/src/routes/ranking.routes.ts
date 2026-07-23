import { Router } from 'express';
import { getWeeklyRanking } from '../controllers/ranking.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/weekly', getWeeklyRanking);

export default router;