export const XP_PER_LEVEL = 100;

export function getLevelXpProgress(totalXp: number) {
  const current = Math.max(0, totalXp) % XP_PER_LEVEL;
  return {
    current,
    max: XP_PER_LEVEL,
    remaining: XP_PER_LEVEL - current,
  };
}
