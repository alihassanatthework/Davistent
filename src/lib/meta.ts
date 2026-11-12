import type { Metadata } from "next";

/**
 * One metadata template per page type (ch. 19): title matches the H1,
 * self-referencing canonical on https://www, no shortcode in social text.
 */
export function meta(title: string, description: string, path: string, opts: { noindex?: boolean } = {}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path },
    twitter: { title, description },
    ...(opts.noindex && { robots: { index: false, follow: true } }),
  };
}
