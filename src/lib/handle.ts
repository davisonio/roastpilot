// Generate fun anon.sol-style handles for new wallets.
// Until SNS resolution lands, every wallet gets one of these on first connect.

const ADJECTIVES = [
  "anon", "chaotic", "petty", "quiet", "loud", "messy", "sharp", "kind",
  "bitter", "sweet", "stoic", "soft", "wild", "still", "feral", "tidy",
  "blunt", "honest", "salty", "smug", "polite", "rude", "warm", "cold",
];

const NOUNS = [
  "owl", "fox", "moth", "cat", "wolf", "crow", "deer", "shark", "swan",
  "judge", "jury", "court", "bench", "case", "verdict", "ember", "flame",
  "tea", "shade", "drama", "saga", "memo", "note", "draft", "scoop",
];

export function generateHandle(seed?: string): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 90) + 10; // 10-99
  return `${adj}${noun}${num}.sol`;
}

export function shortenWallet(addr: string): string {
  if (addr.length <= 10) return addr;
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}

export function avatarGradient(addr: string): string {
  // Deterministic two-color gradient keyed off wallet address.
  let hash = 0;
  for (let i = 0; i < addr.length; i++) hash = (hash * 31 + addr.charCodeAt(i)) | 0;
  const h1 = Math.abs(hash) % 360;
  const h2 = (h1 + 55) % 360;
  return `linear-gradient(135deg, oklch(75% 0.13 ${h1}), oklch(60% 0.18 ${h2}))`;
}
