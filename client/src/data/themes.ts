export interface KidTheme {
  id: string;
  name: string;
  emoji: string;
  from: string;
  via: string;
  to: string;
  cardFrom: string;
  cardTo: string;
  accent: string;
  font: string;
  decorations: string[];
  avatars: string[];
}


const makeTheme = (
  id: string,
  name: string,
  emoji: string,
  from: string,
  via: string,
  to: string,
  accent: string,
  decorations: string[],
  avatars: string[],
): KidTheme => ({
  id,
  name,
  emoji,
  from,
  via,
  to,
  cardFrom: via,
  cardTo: to,
  accent,
  font: "'Fredoka', cursive",
  decorations,
  avatars,
});



export const KID_THEMES: KidTheme[] = [


  makeTheme(
    "space",
    "Space Adventure",
    "🚀",
    "#0f0c29",
    "#302b63",
    "#24243e",
    "#38bdf8",
    [
      "⭐",
      "🌙",
      "🚀",
      "🪐"
    ],
    [
      "🧑‍🚀",
      "👽",
      "🤖",
      "🚀",
      "🌙"
    ]
  ),



  makeTheme(
    "princess",
    "Princess Kingdom",
    "👑",
    "#6b21a8",
    "#9333ea",
    "#c084fc",
    "#facc15",
    [
      "✨",
      "👑",
      "🌸",
      "💎"
    ],
    [
      "👸",
      "🤴",
      "🦄",
      "🧚",
      "🏰"
    ]
  ),



  makeTheme(
    "ocean",
    "Ocean Adventure",
    "🌊",
    "#0c4a6e",
    "#0369a1",
    "#0ea5e9",
    "#67e8f9",
    [
      "🌊",
      "🐠",
      "🐚",
      "🫧"
    ],
    [
      "🧜",
      "🐬",
      "🐠",
      "🐙",
      "🌊"
    ]
  ),



  makeTheme(
    "jungle",
    "Jungle Explorer",
    "🦁",
    "#14532d",
    "#166534",
    "#15803d",
    "#facc15",
    [
      "🦁",
      "🌿",
      "🦜",
      "🐾"
    ],
    [
      "🦁",
      "🐒",
      "🦜",
      "🐯",
      "🌿"
    ]
  ),



  makeTheme(
    "rainbow",
    "Rainbow",
    "🌈",
    "#581c87",
    "#7e22ce",
    "#4c1d95",
    "#f9a8d4",
    [
      "🌈",
      "⭐",
      "💖",
      "✨"
    ],
    [
      "🦄",
      "🌈",
      "🧚",
      "⭐",
      "💖"
    ]
  ),



  makeTheme(
    "dino",
    "Dinosaurs",
    "🦕",
    "#1a2e05",
    "#365314",
    "#3f6212",
    "#fde047",
    [
      "🦕",
      "🌴",
      "🥚",
      "🌋"
    ],
    [
      "🦖",
      "🦕",
      "🥚",
      "🌋",
      "🧭"
    ]
  ),



  makeTheme(
    "pirate",
    "Pirate Island",
    "🏴‍☠️",
    "#1c0a00",
    "#431407",
    "#7c2d12",
    "#fde68a",
    [
      "🏴‍☠️",
      "🌊",
      "💰",
      "⚓"
    ],
    [
      "🏴‍☠️",
      "⚓",
      "🦜",
      "🗺️",
      "💰"
    ]
  ),



  makeTheme(
    "pixel",
    "Retro Pixel",
    "🕹️",
    "#0a0a0a",
    "#111827",
    "#1f2937",
    "#a78bfa",
    [
      "🕹️",
      "👾",
      "⭐",
      "🔷"
    ],
    [
      "👾",
      "🤖",
      "🕹️",
      "⭐",
      "🎮"
    ]
  ),

];