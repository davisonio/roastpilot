"use client";

import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import "@solana/wallet-adapter-react-ui/styles.css";

export type SessionUser = {
  id: string;
  handleSol: string;
  walletAddress: string | null;
  email: string | null;
  pohVerified: boolean;
  roasterVerified: boolean;
  roastPoints: number;
  roastsWon: number;
};

type SessionState = {
  user: SessionUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionState | null>(null);

export function useSession(): SessionState {
  const ctx = useContext(SessionContext);
  if (!ctx)
    throw new Error("useSession must be used inside <WalletProviders>");
  return ctx;
}

function SessionInner({ children }: { children: ReactNode }) {
  const { publicKey, connected, disconnect } = useWallet();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/wallet/me");
    const data = (await res.json()) as { user: SessionUser | null };
    setUser(data.user ?? null);
    setLoading(false);
  }, []);

  const signOut = useCallback(async () => {
    await fetch("/api/wallet/disconnect", { method: "POST" });
    await disconnect();
    setUser(null);
  }, [disconnect]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // When wallet connects, hand the address to the server to create/load user.
  useEffect(() => {
    if (!connected || !publicKey) return;
    const addr = publicKey.toBase58();
    if (user && user.walletAddress === addr) return;
    (async () => {
      const res = await fetch("/api/wallet/connect", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ walletAddress: addr }),
      });
      if (res.ok) {
        const data = (await res.json()) as { user: SessionUser };
        setUser(data.user);
      }
    })();
  }, [connected, publicKey, user]);

  const value = useMemo(
    () => ({ user, loading, refresh, signOut }),
    [user, loading, refresh, signOut],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function WalletProviders({ children }: { children: ReactNode }) {
  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    [],
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <SessionInner>{children}</SessionInner>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
