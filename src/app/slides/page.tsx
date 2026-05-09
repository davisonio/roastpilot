import type { Metadata } from "next";
import SlidesClient from "./slides-client";

export const metadata: Metadata = {
  title: "Roastpilot — Pitch Deck",
  description: "Roast as a Service. A two-sided marketplace for sharp human roasts, backed by Solana bounties.",
};

export default function SlidesPage() {
  return <SlidesClient />;
}
