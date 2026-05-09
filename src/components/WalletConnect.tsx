"use client";

import { useEffect, useRef, useState } from "react";

const WALLET_KEY = "roastpilot.wallet";

function randomSolanaAddress(): string {
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let out = "";
  for (let i = 0; i < 44; i++)
    out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export function getWalletAddress(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(WALLET_KEY);
}

export function WalletConnect() {
  const [address, setAddress] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAddress(getWalletAddress());
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function connect(walletName: string) {
    const addr = randomSolanaAddress();
    localStorage.setItem(WALLET_KEY, addr);
    setAddress(addr);
    setOpen(false);
  }

  function disconnect() {
    localStorage.removeItem(WALLET_KEY);
    setAddress(null);
    setOpen(false);
  }

  const short = address
    ? `${address.slice(0, 4)}…${address.slice(-4)}`
    : null;

  return (
    <div className="relative" ref={ref}>
      {!address ? (
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-sm font-semibold px-3.5 py-1.5 rounded-full border border-accent/50 text-accent hover:bg-accent/10 transition-colors"
        >
          Connect wallet
        </button>
      ) : (
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-full border border-rule hover:border-accent/60 transition-colors group"
        >
          <span className="size-2 rounded-full bg-accent animate-pulse-soft" />
          <span className="text-ink-soft font-mono">{short}</span>
        </button>
      )}

      {open && (
        <div className="absolute right-0 top-10 w-52 rounded-xl border border-rule bg-paper shadow-[0_8px_32px_rgba(0,0,0,0.4)] z-50">
          {!address ? (
            <div className="p-2">
              <p className="px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                Choose wallet
              </p>
              {["Phantom", "Backpack", "Solflare"].map((w) => (
                <button
                  key={w}
                  onClick={() => connect(w)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-ink hover:bg-paper-2 transition-colors text-left"
                >
                  <span className="size-6 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs">
                    {w[0]}
                  </span>
                  {w}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-2">
              <p className="px-3 py-2 text-[11px] font-mono text-ink-faint break-all">
                {address}
              </p>
              <div className="h-px bg-rule mx-1 my-1" />
              <button
                onClick={disconnect}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-ink-soft hover:text-accent hover:bg-paper-2 transition-colors"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
