import { notFound } from "next/navigation";
import { ProductPage } from "@/components/catalog/ProductPage";
import { byCategory, bySlug } from "@/content/catalog";
import { meta } from "@/lib/meta";

export const dynamicParams = false;
export const generateStaticParams = () => byCategory("package").map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = bySlug("package", (await params).slug);
  return p ? meta(p.name, `${p.summary} Sleeps ${p.sleeps}.`, p.href) : {};
}

export default async function PackagePage({ params }: { params: Promise<{ slug: string }> }) {
  const p = bySlug("package", (await params).slug);
  if (!p) notFound();
  return (
    <ProductPage
      product={p}
      crumbs={[
        { label: "Hunt", href: "/hunting/" },
        { label: "Packages", href: "/hunting/packages/" },
        { label: p.name, href: p.href },
      ]}
    />
  );
}
