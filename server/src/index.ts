import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import familyRoutes from './routes/family.routes';
import childRoutes from './routes/child.routes';
import taskRoutes from './routes/task.routes';
import childTaskRoutes from './routes/childTask.routes';
import taskCompletionRoutes from './routes/taskCompletion.routes';
import rankingRoutes from './routes/ranking.routes';
import rewardRoutes from './routes/reward.routes';
import rewardSuggestionsRoutes from './routes/rewardSuggestions.routes';
import rewardRequestRoutes from './routes/rewardRequest.routes';
import analyticsRoutes from './routes/analytics.routes';
import badgeRoutes from './routes/badge.routes';

const app = express();

app.use(cors({
    origin: [
        'http://localhost:5173',
        process.env.FRONTEND_URL || '',
    ].filter(Boolean),
}));
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/children', childRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/child-tasks', childTaskRoutes);
app.use('/api/task-completions', taskCompletionRoutes);
app.use('/api/ranking', rankingRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/rewards', rewardSuggestionsRoutes);
app.use('/api/reward-requests', rewardRequestRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/badges', badgeRoutes);

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});