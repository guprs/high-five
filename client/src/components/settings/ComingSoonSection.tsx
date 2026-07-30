import {
  BarChart3,
  BellRing,
  CalendarDays,
  Image,
  LayoutGrid,
  Lightbulb,
  Mail,
  Mic,
  NotebookPen,
  ShoppingCart,
  Sparkles,
  Target,
  Trophy,
  Utensils,
} from "lucide-react";

const FEATURES = [
  { Icon: Sparkles, label: "AI Routine Generator" },
  { Icon: LayoutGrid, label: "Community Templates" },
  { Icon: Target, label: "Family Goals" },
  { Icon: Trophy, label: "Monthly Rankings" },
  { Icon: Image, label: "Achievement Gallery" },
  { Icon: BarChart3, label: "Historical Analytics" },
  { Icon: Mic, label: "Voice Assistant" },
  { Icon: ShoppingCart, label: "Shopping List" },
  { Icon: Utensils, label: "Meal Planner" },
  { Icon: CalendarDays, label: "School Schedule" },
  { Icon: NotebookPen, label: "Notes" },
  { Icon: Mail, label: "Weekly Email Reports" },
  { Icon: Lightbulb, label: "Smart Suggestions" },
  { Icon: BellRing, label: "Push Notifications" },
];

export default function ComingSoonSection() {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="mb-1 font-semibold text-gray-900">Coming Soon 🚀</h2>
      <p className="mb-4 text-xs text-gray-400">
        Features we&apos;re building for the next version
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {FEATURES.map(({ Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2.5 rounded-xl border border-gray-100 bg-gray-50 p-3 opacity-70"
          >
            <Icon className="h-4 w-4 shrink-0 text-gray-400" />
            <span className="flex-1 text-xs font-medium text-gray-500">
              {label}
            </span>
            <span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 uppercase">
              Soon
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
