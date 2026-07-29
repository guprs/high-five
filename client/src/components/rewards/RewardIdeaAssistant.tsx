import { useState } from "react";
import { LoaderCircle, Sparkles, WandSparkles, X } from "lucide-react";

import {
  generateRewardIdeas,
  type RewardIdea,
} from "../../services/rewardIdeas";

interface Props {
  onSelect: (idea: RewardIdea) => void;
  onClose: () => void;
}

const PREFERENCES = [
  "Screen-free",
  "Low sensory",
  "Limited mobility",
  "No-cost",
];

const REWARD_TYPES = ["Activity", "Privilege", "Family time", "Small treat"];

export default function RewardIdeaAssistant({ onSelect, onClose }: Props) {
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
      const suggestions = await generateRewardIdeas({
        age: normalizedAge,
        interests: interests
          .split(",")
          .map((interest) => interest.trim())
          .filter(Boolean),
        preferences,
        rewardTypes,
        count: 5,
      });
      setIdeas(suggestions);
    } catch {
      setError("Ideas could not be generated. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-5 rounded-2xl border border-violet-200 bg-violet-50/70 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white">
            <WandSparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">
              AI Reward Ideas
            </h3>
            <p className="text-xs text-gray-500">
              Optional details help tailor the suggestions
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close AI reward ideas"
          className="rounded-lg p-1.5 text-gray-400 transition hover:bg-white hover:text-gray-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[110px_1fr]">
        <div>
          <label htmlFor="idea-age" className="text-xs font-semibold text-gray-700">
            Age
          </label>
          <input
            id="idea-age"
            type="number"
            min="3"
            max="17"
            value={age}
            onChange={(event) => setAge(event.target.value)}
            placeholder="Optional"
            className="mt-1.5 w-full rounded-xl border border-violet-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-3 focus:ring-violet-100"
          />
        </div>
        <div>
          <label
            htmlFor="idea-interests"
            className="text-xs font-semibold text-gray-700"
          >
            Interests
          </label>
          <input
            id="idea-interests"
            value={interests}
            onChange={(event) => setInterests(event.target.value)}
            placeholder="Drawing, animals, football..."
            className="mt-1.5 w-full rounded-xl border border-violet-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-3 focus:ring-violet-100"
          />
        </div>
      </div>

      <div className="mt-3">
        <p className="text-xs font-semibold text-gray-700">Preferences</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {PREFERENCES.map((preference) => {
            const selected = preferences.includes(preference);
            return (
              <button
                key={preference}
                type="button"
                aria-pressed={selected}
                onClick={() => toggle(preference, setPreferences)}
                className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                  selected
                    ? "border-violet-400 bg-violet-600 text-white"
                    : "border-violet-200 bg-white text-gray-600 hover:border-violet-300"
                }`}
              >
                {preference}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3">
        <p className="text-xs font-semibold text-gray-700">Reward type</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {REWARD_TYPES.map((type) => {
            const selected = rewardTypes.includes(type);
            return (
              <button
                key={type}
                type="button"
                aria-pressed={selected}
                onClick={() => toggle(type, setRewardTypes)}
                className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                  selected
                    ? "border-indigo-400 bg-indigo-600 text-white"
                    : "border-indigo-200 bg-white text-gray-600 hover:border-indigo-300"
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={() => void handleGenerate()}
        disabled={loading}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-wait disabled:opacity-70"
      >
        {loading ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
        {loading ? "Finding ideas..." : ideas.length ? "Generate New Ideas" : "Generate Ideas"}
      </button>

      {error && (
        <p className="mt-3 rounded-xl bg-rose-100 px-3 py-2 text-xs font-medium text-rose-700">
          {error}
        </p>
      )}

      {ideas.length > 0 && (
        <div className="mt-4 space-y-2" aria-live="polite">
          <p className="text-xs font-bold text-gray-700">
            Choose an idea to fill the reward form
          </p>
          {ideas.map((idea) => (
            <button
              key={`${idea.title}-${idea.cost}`}
              type="button"
              onClick={() => onSelect(idea)}
              className="flex w-full items-start gap-3 rounded-xl border border-violet-100 bg-white p-3 text-left transition hover:border-violet-300 hover:shadow-sm"
            >
              <span className="text-2xl">{idea.icon}</span>
              <span className="min-w-0 flex-1">
                <span className="flex items-start justify-between gap-2">
                  <span className="text-sm font-bold text-gray-900">
                    {idea.title}
                  </span>
                  <span className="shrink-0 text-xs font-bold text-amber-600">
                    ⭐ {idea.cost}
                  </span>
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-gray-500">
                  {idea.reason}
                </span>
              </span>
            </button>
          ))}
          <p className="pt-1 text-[11px] leading-relaxed text-gray-400">
            Suggestions are a starting point. A parent should review what is
            appropriate for their child.
          </p>
        </div>
      )}
    </section>
  );
}
