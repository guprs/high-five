const SCHEDULE_SEPARATOR = "::";
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

export function decodeTaskSchedule(value?: string | null) {
  if (!value) {
    return { frequency: null, scheduledTime: null };
  }

  const [frequency, possibleTime] = value.split(SCHEDULE_SEPARATOR);
  return {
    frequency:
      frequency.toLowerCase() === "once" ? null : frequency || null,
    scheduledTime:
      possibleTime && TIME_PATTERN.test(possibleTime) ? possibleTime : null,
  };
}

export function encodeTaskSchedule({
  recurring,
  frequency,
  scheduledTime,
}: {
  recurring: boolean;
  frequency?: string | null;
  scheduledTime?: string | null;
}) {
  const baseFrequency = recurring ? frequency || "Daily" : "Once";
  const validTime =
    scheduledTime && TIME_PATTERN.test(scheduledTime) ? scheduledTime : null;

  if (validTime) return `${baseFrequency}${SCHEDULE_SEPARATOR}${validTime}`;
  return recurring ? baseFrequency : null;
}
