import { useEffect, useMemo, useRef, useState } from "react";

import CalendarAgenda from "../components/calendar/CalendarAgenda";
import CalendarFilters from "../components/calendar/CalendarFilters";
import CalendarHeader from "../components/calendar/CalendarHeader";
import DesktopCalendarTimeline from "../components/calendar/DesktopCalendarTimeline";
import MobileCalendarTimeline from "../components/calendar/MobileCalendarTimeline";
import { getChildren } from "../services/child";
import { getCalendarTasks } from "../services/task";
import type { Child, Task } from "../types/dashboard";
import {
  addDays,
  fromDateInputValue,
  normalizeChildren,
  normalizeTask,
  startOfDay,
  startOfWeek,
  taskOccursOnDate,
} from "../utils/calendar";

export default function CalendarPage() {
  const today = startOfDay(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [weekStart, setWeekStart] = useState(() => startOfWeek(today));
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const desktopScrollRef = useRef<HTMLDivElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  const calendarDates = useMemo(
    () =>
      Array.from({ length: 21 }, (_, index) =>
        addDays(weekStart, index - 7),
      ),
    [weekStart],
  );

  function tasksForDate(date: Date) {
    return tasks.filter(
      (task) =>
        taskOccursOnDate(task, date, today) &&
        (!selectedChildId || task.assignedTo.includes(selectedChildId)),
    );
  }

  useEffect(() => {
    desktopScrollRef.current?.scrollTo({
      left: 7 * 104,
      behavior: "smooth",
    });
    mobileScrollRef.current?.scrollTo({
      left: 7 * 76,
      behavior: "smooth",
    });
  }, [weekStart]);

  useEffect(() => {
    let cancelled = false;

    Promise.all([getCalendarTasks(), getChildren()])
      .then(([taskData, childData]) => {
        if (cancelled) return;
        setTasks(
          taskData.filter((task) => task.active !== false).map(normalizeTask),
        );
        setChildren(normalizeChildren(childData));
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("Failed to load calendar data", error);
        setLoadError("We couldn’t load the family calendar right now.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function retryLoadCalendar() {
    try {
      setLoading(true);
      setLoadError("");
      const [taskData, childData] = await Promise.all([
        getCalendarTasks(),
        getChildren(),
      ]);
      setTasks(
        taskData.filter((task) => task.active !== false).map(normalizeTask),
      );
      setChildren(normalizeChildren(childData));
    } catch (error) {
      console.error("Failed to load calendar data", error);
      setLoadError("We couldn’t load the family calendar right now.");
    } finally {
      setLoading(false);
    }
  }

  function chooseDate(value: string) {
    if (!value) return;
    const date = fromDateInputValue(value);
    setWeekStart(startOfWeek(date));
    setSelectedDate(date);
  }

  return (
    <div className="space-y-5">
      <CalendarHeader
        dates={calendarDates}
        selectedDate={selectedDate}
        today={today}
        onChooseDate={chooseDate}
      />

      {loading && (
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700">
          Loading family calendar…
        </div>
      )}

      {loadError && (
        <div className="flex flex-col gap-3 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-rose-700">{loadError}</p>
          <button
            type="button"
            onClick={() => void retryLoadCalendar()}
            disabled={loading}
            className="self-start rounded-xl bg-rose-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-rose-700 disabled:opacity-60"
          >
            {loading ? "Retrying…" : "Try again"}
          </button>
        </div>
      )}

      <CalendarFilters
        children={children}
        selectedChildId={selectedChildId}
        onSelect={setSelectedChildId}
      />

      <MobileCalendarTimeline
        dates={calendarDates}
        today={today}
        selectedDate={selectedDate}
        selectedChildId={selectedChildId}
        children={children}
        scrollRef={mobileScrollRef}
        tasksForDate={tasksForDate}
        onSelectDate={setSelectedDate}
      />

      <DesktopCalendarTimeline
        dates={calendarDates}
        today={today}
        selectedDate={selectedDate}
        selectedChildId={selectedChildId}
        children={children}
        scrollRef={desktopScrollRef}
        tasksForDate={tasksForDate}
        onSelectDate={setSelectedDate}
      />

      <CalendarAgenda
        date={selectedDate}
        tasks={tasksForDate(selectedDate)}
        children={children}
        selectedChildId={selectedChildId}
      />
    </div>
  );
}
