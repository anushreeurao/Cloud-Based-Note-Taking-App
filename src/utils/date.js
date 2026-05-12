import { formatDistanceToNow, isToday, isYesterday } from "date-fns";

export function toDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value?.toDate === "function") return value.toDate();
  if (typeof value === "number") return new Date(value);
  return new Date(value);
}

export function readableDate(value) {
  const date = toDate(value);
  if (!date) return "No date";
  if (isToday(date)) return `Today, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  if (isYesterday(date)) return `Yesterday, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

export function relativeTime(value) {
  const date = toDate(value);
  if (!date) return "just now";
  return formatDistanceToNow(date, { addSuffix: true });
}
