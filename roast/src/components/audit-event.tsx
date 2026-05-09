'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { AuditEvent as AuditEventType } from '@/lib/supabase/types';

interface AuditEventProps {
  event: AuditEventType;
  index?: number;
  className?: string;
}

/**
 * AuditEvent - single line in the audit log
 * Monospace, amber on dark, with fade-in animation
 */
export function AuditEvent({ event, index = 0, className }: AuditEventProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Stagger the fade-in animation
    const timer = setTimeout(() => setIsVisible(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  const timestamp = new Date(event.created_at).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return (
    <div
      className={cn(
        'font-mono text-sm py-1.5 transition-all duration-500',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
        className
      )}
    >
      <span className="text-muted-foreground">[{timestamp}]</span>{' '}
      <span className="text-ember-2">action:</span>{' '}
      <span className="text-ember-3">{event.action}</span>{' '}
      <span className="text-muted-foreground">|</span>{' '}
      <span className="text-ember-2">verified:</span>{' '}
      <span className={event.verified ? 'text-green-500' : 'text-red-500'}>
        {event.verified.toString()}
      </span>{' '}
      <span className="text-muted-foreground">|</span>{' '}
      <span className="text-ember-2">confidence:</span>{' '}
      <span className="text-ember-4">{event.confidence.toFixed(2)}</span>{' '}
      <span className="text-muted-foreground">|</span>{' '}
      <span className="text-ember-2">scope:</span>{' '}
      <span className="text-ember-3">{event.scope}</span>{' '}
      <span className="text-muted-foreground">|</span>{' '}
      <span className="text-ember-2">attestation:</span>{' '}
      <span className="text-cool">{event.attestation}</span>
    </div>
  );
}

/**
 * AuditEventList - renders a scrolling list of audit events
 */
export function AuditEventList({
  events,
  className
}: {
  events: AuditEventType[];
  className?: string;
}) {
  return (
    <div className={cn('space-y-0', className)}>
      {events.map((event, index) => (
        <AuditEvent key={event.id} event={event} index={index} />
      ))}
    </div>
  );
}

/**
 * AuditExplanationCard - explains the audit log fields
 */
export function AuditExplanationCard({ className }: { className?: string }) {
  const fields = [
    { name: 'action', description: 'The type of action performed (post, roast, or point)' },
    { name: 'verified', description: 'Whether the action passed presence verification' },
    { name: 'confidence', description: 'Verification confidence score (0.0 to 1.0)' },
    { name: 'scope', description: 'The scope of the action for audit purposes' },
    { name: 'attestation', description: 'Cryptographic hash of the attestation' },
    { name: 'timestamp', description: 'When the action was recorded' },
  ];

  return (
    <div className={cn('bg-surface rounded-lg p-6', className)}>
      <h3 className="text-lg font-semibold text-foreground mb-4">
        What each field means
      </h3>
      <div className="grid gap-3">
        {fields.map(({ name, description }) => (
          <div key={name} className="flex gap-3">
            <code className="text-ember-2 font-mono text-sm bg-background px-2 py-0.5 rounded">
              {name}
            </code>
            <span className="text-muted-foreground text-sm">{description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * AuditPrivacyCard - shows what the platform does NOT know
 */
export function AuditPrivacyCard({ className }: { className?: string }) {
  const unknowns = [
    'Who you are (real identity)',
    'What you posted (content)',
    'Who roasted you',
    'What device you used',
    'Where you are located',
    'Your browsing patterns',
    'Your other accounts',
    'Your email address',
  ];

  return (
    <div className={cn('bg-cool/10 border border-cool/30 rounded-lg p-6', className)}>
      <h3 className="text-lg font-semibold text-foreground mb-4">
        What we DO NOT know
      </h3>
      <ul className="space-y-2">
        {unknowns.map((item) => (
          <li key={item} className="flex items-center gap-2 text-sm">
            <span className="text-cool">✕</span>
            <span className="text-muted-foreground">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
