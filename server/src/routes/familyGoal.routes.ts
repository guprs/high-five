import { Router } from 'express';
import {
    createFamilyGoal,
    getFamilyGoals,
    deleteFamilyGoal,
} from '../controllers/familyGoal.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', createFamilyGoal);
router.get('/', getFamilyGoals);
router.delete('/:id', deleteFamilyGoal);

export default router;