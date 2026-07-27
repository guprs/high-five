import { motion } from "motion/react";

import { KID_THEMES } from "../../data/themes";
import type { Child } from "../../types/dashboard";

interface Props {
  child: Child;
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
}

export default function KidProfileTab({ child, currentTheme, onThemeChange }: Props) {
  const stats = [
    [`Lv.${child.level}`, "Level"],
    [`🔥 ${child.streak}`, "Day Streak"],
    [`⭐ ${child.coins}`, "Coins"],
  ];

  return (
    <div className="space-y-4">
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl border border-white/10 bg-white/15 p-6 text-center shadow-xl backdrop-blur-sm"
      >
        <div
          className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full text-7xl shadow-2xl ring-4 ring-white/25"
          style={{ backgroundColor: `${child.color}40` }}
        >
          {child.avatar}
        </div>
        <h2 className="text-4xl font-black text-white">{child.name}</h2>
        <p className="mt-1 text-sm font-semibold text-white/60">Age {child.age} · {child.theme}</p>
        <div className="mt-5 grid grid-cols-3 gap-3">
          {stats.map(([value, label]) => (
            <div key={label} className="rounded-2xl bg-white/10 py-3">
              <div className="text-xl font-black text-white">{value}</div>
              <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/50">{label}</div>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl backdrop-blur-sm"
      >
        <h3 className="mb-4 text-lg font-black text-white">🎨 Choose Your Theme</h3>
        <div className="grid grid-cols-4 gap-2">
          {KID_THEMES.map((theme) => {
            const isSelected = currentTheme === theme.id;

            return (
              <motion.button
                key={theme.id}
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => onThemeChange(theme.id)}
                aria-pressed={isSelected}
                className={`rounded-2xl p-3 text-center transition-all ${
                  isSelected ? "scale-105 bg-white/25 ring-2 ring-white" : "bg-white/10 hover:bg-white/20"
                }`}
              >
                <div className="mb-1 text-3xl">{theme.emoji}</div>
                <div className="text-[9px] font-bold leading-tight text-white">
                  {theme.name.split(" ").slice(0, 2).join(" ")}
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.section>

      <section className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
        <h3 className="mb-4 text-lg font-black text-white">⚙️ My Settings</h3>
        <div className="space-y-3 opacity-60">
          {["Reduce Animations 🌿", "Big Buttons Mode 🔵", "Sound Effects 🔊"].map((setting) => (
            <div key={setting} className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white/80">{setting}</span>
              <div className="flex items-center gap-2">
                <span className="rounded bg-yellow-400/30 px-1.5 py-0.5 text-[10px] font-bold uppercase text-yellow-300">Soon</span>
                <span className="h-5 w-10 rounded-full bg-white/20" aria-hidden="true" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
