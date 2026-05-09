export function FlameRank({ rank }: { rank: number }) {
  const scale = Math.max(0.4, 1 - (rank - 1) * 0.1);
  const color =
    rank === 1
      ? "#ffd96e"
      : rank === 2
        ? "#ffb347"
        : rank === 3
          ? "#ff8c42"
          : "#5c6878";
  const glow =
    rank === 1
      ? "drop-shadow(0 0 8px rgba(255,217,110,0.7))"
      : rank === 2
        ? "drop-shadow(0 0 5px rgba(255,179,71,0.5))"
        : rank <= 3
          ? "drop-shadow(0 0 3px rgba(255,140,66,0.35))"
          : "none";

  return (
    <svg
      viewBox="0 0 24 24"
      style={{
        width: 40 * scale,
        height: 40 * scale,
        filter: glow,
        flexShrink: 0,
      }}
      aria-hidden
    >
      <defs>
        <linearGradient id={`flame-${rank}`} x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor={rank === 1 ? "#ffd96e" : color} />
          <stop offset="100%" stopColor={rank <= 3 ? "#ff6b1a" : "#3a3230"} />
        </linearGradient>
      </defs>
      <path
        fill={`url(#flame-${rank})`}
        d="M12 2c.5 2 1.5 3.5 3 4.5C16.5 7.5 18 9 18 11.5c0 3.3-2.7 6-6 6s-6-2.7-6-6c0-1.5.5-2.8 1.5-3.8-.1 1 .2 2 .9 2.8C8.1 9 8.8 8 9 7c.4-1.5.7-3.5 3-5z"
      />
    </svg>
  );
}
