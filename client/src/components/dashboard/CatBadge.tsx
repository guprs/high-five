interface Props {
  category: string;
}

const colors: Record<string, string> = {
  "🧹 Chores": "bg-blue-100 text-blue-700",
  Chores: "bg-blue-100 text-blue-700",

  "🧠 Skills": "bg-purple-100 text-purple-700",
  Skills: "bg-purple-100 text-purple-700",

  "📚 Education": "bg-yellow-100 text-yellow-700",
  Education: "bg-yellow-100 text-yellow-700",

  "⭐ Other": "bg-gray-100 text-gray-600",
  Other: "bg-gray-100 text-gray-600",
};

export default function CatBadge({ category }: Props) {
  return (
    <span
      className={`px-2 py-1 rounded-full text-[10px] font-semibold ${
        colors[category] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {category}
    </span>
  );
}