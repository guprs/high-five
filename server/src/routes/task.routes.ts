import { Router } from 'express';
import {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
} from '../controllers/task.controller';
import { getTaskSuggestions } from '../controllers/taskSuggestions.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/suggestions', getTaskSuggestions);
router.post('/', createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
