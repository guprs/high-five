import { useState } from "react";
import { Check, ChevronDown, LoaderCircle, Sparkles } from "lucide-react";

import {
  generateRewardIdeas,
  type RewardIdea,
} from "../../services/rewardIdeas";

interface Props {
  onSelect: (idea: RewardIdea) => void;
}

const PREFERENCES = [
  "Screen-free",
  "Low sensory",
  "Limited mobility",
  "No-cost",
];
const REWARD_TYPES = ["Activity", "Privilege", "Family time", "Small treat"];
const INTEREST_STARTERS = [
  "Drawing and creative activities",
  "Animals and nature",
  "Music and dancing",
  "Sports and outdoor play",
  "Books and storytelling",
];

export default function RewardIdeaAssistant({ onSelect }: Props) {
  const [age, setAge] = useState("");
  const [interests, setInterests] = useState("");
  const [preferences, setPreferences] = useState<string[]>([]);
  const [rewardTypes, setRewardTypes] = useState<string[]>([]);
  const [ideas, setIdeas] = useState<RewardIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggle(
    item: string,
    setSelected: React.Dispatch<React.SetStateAction<string[]>>,
  ) {
    setSelected((current) =>
      current.includes(item)
        ? current.filter((value) => value !== item)
        : [...current, item],
    );
  }

  async function handleGenerate() {
    const normalizedAge = age ? Number(age) : undefined;
    if (
      normalizedAge !== undefined &&
      (!Number.isInteger(normalizedAge) || normalizedAge < 3 || normalizedAge > 17)
    ) {
      setError("Enter an age between 3 and 17, or leave it blank.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setIdeas(
        await generateRewardIdeas({
          age: normalizedAge,
          interests: interests
            .split(",")
            .map((interest) => interest.trim())
            .filter(Boolean),
          preferences,
          rewardTypes,
          count: 5,
        }),
      );
    } catch {
      setError("Reward ideas could not be generated. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-violet-200 bg-violet-50/70 p-4">
      <div>
        <label htmlFor="reward-interest-starter" className="text-xs font-semibold text-gray-700">
          Start with a common interest
        </label>
        <select
          id="reward-interest-starter"
          defaultValue=""
          onChange={(event) => {
            if (event.target.value) setInterests(event.target.value);
          }}
          className="task-input mt-1.5"
        >
          <option value="">Choose an example or describe your own...</option>
          {INTEREST_STARTERS.map((starter) => (
            <option key={starter} value={starter}>{starter}</option>
          ))}
        </select>
      </div>

      <div className="mt-3">
        <label htmlFor="reward-interests" className="text-xs font-semibold text-gray-700">
          What does the child enjoy?
        </label>
        <textarea
          id="reward-interests"
          value={interests}
          onChange={(event) => setInterests(event.target.value)}
          rows={2}
          maxLength={500}
          placeholder="For example: animals, drawing, calm outdoor activities, choosing family games..."
          className="mt-1.5 w-full resize-y rounded-xl border border-violet-200 bg-white px-3 py-2.5 text-sm leading-relaxed outline-none focus:border-violet-400 focus:ring-3 focus:ring-violet-100"
        />
        <div className="mt-1.5 flex items-center justify-between gap-3 text-[11px] text-gray-400">
          <span>Use commas between interests. Don&apos;t include names or identifying details.</span>
          <span className="shrink-0">{interests.length}/500</span>
        </div>
      </div>

      <div className="mt-3 grid items-end gap-3 sm:grid-cols-3">
        <div>
          <label htmlFor="reward-idea-age" className="text-xs font-semibold text-gray-700">Age</label>
          <input
            id="reward-idea-age"
            type="number"
            min="3"
            max="17"
            value={age}
            onChange={(event) => setAge(event.target.value)}
            placeholder="Optional"
            className="task-input mt-1.5"
          />
        </div>
        <MultiSelectMenu
          label="Preferences"
          options={PREFERENCES}
          selected={preferences}
          onToggle={(item) => toggle(item, setPreferences)}
        />
        <MultiSelectMenu
          label="Reward types"
          options={REWARD_TYPES}
          selected={rewardTypes}
          onToggle={(item) => toggle(item, setRewardTypes)}
        />
      </div>

      <button
        type="button"
        onClick={() => void handleGenerate()}
        disabled={loading}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-wait disabled:opacity-70"
      >
        {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        {loading ? "Finding ideas..." : ideas.length ? "Generate New Ideas" : "Generate Ideas"}
      </button>

      {error && (
        <p className="mt-3 rounded-xl bg-rose-100 px-3 py-2 text-xs font-medium text-rose-700">{error}</p>
      )}

      {ideas.length > 0 && (
        <div className="mt-4 space-y-2" aria-live="polite">
          <p className="text-xs font-bold text-gray-700">Choose an idea to fill the reward form</p>
          {ideas.map((idea) => (
            <button
              key={`${idea.title}-${idea.cost}`}
              type="button"
              onClick={() => onSelect(idea)}
              className="w-full rounded-xl border border-violet-100 bg-white p-3 text-left transition hover:border-violet-300 hover:shadow-sm"
            >
              <span className="flex items-start gap-3">
                <span className="text-2xl">{idea.icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-2">
                    <span className="text-sm font-bold text-gray-900">{idea.title}</span>
                    <span className="shrink-0 text-xs font-bold text-amber-600">⭐ {idea.cost}</span>
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-gray-500">{idea.reason}</span>
                </span>
              </span>
            </button>
          ))}
          <p className="pt-1 text-[11px] leading-relaxed text-gray-400">
            Suggestions contain no identifying information. A parent should review each reward before creating it.
          </p>
        </div>
      )}
    </section>
  );
}

interface MultiSelectMenuProps {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (item: string) => void;
}

function MultiSelectMenu({ label, options, selected, onToggle }: MultiSelectMenuProps) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-700">{label}</p>
      <details className="group relative mt-1.5">
        <summary className="task-input flex cursor-pointer list-none items-center justify-between gap-2">
          <span className="truncate">
            {selected.length === 0 ? "Any" : selected.length === 1 ? selected[0] : `${selected.length} selected`}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-gray-400 transition group-open:rotate-180" />
        </summary>
        <div className="absolute right-0 left-0 z-20 mt-1.5 rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl">
          {options.map((option) => {
            const active = selected.includes(option);
            return (
              <label key={option} className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50">
                <input type="checkbox" checked={active} onChange={() => onToggle(option)} className="sr-only" />
                <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${active ? "border-violet-600 bg-violet-600 text-white" : "border-gray-300"}`}>
                  {active && <Check className="h-3 w-3" />}
                </span>
                {option}
              </label>
            );
          })}
        </div>
      </details>
    </div>
  );
}
