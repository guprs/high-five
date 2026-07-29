export interface RewardIdeaInput {
  age?: number;
  interests: string[];
  preferences: string[];
  rewardTypes: string[];
  count: number;
}

export interface RewardIdea {
  title: string;
  icon: string;
  cost: number;
  reason: string;
}

const MOCK_IDEAS: RewardIdea[] = [
  {
    title: "Choose tonight's family game",
    icon: "🎲",
    cost: 80,
    reason: "A screen-free activity that gives the child a meaningful choice.",
  },
  {
    title: "Pick the weekend breakfast",
    icon: "🥞",
    cost: 60,
    reason: "A simple family privilege that feels special without costing much.",
  },
  {
    title: "Creative hour with a parent",
    icon: "🎨",
    cost: 100,
    reason: "Dedicated time for drawing, building, music, or another favorite activity.",
  },
  {
    title: "Indoor picnic night",
    icon: "🧺",
    cost: 120,
    reason: "A calm shared experience that can be adapted to different sensory needs.",
  },
  {
    title: "Stay up 20 minutes later",
    icon: "🌙",
    cost: 150,
    reason: "A memorable privilege that works well as an occasional reward.",
  },
  {
    title: "Choose the family walk route",
    icon: "🌳",
    cost: 70,
    reason: "An active, no-cost reward with choice and family time built in.",
  },
];

// Frontend mock for the future POST /api/rewards/suggestions endpoint.
// Keep this function signature when replacing the mock with api.post(...).
export async function generateRewardIdeas(
  input: RewardIdeaInput,
): Promise<RewardIdea[]> {
  await new Promise((resolve) => window.setTimeout(resolve, 700));

  const interest = input.interests[0]?.trim();
  const personalizedIdea: RewardIdea | null = interest
    ? {
        title: `Choose a special ${interest} activity`,
        icon: "✨",
        cost: input.age && input.age < 8 ? 60 : 100,
        reason: `Uses the child's interest in ${interest} to make the reward feel personal.`,
      }
    : null;

  return [...(personalizedIdea ? [personalizedIdea] : []), ...MOCK_IDEAS].slice(
    0,
    input.count,
  );
}
