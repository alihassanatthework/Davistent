import { notFound } from "next/navigation";
import { ProductPage } from "@/components/catalog/ProductPage";
import { byCategory, bySlug } from "@/content/catalog";
import { meta } from "@/lib/meta";

export const dynamicParams = false;
export const generateStaticParams = () => byCategory("wall").map((p) => ({ size: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ size: string }> }) {
  const p = bySlug("wall", (await params).size);
  return p ? meta(p.name, `${p.summary} Sleeps ${p.sleeps}. From $${p.priceMin.toLocaleString()}.`, p.href) : {};
}

export default async function WallTentPage({ params }: { params: Promise<{ size: string }> }) {
  const p = bySlug("wall", (await params).size);
  if (!p) notFound();
  return (
    <ProductPage
      product={p}
      crumbs={[
        { label: "Tents", href: "/tents/" },
        { label: "Wall tents", href: "/tents/" },
        { label: p.sizeLabel!, href: p.href },
      ]}
    />
  );
}
