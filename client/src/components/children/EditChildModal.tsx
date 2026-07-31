import { useState } from "react";
import { Pencil, X } from "lucide-react";

import type { Child } from "../../types/dashboard";
import { updateChild } from "../../services/child";
import { KID_THEMES } from "../../data/themes";
import ThemePicker from "./ThemePicker";

interface Props {
  child: Child;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditChildModal({ child, onClose, onUpdated }: Props) {
  const [name, setName] = useState(child.name);
  const [age, setAge] = useState(child.age);
  const [themeId, setThemeId] = useState(child.themeId || KID_THEMES[0].id);
  const [avatar, setAvatar] = useState(child.avatar || KID_THEMES[0].avatars[0] || "🧒");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const selectedTheme = KID_THEMES.find((item) => item.id === themeId) ?? KID_THEMES[0];

  function changeTheme(nextThemeId: string) {
    const nextTheme =
      KID_THEMES.find((item) => item.id === nextThemeId) ?? KID_THEMES[0];
    setThemeId(nextThemeId);
    if (!nextTheme.avatars.includes(avatar)) {
      setAvatar(nextTheme.avatars[0] ?? "🧒");
    }
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      await updateChild(child.id, { name: name.trim(), age, emoji: avatar, themeId });
      onUpdated();
    } catch {
      setError("We couldn't save these changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <form onSubmit={handleSave} className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-4xl border border-white/70 bg-white/85 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="mb-2 inline-flex rounded-xl bg-indigo-100 p-2 text-indigo-600"><Pencil className="h-5 w-5" /></div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">Edit {child.name}</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">Update their profile and choose the world for their next adventure.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><X className="h-5 w-5" /></button>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block text-sm font-bold text-slate-700">Name
              <input required value={name} onChange={(event) => setName(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white/80 px-3.5 py-3 font-medium text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
            </label>
            <label className="block text-sm font-bold text-slate-700">Age
              <input required type="number" min={1} max={18} value={age} onChange={(event) => setAge(Number(event.target.value))} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white/80 px-3.5 py-3 font-medium text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
            </label>
          </div>

          <fieldset><legend className="text-sm font-bold text-slate-700">Choose a world</legend><p className="mb-2 text-xs font-medium text-slate-500">Start by picking the adventure style for their Kid Mode experience.</p><ThemePicker value={themeId} onChange={changeTheme} /></fieldset>

          <fieldset><legend className="text-sm font-bold text-slate-700">Choose an avatar</legend><p className="mb-3 text-xs font-medium text-slate-500">These icons match the currently selected world and stay compact for smaller screens.</p><div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-5">
            {selectedTheme.avatars.map((item) => (
              <button key={item} type="button" onClick={() => setAvatar(item)} className={`flex h-11 items-center justify-center rounded-xl text-2xl transition ${avatar === item ? "bg-indigo-100 ring-2 ring-indigo-500" : "bg-white/80 ring-1 ring-slate-200 hover:bg-slate-100"}`}>{item}</button>
            ))}
          </div></fieldset>
          {error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-600">{error}</p>}
        </div>

        <div className="mt-7 flex gap-3"><button type="button" onClick={onClose} className="flex-1 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-100">Cancel</button><button disabled={saving} type="submit" className="flex-[1.4] rounded-xl bg-indigo-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:opacity-60">{saving ? "Saving…" : "Save changes"}</button></div>
      </form>
    </div>
  );
}
