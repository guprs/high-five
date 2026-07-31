import { CheckCircle, Flame, Gift, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  totalDone: number;
  totalToday: number;
  percentage: number;
  topStreak: number;
  topStreakName?: string;
  familyXp: number;
  childrenCount: number;
}

export default function DashboardStats({
  totalDone,
  totalToday,
  percentage,
  topStreak,
  topStreakName,
  familyXp,
  childrenCount,
}: Props) {
  const stats = [
    {
      label: "Tasks Done Today",
      value: `${totalDone}/${totalToday}`,
      sub: `${percentage}% complete`,
      Icon: CheckCircle,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
    },
    {
      label: "Top Streak",
      value: `${topStreak} ${topStreak === 1 ? "day" : "days"} 🔥`,
      sub: topStreakName ? `${topStreakName} leading` : "No streak yet",
      Icon: Flame,
      iconColor: "text-orange-500",
      iconBg: "bg-orange-50",
    },
    {
      label: "Family XP",
      value: `${familyXp.toLocaleString()} XP`,
      sub: "Total earned",
      Icon: Zap,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-50",
    },
    {
      label: "Children",
      value: childrenCount.toLocaleString(),
      sub: childrenCount === 1 ? "Family profile" : "Family profiles",
      Icon: Gift,
      iconColor: "text-pink-600",
      iconBg: "bg-pink-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.Icon;
        return (
          <motion.div
            key={stat.label}
            whileHover={{ y: -2 }}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg}`}>
              <Icon className={`h-5 w-5 ${stat.iconColor}`} />
            </div>
            <div className="text-xl font-bold text-gray-900">{stat.value}</div>
            <div className="mt-0.5 text-xs text-gray-500">{stat.label}</div>
            <div className="mt-1 text-xs text-gray-400">{stat.sub}</div>
          </motion.div>
        );
      })}
    </div>
  );
}
