/**
 * Commerce adapter (ch. 18 option A: headless WooCommerce).
 *
 * The catalogue, cart, checkout, accounts, coupons, gift certificates and
 * donations stay on WooCommerce. This module is the one place the front end
 * talks to it:
 *   - Catalogue reads at build time via the REST API (with revalidation).
 *   - Cart writes from the browser via the Store API on the store subdomain.
 *
 * With no WOO_* environment variables set, the seed catalogue in
 * src/content/catalog.ts is used and the cart is held locally, so the site
 * builds and runs before the Phase 1 API spike is complete.
 */
import { products as seed, type Product } from "@/content/catalog";

const STORE = process.env.NEXT_PUBLIC_STORE_URL;
const KEY = process.env.WOO_CONSUMER_KEY;
const SECRET = process.env.WOO_CONSUMER_SECRET;

export const commerceConnected = Boolean(STORE && KEY && SECRET);

type WooProduct = {
  id: number;
  slug: string;
  prices?: { price: string; currency_minor_unit: number; price_range?: { min_amount: string; max_amount: string } };
  is_in_stock?: boolean;
};

/** Merge live price and stock onto the enriched seed record (enrichment stays in the CMS). */
export async function getProducts(): Promise<Product[]> {
  if (!STORE) return seed;
  try {
    const res = await fetch(`${STORE}/wp-json/wc/store/v1/products?per_page=100`, {
      next: { revalidate: 600, tags: ["products"] },
    });
    if (!res.ok) return seed;
    const live = (await res.json()) as WooProduct[];
    const bySlug = new Map(live.map((p) => [p.slug, p]));
    return seed.map((p) => {
      const w = bySlug.get(p.legacyUrl.split("/").filter(Boolean).pop() ?? "");
      if (!w?.prices) return p;
      const unit = 10 ** w.prices.currency_minor_unit;
      const min = Number(w.prices.price_range?.min_amount ?? w.prices.price) / unit;
      const max = Number(w.prices.price_range?.max_amount ?? w.prices.price) / unit;
      return { ...p, priceMin: min, priceMax: max, status: w.is_in_stock === false ? "waitlist" : p.status };
    });
  } catch {
    return seed;
  }
}

/** Where "Checkout" sends the visitor: the existing WooCommerce checkout. */
export const checkoutUrl = `${STORE ?? "https://www.davistent.com"}/shop/checkout/`;
export const accountUrl = `${STORE ?? "https://www.davistent.com"}/shop/my-account/`;
