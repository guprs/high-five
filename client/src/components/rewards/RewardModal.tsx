import { useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, Gift, Sparkles, X } from "lucide-react";

import type { RewardIdea } from "../../services/rewardIdeas";
import type { Reward } from "../../types/dashboard";
import RewardIdeaAssistant from "./RewardIdeaAssistant";

interface Props {
  reward?: Reward;
  initialValues?: Pick<Reward, "title" | "cost" | "icon">;
  onClose: () => void;
  onSave: (reward: Reward) => Promise<void>;
}

const ICON_OPTIONS = [
  "🎁", "📱", "🍕", "🎬", "✨", "🏕️",
  "🎮", "🍦", "🎨", "⚽", "📚", "🌙",
];

export default function RewardModal({
  reward,
  initialValues,
  onClose,
  onSave,
}: Props) {
  const [title, setTitle] = useState(reward?.title ?? initialValues?.title ?? "");
  const [cost, setCost] = useState(
    (reward?.cost ?? initialValues?.cost ?? 50).toString(),
  );
  const [icon, setIcon] = useState(reward?.icon ?? initialValues?.icon ?? "🎁");
  const [error, setError] = useState("");
  const [showIdeaAssistant, setShowIdeaAssistant] = useState(false);
  const [saving, setSaving] = useState(false);
  const editing = Boolean(reward);

  function handleSelectIdea(idea: RewardIdea) {
    setTitle(idea.title);
    setCost(idea.cost.toString());
    setIcon(idea.icon);
    setError("");
    setShowIdeaAssistant(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedTitle = title.trim();
    const normalizedCost = Number(cost);

    if (!normalizedTitle) {
      setError("Please enter a reward name.");
      return;
    }
    if (!Number.isInteger(normalizedCost) || normalizedCost < 1) {
      setError("Coin cost must be a whole number greater than zero.");
      return;
    }

    try {
      setSaving(true);
      await onSave({
        id: reward?.id ?? "new",
        title: normalizedTitle,
        cost: normalizedCost,
        icon,
      });
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Could not save this reward.",
      );
    } finally {
      setSaving(false);
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-stretch justify-center bg-slate-950/55 backdrop-blur-sm sm:items-center sm:p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="reward-modal-title"
        className="flex h-[100dvh] w-full max-w-3xl flex-col overflow-hidden bg-white shadow-2xl sm:h-auto sm:max-h-[90vh] sm:rounded-3xl sm:border sm:border-gray-100"
      >
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-gray-100 px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${showIdeaAssistant ? "bg-violet-100 text-violet-600" : "bg-indigo-100 text-indigo-600"}`}>
              {showIdeaAssistant ? <Sparkles className="h-5 w-5" /> : <Gift className="h-5 w-5" />}
            </div>
            <div className="min-w-0">
              <h2 id="reward-modal-title" className="truncate text-lg font-bold text-gray-900">
                {showIdeaAssistant
                  ? "Find a Reward Idea"
                  : editing
                    ? "Edit Reward"
                    : "Create New Reward"}
              </h2>
              <p className="truncate text-xs text-gray-400">
                {showIdeaAssistant
                  ? "Create safe, personalised ideas for your child"
                  : editing
                    ? "Update the reward details and coin cost"
                    : "Add a reward to your family catalogue"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close reward form"
            className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {showIdeaAssistant ? (
            <RewardIdeaAssistant onSelect={handleSelectIdea} />
          ) : (
            <form id="reward-form" onSubmit={handleSubmit} className="space-y-5">
              {!editing && (
                <button
                  type="button"
                  onClick={() => setShowIdeaAssistant(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-semibold text-violet-700 transition hover:border-violet-300 hover:bg-violet-100"
                >
                  <Sparkles className="h-4 w-4" />
                  Help me find reward ideas
                </button>
              )}

              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_180px]">
                <label className="text-sm font-semibold text-gray-700">
                  Reward name
                  <input
                    autoFocus
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="e.g. Choose dinner tonight"
                    maxLength={80}
                    className="task-input mt-1.5"
                  />
                </label>
                <label className="text-sm font-semibold text-gray-700">
                  Coin cost
                  <span className="relative mt-1.5 block">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">⭐</span>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={cost}
                      onChange={(event) => setCost(event.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pr-3 pl-11 text-sm font-medium text-gray-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-3 focus:ring-indigo-100"
                    />
                  </span>
                </label>
              </div>

              <fieldset>
                <legend className="text-sm font-semibold text-gray-700">Choose an icon</legend>
                <p className="mt-0.5 text-xs text-gray-400">This appears in the reward catalogue and Kid Mode shop.</p>
                <div className="mt-3 grid grid-cols-6 gap-2 sm:grid-cols-12">
                  {ICON_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setIcon(option)}
                      aria-label={`Use ${option} icon`}
                      aria-pressed={icon === option}
                      className={`flex aspect-square items-center justify-center rounded-xl border text-xl transition ${
                        icon === option
                          ? "border-indigo-400 bg-indigo-50 ring-2 ring-indigo-100"
                          : "border-gray-200 bg-gray-50 hover:border-indigo-200 hover:bg-white"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">{icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-indigo-400 uppercase">Catalogue preview</p>
                    <p className="truncate text-sm font-bold text-gray-900">{title.trim() || "Your reward"}</p>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-amber-600">⭐ {Number(cost) || 0}</span>
                </div>
              </div>

              {error && (
                <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{error}</p>
              )}
            </form>
          )}
        </div>

        <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-gray-100 bg-white px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-4">
          {showIdeaAssistant ? (
            <>
              <button
                type="button"
                onClick={() => setShowIdeaAssistant(false)}
                className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to reward
              </button>
              <span className="hidden text-xs text-gray-400 sm:inline">Select an idea to fill the form</span>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="reward-form"
                disabled={saving}
                className="shrink-0 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60"
              >
                {saving ? "Saving..." : editing ? "Save Changes" : "Create Reward"}
              </button>
            </>
          )}
        </footer>
      </section>
    </div>,
    document.body,
  );
}
