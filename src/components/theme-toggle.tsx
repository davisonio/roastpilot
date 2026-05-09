'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';

type RoastTheme = 'day' | 'night';

const STORAGE_KEY = 'roast-theme';
const THEME_CHANGE_EVENT = 'roast-theme-changed';

let fallbackTheme: RoastTheme = 'night';

function getStoredTheme(): RoastTheme {
  if (typeof window === 'undefined') return 'night';

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'day' || stored === 'night' ? stored : fallbackTheme;
  } catch {
    return fallbackTheme;
  }
}

function getServerTheme(): RoastTheme {
  return 'night';
}

function applyTheme(theme: RoastTheme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle('dark', theme === 'night');
  document.documentElement.style.colorScheme = theme === 'day' ? 'light' : 'dark';
}

function setStoredTheme(theme: RoastTheme) {
  fallbackTheme = theme;
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {}
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

function subscribeToTheme(onStoreChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) onStoreChange();
  };

  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);
  window.addEventListener('storage', onStorage);

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
    window.removeEventListener('storage', onStorage);
  };
}

export function ThemeToggle({ className = '' }: { className?: string }) {
  const theme = useSyncExternalStore(subscribeToTheme, getStoredTheme, getServerTheme);
  const isDay = theme === 'day';

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === 'day' ? 'night' : 'day';
    setStoredTheme(nextTheme);
    applyTheme(nextTheme);
  }, [theme]);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDay ? 'Switch to night mode' : 'Switch to day mode'}
      title={isDay ? 'Switch to night mode' : 'Switch to day mode'}
      suppressHydrationWarning
      className={[
        'inline-flex size-9 items-center justify-center rounded-lg border border-border bg-panel text-muted-foreground transition-all duration-200',
        'hover:border-ember-1/50 hover:bg-panel-elevated hover:text-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {isDay ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
