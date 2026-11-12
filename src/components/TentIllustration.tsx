import type { Illustration } from "@/content/catalog";

/**
 * Schematic line drawings in the brand palette. They stand in for product
 * photography until the Phase 1 image audit and product shoot deliver
 * 4:3 renders on a Canvas-colour ground (ch. 7 "Photography").
 */
export function TentIllustration({
  kind,
  className = "",
  label,
  tone = "light",
}: {
  kind: Illustration;
  className?: string;
  label?: string;
  tone?: "light" | "dark";
}) {
  const ink = tone === "dark" ? "#F4EEE2" : "#1F3A2E";
  const fill = tone === "dark" ? "rgba(244,238,226,.08)" : "#FFFFFF";
  const accent = "#D9601A";
  const ground = tone === "dark" ? "rgba(244,238,226,.25)" : "#C9B48A";
  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      fill="none"
      stroke={ink}
      strokeWidth={2}
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <line x1="20" y1="250" x2="380" y2="250" stroke={ground} strokeWidth={3} />
      {drawings[kind]?.({ ink, fill, accent })}
    </svg>
  );
}

type P = { ink: string; fill: string; accent: string };

const wall = ({ fill, accent }: P, opts: { stove?: boolean; fly?: boolean; awning?: boolean } = {}) => (
  <g>
    {opts.fly && <path d="M70 92 L200 40 L330 92" strokeWidth={3} stroke={accent} />}
    {/* front gable + side walls in 3/4 */}
    <path d="M90 250 V150 L170 90 L250 150 V250 Z" fill={fill} />
    <path d="M250 150 L330 120 V230 L250 250" fill={fill} />
    <path d="M170 90 L250 60 L330 120" />
    {/* door */}
    <path d="M150 250 V178 Q170 168 190 178 V250" />
    <line x1="170" y1="172" x2="170" y2="250" strokeDasharray="4 4" />
    {/* window */}
    <rect x="270" y="160" width="40" height="28" rx="2" />
    {/* ropes and stakes */}
    <path d="M90 150 L50 250 M330 120 L370 238" strokeWidth={1.5} />
    {opts.stove && (
      <g>
        <path d="M222 72 V40" strokeWidth={4} />
        <path d="M216 40 h12" strokeWidth={3} />
        <path d="M222 32 q6 -10 0 -18 q-6 -8 2 -14" stroke={accent} strokeWidth={1.5} opacity={0.8} />
      </g>
    )}
    {opts.awning && <path d="M90 150 L40 175 M250 150 L210 182 M40 175 L210 182" />}
  </g>
);

const drawings: Record<Illustration, (p: P) => React.ReactNode> = {
  wall: (p) => wall(p),
  package: (p) => (
    <g>
      {wall(p, { stove: true })}
      <g transform="translate(36 200)">
        <rect x="0" y="20" width="44" height="30" rx="2" fill={p.fill} />
        <path d="M6 20 V10 h32 v10" />
        <circle cx="22" cy="35" r="6" stroke={p.accent} />
      </g>
    </g>
  ),
  spike: (p) => (
    <g>
      <path d="M110 250 L200 120 L290 250 Z" fill={p.fill} />
      <path d="M200 120 L300 140 L350 240 L290 250" fill={p.fill} />
      <path d="M185 250 L200 205 L215 250" />
    </g>
  ),
  "single-pole": (p) => (
    <g>
      <path d="M80 250 L200 70 L320 250 Z" fill={p.fill} />
      <line x1="200" y1="60" x2="200" y2="250" />
      <path d="M180 250 V200 Q200 190 220 200 V250" />
    </g>
  ),
  cook: (p) => (
    <g>
      {wall(p, { stove: true })}
      <rect x="160" y="210" width="20" height="40" fill={p.fill} />
    </g>
  ),
  small: (p) => (
    <g transform="translate(60 60) scale(.7)">
      {wall(p)}
    </g>
  ),
  glamp: (p) => (
    <g>
      <rect x="30" y="246" width="340" height="10" fill={p.fill} />
      {wall(p, { fly: true, awning: true })}
    </g>
  ),
  stove: (p) => (
    <g>
      <rect x="120" y="140" width="170" height="90" rx="4" fill={p.fill} />
      <rect x="140" y="160" width="60" height="50" rx="2" />
      <path d="M155 200 q15 -25 30 0" stroke={p.accent} />
      <rect x="230" y="118" width="40" height="22" />
      <path d="M250 118 V30" strokeWidth={6} />
      <path d="M130 230 v20 M280 230 v20" strokeWidth={3} />
    </g>
  ),
  frame: () => (
    <g>
      <path d="M110 250 V150 L200 95 L290 150 V250" strokeWidth={3} />
      <path d="M200 95 L280 70 L350 120 V235 M290 150 L350 120" strokeWidth={3} />
      {[
        [110, 150],
        [200, 95],
        [290, 150],
        [280, 70],
        [350, 120],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={6} fill="#D9601A" stroke="none" />
      ))}
    </g>
  ),
  gear: (p) => (
    <g>
      <rect x="90" y="150" width="100" height="90" rx="6" fill={p.fill} />
      <rect x="210" y="150" width="100" height="90" rx="6" fill={p.fill} />
      <path d="M190 170 h20 M140 150 v-30 h120 v30" />
      <path d="M110 180 h60 M230 180 h60" strokeWidth={1.5} />
    </g>
  ),
  cot: (p) => (
    <g>
      <rect x="70" y="170" width="260" height="22" rx="4" fill={p.fill} />
      <path d="M90 192 L130 250 M130 192 L90 250 M310 192 L270 250 M270 192 L310 250" />
    </g>
  ),
  bag: (p) => (
    <g>
      <rect x="110" y="140" width="180" height="100" rx="30" fill={p.fill} />
      <path d="M150 140 q50 -40 100 0" />
      <path d="M140 190 h120" strokeDasharray="6 6" />
    </g>
  ),
  tag: (p) => (
    <g>
      <path d="M140 110 h120 l40 50 -40 50 h-120 Z" fill={p.fill} />
      <circle cx="270" cy="160" r="8" stroke={p.accent} />
      <path d="M170 145 h60 M170 175 h40" />
    </g>
  ),
};
