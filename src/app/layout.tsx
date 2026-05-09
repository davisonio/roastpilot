import type { Metadata } from "next";
import { Inter, Lora, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Logo } from "@/components/Logo";
import { WalletConnect } from "@/components/WalletConnect";
import { DisplayNameWidget } from "@/components/DisplayNameWidget";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const lora = Lora({ variable: "--font-lora", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Roastpilot — Am I The Asshole, judged by AI and humans",
  description: "Post your dilemma. AI delivers a verdict. Real humans pile on. Trustpilot, but for being told you suck.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-ink">
        <header className="sticky top-0 z-20 border-b border-rule bg-background/80 backdrop-blur-md">
          <div className="mx-auto max-w-5xl px-6 h-14 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <Logo variant="horizontal" height={36} className="transition-opacity group-hover:opacity-80" />
            </Link>
            <nav className="flex items-center gap-1 text-sm text-ink-soft">
              <Link href="/" className="px-3 py-1.5 rounded-full hover:bg-paper-2 hover:text-ink transition-colors">Feed</Link>
              <Link href="/leaderboard" className="px-3 py-1.5 rounded-full hover:bg-paper-2 hover:text-ink transition-colors">Leaderboard</Link>
            </nav>
            <div className="flex items-center gap-2 shrink-0">
              <Link href="/posts/new" className="text-sm font-semibold px-3.5 py-1.5 rounded-full bg-accent text-background hover:bg-accent-strong shadow-[0_0_15px_rgba(255,107,26,0.25)] hover:shadow-[0_0_22px_rgba(255,107,26,0.45)] transition-all hidden sm:inline-flex">
                Post a dilemma
              </Link>
              <WalletConnect />
              <DisplayNameWidget />
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-rule mt-16">
          <div className="mx-auto max-w-5xl px-6 py-6 text-xs text-ink-soft flex flex-col sm:flex-row gap-2 justify-between">
            <Link href="/" className="flex items-center gap-2 hover:text-accent transition-colors">
              <Logo variant="mark" height={16} />
              <span>Roastpilot</span>
            </Link>
            <span>Verdicts by AI + the court of public opinion.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
