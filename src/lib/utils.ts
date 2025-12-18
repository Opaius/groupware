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
