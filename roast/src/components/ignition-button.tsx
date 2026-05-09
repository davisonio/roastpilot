'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Flame } from 'lucide-react';

interface IgnitionButtonProps {
  points: number;
  onIgnite?: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * IgnitionButton - the point award button with ignition animation
 * When clicked, flares warm with particles rising, then settles brighter.
 */
export function IgnitionButton({
  points,
  onIgnite,
  disabled = false,
  className
}: IgnitionButtonProps) {
  const [isIgniting, setIsIgniting] = useState(false);
  const [particles, setParticles] = useState<number[]>([]);

  const handleClick = useCallback(() => {
    if (disabled || isIgniting) return;

    setIsIgniting(true);
    // Create 3-5 particles
    setParticles([...Array(4)].map((_, i) => i));

    // Clear animation after it completes
    setTimeout(() => {
      setIsIgniting(false);
      setParticles([]);
    }, 800);

    onIgnite?.();
  }, [disabled, isIgniting, onIgnite]);

  return (
    <div className={cn('relative inline-flex items-center gap-1.5', className)}>
      <button
        onClick={handleClick}
        disabled={disabled || isIgniting}
        className={cn(
          'relative inline-flex items-center gap-1 px-2 py-1 rounded-md',
          'text-sm font-medium transition-all duration-300',
          'focus:outline-none focus:ring-2 focus:ring-ember-1/50',
          disabled
            ? 'bg-secondary/30 text-muted-foreground cursor-not-allowed'
            : 'bg-ember-1/10 text-ember-1 hover:bg-ember-1/20 cursor-pointer',
          isIgniting && 'animate-ignite bg-ember-2/30'
        )}
      >
        <Flame
          className={cn(
            'size-4 transition-all duration-300',
            isIgniting && 'text-ember-4'
          )}
        />
        <span className={cn(
          'transition-colors duration-300',
          isIgniting && 'text-ember-4'
        )}>
          {points}
        </span>

        {/* Particles */}
        {particles.map((i) => (
          <span
            key={i}
            className="absolute animate-particle"
            style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: '#ff8c42',
              left: `calc(50% + ${(Math.random() - 0.5) * 20}px)`,
              bottom: '100%',
              animationDelay: `${i * 100}ms`,
            }}
          />
        ))}
      </button>
    </div>
  );
}

/**
 * IgnitionButtonLarge - larger version for prominent actions
 */
export function IgnitionButtonLarge({
  onIgnite,
  disabled = false,
  label = 'Ignite',
  className
}: Omit<IgnitionButtonProps, 'points'> & { label?: string }) {
  const [isIgniting, setIsIgniting] = useState(false);
  const [particles, setParticles] = useState<number[]>([]);

  const handleClick = useCallback(() => {
    if (disabled || isIgniting) return;

    setIsIgniting(true);
    setParticles([...Array(5)].map((_, i) => i));

    setTimeout(() => {
      setIsIgniting(false);
      setParticles([]);
    }, 800);

    onIgnite?.();
  }, [disabled, isIgniting, onIgnite]);

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isIgniting}
      className={cn(
        'relative inline-flex items-center gap-2 px-4 py-2 rounded-lg',
        'font-medium transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-ember-1/50',
        disabled
          ? 'bg-secondary/30 text-muted-foreground cursor-not-allowed'
          : 'bg-ember-1 text-background hover:bg-ember-2 cursor-pointer',
        'shadow-[0_0_20px_rgba(255,107,26,0.3)] hover:shadow-[0_0_30px_rgba(255,107,26,0.5)]',
        isIgniting && 'animate-ignite bg-ember-3',
        className
      )}
    >
      <Flame className={cn('size-5', isIgniting && 'text-ember-4')} />
      <span>{label}</span>

      {/* Particles */}
      {particles.map((i) => (
        <span
          key={i}
          className="absolute animate-particle"
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#ffd96e',
            left: `calc(50% + ${(Math.random() - 0.5) * 30}px)`,
            bottom: '100%',
            animationDelay: `${i * 80}ms`,
          }}
        />
      ))}
    </button>
  );
}
