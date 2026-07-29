import {
  formatDateRange,
  sameDay,
  toDateInputValue,
} from "../../utils/calendar";

interface Props {
  dates: Date[];
  selectedDate: Date;
  today: Date;
  onChooseDate: (value: string) => void;
}

export default function CalendarHeader({
  dates,
  selectedDate,
  today,
  onChooseDate,
}: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Calendar</h1>
        <p className="text-sm text-gray-400">{formatDateRange(dates)}</p>
      </div>
      <div className="w-full self-start sm:w-auto">
        <label className="flex w-full items-center justify-between gap-3 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-indigo-700 transition-colors hover:bg-indigo-100 sm:w-auto">
          <span className="text-xs font-bold">
            {sameDay(selectedDate, today) ? "Today" : "View date"}
          </span>
          <input
            type="date"
            value={toDateInputValue(selectedDate)}
            onChange={(event) => onChooseDate(event.target.value)}
            aria-label="Choose calendar date"
            className="min-w-0 bg-transparent text-sm font-semibold text-indigo-700 outline-none"
          />
        </label>
      </div>
    </div>
  );
}
