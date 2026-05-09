import type { Category } from "@/db/schema";

const CATEGORY_LABEL: Record<Category, string> = {
  relationships: "Relationships",
  family: "Family",
  work: "Work",
  money: "Money",
  friends: "Friends",
  petty: "Petty",
  other: "Other",
};

export function AboutCase({
  category,
  severity,
  submittedAt,
  visibility = "Public",
}: {
  category: Category;
  severity: "house" | "nuclear";
  submittedAt: Date;
  visibility?: string;
}) {
  return (
    <section className="card-lg p-6">
      <h3 className="text-base font-medium text-ink">About this case</h3>
      <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <Item icon={<HeartIcon />} label="Category" value={CATEGORY_LABEL[category]} />
        <Item
          icon={<HouseIcon />}
          label="Severity"
          value={severity === "house" ? "House" : "Nuclear"}
        />
        <Item
          icon={<ClockIcon />}
          label="Submitted"
          value={submittedAt.toLocaleDateString(undefined, {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        />
        <Item icon={<GlobeIcon />} label="Visibility" value={visibility} />
      </dl>
    </section>
  );
}

function Item({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 text-mute">{icon}</span>
      <div className="min-w-0">
        <dt className="text-xs text-mute">{label}</dt>
        <dd className="font-medium text-ink">{value}</dd>
      </div>
    </div>
  );
}

function HeartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
      <path
        d="M7 12s-4.5-2.7-4.5-6a2.5 2.5 0 014.5-1.5A2.5 2.5 0 0111.5 6c0 3.3-4.5 6-4.5 6z"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function HouseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
      <path
        d="M2 6.5L7 2l5 4.5V12H2V6.5z"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <path d="M7 4v3l2 1.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <path d="M2 7h10M7 2c2 2 2 8 0 10M7 2c-2 2-2 8 0 10" stroke="currentColor" strokeWidth="1.4" fill="none" />
    </svg>
  );
}
