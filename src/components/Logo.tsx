type Variant = "mark" | "horizontal" | "stacked";

const SRC: Record<Variant, { src: string; w: number; h: number }> = {
  mark: { src: "/logo-mark.svg", w: 200, h: 200 },
  horizontal: { src: "/logo-horizontal.svg", w: 760, h: 200 },
  stacked: { src: "/logo-stacked.svg", w: 400, h: 480 },
};

export function Logo({
  variant = "mark",
  height = 32,
  className,
  priority,
}: {
  variant?: Variant;
  height?: number;
  className?: string;
  priority?: boolean;
}) {
  const { src, w, h } = SRC[variant];
  const width = Math.round((w / h) * height);
  return (
    <img
      src={src}
      alt="Roastpilot"
      width={width}
      height={height}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={className}
    />
  );
}
