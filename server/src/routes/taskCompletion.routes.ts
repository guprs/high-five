import { Router } from 'express';
import {
    completeTask,
    uncompleteTask,
    getTodayCompletions,
} from '../controllers/taskCompletion.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/complete', completeTask);
router.post('/uncomplete', uncompleteTask);
router.get('/today/:childId', getTodayCompletions);

export default router;