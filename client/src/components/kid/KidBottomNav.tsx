import { motion } from "framer-motion";

type KidTab =
  | "quests"
  | "shop"
  | "achievements"
  | "profile";

interface Props {
  activeTab: KidTab;
  setActiveTab: (tab: KidTab) => void;
}

const NAV_ITEMS = [
  {
    id: "quests",
    label: "Quests",
    emoji: "⚔️",
  },
  {
    id: "shop",
    label: "Shop",
    emoji: "🛍️",
  },
  {
    id: "achievements",
    label: "Badges",
    emoji: "🏆",
  },
  {
    id: "profile",
    label: "Me",
    emoji: "🧙",
  },
] as const;

export default function KidBottomNav({
  activeTab,
  setActiveTab,
}: Props) {
  return (
    <nav
      className="
        bg-black/30
        backdrop-blur-xl
        border-t
        border-white/10
        px-4
        py-3
      "
    >
      <div
        className="
          flex
          items-center
          justify-around
          max-w-sm
          mx-auto
        "
      >
        {NAV_ITEMS.map((item) => (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveTab(item.id)}
            className={`
              flex
              flex-col
              items-center
              gap-1
              px-5
              py-2
              rounded-2xl
              transition-all

              ${
                activeTab === item.id
                  ? "bg-white/20"
                  : "hover:bg-white/10"
              }
            `}
          >
            <span className="text-2xl">
              {item.emoji}
            </span>

            <span
              className={`
                text-[10px]
                font-black
                uppercase
                tracking-wide

                ${
                  activeTab === item.id
                    ? "text-white"
                    : "text-white/50"
                }
              `}
            >
              {item.label}
            </span>
          </motion.button>
        ))}
      </div>
    </nav>
  );
}