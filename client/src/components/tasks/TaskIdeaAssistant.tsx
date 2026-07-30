import { useState } from "react";
import {
  Check,
  ChevronDown,
  LoaderCircle,
  Sparkles,
} from "lucide-react";

import {
  generateTaskIdeas,
  type TaskIdea,
} from "../../services/taskIdeas";

interface Props {
  onSelect: (idea: TaskIdea) => void;
}

const SUPPORT_PREFERENCES = [
  "Short steps",
  "Low sensory",
  "Limited mobility",
  "Visual prompts",
  "Adult support",
];

const CATEGORIES = ["Chores", "Skills", "Education", "Other"];

const PROMPT_STARTERS = [
  "Everyday household tasks",
  "Morning or bedtime routine",
  "Homework and school preparation",
  "Adapt tasks to limited mobility",
  "Break tasks into very small steps",
];

export default function TaskIdeaAssistant({ onSelect }: Props) {
  const [age, setAge] = useState("");
  const [prompt, setPrompt] = useState("");
  const [supportPreferences, setSupportPreferences] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [ideas, setIdeas] = useState<TaskIdea[]>([]);
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
    const normalizedPrompt = prompt.trim();

    if (
      normalizedAge !== undefined &&
      (!Number.isInteger(normalizedAge) ||
        normalizedAge < 3 ||
        normalizedAge > 17)
    ) {
      setError("Enter an age between 3 and 17, or leave it blank.");
      return;
    }

    if (normalizedPrompt.length < 10) {
      setError(
        "Describe the tasks or support you need in at least 10 characters.",
      );
      return;
    }

    try {
      setLoading(true);
      setError("");
      const suggestions = await generateTaskIdeas({
        age: normalizedAge,
        prompt: normalizedPrompt,
        supportPreferences,
        categories,
        count: 5,
      });
      setIdeas(suggestions);
    } catch {
      setError("Task ideas could not be generated. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-violet-200 bg-violet-50/70 p-4">
      <div>
        <label
          htmlFor="task-prompt-starter"
          className="text-xs font-semibold text-gray-700"
        >
          Start with a common request
        </label>
        <select
          id="task-prompt-starter"
          defaultValue=""
          onChange={(event) => {
            if (event.target.value) setPrompt(event.target.value);
          }}
          className="task-input mt-1.5"
        >
          <option value="">Choose a prompt starter or write your own...</option>
          {PROMPT_STARTERS.map((starter) => (
            <option key={starter} value={starter}>
              {starter}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3">
        <label
          htmlFor="task-idea-prompt"
          className="text-xs font-semibold text-gray-700"
        >
          What would you like help with?
        </label>
        <textarea
          id="task-idea-prompt"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          rows={2}
          maxLength={1000}
          placeholder="For example: Suggest simple household tasks for a 9-year-old who needs clear, one-step instructions and cannot safely carry heavy objects."
          className="mt-1.5 w-full resize-y rounded-xl border border-violet-200 bg-white px-3 py-2.5 text-sm leading-relaxed outline-none focus:border-violet-400 focus:ring-3 focus:ring-violet-100"
        />
        <div className="mt-1.5 flex items-center justify-between gap-3 text-[11px] text-gray-400">
          <span>
            Describe abilities and support needs, but don&apos;t include names
            or identifying information.
          </span>
          <span className="shrink-0">{prompt.length}/1000</span>
        </div>
      </div>

      <div className="mt-3 grid items-end gap-3 sm:grid-cols-3">
        <div>
          <label
            htmlFor="task-idea-age"
            className="text-xs font-semibold text-gray-700"
          >
            Age
          </label>
          <input
            id="task-idea-age"
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
          label="Support preferences"
          options={SUPPORT_PREFERENCES}
          selected={supportPreferences}
          onToggle={(item) => toggle(item, setSupportPreferences)}
        />
        <MultiSelectMenu
          label="Task categories"
          options={CATEGORIES}
          selected={categories}
          onToggle={(item) => toggle(item, setCategories)}
        />
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
        {loading
          ? "Finding ideas..."
          : ideas.length
            ? "Generate New Ideas"
            : "Generate Ideas"}
      </button>

      {error && (
        <p className="mt-3 rounded-xl bg-rose-100 px-3 py-2 text-xs font-medium text-rose-700">
          {error}
        </p>
      )}

      {ideas.length > 0 && (
        <div className="mt-4 space-y-2" aria-live="polite">
          <p className="text-xs font-bold text-gray-700">
            Choose an idea to fill the task form
          </p>
          {ideas.map((idea) => (
            <button
              key={idea.title}
              type="button"
              onClick={() => onSelect(idea)}
              className="w-full rounded-xl border border-violet-100 bg-white p-3 text-left transition hover:border-violet-300 hover:shadow-sm"
            >
              <span className="flex items-start justify-between gap-3">
                <span>
                  <span className="block text-sm font-bold text-gray-900">
                    {idea.title}
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-gray-500">
                    {idea.reason}
                  </span>
                </span>
                <span className="shrink-0 text-xs font-bold text-indigo-600">
                  +{idea.points} XP
                </span>
              </span>
            </button>
          ))}
          <p className="pt-1 text-[11px] leading-relaxed text-gray-400">
            Suggestions use no child name or identifying information. A parent
            should review each task before creating it.
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

function MultiSelectMenu({
  label,
  options,
  selected,
  onToggle,
}: MultiSelectMenuProps) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-700">{label}</p>
      <details className="group relative mt-1.5">
        <summary className="task-input flex cursor-pointer list-none items-center justify-between gap-2">
          <span className="truncate">
            {selected.length === 0
              ? "Any"
              : selected.length === 1
                ? selected[0]
                : `${selected.length} selected`}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-gray-400 transition group-open:rotate-180" />
        </summary>
        <div className="absolute right-0 left-0 z-20 mt-1.5 rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl">
          {options.map((option) => {
            const active = selected.includes(option);
            return (
              <label
                key={option}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => onToggle(option)}
                  className="sr-only"
                />
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                    active
                      ? "border-violet-600 bg-violet-600 text-white"
                      : "border-gray-300"
                  }`}
                >
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
