import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/search/", "/shop/cart/", "/shop/checkout/", "/shop/my-account/"] }], sitemap: `${site.url}/sitemap.xml` };
}
