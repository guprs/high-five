import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import type { KidTheme } from "../../data/themes";
import { getKidBadges, type KidBadge } from "../../services/kidMode";

interface Props { theme: KidTheme; childId: string }

const BADGES = [
  { type: "first_task", title: "First Quest", description: "Complete your first quest", icon: "⭐" },
  { type: "tasks_50", title: "Quest Hero", description: "Complete 50 quests", icon: "🏆" },
  { type: "tasks_100", title: "Quest Legend", description: "Complete 100 quests", icon: "👑" },
  { type: "streak_7", title: "Week of Wonder", description: "Build a 7-day streak", icon: "🔥" },
  { type: "streak_30", title: "Streak Superstar", description: "Build a 30-day streak", icon: "💎" },
];

export default function KidAchievementsTab({ theme, childId }: Props) {
  const [earned, setEarned] = useState<KidBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getKidBadges(childId)
      .then((badges) => { if (active) setEarned(badges); })
      .catch(() => { if (active) setError("Badges could not be loaded."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [childId]);

  const earnedTypes = new Set(earned.map((badge) => badge.type));
  const progress = Math.round((earned.length / BADGES.length) * 100);

  return <div className="space-y-5 overflow-x-hidden">
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-white/20 bg-white/15 p-5 text-center shadow-xl backdrop-blur-md">
      <div className="mb-2 text-6xl">🏆</div><h2 className="text-3xl font-black text-white">Hall of Fame</h2>
      <p className="mt-1 text-sm font-bold text-white/70">{earned.length} / {BADGES.length} badges unlocked</p>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/20"><motion.div animate={{ width: `${progress}%` }} className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-500" /></div>
    </motion.div>
    {error && <div role="alert" className="rounded-2xl bg-red-950/30 p-3 text-center text-sm font-bold text-white">{error}</div>}
    {loading ? <div className="flex justify-center py-12 text-white"><LoaderCircle className="h-8 w-8 animate-spin" /></div> :
      <div className="grid grid-cols-2 gap-4 px-1 py-2">{BADGES.map((badge, index) => {
        const unlocked = earnedTypes.has(badge.type);
        const realBadge = earned.find((item) => item.type === badge.type);
        return <motion.div key={badge.type} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: unlocked ? 1 : 0.5, scale: 1 }} transition={{ delay: index * 0.07 }} className="rounded-3xl border p-4 text-center shadow-lg" style={{ background: unlocked ? `linear-gradient(135deg, ${theme.cardFrom}, ${theme.cardTo})` : "rgba(255,255,255,.08)", borderColor: unlocked ? "rgba(255,255,255,.2)" : "rgba(255,255,255,.05)" }}>
          <div className={`mb-2 text-5xl ${unlocked ? "" : "grayscale"}`}>{realBadge?.icon ?? badge.icon}</div>
          <h3 className="text-sm font-black text-white">{realBadge?.title ?? badge.title}</h3><p className="mt-2 text-xs font-semibold text-white/70">{realBadge?.description ?? badge.description}</p>
          <div className={`mt-3 inline-block rounded-full px-3 py-1 text-[10px] font-black ${unlocked ? "bg-yellow-300/80 text-yellow-900" : "bg-white/10 text-white/60"}`}>{unlocked ? "✓ UNLOCKED" : "🔒 LOCKED"}</div>
        </motion.div>;
      })}</div>}
  </div>;
}
