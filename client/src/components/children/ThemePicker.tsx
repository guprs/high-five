import { KID_THEMES } from "../../data/themes";

interface Props {
  value: string;
  onChange: (themeId: string) => void;
}

export default function ThemePicker({ value, onChange }: Props) {
  const selectedTheme = KID_THEMES.find((theme) => theme.id === value) ?? KID_THEMES[0];

  return (
    <div className="space-y-2">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white/80 px-3.5 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
      >
        {KID_THEMES.map((theme) => (
          <option key={theme.id} value={theme.id}>
            {theme.emoji} {theme.name}
          </option>
        ))}
      </select>

      <div
        className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3"
        style={{ background: `linear-gradient(135deg, ${selectedTheme.from}, ${selectedTheme.to})` }}
      >
        <span className="text-2xl">{selectedTheme.emoji}</span>
        <div>
          <p className="text-sm font-black text-white">{selectedTheme.name}</p>
          <p className="text-xs font-medium text-white/80">Perfect for this adventure vibe</p>
        </div>
      </div>
    </div>
  );
}
