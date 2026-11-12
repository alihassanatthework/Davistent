import { standardFeatures } from "@/content/features";

/**
 * Standard features (homepage section 6, tent pages). CR-05: a static numbered
 * list of the seven features with their specifications beside one photograph.
 * No hotspots and no animation; every name, spec and detail is always visible.
 *
 * Photo slot: one wall-tent photograph (CR-22, needed from the client). Until it
 * is supplied the slot is a flat Charcoal placeholder.
 */
export function FeatureHotspots({ dark }: { dark?: boolean }) {
  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
      <div aria-hidden className={`aspect-[4/3] lg:col-span-5 ${dark ? "bg-gunmetal" : "bg-ink"}`} />
      <ol className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:col-span-7">
        {standardFeatures.map((f, i) => (
          <li key={f.id} className={`flex gap-4 border-t pt-4 ${dark ? "border-steel" : "border-line"}`}>
            <span className="data shrink-0 text-[14px] font-semibold">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3 className="text-[19px]">{f.name}</h3>
              <p className="data mt-1">{f.spec}</p>
              <p className="mt-2 text-[15px] leading-6 opacity-90">{f.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
