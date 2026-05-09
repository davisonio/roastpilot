import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { DisplayNameWidget } from "@/components/DisplayNameWidget";
import { Logo } from "@/components/logo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Roastpilot — Am I The Asshole, judged by AI and humans",
  description:
    "Post your dilemma. Claude Opus delivers a verdict. Real humans pile on. Trustpilot, but for being told you suck.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-rule bg-paper/70 backdrop-blur sticky top-0 z-20">
          <div className="mx-auto max-w-5xl px-6 h-14 flex items-center justify-between">
            <Link href="/" aria-label="Roastpilot home" className="flex items-center gap-3">
              <Logo variant="horizontal" height={28} priority />
              <span className="text-[11px] uppercase tracking-[0.18em] text-ink-soft pl-2 border-l border-rule">
                AITA, but settled
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/posts/new"
                className="text-sm font-medium px-3 py-1.5 rounded-full bg-ink text-paper hover:bg-accent-strong transition-colors"
              >
                Post a dilemma
              </Link>
              <DisplayNameWidget />
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-rule mt-16">
          <div className="mx-auto max-w-5xl px-6 py-6 text-xs text-ink-soft flex items-center justify-between">
            <span className="flex items-center gap-2.5">
              <Logo variant="mark" height={18} />
              <span>Roastpilot — Roast as a Service.</span>
            </span>
            <span>Verdicts by Claude Opus + the court of public opinion.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
