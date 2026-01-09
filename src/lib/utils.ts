import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (name: string) => {
  if (!name) return "";
  if (name.split(" ").length === 1) return name.slice(0, 2).toUpperCase();
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};
export function getRandomColorBasedOnName(name: string) {
  const fallback = "hsl(260 85% 60%)";
  const normalized = name?.trim().toLowerCase();

  if (!normalized) {
    return fallback;
  }

  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash << 5) - hash + normalized.charCodeAt(i);
    hash |= 0; // Keep hash in 32-bit integer range
  }

  const hue = Math.abs(hash) % 360;
  const saturation = 70 + (Math.abs(hash) % 20); // 70% - 89%
  const lightness = 60;

  return `hsl(${hue} ${saturation}% ${lightness}%)`;
}

export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years}y ago`;
  if (months > 0) return `${months}mo ago`;
  if (weeks > 0) return `${weeks}w ago`;
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
}
