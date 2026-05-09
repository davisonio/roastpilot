import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Heat level 0–4 based on comment count, drives glow class. */
export function heatLevel(commentCount: number): 0 | 1 | 2 | 3 | 4 {
  if (commentCount === 0) return 0;
  if (commentCount <= 2) return 1;
  if (commentCount <= 5) return 2;
  if (commentCount <= 9) return 3;
  return 4;
}

export function heatGlowClass(level: 0 | 1 | 2 | 3 | 4): string {
  if (level === 0) return "";
  if (level === 1) return "heat-glow-1";
  if (level === 2) return "heat-glow-2";
  if (level === 3) return "heat-glow-3";
  return "heat-glow-3 animate-heat-pulse";
}
