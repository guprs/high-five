import { RefreshCw, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
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

import { ChildAvatar } from "../components/ChildAvatar";
import {
  CATEGORY_DATA,
  CHILDREN,
  WEEKLY_DATA,
  XP_DATA,
} from "../data/dashboardData";
import {
  getWeeklyRanking,
  type WeeklyRankingEntry,
} from "../services/ranking";

const SUMMARY_STATS = [
  {
    label: "Completion Rate",
    value: "78%",
    delta: "+5% vs last week",
  },
  {
    label: "Total Tasks Done",
    value: "124",
    delta: "+18 this week",
  },
  {
    label: "Longest Streak",
    value: "14 days",
    delta: "Lucas 🚀",
  },
  {
    label: "Family XP Total",
    value: "7,940",
    delta: "+680 this week",
  },
];

const CHILD_SERIES = [
  { key: "emma", label: "Emma 🦄", color: "#8B5CF6" },
  { key: "lucas", label: "Lucas 🚀", color: "#3B82F6" },
  { key: "sofia", label: "Sofia 🌈", color: "#EC4899" },
] as const;

const MEDALS = ["🥇", "🥈", "🥉"];

const tooltipStyle = {
  borderRadius: 12,
  border: "none",
  boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
  fontSize: 12,
};

export default function AnalyticsPage() {
  const streakRanking = [...CHILDREN].sort((a, b) => b.streak - a.streak);
  const [xpRanking, setXpRanking] = useState<WeeklyRankingEntry[]>([]);
  const [rankingLoading, setRankingLoading] = useState(true);
  const [rankingError, setRankingError] = useState(false);

  async function loadRanking() {
    setRankingLoading(true);
    setRankingError(false);

    try {
      const data = await getWeeklyRanking();
      setXpRanking(data.ranking);
    } catch {
      setRankingError(true);
    } finally {
      setRankingLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    getWeeklyRanking()
      .then((data) => {
        if (active) setXpRanking(data.ranking);
      })
      .catch(() => {
        if (active) setRankingError(true);
      })
      .finally(() => {
        if (active) setRankingLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const highestWeeklyXp = Math.max(
    ...xpRanking.map((child) => child.weeklyXp),
    1,
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-400">
          Track your family&apos;s performance and growth
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {SUMMARY_STATS.map((stat) => (
          <motion.article
            key={stat.label}
            whileHover={{ y: -1 }}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div className="text-2xl font-black text-gray-900">
              {stat.value}
            </div>
            <div className="mt-0.5 text-sm text-gray-500">{stat.label}</div>
            <div className="mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="text-xs font-semibold text-emerald-600">
                {stat.delta}
              </span>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="mb-0.5 font-semibold text-gray-900">
            Weekly Task Completion
          </h2>
          <p className="mb-5 text-xs text-gray-400">
            Tasks completed per child per day
          </p>
          <div
            className="h-50 w-full [&_g]:outline-none [&_path]:outline-none [&_svg]:outline-none"
            onMouseDown={(event) => event.preventDefault()}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={WEEKLY_DATA}
                barGap={2}
                barCategoryGap="25%"
                accessibilityLayer={false}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0f4f8"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: "#94A3B8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94A3B8" }}
                  axisLine={false}
                  tickLine={false}
                  width={20}
                  allowDecimals={false}
                />
                <Tooltip contentStyle={tooltipStyle} cursor={false} />
                {CHILD_SERIES.map((child) => (
                  <Bar
                    key={child.key}
                    dataKey={child.key}
                    name={child.label}
                    fill={child.color}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2">
            {CHILD_SERIES.map((child) => (
              <div key={child.key} className="flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-sm"
                  style={{ backgroundColor: child.color }}
                />
                <span className="text-xs text-gray-500">{child.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="mb-0.5 font-semibold text-gray-900">
            XP Progress — 4 Weeks
          </h2>
          <p className="mb-5 text-xs text-gray-400">
            Cumulative experience points earned
          </p>
          <div
            className="h-50 w-full [&_g]:outline-none [&_path]:outline-none [&_svg]:outline-none"
            onMouseDown={(event) => event.preventDefault()}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={XP_DATA} accessibilityLayer={false}>
                <defs>
                  {CHILD_SERIES.map((child) => (
                    <linearGradient
                      key={child.key}
                      id={`${child.key}Gradient`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={child.color}
                        stopOpacity={0.25}
                      />
                      <stop
                        offset="95%"
                        stopColor={child.color}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0f4f8"
                  vertical={false}
                />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 11, fill: "#94A3B8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94A3B8" }}
                  axisLine={false}
                  tickLine={false}
                  width={36}
                />
                <Tooltip contentStyle={tooltipStyle} />
                {CHILD_SERIES.map((child) => (
                  <Area
                    key={child.key}
                    type="monotone"
                    dataKey={child.key}
                    name={child.label}
                    stroke={child.color}
                    strokeWidth={2}
                    fill={`url(#${child.key}Gradient)`}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="mb-0.5 font-semibold text-gray-900">
            Task Categories
          </h2>
          <p className="mb-4 text-xs text-gray-400">
            Distribution of task types
          </p>
          <div
            className="h-38 w-full [&_g]:outline-none [&_path]:outline-none [&_svg]:outline-none"
            onMouseDown={(event) => event.preventDefault()}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart accessibilityLayer={false}>
                <Pie
                  data={CATEGORY_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                  rootTabIndex={-1}
                  style={{ outline: "none" }}
                >
                  {CATEGORY_DATA.map((category) => (
                    <Cell key={category.name} fill={category.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 space-y-2">
            {CATEGORY_DATA.map((category) => (
              <div
                key={category.name}
                className="flex items-center gap-2.5"
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="flex-1 text-xs text-gray-600">
                  {category.name}
                </span>
                <span className="text-xs font-bold text-gray-900">
                  {category.value}%
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900">
            Streak Leaderboard 🔥
          </h2>
          <div className="space-y-4">
            {streakRanking.map((child, index) => (
              <div key={child.id} className="flex items-center gap-3">
                <span className="shrink-0 text-lg">
                  {MEDALS[index] ?? `#${index + 1}`}
                </span>
                <ChildAvatar child={child} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-gray-900">
                    {child.name}
                  </div>
                  <div className="text-xs text-gray-400">Current streak</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-orange-500">
                    🔥 {child.streak}
                  </div>
                  <div className="text-[10px] text-gray-400">days</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">Weekly XP Ranking 🏆</h2>
          <p className="mb-4 text-xs text-gray-400">
            XP earned since Monday
          </p>

          {rankingLoading ? (
            <div
              className="space-y-4"
              aria-label="Loading weekly XP ranking"
            >
              {[0, 1, 2].map((item) => (
                <div key={item} className="flex animate-pulse items-center gap-3">
                  <div className="h-6 w-6 rounded bg-gray-100" />
                  <div className="h-9 w-9 rounded-full bg-gray-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-24 rounded bg-gray-100" />
                    <div className="h-2 rounded bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : rankingError ? (
            <div className="rounded-xl bg-rose-50 p-4 text-center">
              <p className="text-xs text-rose-700">
                We couldn&apos;t load the weekly ranking.
              </p>
              <button
                type="button"
                onClick={() => void loadRanking()}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 hover:text-rose-800"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Try again
              </button>
            </div>
          ) : xpRanking.length === 0 ? (
            <div className="rounded-xl bg-gray-50 p-4 text-center">
              <p className="text-sm font-medium text-gray-600">
                No children to rank yet
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Add a child to start tracking weekly XP.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {xpRanking.map((child, index) => (
              <div key={child.childId} className="flex items-center gap-3">
                <span className="shrink-0 text-lg">
                  {MEDALS[index] ?? `#${index + 1}`}
                </span>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-lg">
                  {child.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex justify-between gap-2">
                    <span className="truncate text-sm font-bold text-gray-900">
                      {child.name}
                    </span>
                    <span className="shrink-0 text-xs font-bold text-indigo-600">
                      {child.weeklyXp.toLocaleString()} XP
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-indigo-500 transition-[width]"
                      style={{
                        width: `${(child.weeklyXp / highestWeeklyXp) * 100}%`,
                      }}
                    />
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
