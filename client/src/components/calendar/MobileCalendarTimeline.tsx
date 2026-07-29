import type { RefObject } from "react";

import type { Child, Task } from "../../types/dashboard";
import {
  childrenForTask,
  DAY_NAMES,
  sameDay,
} from "../../utils/calendar";

interface Props {
  dates: Date[];
  today: Date;
  selectedDate: Date;
  selectedChildId: string | null;
  children: Child[];
  scrollRef: RefObject<HTMLDivElement | null>;
  tasksForDate: (date: Date) => Task[];
  onSelectDate: (date: Date) => void;
}

export default function MobileCalendarTimeline({
  dates,
  today,
  selectedDate,
  selectedChildId,
  children,
  scrollRef,
  tasksForDate,
  onSelectDate,
}: Props) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm md:hidden">
      <p className="mb-2 px-1 text-xs font-semibold text-gray-400">
        Swipe to browse dates
      </p>
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth pb-2 overscroll-x-contain"
      >
        {dates.map((date) => {
          const isToday = sameDay(date, today);
          const isSelected = sameDay(date, selectedDate);
          const weekdayIndex = (date.getDay() + 6) % 7;
          const dayTasks = tasksForDate(date);
          const assignedChildren = dayTasks
            .flatMap((task) =>
              childrenForTask(task, children, selectedChildId),
            )
            .filter(
              (child, index, taskChildren) =>
                taskChildren.findIndex(
                  (candidate) => candidate.id === child.id,
                ) === index,
            )
            .slice(0, 3);

          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => onSelectDate(date)}
              aria-label={`Show agenda for ${date.toLocaleDateString("en-US", { dateStyle: "full" })}`}
              aria-pressed={isSelected}
              className={`w-17 min-w-17 snap-center rounded-2xl border px-2 py-3 text-center transition-all ${
                isSelected
                  ? "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-100"
                  : "border-gray-100 bg-gray-50 text-gray-700"
              }`}
            >
              <span
                className={`block text-[10px] font-bold tracking-wide uppercase ${
                  isSelected ? "text-indigo-100" : "text-gray-400"
                }`}
              >
                {DAY_NAMES[weekdayIndex]}
              </span>
              <span className="mt-1 block text-xl font-black">
                {date.getDate()}
              </span>
              <span
                className={`mt-1 block text-[9px] font-semibold ${
                  isSelected ? "text-indigo-100" : "text-gray-400"
                }`}
              >
                {date.toLocaleDateString("en-US", { month: "short" })}
              </span>
              <span className="mt-2 flex h-5 items-center justify-center -space-x-1">
                {assignedChildren.length > 0 ? (
                  assignedChildren.map((child) => (
                    <span
                      key={child.id}
                      title={child.name}
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${
                        isSelected ? "bg-white/20" : "bg-white"
                      }`}
                    >
                      {child.avatar}
                    </span>
                  ))
                ) : (
                  <span
                    className={`text-[9px] ${
                      isSelected ? "text-indigo-200" : "text-gray-300"
                    }`}
                  >
                    No tasks
                  </span>
                )}
              </span>
              <span
                className={`mt-1 block text-[9px] font-bold ${
                  isSelected ? "text-white" : "text-indigo-600"
                }`}
              >
                {dayTasks.length} {dayTasks.length === 1 ? "task" : "tasks"}
              </span>
              {isToday && (
                <span
                  className={`mx-auto mt-1.5 block h-1 w-4 rounded-full ${
                    isSelected ? "bg-white" : "bg-indigo-500"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
