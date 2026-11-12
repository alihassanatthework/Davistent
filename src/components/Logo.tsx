/**
 * Wordmark placeholder. The existing Davis Tent® logo stays as it is (ch. 7);
 * drop the supplied SVG in here once the client provides the master file.
 */
export function Logo({ className = "h-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 174 40" className={className} role="img" aria-label="Davis Tent">
      <path d="M4 32 L20 8 L36 32 Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M17 32 L20 22 L23 32" fill="none" stroke="#D9601A" strokeWidth="2.5" strokeLinejoin="round" />
      <text x="44" y="27" fill="currentColor" fontFamily="var(--font-barlow), 'Arial Narrow', sans-serif" fontWeight="700" fontSize="25" letterSpacing="1.5">
        DAVIS TENT
      </text>
      <text x="164" y="13" fill="currentColor" fontSize="8" fontFamily="sans-serif">
        ®
      </text>
    </svg>
  );
}

/** One-colour "Made in USA" mark, used only where the claim is confirmed (tents). */
export function MadeInUsaMark({ className = "h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 48" className={className} role="img" aria-label="Tents made in the USA, Denver, Colorado">
      <rect x="1" y="1" width="118" height="46" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text x="60" y="20" textAnchor="middle" fill="currentColor" fontSize="10" fontWeight="700" letterSpacing="2">
        MADE IN USA
      </text>
      <text x="60" y="36" textAnchor="middle" fill="currentColor" fontSize="9" letterSpacing="1">
        DENVER · SINCE 1955
      </text>
    </svg>
  );
}
