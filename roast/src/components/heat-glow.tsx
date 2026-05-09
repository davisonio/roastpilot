'use client';

import { cn } from '@/lib/utils';
import { calculateHeatLevel, shouldPulse, type HeatLevel } from '@/lib/heat';

interface HeatGlowProps {
  heat?: number; // 0-1 continuous value, or pass roastCount and it will calculate
  roastCount?: number;
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

/**
 * HeatGlow wrapper component
 * Applies heat-based glow effects based on roast count or heat value.
 *
 * Heat levels:
 * - 0: Cool, dormant (slate-blue)
 * - 1: Warming (ember-orange subtle)
 * - 2: Ember glow visible
 * - 3: Clear warm light
 * - 4: Peak heat, crackling
 */
export function HeatGlow({
  heat = 0,
  roastCount,
  children,
  className,
  as: Component = 'div'
}: HeatGlowProps) {
  // Calculate heat level from roastCount if provided, otherwise from heat value
  const level: HeatLevel = roastCount !== undefined
    ? calculateHeatLevel(roastCount)
    : Math.min(Math.floor(heat * 5), 4) as HeatLevel;

  const isPulsing = roastCount !== undefined
    ? shouldPulse(roastCount)
    : heat >= 1;

  return (
    <Component
      className={cn(
        'transition-heat border rounded-lg',
        `heat-glow-${level}`,
        isPulsing && 'animate-heat-pulse',
        className
      )}
    >
      {children}
    </Component>
  );
}

/**
 * Get inline style for custom heat interpolation
 * Useful for more granular control than the discrete levels
 */
export function getHeatStyle(heat: number): React.CSSProperties {
  const intensity = Math.min(heat, 1);
  const glowSize = 20 + intensity * 30;
  const glowOpacity = 0.1 + intensity * 0.5;

  // Interpolate between cool and ember-4
  const r = Math.round(92 + intensity * (255 - 92));
  const g = Math.round(104 + intensity * (217 - 104));
  const b = Math.round(120 + intensity * (110 - 120));

  return {
    boxShadow: `0 0 ${glowSize}px rgba(${r}, ${g}, ${b}, ${glowOpacity})`,
    borderColor: `rgb(${r}, ${g}, ${b})`,
  };
}
