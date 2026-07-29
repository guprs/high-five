import { Response } from 'express';
import { z } from 'zod';
import OpenAI from 'openai';
import { AuthRequest } from '../middleware/auth.middleware';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const suggestionsSchema = z.object({
    age: z.number().int().min(1).max(18).optional(),
    interests: z.array(z.string()).max(10).optional().default([]),
    preferences: z.array(z.string()).max(10).optional().default([]),
    rewardTypes: z.array(z.string()).max(10).optional().default([]),
    count: z.number().int().min(1).max(5).optional().default(5),
});

export async function getRewardSuggestions(req: AuthRequest, res: Response) {
    const parsed = suggestionsSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
            message: 'Please check your input.',
            errors: parsed.error.flatten().fieldErrors,
        });
    }

    const { age, interests, preferences, rewardTypes, count } = parsed.data;

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4.1-nano',
            max_tokens: 600,
            messages: [
        {
            role: 'system',
            content:
                'You suggest age-appropriate, screen-conscious reward ideas for a family chore-tracking app for children. Rewards are redeemed with in-app coins earned by completing tasks. Never suggest anything unsafe, inappropriate, screen-based (unless explicitly requested via preferences), or involving real money. Respond with strict JSON only, no extra commentary.',
        },
        {
            role: 'user',
            content: JSON.stringify({
            childAge: age ?? 'unspecified',
            interests,
            preferences,
            rewardTypes,
            numberOfSuggestions: count,
            }),
        },
        ],
        response_format: {
        type: 'json_schema',
        json_schema: {
            name: 'reward_suggestions',
            strict: true,
            schema: {
            type: 'object',
            properties: {
                suggestions: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                    title: { type: 'string' },
                    icon: { type: 'string' },
                    cost: { type: 'integer' },
                    reason: { type: 'string' },
                    },
                    required: ['title', 'icon', 'cost', 'reason'],
                    additionalProperties: false,
                },
                },
            },
            required: ['suggestions'],
            additionalProperties: false,
            },
        },
        },
    });

    const raw = completion.choices[0]?.message?.content;

    if (!raw) {
        return res.status(502).json({ message: 'AI did not return a response.' });
    }

    const parsedResponse = JSON.parse(raw);
    const suggestions = Array.isArray(parsedResponse.suggestions)
        ? parsedResponse.suggestions.slice(0, count)
        : [];

    return res.json({ suggestions });
    } catch (error) {
    console.error('REWARD SUGGESTIONS ERROR:', error);
    return res.status(502).json({ message: 'Could not generate reward suggestions right now.' });
    }
}