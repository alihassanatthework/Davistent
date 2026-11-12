import { Suspense } from "react";
import type { Product } from "@/content/catalog";
import { ProductCard } from "../ProductCard";
import { CategoryGrid, type FilterKey } from "./CategoryGrid";

/**
 * Server wrapper: the full product list is rendered in HTML (for crawlers and
 * no-script), and the interactive grid hydrates over it reading the URL.
 */
export function Category({ products, filters = [], compare = true }: { products: Product[]; filters?: FilterKey[]; compare?: boolean }) {
  return (
    <Suspense
      fallback={
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-3">
          {products.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      }
    >
      <CategoryGrid products={products} filters={filters} compareEnabled={compare} />
    </Suspense>
  );
}
