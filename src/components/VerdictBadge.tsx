import { VERDICT_LABELS, VERDICT_TONE, type Verdict } from "@/lib/verdicts";

export function VerdictBadge({
  verdict,
  size = "md",
  showLabel = false,
}: {
  verdict: Verdict;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}) {
  const tone = VERDICT_TONE[verdict];
  const sizing =
    size === "lg"
      ? "text-base px-3 py-1"
      : size === "sm"
        ? "text-[10px] px-1.5 py-0.5"
        : "text-xs px-2 py-0.5";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold tracking-wider ring-1 ${tone.bg} ${tone.text} ${tone.ring} ${sizing}`}
    >
      <span>{verdict}</span>
      {showLabel ? <span className="font-normal opacity-80">{VERDICT_LABELS[verdict]}</span> : null}
    </span>
  );
}
