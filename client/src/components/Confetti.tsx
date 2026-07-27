import { motion } from "motion/react";

interface Props {
  active: boolean;
}

const PIECES = Array.from({ length: 42 }, (_, index) => ({
  id: index,
  color: ["#facc15", "#f472b6", "#60a5fa", "#34d399", "#fb923c", "#c084fc"][index % 6],
  left: `${(index * 37) % 100}%`,
  delay: (index % 10) * 0.035,
  rotation: index % 2 === 0 ? 360 : -360,
}));

export default function Confetti({ active }: Props) {
  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {PIECES.map((piece) => (
        <motion.span
          key={piece.id}
          initial={{ opacity: 0, y: -24, x: 0, rotate: 0, scale: 0.6 }}
          animate={{ opacity: [0, 1, 1, 0], y: "105vh", x: piece.id % 2 === 0 ? 90 : -90, rotate: piece.rotation, scale: 1 }}
          transition={{ duration: 2.2, delay: piece.delay, ease: "easeOut" }}
          className="absolute top-0 h-3 w-2 rounded-sm"
          style={{ left: piece.left, backgroundColor: piece.color }}
        />
      ))}
    </div>
  );
}
