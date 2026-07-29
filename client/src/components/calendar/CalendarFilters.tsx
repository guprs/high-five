import type { Child } from "../../types/dashboard";

interface Props {
  children: Child[];
  selectedChildId: string | null;
  onSelect: (childId: string | null) => void;
}

export default function CalendarFilters({
  children,
  selectedChildId,
  onSelect,
}: Props) {
  return (
    <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1">
      <span className="shrink-0 text-xs font-semibold tracking-wide text-gray-400 uppercase">
        Show:
      </span>
      <button
        type="button"
        onClick={() => onSelect(null)}
        aria-pressed={selectedChildId === null}
        className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
          selectedChildId === null
            ? "border-indigo-600 bg-indigo-600 text-white"
            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
        }`}
      >
        All
      </button>
      {children.map((child) => (
        <button
          key={child.id}
          type="button"
          onClick={() => onSelect(child.id)}
          aria-pressed={selectedChildId === child.id}
          className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
            selectedChildId === child.id
              ? "border-indigo-600 bg-indigo-600 text-white"
              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
          }`}
        >
          <span>{child.avatar}</span>
          {child.name}
        </button>
      ))}
    </div>
  );
}
