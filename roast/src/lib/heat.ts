/**
 * Heat calculation utilities for the Roast ember design system.
 * Heat represents how "hot" a post is based on roast count.
 */

export type HeatLevel = 0 | 1 | 2 | 3 | 4;

/**
 * Calculate heat level (0-4) from roast count.
 * - 0 roasts: Level 0 (cool, dormant)
 * - 1-2 roasts: Level 1 (warming)
 * - 3-5 roasts: Level 2 (ember glow)
 * - 6-10 roasts: Level 3 (hot)
 * - 10+ roasts: Level 4 (peak heat)
 */
export function calculateHeatLevel(roastCount: number): HeatLevel {
  if (roastCount === 0) return 0;
  if (roastCount <= 2) return 1;
  if (roastCount <= 5) return 2;
  if (roastCount <= 10) return 3;
  return 4;
}

/**
 * Calculate continuous heat value (0-1) from roast count.
 * Used for smooth interpolation in animations.
 */
export function calculateHeat(roastCount: number): number {
  return Math.min(roastCount / 10, 1);
}

/**
 * Get the CSS class for heat glow based on level.
 */
export function getHeatGlowClass(level: HeatLevel): string {
  return `heat-glow-${level}`;
}

/**
 * Get border color based on heat level.
 */
export function getHeatBorderColor(level: HeatLevel): string {
  const colors = {
    0: 'var(--cool)',
    1: 'var(--ember-1)',
    2: 'var(--ember-2)',
    3: 'var(--ember-3)',
    4: 'var(--ember-4)',
  };
  return colors[level];
}

/**
 * Check if a post should have the pulse animation (peak heat only).
 */
export function shouldPulse(roastCount: number): boolean {
  return roastCount >= 10;
}

/**
 * Format roast count for display.
 */
export function formatRoastCount(count: number): string {
  if (count === 0) return 'No roasts yet';
  if (count === 1) return '1 roast';
  return `${count} roasts`;
}

/**
 * Format relative time (e.g., "a few hours ago").
 * Quiet, not in-your-face.
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return 'a few minutes ago';
  if (diffHours < 2) return 'about an hour ago';
  if (diffHours < 24) return 'a few hours ago';
  if (diffDays < 2) return 'yesterday';
  if (diffDays < 7) return 'a few days ago';
  if (diffDays < 30) return 'a few weeks ago';
  return 'a while ago';
}
