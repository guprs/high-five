import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";

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

  const selectedTheme = KID_THEMES.find((item) => item.id === themeId) ?? KID_THEMES[0];

  useEffect(() => {
    if (!selectedTheme.avatars.includes(avatar)) {
      setAvatar(selectedTheme.avatars[0] ?? "🧒");
    }
  }, [avatar, selectedTheme, themeId]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const theme = KID_THEMES.find((item) => item.id === themeId) ?? KID_THEMES[0];

    try {
      setLoading(true);
      setError("");
      await api.post("/api/children", { name: name.trim(), age: Number(age), emoji: avatar, theme: theme.name });
      onCreated();
    } catch {
      setError("We couldn't add this adventurer. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-4xl border border-white/70 bg-white/85 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="mb-2 inline-flex rounded-xl bg-indigo-100 p-2 text-indigo-600"><Sparkles className="h-5 w-5" /></div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">Add an adventurer</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">Set up their avatar and choose a world to explore.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><X className="h-5 w-5" /></button>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block text-sm font-bold text-slate-700">Name
              <input required value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Emma" className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white/80 px-3.5 py-3 font-medium text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
            </label>
            <label className="block text-sm font-bold text-slate-700">Age
              <input required type="number" min={1} max={18} value={age} onChange={(event) => setAge(event.target.value)} placeholder="8" className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white/80 px-3.5 py-3 font-medium text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
            </label>
          </div>

          <fieldset><legend className="text-sm font-bold text-slate-700">Choose a world</legend><p className="mb-2 text-xs font-medium text-slate-500">Start by picking the adventure style for their Kid Mode experience.</p><ThemePicker value={themeId} onChange={setThemeId} /></fieldset>

          <fieldset><legend className="text-sm font-bold text-slate-700">Choose an avatar</legend><p className="mb-3 text-xs font-medium text-slate-500">These icons match the currently selected world and stay compact for smaller screens.</p><div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-5">
            {selectedTheme.avatars.map((item) => (
              <button key={item} type="button" onClick={() => setAvatar(item)} className={`flex h-11 items-center justify-center rounded-xl text-2xl transition ${avatar === item ? "bg-indigo-100 ring-2 ring-indigo-500" : "bg-white/80 ring-1 ring-slate-200 hover:bg-slate-100"}`}>{item}</button>
            ))}
          </div></fieldset>
          {error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-600">{error}</p>}
        </div>

        <div className="mt-7 flex gap-3"><button type="button" onClick={onClose} className="flex-1 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-100">Cancel</button><button disabled={loading} type="submit" className="flex-[1.4] rounded-xl bg-indigo-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:opacity-60">{loading ? "Creating…" : "Create adventure"}</button></div>
      </form>
    </div>
  );
}
