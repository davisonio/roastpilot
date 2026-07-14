import { VERDICTS, VERDICT_LABELS, VERDICT_BLURBS } from "@/lib/verdicts";
import { VerdictBadge } from "./VerdictBadge";

export function VerdictGlossary() {
  return (
    <div className="rounded-xl border border-rule bg-paper p-5">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="font-semibold text-ink text-sm tracking-wide">The verdicts</h3>
        <span className="text-[11px] text-ink-soft uppercase tracking-[0.16em]">
          Claude rules. So do you.
        </span>
      </div>
      <ul className="grid gap-2.5">
        {VERDICTS.map((v) => (
          <li key={v} className="flex items-start gap-3">
            <span className="pt-0.5">
              <VerdictBadge verdict={v} />
            </span>
            <div className="text-sm leading-snug">
              <div className="font-medium text-ink">{VERDICT_LABELS[v]}</div>
              <div className="text-ink-soft">{VERDICT_BLURBS[v]}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
