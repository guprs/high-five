import { useState } from "react";
import { createPortal } from "react-dom";
import { Gift, Sparkles, X } from "lucide-react";

import type { Reward } from "../../types/dashboard";
import type { RewardIdea } from "../../services/rewardIdeas";
import RewardIdeaAssistant from "./RewardIdeaAssistant";

interface Props {
  reward?: Reward;
  onClose: () => void;
  onSave: (reward: Reward) => Promise<void>;
}

const ICON_OPTIONS = ["🎁", "📱", "🍕", "🎬", "✨", "🏕️", "🎮", "🍦", "🎨", "⚽", "📚", "🌙"];

export default function RewardModal({ reward, onClose, onSave }: Props) {
  const [title, setTitle] = useState(reward?.title ?? "");
  const [cost, setCost] = useState(reward?.cost.toString() ?? "50");
  const [icon, setIcon] = useState(reward?.icon ?? "🎁");
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
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reward-modal-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/70 bg-white p-6 shadow-2xl sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
              <Gift className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="reward-modal-title"
                className="text-lg font-bold text-gray-900"
              >
                {editing ? "Edit Reward" : "Create Reward"}
              </h2>
              <p className="text-sm text-gray-400">
                {editing
                  ? "Update this catalog reward"
                  : "Add something exciting to the catalog"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close reward form"
            className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {!showIdeaAssistant && (
          <button
            type="button"
            onClick={() => setShowIdeaAssistant(true)}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-semibold text-violet-700 transition hover:border-violet-300 hover:bg-violet-100"
          >
            <Sparkles className="h-4 w-4" />
            Help me find reward ideas
          </button>
        )}

        {showIdeaAssistant && (
          <RewardIdeaAssistant
            onSelect={handleSelectIdea}
            onClose={() => setShowIdeaAssistant(false)}
          />
        )}

        <div className="mt-6">
          <label
            htmlFor="reward-title"
            className="text-sm font-semibold text-gray-700"
          >
            Reward name
          </label>
          <input
            id="reward-title"
            autoFocus
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Choose dinner tonight"
            maxLength={80}
            className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        <fieldset className="mt-5">
          <legend className="text-sm font-semibold text-gray-700">
            Choose an icon
          </legend>
          <div className="mt-2 grid grid-cols-6 gap-2">
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

        <div className="mt-5">
          <label
            htmlFor="reward-cost"
            className="text-sm font-semibold text-gray-700"
          >
            Coin cost
          </label>
          <div className="relative mt-2">
            <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
              ⭐
            </span>
            <input
              id="reward-cost"
              type="number"
              min="1"
              step="1"
              value={cost}
              onChange={(event) => setCost(event.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pr-3.5 pl-11 text-sm font-semibold text-gray-900 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : editing
                ? "Save Changes"
                : "Create Reward"}
          </button>
        </div>
      </form>
    </div>,
    document.body,
  );
}
