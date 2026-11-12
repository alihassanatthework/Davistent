import Link from "next/link";
import { type Product, formatPrice } from "@/content/catalog";

export function PackageTable({ products }: { products: Product[] }) {
  return (
    <div role="region" aria-label="Package comparison" tabIndex={0} className="overflow-x-auto rounded-md border border-line bg-snow">
      <table className="w-full min-w-[720px] text-left text-[15px]">
        <thead>
          <tr className="border-b border-line">
            <th scope="col" className="sticky left-0 bg-ink p-3">
              Package
            </th>
            <th scope="col" className="p-3">Size</th>
            <th scope="col" className="p-3">Sleeps</th>
            <th scope="col" className="p-3">Stove</th>
            <th scope="col" className="p-3">Sale price</th>
            <th scope="col" className="p-3">Was</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b border-line last:border-0">
              <th scope="row" className="sticky left-0 bg-snow p-3">
                <Link href={p.href} className="font-semibold text-pine underline-offset-4 hover:underline">
                  {p.name.replace(" Camp Package", "")}
                </Link>
              </th>
              <td className="data p-3">{p.sizeLabel}</td>
              <td className="data p-3">{p.sleeps}</td>
              <td className="data p-3">{p.specs?.find((s) => s.label === "Stove")?.value}</td>
              <td className="data p-3 font-semibold">
                {formatPrice(p.priceMin)}–{formatPrice(p.priceMax!)}
              </td>
              <td className="data p-3 text-stone line-through">
                {formatPrice(p.compareMin!)}–{formatPrice(p.compareMax!)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
