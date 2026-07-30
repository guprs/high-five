import { Router } from 'express';
import { register, login, changePassword } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.patch('/password', authenticate, changePassword);

export default router;
