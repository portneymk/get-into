import { albumInitials, coverPalette } from "@/lib/cover";

type CoverMarkProps = {
  title: string;
  slug: string;
  accent: string;
  accent2: string;
  size?: number;
  className?: string;
};

export function CoverMark({
  title,
  slug,
  accent,
  accent2,
  size = 160,
  className,
}: CoverMarkProps) {
  const palette = coverPalette(slug, accent, accent2);
  const initials = albumInitials(title);
  const rings = Array.from({ length: palette.rings }, (_, index) => 18 + index * 14);

  return (
    <svg
      viewBox="0 0 160 160"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={`${title} placeholder cover`}
    >
      <defs>
        <radialGradient id={`g-${slug}`} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor={accent2} stopOpacity="0.95" />
          <stop offset="70%" stopColor={accent} stopOpacity="0.85" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.4" />
        </radialGradient>
      </defs>
      <rect width="160" height="160" rx="18" fill={`url(#g-${slug})`} />
      <g
        transform={`translate(80 80) rotate(${palette.rotate})`}
        fill="none"
        stroke="rgba(8,10,8,0.28)"
        strokeWidth="2"
      >
        {rings.map((radius) => (
          <circle key={radius} r={radius} cx={palette.offset} cy={-palette.offset / 2} />
        ))}
        <path d={`M ${-50 + palette.offset} 8 Q 0 ${-36 + (palette.hash % 20)} ${50 - palette.offset} 12`} />
      </g>
      <text
        x="80"
        y="92"
        textAnchor="middle"
        fill="rgba(8,10,8,0.82)"
        fontSize="42"
        fontFamily="var(--font-display), Georgia, serif"
        fontWeight="700"
      >
        {initials}
      </text>
    </svg>
  );
}
