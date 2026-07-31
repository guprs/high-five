export function calculateDifficultyMultiplier(difficulty?: number | null): number {
    if (!difficulty) return 1;
    const clamped = Math.min(Math.max(difficulty, 1), 5);
  return 1 + (clamped - 1) * 0.25;
}

export function calculateWeightedPoints(basePoints: number, difficulty?: number | null): number {
  return Math.round(basePoints * calculateDifficultyMultiplier(difficulty));
}