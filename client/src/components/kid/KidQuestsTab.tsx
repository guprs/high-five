import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Clock, LoaderCircle } from "lucide-react";

import type { KidTheme } from "../../data/themes";
import type { Child, Task } from "../../types/dashboard";
import {
  completeKidTask,
  getKidTasks,
  getTodayCompletions,
  type KidTask,
  uncompleteKidTask,
} from "../../services/kidMode";
import { startOfDay, taskOccursOnDate } from "../../utils/calendar";

interface Props {
  child: Child;
  theme: KidTheme;
  onComplete: (newBadges?: string[]) => void;
  onDataChanged: () => Promise<void>;
}

const CATEGORY_STYLE: Record<string, { emoji: string; from: string; to: string }> = {
  chores: { emoji: "🧹", from: "#8B5CF6", to: "#6366F1" },
  education: { emoji: "📚", from: "#10B981", to: "#059669" },
  school: { emoji: "📚", from: "#10B981", to: "#059669" },
  skills: { emoji: "🧠", from: "#0EA5E9", to: "#2563EB" },
  health: { emoji: "💪", from: "#F59E0B", to: "#EA580C" },
  kindness: { emoji: "💛", from: "#EC4899", to: "#F43F5E" },
  other: { emoji: "✨", from: "#3B82F6", to: "#2563EB" },
};

const WORLD_PROGRESS: Record<string, { companion: string; companionName: string; destination: string; destinationIcon: string }> = {
  space: { companion: "🤖", companionName: "Nova", destination: "Moon Base", destinationIcon: "🌕" },
  princess: { companion: "🦄", companionName: "Lumi", destination: "Crystal Castle", destinationIcon: "🏰" },
  ocean: { companion: "🐢", companionName: "Bubbles", destination: "Coral Palace", destinationIcon: "🪸" },
  jungle: { companion: "🦁", companionName: "Kito", destination: "Sun Temple", destinationIcon: "🛕" },
  rainbow: { companion: "🦄", companionName: "Spark", destination: "Cloud Kingdom", destinationIcon: "☁️" },
  dino: { companion: "🦕", companionName: "Rex", destination: "Volcano Valley", destinationIcon: "🌋" },
  pirate: { companion: "🦜", companionName: "Captain Pip", destination: "Hidden Cove", destinationIcon: "🏝️" },
  pixel: { companion: "👾", companionName: "Byte", destination: "Level 8 Castle", destinationIcon: "🏯" },
};

function categoryStyle(category?: string) {
  const normalized = (category ?? "other").replace(/^\p{Extended_Pictographic}\s*/u, "").trim().toLowerCase();
  return CATEGORY_STYLE[normalized] ?? CATEGORY_STYLE.other;
}

function asCalendarTask(task: KidTask): Task {
  return {
    ...task,
    category: task.category ?? "Other",
    catColor: "indigo",
    difficulty: task.difficulty ?? 1,
    assignedTo: [],
    status: "pending",
  };
}

function taskReward(task: KidTask) {
  const difficulty = Math.min(5, Math.max(1, task.difficulty ?? 1));
  const xp = Math.round(task.points * (1 + (difficulty - 1) * 0.25));
  return { xp, coins: Math.floor(xp / 2) };
}

export default function KidQuestsTab({ child, theme, onComplete, onDataChanged }: Props) {
  const [tasks, setTasks] = useState<KidTask[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionTaskId, setActionTaskId] = useState<string | null>(null);
  const [lastCompletedId, setLastCompletedId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([getKidTasks(child.id), getTodayCompletions(child.id)])
      .then(([assignedTasks, completions]) => {
        if (!active) return;
        const today = startOfDay(new Date());
        const todaysTasks = assignedTasks.filter(
          (task) => task.active !== false && taskOccursOnDate(asCalendarTask(task), today, today),
        );
        setTasks([...todaysTasks].sort((left, right) => {
          if (left.scheduledTime && right.scheduledTime) return left.scheduledTime.localeCompare(right.scheduledTime);
          if (left.scheduledTime) return -1;
          if (right.scheduledTime) return 1;
          return left.title.localeCompare(right.title);
        }));
        setCompletedIds(new Set(completions.map((completion) => completion.taskId)));
      })
      .catch(() => { if (active) setError("We couldn't load today's quests. Please try again."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [child.id]);

  const completed = tasks.filter((task) => completedIds.has(task.id)).length;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const world = WORLD_PROGRESS[theme.id] ?? WORLD_PROGRESS.space;
  const companionEnergy = progress;
  const earnedToday = tasks.reduce(
    (total, task) => {
      if (!completedIds.has(task.id)) return total;
      const reward = taskReward(task);
      return { xp: total.xp + reward.xp, coins: total.coins + reward.coins };
    },
    { xp: 0, coins: 0 },
  );
  const encouragement = completed === tasks.length
    ? `Legendary work, ${child.name}! You completed today's whole ${theme.name} route! 🏆`
    : completed === tasks.length - 1
      ? `So close, ${child.name}! One more checkpoint to finish today's adventure! 🎁`
      : `Amazing job, ${child.name}! ${tasks.length - completed} more checkpoint${tasks.length - completed === 1 ? "" : "s"} to go! ✨`;

  async function toggleTask(task: KidTask) {
    if (actionTaskId) return;
    const wasCompleted = completedIds.has(task.id);
    setActionTaskId(task.id);
    setError("");
    try {
      if (wasCompleted) {
        await uncompleteKidTask(child.id, task.id);
        setCompletedIds((current) => {
          const next = new Set(current);
          next.delete(task.id);
          return next;
        });
      } else {
        const result = await completeKidTask(child.id, task.id);
        setCompletedIds((current) => new Set(current).add(task.id));
        setLastCompletedId(task.id);
        onComplete(result.newBadges);
      }
      await onDataChanged();
    } catch {
      setError("That quest could not be updated. Please try again.");
    } finally {
      setActionTaskId(null);
    }
  }

  return (
    <div className="space-y-5 overflow-x-hidden">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-white/20 bg-white/15 p-5 shadow-xl backdrop-blur-md">
        <div className="mb-3 flex justify-between text-sm font-bold text-white">
          <span>Today's Quests ⚔️</span><span>{completed}/{tasks.length}</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-white/20">
          <motion.div animate={{ width: `${progress}%` }} className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500" />
        </div>
        <p className="mt-2 text-xs font-bold text-white/70">{progress}% complete</p>
      </motion.div>

      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-white/20 bg-white/15 p-4 shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <motion.div animate={{ y: [0, -7, 0], rotate: [-3, 3, -3] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }} className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/20 text-4xl shadow-inner">{world.companion}</motion.div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black text-white">{world.companionName} is travelling with you!</p>
            <p className="mt-0.5 text-xs font-semibold text-white/70">Complete quests to give them energy for {world.destination}.</p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/20"><motion.div animate={{ width: `${companionEnergy}%` }} className="h-full rounded-full bg-gradient-to-r from-yellow-300 to-orange-400" /></div>
          </div>
          <span className="text-xs font-black text-yellow-200">{companionEnergy}%</span>
        </div>
      </motion.section>

      {tasks.length > 0 && <>
        <section className="rounded-3xl border border-white/15 bg-black/10 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3">
            <div><p className="text-xs font-bold uppercase tracking-wider text-white/60">Today’s adventure</p><h2 className="text-lg font-black text-white">Reach {world.destination}</h2></div>
            <span className="rounded-full bg-yellow-300/20 px-2 py-1 text-[10px] font-black text-yellow-100">{completed === tasks.length ? "✓ Destination reached" : `${tasks.length - completed} to go`}</span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-2xl bg-white/10 p-2 text-center"><div className="text-xl">✅</div><div className="text-[10px] font-bold text-white">Quests</div><div className="mt-1 text-xs font-black text-white/80">{completed}/{tasks.length}</div></div>
            <div className="rounded-2xl bg-white/10 p-2 text-center"><div className="text-xl">⚡</div><div className="text-[10px] font-bold text-white">XP earned</div><div className="mt-1 text-xs font-black text-white/80">+{earnedToday.xp}</div></div>
            <div className="rounded-2xl bg-white/10 p-2 text-center"><div className="text-xl">⭐</div><div className="text-[10px] font-bold text-white">Coins earned</div><div className="mt-1 text-xs font-black text-white/80">+{earnedToday.coins}</div></div>
          </div>
        </section>

        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl border border-white/20 bg-black/15 p-4 shadow-xl backdrop-blur-sm">
          <div className="relative mb-3"><p className="text-xs font-bold uppercase tracking-wider text-white/60">{theme.name} map</p><h2 className="text-lg font-black text-white">Your adventure trail</h2></div>
          <div className="overflow-x-auto pb-3 pt-1 [scrollbar-width:thin]">
            <div className="relative flex w-max min-w-full items-start justify-between gap-5 px-2">
              <div className="absolute left-8 right-9 top-6 h-1 rounded-full bg-white/25">
                <span className="absolute right-0 top-1/2 -translate-y-1/2 text-sm text-white/60">▶</span>
              </div>
              {tasks.map((task, index) => {
                const reached = completedIds.has(task.id);
                const taskAvatar = categoryStyle(task.category).emoji;
                return <div key={task.id} className="relative z-10 w-24 shrink-0 text-center"><motion.div animate={reached ? { scale: [1, 1.15, 1] } : { y: [0, -4, 0] }} transition={{ duration: reached ? 0.45 : 2.2, repeat: reached ? 0 : Infinity, delay: index * 0.2 }} className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border-2 text-2xl shadow-lg ${reached ? "border-white bg-emerald-400" : "border-white/50 bg-white/20"}`}>{reached ? "✓" : taskAvatar}</motion.div><p className="mt-2 truncate text-[10px] font-bold text-white/90">{task.title}</p><p className="mt-0.5 text-[9px] font-bold text-white/55">Quest {index + 1}</p></div>;
              })}
              <div className="relative z-10 w-28 shrink-0 text-center">
                <motion.div
                  animate={completed === tasks.length ? { scale: [1, 1.18, 1], rotate: [-2, 2, -2] } : { scale: 1 }}
                  transition={{ duration: 1.4, repeat: completed === tasks.length ? Infinity : 0 }}
                  className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border-2 text-3xl shadow-xl ${completed === tasks.length ? "border-yellow-200 bg-yellow-300" : "border-white/40 bg-black/40 grayscale"}`}
                >
                  {world.destinationIcon}
                </motion.div>
                <p className="mt-2 text-[10px] font-black leading-tight text-white">Goal: {world.destination}</p>
                <p className="mt-0.5 text-[9px] font-bold text-white/60">{completed === tasks.length ? "Reached!" : "Finish all quests"}</p>
              </div>
            </div>
          </div>
        </motion.section>
      </>}

      {lastCompletedId && <motion.div key={lastCompletedId} initial={{ opacity: 0, scale: 0.9, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="rounded-3xl border border-white/25 bg-white/20 p-4 text-center shadow-lg backdrop-blur-sm"><div className="mb-1 text-3xl">{completed === tasks.length ? "🏆" : "🌟"}</div><p className="text-sm font-black text-white">{encouragement}</p>{completed < tasks.length && <p className="mt-1 text-xs font-semibold text-white/70">📡 Mission sent to Mission Control for a grown-up to celebrate. Keep exploring — the next stop is waiting for you.</p>}</motion.div>}

      {error && <div role="alert" className="rounded-2xl bg-red-950/30 p-3 text-center text-sm font-bold text-white">{error}</div>}

      {loading ? (
        <div className="flex justify-center py-12 text-white"><LoaderCircle className="h-8 w-8 animate-spin" /></div>
      ) : tasks.length === 0 ? (
        <div className="rounded-3xl border border-white/20 bg-white/15 p-8 text-center text-white backdrop-blur-sm">
          <div className="text-5xl">🎉</div><h2 className="mt-3 text-xl font-black">No quests today</h2><p className="mt-1 text-sm font-semibold text-white/70">Enjoy your free time or check again later.</p>
        </div>
      ) : (
        <div className="space-y-4 px-1">
          {tasks.map((task, index) => {
            const done = completedIds.has(task.id);
            const busy = actionTaskId === task.id;
            const style = categoryStyle(task.category);
            const reward = taskReward(task);
            return (
              <motion.article key={task.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: done ? 0.75 : 1, y: 0 }} transition={{ delay: index * 0.06 }} className="rounded-3xl border border-white/20 p-4 shadow-xl" style={{ background: `linear-gradient(135deg, ${style.from}, ${style.to})` }}>
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-3xl">{style.emoji}</div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-black text-white">{task.title}</h3>
                    {task.description && <p className="mt-0.5 line-clamp-2 text-xs font-semibold text-white/75">{task.description}</p>}
                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs font-bold text-white/85">
                      {task.scheduledTime && <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{task.scheduledTime}</span>}
                      <span>⚡ +{reward.xp} XP</span><span>⭐ +{reward.coins}</span>
                    </div>
                  </div>
                  <motion.button whileTap={{ scale: 0.9 }} disabled={Boolean(actionTaskId)} onClick={() => void toggleTask(task)} aria-label={done ? `Mark ${task.title} as not completed` : `Complete ${task.title}`} className={`flex h-12 shrink-0 items-center justify-center rounded-2xl shadow-xl disabled:opacity-60 ${done ? "min-w-20 gap-1.5 bg-emerald-400 px-3 text-white" : "w-12 bg-white"}`}>
                    {busy ? <LoaderCircle className="h-6 w-6 animate-spin" style={{ color: done ? "white" : style.from }} /> : done ? <><Check className="h-5 w-5" /><span className="text-sm font-black">Done</span></> : <Check className="h-7 w-7" style={{ color: style.from }} />}
                  </motion.button>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}
    </div>
  );
}
