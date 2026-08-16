const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function formatRelativeTime(date: Date, now: Date = new Date()): string {
  const diff = now.getTime() - date.getTime();

  if (diff < MINUTE) {
    return "방금";
  }

  if (diff < HOUR) {
    return `${Math.floor(diff / MINUTE)}분 전`;
  }

  if (diff < DAY) {
    return `${Math.floor(diff / HOUR)}시간 전`;
  }

  const days = Math.floor(diff / DAY);

  if (days === 1) {
    return "어제";
  }

  if (days < 7) {
    return `${days}일 전`;
  }

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
