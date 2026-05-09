'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DisplayNameWidget } from '@/components/DisplayNameWidget';
import { ThemeToggle } from '@/components/theme-toggle';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/slides') {
    return children;
  }

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-rule bg-background/75 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <Link href="/" className="group flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block size-2.5 rounded-full bg-accent shadow-[0_0_12px_rgba(255,107,26,0.7)] animate-ember-breathe"
            />
            <span className="font-display text-xl font-semibold tracking-tight text-ink transition-colors group-hover:text-accent">
              Roastpilot
            </span>
            <span className="ml-2 hidden border-l border-rule pl-2 text-[11px] uppercase tracking-[0.18em] text-ink-soft sm:inline">
              AITA, but settled
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/posts/new"
              className="rounded-full bg-accent px-3.5 py-1.5 text-sm font-semibold text-background shadow-[0_0_15px_rgba(255,107,26,0.25)] transition-all hover:bg-accent-strong hover:shadow-[0_0_22px_rgba(255,107,26,0.45)]"
            >
              Post a dilemma
            </Link>
            <DisplayNameWidget />
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="mt-16 border-t border-rule">
        <div className="mx-auto flex max-w-5xl flex-col justify-between gap-2 px-6 py-6 text-xs text-ink-soft sm:flex-row">
          <span>Roastpilot — Roast as a Service.</span>
          <span>Verdicts by Claude Opus + the court of public opinion.</span>
        </div>
      </footer>
    </>
  );
}
