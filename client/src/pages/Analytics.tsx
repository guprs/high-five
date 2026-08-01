import { RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  getAnalytics,
  type AnalyticsResponse,
} from "../services/analytics";
import { getChildren } from "../services/child";
import PageHeader from "../components/PageHeader";

const MEDALS = ["🥇", "🥈", "🥉"];
const CHART_COLORS = [
  "#8B5CF6",
  "#3B82F6",
  "#EC4899",
  "#059669",
  "#F59E0B",
  "#EF4444",
];
const tooltipStyle = {
  borderRadius: 12,
  border: "none",
  boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
  fontSize: 12,
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function RankingAvatar({
  name,
  index,
  avatar,
}: {
  name: string;
  index: number;
  avatar?: string;
}) {
  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-black text-white"
      style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
    >
      {avatar || initials(name)}
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-full items-center justify-center rounded-xl bg-gray-50 px-4 text-center text-xs text-gray-400">
      {message}
    </div>
  );
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [childAvatars, setChildAvatars] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function loadAnalytics() {
    try {
      setLoading(true);
      setError(false);
      const [analyticsData, children] = await Promise.all([
        getAnalytics(),
        getChildren(),
      ]);
      setAnalytics(analyticsData);
      setChildAvatars(
        Object.fromEntries(
          children.map((child) => [child.id, child.avatar || child.emoji || "🧒"]),
        ),
      );
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(loadAnalytics);
  }, []);

  const weeklyData = useMemo(
    () =>
      analytics?.weeklyCompletionsPerChild.map((entry) => ({
        name: entry.name,
        tasks: entry.completions,
      })) ?? [],
    [analytics],
  );

  const xpData = useMemo(
    () =>
      analytics?.fourWeekXpProgress.map((entry) => ({
        week: new Date(entry.weekStart).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
        }),
        xp: entry.xp,
      })) ?? [],
    [analytics],
  );

  const categoryData = useMemo(() => {
    const entries = analytics?.categoryDistribution ?? [];
    const total = entries.reduce((sum, entry) => sum + entry.count, 0);
    return entries.map((entry, index) => ({
      name: entry.category,
      value: entry.count,
      percentage: total ? Math.round((entry.count / total) * 100) : 0,
      color: CHART_COLORS[index % CHART_COLORS.length],
    }));
  }, [analytics]);

  if (loading && !analytics) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center text-sm text-gray-500 shadow-sm">
        Loading family analytics...
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="rounded-2xl border border-rose-100 bg-rose-50 p-8 text-center">
        <h1 className="font-semibold text-rose-800">Analytics could not be loaded</h1>
        <p className="mt-1 text-sm text-rose-600">Please check the connection and try again.</p>
        <button
          type="button"
          onClick={() => void loadAnalytics()}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      </div>
    );
  }

  const summaryStats = [
    {
      label: "Completion Rate",
      value: `${analytics.completionRate}%`,
      note: "Last 7 days",
    },
    {
      label: "Total Tasks Done",
      value: analytics.totalCompletedTasks.toLocaleString(),
      note: "All recorded completions",
    },
    {
      label: "Longest Streak",
      value: `${analytics.longestStreak} ${analytics.longestStreak === 1 ? "day" : "days"}`,
      note: "Family best",
    },
    {
      label: "Family XP Total",
      value: analytics.totalFamilyXp.toLocaleString(),
      note: "Current total",
    },
  ];
  const highestXp = Math.max(...analytics.xpRanking.map((child) => child.xp), 1);

  return (
    <div className="min-w-0 space-y-5">
      <PageHeader
        title="Analytics"
        description="Track your family’s performance and growth"
        action={<button
          type="button"
          disabled={loading}
          onClick={() => void loadAnalytics()}
          aria-label="Refresh analytics"
          className="rounded-xl border border-gray-200 bg-white p-2.5 text-gray-500 transition hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {summaryStats.map((stat) => (
          <motion.article
            key={stat.label}
            whileHover={{ y: -1 }}
            className="min-w-0 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5"
          >
            <div className="wrap-break-word text-xl font-black text-gray-900 sm:text-2xl">
              {stat.value}
            </div>
            <div className="mt-0.5 text-sm text-gray-500">{stat.label}</div>
            <div className="mt-2 text-xs font-semibold text-indigo-500">{stat.note}</div>
          </motion.article>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <section className="min-w-0 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="mb-0.5 font-semibold text-gray-900">This Week&apos;s Task Completion</h2>
          <p className="mb-5 text-xs text-gray-400">Completed tasks per child since Monday</p>
          <div className="h-55 w-full [&_g]:outline-none [&_path]:outline-none [&_svg]:outline-none">
            {weeklyData.length === 0 || weeklyData.every((entry) => entry.tasks === 0) ? (
              <EmptyChart message="Task completions will appear here after a child completes a task." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} accessibilityLayer={false}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} width={24} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={false} />
                  <Bar dataKey="tasks" name="Completed tasks" fill="#6366F1" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>

        <section className="min-w-0 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="mb-0.5 font-semibold text-gray-900">XP Earned — 4 Weeks</h2>
          <p className="mb-5 text-xs text-gray-400">Family XP earned during each week</p>
          <div className="h-55 w-full [&_g]:outline-none [&_path]:outline-none [&_svg]:outline-none">
            {xpData.every((entry) => entry.xp === 0) ? (
              <EmptyChart message="Weekly XP will appear here after tasks are completed." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={xpData} accessibilityLayer={false}>
                  <defs>
                    <linearGradient id="familyXpGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} width={38} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="xp" name="Family XP" stroke="#6366F1" strokeWidth={2} fill="url(#familyXpGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <section className="min-w-0 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="mb-0.5 font-semibold text-gray-900">Task Categories</h2>
          <p className="mb-4 text-xs text-gray-400">Completed tasks by category</p>
          <div className="h-40 w-full [&_g]:outline-none [&_path]:outline-none [&_svg]:outline-none">
            {categoryData.length === 0 ? (
              <EmptyChart message="Category insights will appear after tasks are completed." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart accessibilityLayer={false}>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={42} outerRadius={65} paddingAngle={4} dataKey="value" rootTabIndex={-1} style={{ outline: "none" }}>
                    {categoryData.map((category) => (
                      <Cell key={category.name} fill={category.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="mt-3 space-y-2">
            {categoryData.map((category) => (
              <div key={category.name} className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: category.color }} />
                <span className="min-w-0 flex-1 truncate text-xs text-gray-600">{category.name}</span>
                <span className="text-xs font-bold text-gray-900">{category.percentage}%</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="mb-4 font-semibold text-gray-900">Streak Leaderboard 🔥</h2>
          {analytics.streakLeaderboard.length === 0 ? (
            <p className="rounded-xl bg-gray-50 p-5 text-center text-xs text-gray-400">Add a child to begin tracking streaks.</p>
          ) : (
            <div className="space-y-4">
              {analytics.streakLeaderboard.map((child, index) => (
                <div key={child.childId} className="flex items-center gap-3">
                  <span className="w-6 shrink-0 text-center text-lg">{MEDALS[index] ?? `#${index + 1}`}</span>
                  <RankingAvatar name={child.name} index={index} avatar={childAvatars[child.childId]} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold text-gray-900">{child.name}</div>
                    <div className="text-xs text-gray-400">Best: {child.longestStreak} days</div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-lg font-black text-orange-500">🔥 {child.streak}</div>
                    <div className="text-[10px] text-gray-400">days</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="font-semibold text-gray-900">All-Time XP Ranking 🏆</h2>
          <p className="mb-4 text-xs text-gray-400">Current family XP totals</p>
          {analytics.xpRanking.length === 0 ? (
            <p className="rounded-xl bg-gray-50 p-5 text-center text-xs text-gray-400">Add a child to start the ranking.</p>
          ) : (
            <div className="space-y-4">
              {analytics.xpRanking.map((child, index) => (
                <div key={child.childId} className="flex items-center gap-3">
                  <span className="w-6 shrink-0 text-center text-lg">{MEDALS[index] ?? `#${index + 1}`}</span>
                  <RankingAvatar name={child.name} index={index} avatar={childAvatars[child.childId]} />
                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex justify-between gap-2">
                      <span className="truncate text-sm font-bold text-gray-900">{child.name} · Lv.{child.level}</span>
                      <span className="shrink-0 text-xs font-bold text-indigo-600">{child.xp.toLocaleString()} XP</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div className="h-full rounded-full bg-indigo-500 transition-[width]" style={{ width: `${(child.xp / highestXp) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
