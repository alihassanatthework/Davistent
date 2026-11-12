import { notFound } from "next/navigation";
import { ProductPage } from "@/components/catalog/ProductPage";
import { byCategory, bySlug } from "@/content/catalog";
import { meta } from "@/lib/meta";

export const dynamicParams = false;
export const generateStaticParams = () => byCategory("specialty").map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = bySlug("specialty", (await params).slug);
  return p ? meta(p.name, p.summary, p.href) : {};
}

export default async function SpecialtyTentPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = bySlug("specialty", (await params).slug);
  if (!p) notFound();
  return (
    <ProductPage
      product={p}
      crumbs={[
        { label: "Tents", href: "/tents/" },
        { label: "Specialty", href: "/tents/specialty/" },
        { label: p.name, href: p.href },
      ]}
    />
  );
}
