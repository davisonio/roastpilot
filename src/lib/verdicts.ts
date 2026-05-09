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
  YTA: { bg: "bg-red-100", text: "text-red-900", ring: "ring-red-300" },
  NTA: { bg: "bg-emerald-100", text: "text-emerald-900", ring: "ring-emerald-300" },
  ESH: { bg: "bg-orange-100", text: "text-orange-900", ring: "ring-orange-300" },
  NAH: { bg: "bg-sky-100", text: "text-sky-900", ring: "ring-sky-300" },
  INFO: { bg: "bg-zinc-100", text: "text-zinc-900", ring: "ring-zinc-300" },
};

export const VERDICTS: Verdict[] = ["YTA", "NTA", "ESH", "NAH", "INFO"];
