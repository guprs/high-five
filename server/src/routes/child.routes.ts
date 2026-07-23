import { Router } from 'express';
import {
    createChild,
    getChildren,
    getChildById,
    updateChild,
    deleteChild,
} from '../controllers/child.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', createChild);
router.get('/', getChildren);
router.get('/:id', getChildById);
router.patch('/:id', updateChild);
router.delete('/:id', deleteChild);

export default router;