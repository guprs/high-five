import { Router } from 'express';
import { getChildBadges } from '../controllers/badge.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/:childId', getChildBadges);

export default router;