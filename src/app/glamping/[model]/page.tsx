import { notFound } from "next/navigation";
import { ProductPage } from "@/components/catalog/ProductPage";
import { byCategory, bySlug } from "@/content/catalog";
import { meta } from "@/lib/meta";

export const dynamicParams = false;
export const generateStaticParams = () => byCategory("glamping").map((p) => ({ model: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ model: string }> }) {
  const p = bySlug("glamping", (await params).model);
  return p ? meta(`${p.name} Glamping Tent ${p.sizeLabel}`, p.summary, p.href) : {};
}

export default async function GlampModelPage({ params }: { params: Promise<{ model: string }> }) {
  const p = bySlug("glamping", (await params).model);
  if (!p) notFound();
  return (
    <ProductPage
      product={p}
      crumbs={[
        { label: "Glamp", href: "/glamping/" },
        { label: p.name, href: p.href },
      ]}
    />
  );
}
