'use client';

import { cn } from '@/lib/utils';
import { HandleBadge } from './handle-badge';

interface FlameRankProps {
  rank: number;
  handle: string;
  points: number;
  className?: string;
}

/**
 * FlameRank - leaderboard entry with flame visualization
 * Top ranker has large animated flame, lower ranks have progressively smaller flames.
 */
export function FlameRank({ rank, handle, points, className }: FlameRankProps) {
  // Calculate flame size based on rank (1 = largest, 10 = smallest)
  const flameScale = Math.max(0.4, 1 - (rank - 1) * 0.08);
  const isTop3 = rank <= 3;
  const isChampion = rank === 1;

  return (
    <div
      className={cn(
        'flex items-center gap-4 py-3 px-4 rounded-lg transition-all duration-300',
        isTop3 ? 'bg-surface' : 'bg-transparent',
        isChampion && 'bg-ember-1/10',
        className
      )}
    >
      {/* Rank number */}
      <div
        className={cn(
          'w-8 text-center font-mono text-lg',
          isChampion ? 'text-ember-4' : isTop3 ? 'text-ember-2' : 'text-muted-foreground'
        )}
      >
        {rank}
      </div>

      {/* Flame visualization */}
      <div
        className="relative flex items-end justify-center"
        style={{ width: 40, height: 50 }}
      >
        {/* Flame layers */}
        <div
          className={cn(
            'absolute bottom-0 transition-all duration-500',
            isChampion && 'animate-ember-breathe'
          )}
          style={{
            transform: `scale(${flameScale})`,
            transformOrigin: 'bottom center',
          }}
        >
          {/* Outer glow */}
          <div
            className="absolute inset-0 rounded-full blur-md"
            style={{
              background: isTop3
                ? 'radial-gradient(ellipse at bottom, rgba(255, 140, 66, 0.4) 0%, transparent 70%)'
                : 'radial-gradient(ellipse at bottom, rgba(92, 104, 120, 0.2) 0%, transparent 70%)',
              width: 50,
              height: 60,
              left: -5,
              top: -10,
            }}
          />

          {/* Main flame shape */}
          <svg
            width="40"
            height="50"
            viewBox="0 0 40 50"
            fill="none"
            className="relative"
          >
            {/* Outer flame */}
            <path
              d="M20 2C20 2 8 18 8 30C8 40 13 48 20 48C27 48 32 40 32 30C32 18 20 2 20 2Z"
              fill={isTop3 ? 'url(#flameGradient)' : '#5c6878'}
              opacity={isTop3 ? 1 : 0.6}
            />
            {/* Inner bright core */}
            {isTop3 && (
              <path
                d="M20 15C20 15 14 25 14 32C14 38 17 42 20 42C23 42 26 38 26 32C26 25 20 15 20 15Z"
                fill="url(#coreGradient)"
              />
            )}
            <defs>
              <linearGradient id="flameGradient" x1="20" y1="2" x2="20" y2="48" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ffd96e" />
                <stop offset="40%" stopColor="#ff8c42" />
                <stop offset="100%" stopColor="#ff6b1a" />
              </linearGradient>
              <linearGradient id="coreGradient" x1="20" y1="15" x2="20" y2="42" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#fff8e7" />
                <stop offset="50%" stopColor="#ffd96e" />
                <stop offset="100%" stopColor="#ffb347" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Handle */}
      <div className="flex-1">
        <HandleBadge
          handle={handle}
          size={isTop3 ? 'md' : 'sm'}
          className={isChampion ? 'bg-ember-1/20 text-ember-4' : undefined}
        />
      </div>

      {/* Points */}
      <div
        className={cn(
          'font-mono text-right',
          isChampion ? 'text-ember-4 text-lg font-bold' : isTop3 ? 'text-ember-2' : 'text-muted-foreground'
        )}
      >
        {points}
        <span className="text-xs ml-1 opacity-60">pts</span>
      </div>
    </div>
  );
}

/**
 * FlameRankList - renders a list of FlameRank entries
 */
export function FlameRankList({
  entries,
  className
}: {
  entries: { rank: number; handle: string; points: number }[];
  className?: string;
}) {
  return (
    <div className={cn('space-y-1', className)}>
      {entries.map((entry) => (
        <FlameRank key={entry.rank} {...entry} />
      ))}
    </div>
  );
}
