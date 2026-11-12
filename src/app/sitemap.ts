import type { MetadataRoute } from "next";
import { products } from "@/content/catalog";
import { site } from "@/content/site";

const pages = ["/", "/tents/", "/tents/specialty/", "/hunting/", "/hunting/packages/", "/build/", "/glamping/", "/glamping/guide/", "/glamping/custom/", "/glamping/accessories/", "/gear/", "/accessories/", "/accessories/frames/", "/accessories/flys-awnings/", "/deals/", "/stoves/", "/gift-certificates/", "/support/faq/", "/support/returns/", "/support/shipping/", "/support/warranty/", "/contact/"];

export default function sitemap(): MetadataRoute.Sitemap {
  const urls = new Set([...pages, ...products.map((p) => p.href.split("#")[0])]);
  return [...urls].map((u) => ({ url: `${site.url}${u}`, changeFrequency: "weekly" }));
}
