import type { Metadata } from "next";
import { Inter, Lora, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { DisplayNameWidget } from "@/components/DisplayNameWidget";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
      className={`${inter.variable} ${lora.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-ink">
        <header className="sticky top-0 z-20 border-b border-rule bg-background/75 backdrop-blur-md">
          <div className="mx-auto max-w-5xl px-6 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <span
                aria-hidden
                className="inline-block size-2.5 rounded-full bg-accent shadow-[0_0_12px_rgba(255,107,26,0.7)] animate-ember-breathe"
              />
              <span className="font-display text-xl font-semibold tracking-tight text-ink group-hover:text-accent transition-colors">
                Roastpilot
              </span>
              <span className="text-[11px] uppercase tracking-[0.18em] text-ink-soft pl-2 border-l border-rule ml-2 hidden sm:inline">
                AITA, but settled
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/posts/new"
                className="text-sm font-semibold px-3.5 py-1.5 rounded-full bg-accent text-background hover:bg-accent-strong shadow-[0_0_15px_rgba(255,107,26,0.25)] hover:shadow-[0_0_22px_rgba(255,107,26,0.45)] transition-all"
              >
                Post a dilemma
              </Link>
              <DisplayNameWidget />
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-rule mt-16">
          <div className="mx-auto max-w-5xl px-6 py-6 text-xs text-ink-soft flex flex-col sm:flex-row gap-2 justify-between">
            <span>Roastpilot — Roast as a Service.</span>
            <span>Verdicts by Claude Opus + the court of public opinion.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
