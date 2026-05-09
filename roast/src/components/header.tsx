'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Flame, BarChart3, Shield, PenSquare } from 'lucide-react';

/**
 * Header - navigation bar for authenticated pages
 */
export function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: '/feed', label: 'Feed', icon: Flame },
    { href: '/leaderboard', label: 'Leaders', icon: BarChart3 },
    { href: '/audit', label: 'Audit', icon: Shield },
  ];

  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/feed" className="flex items-center gap-2 group">
          <Flame className="size-6 text-ember-1 group-hover:text-ember-2 transition-colors" />
          <span className="font-display text-xl font-semibold text-foreground">
            Roast
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors',
                pathname === href
                  ? 'bg-ember-1/10 text-ember-1'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <Icon className="size-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}

          {/* Submit button */}
          <Link
            href="/submit"
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm ml-2',
              'bg-ember-1 text-background hover:bg-ember-2 transition-colors',
              'shadow-[0_0_15px_rgba(255,107,26,0.2)] hover:shadow-[0_0_20px_rgba(255,107,26,0.3)]'
            )}
          >
            <PenSquare className="size-4" />
            <span className="hidden sm:inline">Post</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
