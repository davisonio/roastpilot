"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useSession } from "./wallet-providers";
import { Avatar } from "./avatar";
import { shortenWallet } from "@/lib/handle";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/browse", label: "Browse" },
  { href: "/request", label: "Request a roast" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 border-b border-rule bg-paper/80 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-8 px-6 py-4">
        <Link href="/" className="flex items-baseline gap-1.5">
          <span className="display text-2xl text-ink">Roastpilot</span>
          <span aria-hidden className="text-lg leading-none">🔥</span>
        </Link>

        <nav className="flex items-center justify-center gap-8">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-[15px] font-medium transition-colors",
                  active ? "text-ember" : "text-mute hover:text-ink",
                )}
              >
                {item.label}
                {active && (
                  <span className="absolute -bottom-[18px] left-0 right-0 h-[2px] rounded-full bg-ember" />
                )}
              </Link>
            );
          })}
        </nav>

        <UserMenu />
      </div>
    </header>
  );
}

function UserMenu() {
  const { user, signOut } = useSession();
  const { setVisible } = useWalletModal();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  if (!user) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-ember-deep"
      >
        Connect wallet
      </button>
    );
  }

  return (
    <div className="flex items-center gap-5" ref={ref}>
      <div className="flex items-center gap-1.5 text-[15px] font-medium tnum">
        <span aria-hidden>🔥</span>
        <span className="text-ink">{user.roastPoints.toLocaleString()}</span>
      </div>

      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2 hover:bg-soft"
      >
        <Avatar
          seed={user.walletAddress ?? user.handleSol}
          verified={user.roasterVerified}
          size={32}
        />
        <span className="hidden text-left leading-tight md:block">
          <span className="block text-sm font-medium text-ink">{user.handleSol}</span>
          {user.roasterVerified ? (
            <span className="block text-[11px] text-verified">Verified roaster</span>
          ) : (
            <span className="block text-[11px] text-mute">unverified</span>
          )}
        </span>
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden className="text-mute">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-6 top-16 w-64 rounded-xl border border-rule bg-card shadow-card-lg">
          <div className="border-b border-rule p-3">
            <div className="text-sm font-medium text-ink">{user.handleSol}</div>
            <div className="mt-0.5 text-xs text-mute tnum">
              {user.walletAddress ? shortenWallet(user.walletAddress) : user.email}
            </div>
          </div>
          <div className="p-2 text-sm">
            <Link href="/me" className="block rounded-md px-2 py-2 hover:bg-soft" onClick={() => setOpen(false)}>
              My dashboard
            </Link>
            {!user.roasterVerified && (
              <Link href="/become-a-roaster" className="block rounded-md px-2 py-2 text-ember hover:bg-soft" onClick={() => setOpen(false)}>
                Become a roaster
              </Link>
            )}
            <button
              onClick={() => {
                setOpen(false);
                signOut();
              }}
              className="block w-full rounded-md px-2 py-2 text-left text-mute hover:bg-soft hover:text-ink"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-rule">
      <div className="mx-auto flex max-w-7xl items-baseline justify-between px-6 py-6 text-xs text-mute">
        <span>
          Roastpilot. Roast-as-a-Service. Pay a bounty, get roasted by{" "}
          <span className="font-medium text-ink">verified humans</span>.
        </span>
        <span className="tnum">v0.2</span>
      </div>
    </footer>
  );
}
