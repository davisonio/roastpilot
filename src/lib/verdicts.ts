export type Verdict = "YTA" | "NTA" | "ESH" | "NAH" | "INFO";

export const VERDICT_LABELS: Record<Verdict, string> = {
  YTA: "You're The Asshole",
  NTA: "Not The Asshole",
  ESH: "Everyone Sucks Here",
  NAH: "No Assholes Here",
  INFO: "Not Enough Info",
};

export const VERDICT_BLURBS: Record<Verdict, string> = {
  YTA: "The poster is in the wrong here.",
  NTA: "The poster did nothing wrong.",
  ESH: "Nobody comes out of this looking good.",
  NAH: "It's a misunderstanding, no real wrong-doing.",
  INFO: "Not enough info to judge yet.",
};

export const VERDICT_TONE: Record<Verdict, { bg: string; text: string; ring: string }> = {
  YTA: { bg: "bg-red-500/15", text: "text-red-300", ring: "ring-red-500/35" },
  NTA: { bg: "bg-emerald-500/15", text: "text-emerald-300", ring: "ring-emerald-500/35" },
  ESH: { bg: "bg-orange-500/15", text: "text-orange-300", ring: "ring-orange-500/35" },
  NAH: { bg: "bg-sky-500/15", text: "text-sky-300", ring: "ring-sky-500/35" },
  INFO: { bg: "bg-zinc-500/15", text: "text-zinc-300", ring: "ring-zinc-500/35" },
};

export const VERDICTS: Verdict[] = ["YTA", "NTA", "ESH", "NAH", "INFO"];
