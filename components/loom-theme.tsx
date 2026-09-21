/* Loom color palette and shared UI components */

export const LOOM = {
  ecru: "#f3ede2",
  cloth: "#faf6ee",
  warp: "#b3502e",
  weft: "#3a5a8c",
  ink: "#332c24",
  muted: "#847763",
} as const;

/* -- Thread Divider SVG -- */
export function ThreadDivider({ w = 220 }: { w?: number }) {
  return (
    <svg width={w} height="20" viewBox="0 0 220 20" fill="none" className="mx-auto" aria-hidden="true">
      <path
        d="M4 10 C 30 2, 50 18, 76 10 S 122 2, 148 10 S 194 18, 216 10"
        stroke={LOOM.warp}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M4 10 C 30 18, 50 2, 76 10 S 122 18, 148 10 S 194 2, 216 10"
        stroke={LOOM.weft}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="110" cy="10" r="2.6" fill={LOOM.ink} />
    </svg>
  );
}

/* -- Weave Band Divider -- */
export function WeaveBandDivider() {
  return (
    <div className="mx-auto flex max-w-5xl items-center gap-2 px-6 py-8" aria-hidden="true">
      <span className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${LOOM.warp}30)` }} />
      <svg width="320" height="14" viewBox="0 0 320 14" fill="none" className="shrink-0">
        <path
          d="M0 7 C 20 2, 40 12, 60 7 S 100 2, 120 7 S 160 12, 180 7 S 220 2, 240 7 S 280 12, 300 7 L 320 7"
          stroke={LOOM.warp}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.5"
        />
        <path
          d="M0 7 C 20 12, 40 2, 60 7 S 100 12, 120 7 S 160 2, 180 7 S 220 12, 240 7 S 280 2, 300 7 L 320 7"
          stroke={LOOM.weft}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.5"
        />
        <circle cx="60" cy="7" r="1.8" fill={LOOM.warp} opacity="0.4" />
        <circle cx="160" cy="7" r="1.8" fill={LOOM.ink} opacity="0.3" />
        <circle cx="260" cy="7" r="1.8" fill={LOOM.weft} opacity="0.4" />
      </svg>
      <span className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${LOOM.weft}30, transparent)` }} />
    </div>
  );
}

/* -- Thread Knot Corner -- */
function ThreadKnotCorner({ color }: { color: string }) {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      className="absolute right-3 top-3"
      aria-hidden="true"
    >
      <path d="M1 4 C 1 2, 4 1, 4 4 S 7 6, 7 4" stroke={color} strokeWidth="0.8" opacity="0.35" />
      <circle cx="4" cy="4" r="0.8" fill={color} opacity="0.3" />
    </svg>
  );
}

/* -- LoomCard -- */
export function LoomCard({
  children,
  className = "",
  motifColor,
  style,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  motifColor?: string;
  style?: React.CSSProperties;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "style" | "className">) {
  return (
    <div
      className={`group relative flex flex-col rounded-2xl border shadow-[0_12px_36px_rgba(51,44,36,0.06)] ring-1 ring-inset transition-shadow duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(51,44,36,0.1)] ${className}`}
      style={{
        background: LOOM.cloth,
        borderColor: `${LOOM.ink}12`,
        boxShadow: `inset 0 0 0 1px ${LOOM.ink}08, 0 12px 36px rgba(51,44,36,0.06)`,
        ...style,
      }}
      {...rest}
    >
      <ThreadKnotCorner color={motifColor ?? LOOM.warp} />
      {children}
    </div>
  );
}

/* -- Kilim Motifs -- */
export function KilimMotif({ kind, size = 56 }: { kind: number; size?: number }) {
  const paths = [
    "M28 8 L38 20 L33 20 L33 30 L44 30 L36 44 L20 44 L12 30 L23 30 L23 20 L18 20 Z",
    "M28 12 L28 34 M28 20 C 14 20 10 8 16 6 M28 20 C 42 20 46 8 40 6 M18 44 L38 44",
    "M28 10 L46 28 L28 46 L10 28 Z M28 20 L36 28 L28 36 L20 28 Z",
    "M28 8 L33 22 L48 22 L36 31 L41 46 L28 37 L15 46 L20 31 L8 22 L23 22 Z",
    "M12 16 L44 16 M12 16 L12 40 M20 16 L20 40 M28 16 L28 40 M36 16 L36 40 M44 16 L44 40",
    "M8 20 L18 12 L28 20 L38 12 L48 20 M8 34 L18 26 L28 34 L38 26 L48 34",
  ];
  const isStroke = kind === 1 || kind === 4 || kind === 5;
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" aria-hidden="true">
      <path
        d={paths[kind % paths.length]}
        stroke={kind % 2 === 0 ? LOOM.warp : LOOM.weft}
        strokeWidth="2.2"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill={isStroke ? "none" : kind % 2 === 0 ? `${LOOM.warp}22` : `${LOOM.weft}22`}
      />
    </svg>
  );
}

/* -- Hero thread lines behind title -- */
export function HeroThreadLines() {
  const warpBase = "M-20 34 C 150 50, 350 18, 500 38 S 750 52, 1020 30";
  const weftBase = "M-20 26 C 200 10, 400 46, 500 24 S 800 8, 1020 32";
  const plyOffsets = [-1.8, 0, 1.8];

  return (
    <svg
      className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2"
      width="100%"
      height="70"
      viewBox="0 0 1000 70"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      {plyOffsets.map((offset, i) => (
        <path
          key={`warp-${i}`}
          d={warpBase}
          stroke={LOOM.warp}
          strokeWidth={1.2 + (i === 1 ? 0.3 : 0)}
          opacity={0.06 + i * 0.02}
          transform={`translate(0, ${offset})`}
        />
      ))}
      {plyOffsets.map((offset, i) => (
        <path
          key={`weft-${i}`}
          d={weftBase}
          stroke={LOOM.weft}
          strokeWidth={1.2 + (i === 1 ? 0.3 : 0)}
          opacity={0.06 + i * 0.02}
          transform={`translate(0, ${offset})`}
        />
      ))}
    </svg>
  );
}

/* -- CSS for layered background -- */
export const bgLayerStyles = `
  .loom-bg-layers { position: relative; }
  .loom-bg-layers::before,
  .loom-bg-layers::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }
  .loom-bg-layers::before {
    background:
      repeating-linear-gradient(0deg, rgba(51,44,36,0.03) 0 1px, transparent 1px 5px),
      repeating-linear-gradient(90deg, rgba(51,44,36,0.03) 0 1px, transparent 1px 5px);
  }
  .loom-bg-layers::after {
    background:
      radial-gradient(ellipse 60% 50% at 85% 15%, ${LOOM.warp}08, transparent 70%),
      radial-gradient(ellipse 60% 50% at 15% 85%, ${LOOM.weft}08, transparent 70%);
  }
`;
