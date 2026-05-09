import type { Verdict } from "@/db/schema";
import { cn } from "@/lib/cn";

const STYLES: Record<Verdict, string> = {
  YTA: "bg-[color:var(--color-yta-soft)] text-[color:var(--color-yta)]",
  NTA: "bg-[color:var(--color-nta-soft)] text-[color:var(--color-nta)]",
  ESH: "bg-[color:var(--color-esh-soft)] text-[color:var(--color-esh)]",
  NAH: "bg-[color:var(--color-nah-soft)] text-[color:var(--color-nah)]",
  INFO: "bg-soft text-mute",
};

export function VerdictPill({
  verdict,
  className,
}: {
  verdict: Verdict;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold tnum",
        STYLES[verdict],
        className,
      )}
    >
      {verdict}
    </span>
  );
}

export function SeverityPill({
  severity,
  className,
}: {
  severity: "house" | "nuclear";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        severity === "house"
          ? "bg-[color:var(--color-ember-soft)] text-[color:var(--color-ember-deep)]"
          : "bg-[color:var(--color-yta)] text-white",
        className,
      )}
    >
      {severity === "house" ? "House" : "Nuclear"}
    </span>
  );
}
