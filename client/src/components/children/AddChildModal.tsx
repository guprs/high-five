import { useState } from "react";
import { UserPlus, X } from "lucide-react";

import { KID_THEMES } from "../../data/themes";
import api from "../../services/api";
import ThemePicker from "./ThemePicker";

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export default function AddChildModal({ onClose, onCreated }: Props) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [themeId, setThemeId] = useState(KID_THEMES[0].id);
  const [avatar, setAvatar] = useState(KID_THEMES[0].avatars[0] ?? "🧒");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const selectedTheme =
    KID_THEMES.find((item) => item.id === themeId) ?? KID_THEMES[0];

  function changeTheme(nextThemeId: string) {
    const nextTheme =
      KID_THEMES.find((item) => item.id === nextThemeId) ?? KID_THEMES[0];
    setThemeId(nextThemeId);
    if (!nextTheme.avatars.includes(avatar)) {
      setAvatar(nextTheme.avatars[0] ?? "🧒");
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      setLoading(true);
      setError("");
      await api.post("/api/children", {
        name: name.trim(),
        age: Number(age),
        emoji: avatar,
        theme: selectedTheme.name,
      });
      onCreated();
    } catch {
      setError("We couldn’t add this child. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-stretch justify-center bg-slate-950/55 backdrop-blur-sm sm:items-center sm:p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-child-title"
        className="flex h-[100dvh] w-full max-w-2xl flex-col overflow-hidden bg-white shadow-2xl sm:h-auto sm:max-h-[90vh] sm:rounded-3xl sm:border sm:border-gray-100"
      >
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-gray-100 px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
              <UserPlus className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 id="add-child-title" className="truncate text-lg font-bold text-gray-900">Add a Child</h2>
              <p className="truncate text-xs text-gray-400">Create their profile, avatar and Kid Mode world</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close child form" className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <form id="add-child-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_140px]">
              <label className="text-sm font-semibold text-gray-700">
                Name
                <input required autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Emma" maxLength={60} className="task-input mt-1.5" />
              </label>
              <label className="text-sm font-semibold text-gray-700">
                Age
                <input required type="number" min={1} max={18} value={age} onChange={(event) => setAge(event.target.value)} placeholder="8" className="task-input mt-1.5" />
              </label>
            </div>

            <fieldset className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <legend className="px-1 text-sm font-semibold text-gray-700">Choose a Kid Mode world</legend>
              <p className="mb-3 text-xs text-gray-400">This controls the colours and atmosphere of their adventure.</p>
              <ThemePicker value={themeId} onChange={changeTheme} />
            </fieldset>

            <fieldset>
              <legend className="text-sm font-semibold text-gray-700">Choose an avatar</legend>
              <p className="mt-0.5 text-xs text-gray-400">Avatars are matched to the selected world.</p>
              <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
                {selectedTheme.avatars.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setAvatar(item)}
                    aria-label={`Use ${item} avatar`}
                    aria-pressed={avatar === item}
                    className={`flex aspect-square items-center justify-center rounded-xl border text-2xl transition ${
                      avatar === item
                        ? "border-indigo-400 bg-indigo-50 ring-2 ring-indigo-100"
                        : "border-gray-200 bg-gray-50 hover:border-indigo-200 hover:bg-white"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="flex items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-3xl shadow-sm">{avatar}</span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-indigo-400 uppercase">Profile preview</p>
                <p className="truncate text-sm font-bold text-gray-900">{name.trim() || "New child"}</p>
                <p className="truncate text-xs text-gray-500">{selectedTheme.emoji} {selectedTheme.name}</p>
              </div>
            </div>

            {error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{error}</p>}
          </form>
        </div>

        <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-gray-100 bg-white px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-4">
          <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100">Cancel</button>
          <button type="submit" form="add-child-form" disabled={loading} className="shrink-0 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60">
            {loading ? "Creating..." : "Add Child"}
          </button>
        </footer>
      </section>
    </div>
  );
}
