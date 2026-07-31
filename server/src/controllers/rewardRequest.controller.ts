import { Response } from 'express';
import { z } from 'zod';
import prisma from '../prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const createRequestSchema = z.object({
    childId: z.string().uuid(),
    rewardId: z.string().uuid(),
});

function formatRewardRequest(request: any) {
    return {
        id: request.id,
        status: request.status,
        requestedAt: request.requestedAt,
        resolvedAt: request.resolvedAt,
        childId: request.childId,
        rewardId: request.rewardId,
        childName: request.child?.name,
        childEmoji: request.child?.emoji,
        reward: request.reward?.title,
        cost: request.reward?.cost,
        child: request.child,
        rewardDetails: request.reward,
    };
}

export async function createRewardRequest(req: AuthRequest, res: Response) {
    try {
        const parsed = createRequestSchema.safeParse(req.body);

        if (!parsed.success) {
        return res.status(400).json({
            message: 'Please check your input.',
            errors: parsed.error.flatten().fieldErrors,
        });
        }

        const { childId, rewardId } = parsed.data;

        const child = await prisma.child.findFirst({
        where: { id: childId, familyId: req.familyId },
        });
        const reward = await prisma.reward.findFirst({
        where: { id: rewardId, familyId: req.familyId },
        });

        if (!child || !reward) {
        return res.status(404).json({ message: 'Child or reward not found.' });
        }

        const request = await prisma.rewardRequest.create({
        data: { childId, rewardId },
        include: { child: true, reward: true },
        });

        return res.status(201).json({ request: formatRewardRequest(request) });
    } catch (error) {
        console.error('CREATE REWARD REQUEST ERROR:', error);
        return res.status(500).json({ message: 'Could not create reward request.' });
    }
}

export async function getRewardRequests(req: AuthRequest, res: Response) {
    try {
        const statusFilter = req.query.status as string | undefined;

        const requests = await prisma.rewardRequest.findMany({
        where: {
            child: { familyId: req.familyId },
            ...(statusFilter ? { status: statusFilter } : {}),
        },
        include: { child: true, reward: true },
        orderBy: { requestedAt: 'desc' },
        });

        return res.json({ requests: requests.map(formatRewardRequest) });
    } catch (error) {
        console.error('GET REWARD REQUESTS ERROR:', error);
        return res.status(500).json({ message: 'Could not load reward requests.' });
    }
    }

export async function approveRewardRequest(req: AuthRequest, res: Response) {
    try {
        const id = req.params.id as string;

        const request = await prisma.rewardRequest.findFirst({
        where: { id, child: { familyId: req.familyId } },
        include: { child: true, reward: true },
        });

        if (!request) {
        return res.status(404).json({ message: 'Reward request not found.' });
        }

        if (request.status !== 'pending') {
        return res.status(409).json({ message: 'This request has already been resolved.' });
        }

        if (request.child.coins < request.reward.cost) {
        return res.status(400).json({ message: 'Child does not have enough coins for this reward.' });
        }

        await prisma.child.update({
        where: { id: request.childId },
        data: { coins: { decrement: request.reward.cost } },
        });

        const updated = await prisma.rewardRequest.update({
        where: { id },
        data: { status: 'approved', resolvedAt: new Date() },
        include: { child: true, reward: true },
        });

        return res.json({ request: formatRewardRequest(updated) });
    } catch (error) {
        console.error('APPROVE REWARD REQUEST ERROR:', error);
        return res.status(500).json({ message: 'Could not approve reward request.' });
    }
}

export async function rejectRewardRequest(req: AuthRequest, res: Response) {
    try {
        const id = req.params.id as string;

        const request = await prisma.rewardRequest.findFirst({
        where: { id, child: { familyId: req.familyId } },
        });

        if (!request) {
        return res.status(404).json({ message: 'Reward request not found.' });
        }

        if (request.status !== 'pending') {
        return res.status(409).json({ message: 'This request has already been resolved.' });
        }

        const updated = await prisma.rewardRequest.update({
        where: { id },
        data: { status: 'rejected', resolvedAt: new Date() },
        include: { child: true, reward: true },
        });

        return res.json({ request: formatRewardRequest(updated) });
    } catch (error) {
        console.error('REJECT REWARD REQUEST ERROR:', error);
        return res.status(500).json({ message: 'Could not reject reward request.' });
    }
}

export async function cancelRewardRequest(req: AuthRequest, res: Response) {
    try {
        const id = req.params.id as string;

        const request = await prisma.rewardRequest.findFirst({
        where: { id, child: { familyId: req.familyId } },
        });

        if (!request) {
        return res.status(404).json({ message: 'Reward request not found.' });
        }

        if (request.status !== 'pending') {
        return res.status(409).json({ message: 'This request has already been resolved.' });
        }

        await prisma.rewardRequest.delete({ where: { id } });

        return res.json({ message: 'Reward request cancelled.' });
    } catch (error) {
        console.error('CANCEL REWARD REQUEST ERROR:', error);
        return res.status(500).json({ message: 'Could not cancel reward request.' });
    }
}