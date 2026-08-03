import { motion } from "motion/react";

import type { KidTheme } from "../../data/themes";

interface Props {
  theme: KidTheme;
}

const SCENES: Record<string, string[]> = {
  space: ["🪐", "⭐", "✨", "🚀", "🌙"],
  princess: ["🪄", "✨", "🌸", "👑", "🦋"],
  ocean: ["🐠", "🫧", "🐳", "🐚", "🌊"],
  jungle: ["🌿", "🦜", "🐒", "🌴", "🐾"],
  rainbow: ["☁️", "✨", "💖", "🌈", "⭐"],
  dino: ["🌋", "🌴", "🥚", "🦕", "🍃"],
  pirate: ["⚓", "💰", "🦜", "🗺️", "🌊"],
  pixel: ["👾", "⭐", "🔷", "🕹️", "💾"],
};

export default function ThemeAtmosphere({ theme }: Props) {
  const decorations = SCENES[theme.id] ?? theme.decorations;

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {decorations.map((decoration, index) => (
        <motion.span
          key={`${theme.id}-${decoration}-${index}`}
          initial={{ opacity: 0, y: 16, rotate: 0 }}
          animate={{ opacity: [0, 0.32, 0.18], y: [16, -18, 10], rotate: index % 2 ? -12 : 12 }}
          transition={{ duration: 3.5 + index * 0.45, delay: index * 0.25, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          className="absolute text-3xl sm:text-4xl"
          style={{ left: `${8 + index * 21}%`, top: `${10 + (index % 3) * 27}%` }}
        >
          {decoration}
        </motion.span>
      ))}
    </div>
  );
}
