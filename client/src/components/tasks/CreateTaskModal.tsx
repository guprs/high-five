import { useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardPlus,
  Minus,
  Plus,
  Sparkles,
  X,
} from "lucide-react";

import type { TaskIdea } from "../../services/taskIdeas";
import { assignTaskToChild, createTask } from "../../services/tasks";
import type { Child } from "../../types/dashboard";
import { ChildAvatar } from "../ChildAvatar";
import TaskIdeaAssistant from "./TaskIdeaAssistant";

interface Props {
  familyChildren: Child[];
  onClose: () => void;
  onCreated: () => Promise<void>;
}

const CATEGORIES = [
  { value: "🧹 Chores", label: "🧹 Chores" },
  { value: "🧠 Skills", label: "🧠 Skills" },
  { value: "📚 Education", label: "📚 Education" },
  { value: "⭐ Other", label: "⭐ Other" },
];

const FREQUENCIES = ["Daily", "Weekly", "Weekdays", "Weekends", "Monthly"];

export default function CreateTaskModal({
  familyChildren,
  onClose,
  onCreated,
}: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [showIdeaAssistant, setShowIdeaAssistant] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("🧹 Chores");
  const [points, setPoints] = useState(20);
  const [difficulty, setDifficulty] = useState(2);
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
  const [recurring, setRecurring] = useState(false);
  const [frequency, setFrequency] = useState("Daily");
  const [scheduledTime, setScheduledTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleChild(id: string) {
    setSelectedChildren((current) =>
      current.includes(id)
        ? current.filter((childId) => childId !== id)
        : [...current, id],
    );
  }

  function handleSelectIdea(idea: TaskIdea) {
    setTitle(idea.title);
    setDescription(idea.description);
    setCategory(idea.category);
    setPoints(idea.points);
    setDifficulty(Math.min(3, Math.max(1, idea.difficulty)));
    setRecurring(idea.recurring);
    setFrequency(idea.frequency ?? "Daily");
    setScheduledTime(idea.scheduledTime ?? "");
    setError("");
    setShowIdeaAssistant(false);
    setStep(1);
  }

  function continueToAssignment() {
    if (!title.trim()) {
      setError("Please enter a task name.");
      return;
    }

    setError("");
    setStep(2);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!title.trim()) {
      setStep(1);
      setError("Please enter a task name.");
      return;
    }

    if (selectedChildren.length === 0) {
      setError("Please select at least one child.");
      return;
    }

    try {
      setLoading(true);
      const response = await createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        points,
        difficulty,
        recurring,
        frequency: recurring ? frequency : undefined,
        scheduledTime: scheduledTime || null,
      });

      await Promise.all(
        selectedChildren.map((childId) =>
          assignTaskToChild(childId, response.task.id),
        ),
      );
      await onCreated();
      onClose();
    } catch (submitError: unknown) {
      console.error(submitError);
      setError(
        (typeof submitError === "object" &&
        submitError !== null &&
        "response" in submitError
          ? (
              submitError.response as {
                data?: { message?: string };
              }
            ).data?.message
          : undefined) || "Could not create task.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-center bg-slate-950/55 backdrop-blur-sm sm:items-center sm:p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-task-title"
        className="flex h-[100dvh] w-full max-w-3xl flex-col overflow-hidden bg-white shadow-2xl sm:h-auto sm:max-h-[90vh] sm:rounded-3xl sm:border sm:border-gray-100"
      >
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-gray-100 px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
              <ClipboardPlus className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2
                id="create-task-title"
                className="truncate text-lg font-bold text-gray-900"
              >
                {showIdeaAssistant ? "Find a Task Idea" : "Create New Task"}
              </h2>
              <p className="text-xs text-gray-400">
                {showIdeaAssistant
                  ? "Describe the support and tasks your child needs"
                  : step === 1
                    ? "Step 1 of 2 · Task details"
                    : "Step 2 of 2 · Assignment and schedule"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close task form"
            className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {!showIdeaAssistant && (
          <div className="grid shrink-0 grid-cols-2 border-b border-gray-100 bg-gray-50 px-5 sm:px-6">
            <StepButton
              number={1}
              label="Task details"
              active={step === 1}
              complete={Boolean(title.trim())}
              onClick={() => setStep(1)}
            />
            <StepButton
              number={2}
              label="Assign & schedule"
              active={step === 2}
              complete={selectedChildren.length > 0}
              onClick={continueToAssignment}
            />
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {showIdeaAssistant ? (
            <TaskIdeaAssistant
              onSelect={handleSelectIdea}
            />
          ) : (
            <form id="create-task-form" onSubmit={handleSubmit}>
              {step === 1 ? (
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => setShowIdeaAssistant(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-semibold text-violet-700 transition hover:border-violet-300 hover:bg-violet-100"
                  >
                    <Sparkles className="h-4 w-4" />
                    Help me find task ideas
                  </button>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField label="Task name">
                      <input
                        autoFocus
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="e.g. Prepare school bag"
                        className="task-input"
                      />
                    </FormField>
                    <FormField label="Category">
                      <select
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                        className="task-input"
                      >
                        {CATEGORIES.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </FormField>
                  </div>

                  <FormField label="Description" optional>
                    <textarea
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      placeholder="Add clear steps or helpful details..."
                      rows={2}
                      className="task-input resize-none"
                    />
                  </FormField>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField label="Difficulty">
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          [1, "Easy"],
                          [2, "Medium"],
                          [3, "Hard"],
                        ].map(([value, label]) => (
                          <button
                            key={value}
                            type="button"
                            aria-pressed={difficulty === value}
                            onClick={() => setDifficulty(Number(value))}
                            className={`rounded-xl border px-2 py-2.5 text-xs font-semibold transition ${
                              difficulty === value
                                ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                                : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            {"⭐".repeat(Number(value))} {label}
                          </button>
                        ))}
                      </div>
                    </FormField>
                    <FormField label="XP reward">
                      <div className="flex h-10.5 items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-2">
                        <button
                          type="button"
                          aria-label="Decrease XP"
                          onClick={() => setPoints((value) => Math.max(5, value - 5))}
                          className="rounded-lg p-1.5 text-gray-500 hover:bg-white"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-sm font-bold text-gray-900">
                          {points} XP
                        </span>
                        <button
                          type="button"
                          aria-label="Increase XP"
                          onClick={() => setPoints((value) => value + 5)}
                          className="rounded-lg p-1.5 text-gray-500 hover:bg-white"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </FormField>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <fieldset>
                    <legend className="text-sm font-semibold text-gray-700">
                      Assign to
                    </legend>
                    <p className="mt-0.5 text-xs text-gray-400">
                      Select one or more children
                    </p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {familyChildren.map((child) => {
                        const selected = selectedChildren.includes(child.id);
                        return (
                          <button
                            type="button"
                            key={child.id}
                            aria-pressed={selected}
                            onClick={() => toggleChild(child.id)}
                            className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                              selected
                                ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <ChildAvatar child={child} size="sm" />
                            <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                              {child.name}
                            </span>
                            {selected && <Check className="h-4 w-4" />}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <label className="flex items-center justify-between gap-4">
                      <span>
                        <span className="block text-sm font-semibold text-gray-700">
                          Repeat this task
                        </span>
                        <span className="text-xs text-gray-400">
                          Add it to the child&apos;s routine automatically
                        </span>
                      </span>
                      <input
                        type="checkbox"
                        checked={recurring}
                        onChange={(event) => setRecurring(event.target.checked)}
                        className="h-5 w-5 rounded border-gray-300 text-indigo-600"
                      />
                    </label>

                    {recurring && (
                      <label className="mt-4 block border-t border-gray-200 pt-4 text-xs font-semibold text-gray-600">
                        Frequency
                        <select
                          value={frequency}
                          onChange={(event) => setFrequency(event.target.value)}
                          className="task-input mt-1.5"
                        >
                          {FREQUENCIES.map((option) => (
                            <option key={option}>{option}</option>
                          ))}
                        </select>
                      </label>
                    )}
                  </div>

                  <label className="block rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm font-semibold text-gray-700">
                    <span className="flex items-center justify-between gap-3">
                      <span>
                        <span className="block">Time of day</span>
                        <span className="text-xs font-normal text-gray-400">
                          Optional · untimed tasks appear as No time
                        </span>
                      </span>
                      <input
                        type="time"
                        value={scheduledTime}
                        onChange={(event) =>
                          setScheduledTime(event.target.value)
                        }
                        className="task-input w-auto min-w-30"
                      />
                    </span>
                  </label>
                </div>
              )}

              {error && (
                <p className="mt-4 rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
                  {error}
                </p>
              )}
            </form>
          )}
        </div>

        <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-gray-100 bg-white px-5 py-4 sm:px-6">
          {showIdeaAssistant ? (
            <>
              <button
                type="button"
                onClick={() => setShowIdeaAssistant(false)}
                className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to task
              </button>
              <span className="text-xs text-gray-400">
                Select an idea to fill the form
              </span>
            </>
          ) : step === 1 ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={continueToAssignment}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setStep(1);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
              <button
                type="submit"
                form="create-task-form"
                disabled={loading}
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create Task"}
              </button>
            </>
          )}
        </footer>
      </section>
    </div>
  );
}

interface StepButtonProps {
  number: number;
  label: string;
  active: boolean;
  complete: boolean;
  onClick: () => void;
}

function StepButton({
  number,
  label,
  active,
  complete,
  onClick,
}: StepButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-2 border-b-2 px-2 py-3 text-xs font-semibold transition ${
        active
          ? "border-indigo-600 text-indigo-700"
          : "border-transparent text-gray-400 hover:text-gray-600"
      }`}
    >
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
          active || complete
            ? "bg-indigo-600 text-white"
            : "bg-gray-200 text-gray-500"
        }`}
      >
        {complete && !active ? <Check className="h-3 w-3" /> : number}
      </span>
      {label}
    </button>
  );
}

interface FormFieldProps {
  label: string;
  optional?: boolean;
  children: React.ReactNode;
}

function FormField({ label, optional, children }: FormFieldProps) {
  return (
    <label className="block text-sm font-semibold text-gray-700">
      <span className="flex items-center justify-between gap-2">
        {label}
        {optional && (
          <span className="text-[10px] font-medium text-gray-400">Optional</span>
        )}
      </span>
      <span className="mt-1.5 block">{children}</span>
    </label>
  );
}
