/**
 * The real Davis Tent® logo (public/brand). The supplied file is black on a
 * transparent background, so on the dark header and footer it is inverted to
 * white; pass tone="dark" to keep it black on a light surface.
 */
export function Logo({ className = "h-9", tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/DT_Logo_2_H_Color_black.png"
      width={630}
      height={150}
      alt="Davis Tent"
      className={`w-auto ${tone === "light" ? "invert" : ""} ${className}`}
    />
  );
}

/** One-colour "Made in USA" mark, used only where the claim is confirmed (tents). */
export function MadeInUsaMark({ className = "h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 48" className={className} role="img" aria-label="Tents made in the USA, Denver, Colorado">
      <rect x="1" y="1" width="118" height="46" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text x="60" y="20" textAnchor="middle" fill="currentColor" fontSize="10" fontWeight="700" letterSpacing="2">
        MADE IN USA
      </text>
      <text x="60" y="36" textAnchor="middle" fill="currentColor" fontSize="9" letterSpacing="1">
        DENVER · SINCE 1955
      </text>
    </svg>
  );
}
