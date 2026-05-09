import { cn } from '@/lib/utils';

interface HandleBadgeProps {
  handle: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * HandleBadge - displays a two-word anonymous handle
 * Used throughout the app to identify users without revealing identity
 */
export function HandleBadge({ handle, size = 'md', className }: HandleBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full',
        'bg-secondary/50 text-muted-foreground',
        'font-medium tracking-wide uppercase',
        sizeClasses[size],
        className
      )}
    >
      {handle}
    </span>
  );
}

/**
 * HandleDisplay - larger handle display for profile/signup flow
 */
export function HandleDisplay({ handle, className }: { handle: string; className?: string }) {
  return (
    <div className={cn('text-center', className)}>
      <p className="text-muted-foreground text-sm mb-2">You are now:</p>
      <h2 className="font-display text-3xl md:text-4xl text-foreground font-semibold">
        {handle}
      </h2>
    </div>
  );
}
