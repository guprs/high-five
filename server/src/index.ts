import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import familyRoutes from './routes/family.routes';
import childRoutes from './routes/child.routes';
import taskRoutes from './routes/task.routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/children', childRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});