import { clsx } from "clsx";

export function cn(...values: Array<string | false | null | undefined>) {
  return clsx(values);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatRelativeDate(value: string) {
  const target = new Date(value);
  if (Number.isNaN(target.getTime())) {
    return "Unknown";
  }

  const diff = target.getTime() - Date.now();
  const days = Math.round(diff / 86_400_000);

  if (days === 0) {
    return "Today";
  }

  if (days === -1) {
    return "Yesterday";
  }

  if (days > -7 && days < 0) {
    return `${Math.abs(days)} days ago`;
  }

  return formatDate(value);
}

export function generateId() {
  return crypto.randomUUID();
}

export function generateInviteCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function slugifyCategory(value: string) {
  return value
    .replaceAll("_", " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
