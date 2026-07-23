import { Router } from 'express';
import {
    assignTaskToChild,
    unassignTaskFromChild,
    getChildTasks,
} from '../controllers/childTask.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', assignTaskToChild);
router.delete('/:childId/:taskId', unassignTaskFromChild);
router.get('/:childId', getChildTasks);

export default router;