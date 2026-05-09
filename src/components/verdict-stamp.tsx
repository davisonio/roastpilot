import type { Verdict } from "@/db/schema";
import { cn } from "@/lib/cn";

const LABELS: Record<Verdict, string> = {
  NTA: "Not the asshole",
  YTA: "You're the asshole",
  ESH: "Everyone sucks here",
  NAH: "No assholes here",
  INFO: "Insufficient information",
};

const STAMP_CLASS: Record<Verdict, string> = {
  NTA: "stamp-nta",
  YTA: "stamp-yta",
  ESH: "stamp-esh",
  NAH: "stamp-nah",
  INFO: "stamp-info",
};

export function VerdictStamp({
  verdict,
  size = "md",
  className,
}: {
  verdict: Verdict;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "stamp",
        STAMP_CLASS[verdict],
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        size === "lg" && "text-base",
        className,
      )}
    >
      {LABELS[verdict]}
    </span>
  );
}

export function VerdictDisplay({ verdict }: { verdict: Verdict }) {
  // Big italic Cormorant rendering for verdict pages
  const text =
    verdict === "YTA"
      ? "Yes, you are."
      : verdict === "NTA"
        ? "No, you are not."
        : verdict === "ESH"
          ? "Everyone, equally."
          : verdict === "NAH"
            ? "No one. Move on."
            : "We need more.";
  return <p className="display text-5xl md:text-6xl text-ink">{text}</p>;
}
