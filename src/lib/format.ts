import { getDictionary } from "@/lib/i18n";
import type { Language } from "@/types/language";

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function formatRelativeTime(
  date: Date,
  language: Language,
  now: Date = new Date(),
): string {
  const { time } = getDictionary(language);
  const diff = now.getTime() - date.getTime();

  if (diff < MINUTE) {
    return time.justNow;
  }

  if (diff < HOUR) {
    return time.minutesAgo(Math.floor(diff / MINUTE));
  }

  if (diff < DAY) {
    return time.hoursAgo(Math.floor(diff / HOUR));
  }

  const days = Math.floor(diff / DAY);

  if (days === 1) {
    return time.yesterday;
  }

  if (days < 7) {
    return time.daysAgo(days);
  }

  return formatAbsoluteDate(date, language);
}

export function formatAbsoluteDate(date: Date, language: Language): string {
  return date.toLocaleDateString(getDictionary(language).time.locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
