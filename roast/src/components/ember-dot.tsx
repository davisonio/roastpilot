'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface EmberDotProps {
  /** Duration of the breathing exercise in seconds */
  duration?: number;
  /** Callback when the exercise completes */
  onComplete?: () => void;
  /** Size of the dot in pixels */
  size?: number;
  className?: string;
}

/**
 * EmberDot - breathing verification dot
 * Pulses at ~6 breaths per minute (10s cycle) during presence check.
 * User "breathes with" the ember for verification.
 */
export function EmberDot({
  duration = 5,
  onComplete,
  size = 80,
  className
}: EmberDotProps) {
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const startExercise = useCallback(() => {
    setIsActive(true);
    setProgress(0);
  }, []);

  useEffect(() => {
    if (!isActive || isComplete) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + (100 / (duration * 10));
        if (next >= 100) {
          setIsComplete(true);
          setIsActive(false);
          onComplete?.();
          return 100;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, isComplete, duration, onComplete]);

  return (
    <div className={cn('flex flex-col items-center gap-6', className)}>
      {/* The breathing dot */}
      <div className="relative">
        {/* Outer glow ring */}
        <div
          className={cn(
            'absolute inset-0 rounded-full transition-all duration-1000',
            isActive && 'animate-ember-breathe'
          )}
          style={{
            width: size * 1.5,
            height: size * 1.5,
            left: -(size * 0.25),
            top: -(size * 0.25),
            background: isComplete
              ? 'radial-gradient(circle, rgba(255, 217, 110, 0.3) 0%, transparent 70%)'
              : isActive
              ? 'radial-gradient(circle, rgba(255, 107, 26, 0.3) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(92, 104, 120, 0.2) 0%, transparent 70%)',
          }}
        />

        {/* Main dot */}
        <div
          className={cn(
            'relative rounded-full transition-all duration-500',
            isActive && 'animate-ember-breathe',
            isComplete && 'scale-110'
          )}
          style={{
            width: size,
            height: size,
            background: isComplete
              ? 'radial-gradient(circle at 30% 30%, #ffd96e 0%, #ff8c42 50%, #ff6b1a 100%)'
              : isActive
              ? 'radial-gradient(circle at 30% 30%, #ff8c42 0%, #ff6b1a 50%, #cc5515 100%)'
              : 'radial-gradient(circle at 30% 30%, #7a8899 0%, #5c6878 50%, #4a5568 100%)',
            boxShadow: isComplete
              ? '0 0 40px rgba(255, 217, 110, 0.6), 0 0 80px rgba(255, 179, 71, 0.3)'
              : isActive
              ? '0 0 30px rgba(255, 107, 26, 0.5), 0 0 60px rgba(255, 107, 26, 0.2)'
              : '0 0 20px rgba(92, 104, 120, 0.3)',
          }}
        />

        {/* Particles when complete */}
        {isComplete && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-particle"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#ff8c42',
                  left: size / 2 - 3 + (Math.random() - 0.5) * 20,
                  top: size / 2,
                  animationDelay: `${i * 100}ms`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Progress indicator */}
      {isActive && (
        <div className="w-32 h-1 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-ember-1 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Instructions / Status */}
      <div className="text-center">
        {isComplete ? (
          <p className="text-ember-4 font-medium">Verified human. Welcome.</p>
        ) : isActive ? (
          <p className="text-muted-foreground">Breathe with the ember...</p>
        ) : (
          <button
            onClick={startExercise}
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Tap to begin presence check
          </button>
        )}
      </div>
    </div>
  );
}
