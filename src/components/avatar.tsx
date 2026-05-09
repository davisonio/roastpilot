import { avatarGradient } from "@/lib/handle";

export function Avatar({
  seed,
  verified,
  size = 32,
}: {
  seed: string;
  verified?: boolean;
  size?: number;
}) {
  const badge = Math.max(12, Math.round(size * 0.36));
  return (
    <span
      className="relative inline-block shrink-0"
      style={{ width: size, height: size }}
    >
      <span
        className="block h-full w-full rounded-full"
        style={{ background: avatarGradient(seed) }}
      />
      {verified && (
        <span
          className="absolute -bottom-0.5 -right-0.5 grid place-items-center rounded-full bg-card"
          style={{ width: badge, height: badge }}
          aria-label="Verified Human"
        >
          <svg
            viewBox="0 0 12 12"
            width={badge - 2}
            height={badge - 2}
            aria-hidden
          >
            <circle cx="6" cy="6" r="6" fill="var(--color-verified)" />
            <path
              d="M3.6 6.1l1.7 1.7L8.6 4.5"
              stroke="white"
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </span>
  );
}
