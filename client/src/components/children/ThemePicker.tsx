import { KID_THEMES } from "../../data/themes";

interface Props {
  value: string;
  onChange: (themeId: string) => void;
}

export default function ThemePicker({ value, onChange }: Props) {
  const selectedTheme = KID_THEMES.find((theme) => theme.id === value) ?? KID_THEMES[0];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="task-input self-stretch"
      >
        {KID_THEMES.map((theme) => (
          <option key={theme.id} value={theme.id}>
            {theme.emoji} {theme.name}
          </option>
        ))}
      </select>

      <div
        className="flex min-h-11 items-center gap-3 rounded-xl border border-white/20 p-3 shadow-sm"
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
