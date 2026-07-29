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

export default function DesktopCalendarTimeline({
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
    <section className="hidden rounded-2xl border border-gray-100 bg-white shadow-sm md:block">
      <div
        ref={scrollRef}
        className="snap-x snap-mandatory overflow-x-auto scroll-smooth overscroll-x-contain"
      >
        <div className="min-w-546">
          <div className="grid grid-cols-[repeat(21,minmax(104px,1fr))] border-b border-gray-100">
            {dates.map((date) => {
              const isToday = sameDay(date, today);
              const isSelected = sameDay(date, selectedDate);
              const weekdayIndex = (date.getDay() + 6) % 7;
              const taskCount = tasksForDate(date).length;

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => onSelectDate(date)}
                  aria-label={`Show agenda for ${date.toLocaleDateString("en-US", { dateStyle: "full" })}`}
                  aria-pressed={isSelected}
                  className={`snap-start py-4 text-center transition-colors ${
                    isSelected ? "bg-indigo-50" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
                    {DAY_NAMES[weekdayIndex]}
                  </div>
                  <div
                    className={`mx-auto mt-0.5 flex h-9 w-9 items-center justify-center rounded-full text-xl font-black transition-all ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-sm ring-4 ring-indigo-100"
                        : "text-gray-800"
                    }`}
                  >
                    {date.getDate()}
                  </div>
                  <div className="mt-1 flex h-4 items-center justify-center gap-1">
                    {isToday && (
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    )}
                    {taskCount > 0 && (
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[9px] leading-none font-bold ${
                          isSelected
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {taskCount}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="grid min-h-70 grid-cols-[repeat(21,minmax(104px,1fr))] divide-x divide-gray-50">
            {dates.map((date) => {
              const isSelected = sameDay(date, selectedDate);
              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => onSelectDate(date)}
                  className={`snap-start space-y-1.5 p-2 text-left align-top transition-colors ${
                    isSelected ? "bg-indigo-50/30" : "hover:bg-gray-50/60"
                  }`}
                >
                  {tasksForDate(date).map((task) => {
                    const assignedChildren = childrenForTask(
                      task,
                      children,
                      selectedChildId,
                    );
                    const primaryChild = assignedChildren[0];
                    return (
                      <span
                        key={task.id}
                        className="block rounded-lg px-2 py-1.5 text-[10px] leading-tight font-semibold transition-opacity hover:opacity-80"
                        style={{
                          backgroundColor: `${primaryChild?.color ?? "#4F46E5"}22`,
                          color: primaryChild?.color ?? "#4F46E5",
                        }}
                      >
                        <span className="mr-1 inline-flex -space-x-0.5">
                          {assignedChildren.map((child) => (
                            <span key={child.id} title={child.name}>
                              {child.avatar}
                            </span>
                          ))}
                        </span>
                        {task.title}
                      </span>
                    );
                  })}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
