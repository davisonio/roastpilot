'use client';

import { cn } from '@/lib/utils';
import { HandleBadge } from './handle-badge';
import { IgnitionButton } from './ignition-button';
import { formatRelativeTime } from '@/lib/heat';
import type { Roast, User } from '@/lib/supabase/types';

interface RoastCardProps {
  roast: Roast & { user: User };
  onIgnite?: (roastId: string) => void;
  className?: string;
}

/**
 * RoastCard - displays a roast with point button
 */
export function RoastCard({ roast, onIgnite, className }: RoastCardProps) {
  const hasPoints = roast.points > 0;

  return (
    <div
      className={cn(
        'bg-surface/50 rounded-lg p-4 ml-4 border-l-2 transition-all duration-300',
        hasPoints ? 'border-ember-1/50' : 'border-border',
        className
      )}
    >
      {/* Header: Handle */}
      <div className="flex items-center gap-2 mb-3">
        <HandleBadge handle={roast.user.handle} size="sm" />
      </div>

      {/* Content */}
      <p className="font-display text-base text-foreground leading-relaxed">
        {roast.content}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4">
        {/* Time - quiet */}
        <span className="text-xs text-muted-foreground/60">
          {formatRelativeTime(roast.created_at)}
        </span>

        {/* Point button */}
        <IgnitionButton
          points={roast.points}
          onIgnite={() => onIgnite?.(roast.id)}
        />
      </div>
    </div>
  );
}

/**
 * RoastList - renders a list of roast cards
 */
export function RoastList({
  roasts,
  onIgnite,
  className
}: {
  roasts: (Roast & { user: User })[];
  onIgnite?: (roastId: string) => void;
  className?: string;
}) {
  if (roasts.length === 0) {
    return (
      <div className={cn('py-8 text-center text-muted-foreground', className)}>
        No roasts yet. Be the first to share your honest take.
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {roasts.map((roast) => (
        <RoastCard key={roast.id} roast={roast} onIgnite={onIgnite} />
      ))}
    </div>
  );
}
