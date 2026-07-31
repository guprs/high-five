import { Check, Plus } from "lucide-react";
import type { Reward } from "../../types/dashboard";

const REWARD_TEMPLATES: Reward[] = [
  { id: "template-dinner", title: "Choose tonight’s dinner", cost: 60, icon: "🍕" },
  { id: "template-movie", title: "Family movie night", cost: 80, icon: "🎬" },
  { id: "template-bedtime", title: "Stay up 30 minutes later", cost: 100, icon: "🌙" },
  { id: "template-story", title: "Extra bedtime story", cost: 35, icon: "📚" },
  { id: "template-game", title: "Choose the family game", cost: 50, icon: "🎮" },
  { id: "template-time", title: "One-to-one parent time", cost: 70, icon: "✨" },
  { id: "template-weekend", title: "Choose a weekend activity", cost: 120, icon: "🏕️" },
  { id: "template-chore", title: "Skip one suitable chore", cost: 90, icon: "🎁" },
];

interface Props {
  existingRewards: Reward[];
  onSelect: (template: Reward) => void;
}

export default function RewardTemplates({
  existingRewards,
  onSelect,
}: Props) {
  const existingTitles = new Set(
    existingRewards.map((reward) => reward.title.trim().toLocaleLowerCase()),
  );

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4">
        <h2 className="font-semibold text-gray-900">Quick Templates</h2>
        <p className="mt-0.5 text-xs text-gray-400">
          Start with a family-friendly idea, then adjust its name and cost.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {REWARD_TEMPLATES.map((template) => {
          const alreadyAdded = existingTitles.has(
            template.title.toLocaleLowerCase(),
          );

          return (
            <button
              key={template.id}
              type="button"
              disabled={alreadyAdded}
              onClick={() => onSelect(template)}
              className={`flex min-w-0 items-center gap-3 rounded-xl border p-3 text-left transition ${
                alreadyAdded
                  ? "cursor-default border-emerald-100 bg-emerald-50/60"
                  : "border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/40"
              }`}
            >
              <span className="shrink-0 text-2xl">{template.icon}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-gray-900">
                  {template.title}
                </span>
                <span className="block text-xs font-bold text-amber-600">
                  ⭐ {template.cost}
                </span>
              </span>
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                  alreadyAdded
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-white text-indigo-500 shadow-sm"
                }`}
              >
                {alreadyAdded ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Plus className="h-3.5 w-3.5" />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
