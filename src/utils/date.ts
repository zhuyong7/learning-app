/**
 * Date utilities.
 */

export function getLocalDateString(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayString(): string {
  return getLocalDateString();
}

export function formatWeekday(dateStr: string): string {
  const days = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  const parsed = new Date(`${dateStr}T00:00:00`);
  return days[parsed.getDay()];
}
