"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { type Product, formatPrice, priceLabel } from "@/content/catalog";
import { ProductCard } from "../ProductCard";
import { TentIllustration } from "../TentIllustration";
import { Button, buttonClass, Icon } from "../ui";

export type FilterKey = "use" | "sleeps" | "size" | "stove" | "price" | "compat";
const useLabels: Record<string, string> = {
  hunt: "Hunting",
  family: "Family camping",
  solo: "Solo",
  spike: "Spike camp",
  cook: "Cook",
  wash: "Wash",
  storage: "Storage",
  glamp: "Glamping",
};
const sleepBands = [
  { id: "1-2", label: "1–2", test: (n: number) => n <= 2 },
  { id: "3-4", label: "3–4", test: (n: number) => n >= 3 && n <= 4 },
  { id: "5+", label: "5 or more", test: (n: number) => n >= 5 },
];
const priceBands = [
  { id: "u500", label: "Under $500", test: (n: number) => n < 500 },
  { id: "500-2000", label: "$500 – $2,000", test: (n: number) => n >= 500 && n < 2000 },
  { id: "2000+", label: "$2,000 and up", test: (n: number) => n >= 2000 },
];
const sorts = [
  { id: "recommended", label: "Recommended" },
  { id: "price-asc", label: "Price, low to high" },
  { id: "price-desc", label: "Price, high to low" },
  { id: "size", label: "Size" },
];

/**
 * Category grid (ch. 13): filters update results without a reload and write to
 * the URL; left rail on desktop, bottom sheet on mobile. Compare up to three;
 * quick view dialog. Result count announced on change.
 */
export function CategoryGrid({ products, filters, compareEnabled = true }: { products: Product[]; filters: FilterKey[]; compareEnabled?: boolean }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [sheet, setSheet] = useState(false);
  const [compare, setCompare] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [quick, setQuick] = useState<Product | null>(null);
  const sheetRef = useRef<HTMLDialogElement>(null);
  const cmpRef = useRef<HTMLDialogElement>(null);
  const quickRef = useRef<HTMLDialogElement>(null);

  const selected = (k: string) => params.get(k)?.split(",").filter(Boolean) ?? [];
  const sort = params.get("sort") ?? "recommended";

  const setParam = (k: string, values: string[] | string) => {
    const next = new URLSearchParams(params.toString());
    const v = Array.isArray(values) ? values.join(",") : values;
    if (v) next.set(k, v);
    else next.delete(k);
    router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false });
  };
  const toggle = (k: string, id: string) => {
    const cur = selected(k);
    setParam(k, cur.includes(id) ? cur.filter((c) => c !== id) : [...cur, id]);
  };

  const sizes = useMemo(() => [...new Set(products.map((p) => p.sizeLabel).filter(Boolean))] as string[], [products]);
  const uses = useMemo(() => [...new Set(products.flatMap((p) => p.uses ?? []))], [products]);
  const compatSizes = ["10x15", "12x15", "14x15", "14x20", "16x20", "16x25"];

  const results = useMemo(() => {
    let list = products.filter((p) => {
      const u = selected("use");
      if (u.length && !p.uses?.some((x) => u.includes(x))) return false;
      const s = selected("sleeps");
      if (s.length && !(p.sleepsMax && sleepBands.some((b) => s.includes(b.id) && b.test(p.sleepsMax!)))) return false;
      const z = selected("size");
      if (z.length && !(p.sizeLabel && z.includes(p.sizeLabel))) return false;
      if (params.get("stove") === "yes" && !p.stoveIncluded) return false;
      const pr = selected("price");
      if (pr.length && !priceBands.some((b) => pr.includes(b.id) && b.test(p.priceMin))) return false;
      const c = params.get("compat");
      if (c && !p.compatibleSizes?.includes(c)) return false;
      return true;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.priceMin - b.priceMin);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.priceMin - a.priceMin);
    if (sort === "size") list = [...list].sort((a, b) => (a.size ? a.size[0] * a.size[1] : 0) - (b.size ? b.size[0] * b.size[1] : 0));
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, params, sort]);

  const activeCount = filters.reduce((n, k) => n + (k === "stove" || k === "compat" ? (params.get(k) ? 1 : 0) : selected(k).length), 0);

  /* Active filters as rectangular tags with a remove control (CR-14). Same toggles, same URL parameters. */
  const activeTags: { key: string; label: string; remove: () => void }[] = [
    ...selected("use").map((id) => ({ key: `use-${id}`, label: useLabels[id] ?? id, remove: () => toggle("use", id) })),
    ...selected("sleeps").map((id) => ({ key: `sleeps-${id}`, label: `Sleeps ${sleepBands.find((b) => b.id === id)?.label ?? id}`, remove: () => toggle("sleeps", id) })),
    ...selected("size").map((id) => ({ key: `size-${id}`, label: id, remove: () => toggle("size", id) })),
    ...(params.get("stove") === "yes" ? [{ key: "stove", label: "Stove included", remove: () => setParam("stove", "") }] : []),
    ...(params.get("compat") ? [{ key: "compat", label: `Fits ${params.get("compat")!.replace("x", "' × ")}'`, remove: () => setParam("compat", "") }] : []),
    ...selected("price").map((id) => ({ key: `price-${id}`, label: priceBands.find((b) => b.id === id)?.label ?? id, remove: () => toggle("price", id) })),
  ].filter((t) => filters.includes(t.key.split("-")[0] as FilterKey));

  useEffect(() => {
    const d = sheetRef.current;
    if (d) sheet ? !d.open && d.showModal() : d.open && d.close();
  }, [sheet]);
  useEffect(() => {
    const d = cmpRef.current;
    if (d) compareOpen ? !d.open && d.showModal() : d.open && d.close();
  }, [compareOpen]);
  useEffect(() => {
    const d = quickRef.current;
    if (d) quick ? !d.open && d.showModal() : d.open && d.close();
  }, [quick]);

  const panel = (
    <div className="space-y-6">
      {filters.includes("use") && uses.length > 1 && (
        <Group legend="Use">
          {uses.map((u) => (
            <Check key={u} label={useLabels[u] ?? u} checked={selected("use").includes(u)} onChange={() => toggle("use", u)} />
          ))}
        </Group>
      )}
      {filters.includes("sleeps") && (
        <Group legend="Sleeps">
          {sleepBands.map((b) => (
            <Check key={b.id} label={b.label} checked={selected("sleeps").includes(b.id)} onChange={() => toggle("sleeps", b.id)} />
          ))}
        </Group>
      )}
      {filters.includes("size") && sizes.length > 1 && (
        <Group legend="Size">
          {sizes.map((s) => (
            <Check key={s} label={s} checked={selected("size").includes(s)} onChange={() => toggle("size", s)} />
          ))}
        </Group>
      )}
      {filters.includes("stove") && (
        <Group legend="Stove">
          <Check label="Stove included" checked={params.get("stove") === "yes"} onChange={() => setParam("stove", params.get("stove") === "yes" ? "" : "yes")} />
        </Group>
      )}
      {filters.includes("compat") && (
        <Group legend="Fits my tent">
          <label className="block">
            <span className="sr-only">Tent size</span>
            <select value={params.get("compat") ?? ""} onChange={(e) => setParam("compat", e.target.value)} className="h-12 w-full rounded-md border border-slate bg-snow px-3">
              <option value="">Any tent size</option>
              {compatSizes.map((s) => (
                <option key={s} value={s}>
                  {s.replace("x", "' × ")}'
                </option>
              ))}
            </select>
          </label>
        </Group>
      )}
      {filters.includes("price") && (
        <Group legend="Price">
          {priceBands.map((b) => (
            <Check key={b.id} label={b.label} checked={selected("price").includes(b.id)} onChange={() => toggle("price", b.id)} />
          ))}
        </Group>
      )}
      {activeCount > 0 && (
        <button className="text-[15px] font-semibold text-ink underline underline-offset-4" onClick={() => router.replace(pathname, { scroll: false })}>
          Clear all filters
        </button>
      )}
    </div>
  );

  const compared = products.filter((p) => compare.includes(p.id));

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
      <aside className="hidden lg:block" aria-label="Filters">
        <h2 className="nav-label mb-4 font-sans">Filter</h2>
        {panel}
      </aside>

      <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p aria-live="polite" className="nav-label text-slate">
            {results.length} {results.length === 1 ? "product" : "products"}
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setSheet(true)} className="nav-label inline-flex min-h-11 items-center gap-2 rounded-md border border-slate bg-snow px-4 lg:hidden">
              Filter{activeCount ? ` (${activeCount})` : ""}
            </button>
            <label className="flex items-center gap-2 text-[15px]">
              <span className="nav-label max-sm:sr-only">Sort</span>
              <select value={sort} onChange={(e) => setParam("sort", e.target.value === "recommended" ? "" : e.target.value)} className="h-12 rounded-md border border-slate bg-snow px-3">
                {sorts.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {activeTags.length > 0 && (
          <ul aria-label="Active filters" className="mb-6 flex flex-wrap gap-2">
            {activeTags.map((t) => (
              <li key={t.key}>
                <button onClick={t.remove} className="inline-flex min-h-9 items-center gap-2 rounded-sm border border-ink px-3 text-[13px] font-semibold hover:bg-ink hover:text-bone">
                  {t.label}
                  <Icon name="close" className="size-3.5" />
                  <span className="sr-only">Remove filter</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {results.length === 0 ? (
          <div className="rounded-md border border-line bg-snow p-8 text-center">
            <p className="font-semibold">No products match those filters.</p>
            <button className="mt-3 font-semibold text-ink underline" onClick={() => router.replace(pathname, { scroll: false })}>
              Reset filters
            </button>
            <p className="mt-4 text-[15px] text-stone">
              Or browse <Link href="/hunting/" className="underline">hunting tents</Link>, <Link href="/glamping/" className="underline">glamping</Link> or{" "}
              <Link href="/gear/" className="underline">gear</Link>.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((p) => (
              <li key={p.id}>
                <ProductCard
                  product={p}
                  compareSlot={
                    <div className="flex items-center justify-between gap-2">
                      {compareEnabled ? (
                        <label className="flex min-h-10 items-center gap-2 text-[14px]">
                          <input
                            type="checkbox"
                            className="size-5 accent-ink"
                            checked={compare.includes(p.id)}
                            disabled={!compare.includes(p.id) && compare.length >= 3}
                            onChange={() => setCompare((c) => (c.includes(p.id) ? c.filter((x) => x !== p.id) : [...c, p.id]))}
                          />
                          Compare<span className="sr-only"> {p.name}</span>
                        </label>
                      ) : (
                        <span />
                      )}
                      <button className="min-h-10 text-[14px] font-semibold text-ink underline-offset-4 hover:underline" onClick={() => setQuick(p)}>
                        Quick view<span className="sr-only"> of {p.name}</span>
                      </button>
                    </div>
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* compare tray */}
      {compare.length > 0 && (
        <div data-surface="dark" className="fixed inset-x-0 bottom-16 z-40 border-t border-steel bg-ink text-bone md:bottom-0">
          <div className="container-site flex items-center justify-between gap-4 py-3">
            <p className="text-[15px]">
              <strong>{compare.length}</strong> of 3 selected to compare
            </p>
            <div className="flex gap-2">
              <button className="min-h-11 px-3 text-[14px] underline" onClick={() => setCompare([])}>
                Clear
              </button>
              <Button onClick={() => setCompareOpen(true)} disabled={compare.length < 2}>
                <Icon name="compare" className="size-4" /> Compare ({compare.length})
              </Button>
            </div>
          </div>
        </div>
      )}

      <dialog ref={sheetRef} onClose={() => setSheet(false)} aria-labelledby="filter-title" className="mb-0 mt-auto max-h-[85dvh] w-full max-w-full rounded-t-md bg-canvas p-0 backdrop:bg-charcoal/40">
        <div className="flex items-center justify-between border-b border-line p-4">
          <h2 id="filter-title" className="font-sans text-[19px] font-semibold">
            Filter
          </h2>
          <button onClick={() => setSheet(false)} className="grid size-11 place-items-center">
            <Icon name="close" />
            <span className="sr-only">Close filters</span>
          </button>
        </div>
        <div className="overflow-y-auto p-4">{panel}</div>
        <div className="border-t border-line p-4">
          <Button className="w-full" onClick={() => setSheet(false)}>
            Show {results.length} products
          </Button>
        </div>
      </dialog>

      <dialog ref={cmpRef} onClose={() => setCompareOpen(false)} aria-labelledby="cmp-title" className="w-[min(96vw,1000px)] max-w-none rounded-md bg-snow p-0 backdrop:bg-charcoal/50">
        <div className="flex items-center justify-between border-b border-line p-4">
          <h2 id="cmp-title" className="text-[26px]">
            Compare
          </h2>
          <button onClick={() => setCompareOpen(false)} className="grid size-11 place-items-center">
            <Icon name="close" />
            <span className="sr-only">Close comparison</span>
          </button>
        </div>
        <div role="region" aria-label="Comparison table" tabIndex={0} className="overflow-x-auto p-4">
          <table className="w-full min-w-[560px] text-left text-[15px]">
            <thead>
              <tr>
                <th scope="col" className="sticky left-0 bg-ink p-2" />
                {compared.map((p) => (
                  <th key={p.id} scope="col" className="p-2 align-top">
                    <Link href={p.href} className="font-semibold hover:underline">
                      {p.name}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ["Price", (p: Product) => priceLabel(p)],
                  ["Size", (p: Product) => p.sizeLabel ?? "—"],
                  ["Sleeps", (p: Product) => p.sleeps ?? "—"],
                  ["Stove included", (p: Product) => (p.stoveIncluded ? "Yes" : "No")],
                  ["Included", (p: Product) => (p.included ? `${p.included.length} items` : "—")],
                  ...[...new Set(compared.flatMap((p) => p.specs?.map((s) => s.label) ?? []))].map(
                    (label) => [label, (p: Product) => p.specs?.find((s) => s.label === label)?.value ?? "—"] as const,
                  ),
                ] as [string, (p: Product) => string][]
              ).map(([label, get]) => (
                <tr key={label} className="border-t border-line">
                  <th scope="row" className="sticky left-0 bg-snow p-2 font-semibold">
                    {label}
                  </th>
                  {compared.map((p) => (
                    <td key={p.id} className="data p-2 align-top">
                      {get(p)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </dialog>

      <dialog ref={quickRef} onClose={() => setQuick(null)} aria-labelledby="qv-title" className="w-[min(96vw,820px)] max-w-none rounded-md bg-snow p-0 backdrop:bg-charcoal/50">
        {quick && (
          <div className="grid gap-6 p-4 md:grid-cols-2 md:p-6">
            <div className="aspect-[4/3] rounded-md bg-canvas">
              <TentIllustration kind={quick.illustration} className="h-full w-full p-4" />
            </div>
            <div>
              <div className="flex items-start justify-between gap-2">
                <h2 id="qv-title" className="text-[26px]">
                  {quick.name}
                </h2>
                <button onClick={() => setQuick(null)} className="grid size-11 shrink-0 place-items-center">
                  <Icon name="close" />
                  <span className="sr-only">Close quick view</span>
                </button>
              </div>
              <p className="data mt-2 text-[16px] font-semibold">{priceLabel(quick)}</p>
              {quick.priceMax && quick.priceMax !== quick.priceMin && <p className="text-[13px] text-stone">Up to {formatPrice(quick.priceMax)} with options</p>}
              <p className="mt-3 text-[15px]">{quick.summary}</p>
              {quick.specs && (
                <dl className="mt-4 space-y-1 text-[14px]">
                  {quick.specs.slice(0, 4).map((s) => (
                    <div key={s.label} className="flex gap-2">
                      <dt className="font-semibold">{s.label}:</dt>
                      <dd>{s.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              <Link href={quick.href} className={`mt-6 ${buttonClass()}`}>
                {quick.priceMax && quick.priceMax !== quick.priceMin ? "Configure" : "View product"}
              </Link>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}

function Group({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="eyebrow mb-2 w-full border-b border-line pb-2 text-slate">{legend}</legend>
      <div className="space-y-1">{children}</div>
    </fieldset>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex min-h-10 cursor-pointer items-center gap-3 text-[15px]">
      <input type="checkbox" checked={checked} onChange={onChange} className="size-[18px] rounded-none accent-ink" />
      {label}
    </label>
  );
}
