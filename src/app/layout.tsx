import type { Metadata } from "next";
import { Inter, Lora, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AppShell } from "@/components/AppShell";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const lora = Lora({ variable: "--font-lora", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Roastpilot — Am I The Asshole, judged by AI and humans",
  description: "Post your dilemma. AI delivers a verdict. Real humans pile on. Trustpilot, but for being told you suck.",
};

const themeScript = `
try {
  var theme = localStorage.getItem('roast-theme');
  if (theme !== 'day' && theme !== 'night') theme = 'night';
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle('dark', theme === 'night');
  document.documentElement.style.colorScheme = theme === 'day' ? 'light' : 'dark';
} catch (_) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${lora.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-ink">
        <Script
          id="roast-theme"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
