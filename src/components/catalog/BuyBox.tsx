"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { type Product, formatPrice } from "@/content/catalog";
import { destinations, fireStates } from "@/content/builder";
import { site } from "@/content/site";
import { useCart } from "../Cart";
import { Button, Icon, Notice } from "../ui";

type Choice = { id: string; label: string; price: number; note?: string };

/**
 * Options panel (ch. 14): visual chips with price adders, inline rule checks,
 * live price, sticky buy bar on mobile. Option groups come from the store's
 * add-on data once connected; until then the published price range is shown
 * as two tiers so the price never misstates the store.
 */
export function BuyBox({ product: p }: { product: Product }) {
  const { add } = useCart();
  const id = useId();
  const groups = useMemo(() => optionGroups(p), [p]);
  const [picks, setPicks] = useState<Record<string, string>>(() => Object.fromEntries(groups.map((g) => [g.id, g.choices[0].id])));
  const [dest, setDest] = useState("");

  const total = groups.reduce((sum, g) => sum + (g.choices.find((c) => c.id === picks[g.id])?.price ?? 0), p.priceMin);
  const isTent = ["wall", "package", "specialty", "glamping"].includes(p.category);
  const treatment = picks.treatment;
  const fireNeeded = isTent && ((fireStates as readonly string[]).includes(dest) || dest === "CANADA");
  const blocked = fireNeeded && treatment !== "fire";
  const priced = p.priceMin > 0;

  const addToCart = () =>
    add({
      id: `${p.id}:${Object.values(picks).join("-")}`,
      name: p.name,
      price: total,
      href: p.href,
      options: groups.map((g) => g.choices.find((c) => c.id === picks[g.id])!.label),
    });

  return (
    <div className="space-y-6">
      <div>
        <p className="data text-[28px] font-semibold" aria-live="polite">
          {priced ? formatPrice(total) : "Price in store"}
        </p>
        {p.compareMin && (
          <p className="text-[14px] text-stone">
            Was {formatPrice(p.compareMin)}
            {p.compareMax ? `–${formatPrice(p.compareMax)}` : ""}
          </p>
        )}
        {p.priceMax && p.priceMax !== p.priceMin && (
          <p className="text-[14px] text-stone">
            {formatPrice(p.priceMin)} to {formatPrice(p.priceMax)} depending on options
          </p>
        )}
      </div>

      {groups.map((g) => (
        <fieldset key={g.id}>
          <legend className="mb-2 font-semibold">{g.label}</legend>
          <div role="radiogroup" className="grid gap-2 sm:grid-cols-2">
            {g.choices.map((c) => {
              const selected = picks[g.id] === c.id;
              return (
                <label
                  key={c.id}
                  className={`flex min-h-12 cursor-pointer items-start gap-3 rounded-md border p-3 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-pine ${
                    selected ? "border-pine bg-pine/5 ring-1 ring-pine" : "border-line bg-snow"
                  }`}
                >
                  <input type="radio" name={`${id}-${g.id}`} className="mt-1 size-4 accent-ink" checked={selected} onChange={() => setPicks((s) => ({ ...s, [g.id]: c.id }))} />
                  <span className="flex-1">
                    <span className="block text-[15px] font-semibold">{c.label}</span>
                    {c.note && <span className="block text-[13px] text-stone">{c.note}</span>}
                  </span>
                  {c.price !== 0 && <span className="data text-[13px]">+{formatPrice(c.price)}</span>}
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}

      {isTent && (
        <div>
          <label htmlFor={`${id}-dest`} className="mb-2 block font-semibold">
            Shipping to
          </label>
          <select id={`${id}-dest`} value={dest} onChange={(e) => setDest(e.target.value)} className="h-12 w-full rounded-md border border-line bg-snow px-3">
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {blocked && (
        <Notice tone="block" role="alert" title="Fire treatment required">
          We cannot ship tents to CA, LA, MA, MI, MN, NY, NJ or Canada without the FIRE treatment.{" "}
          <button className="font-semibold underline" onClick={() => setPicks((s) => ({ ...s, treatment: "fire" }))}>
            Switch to fire treatment
          </button>
        </Notice>
      )}

      <div className="hidden md:block">
        {priced ? (
          <Button className="w-full" onClick={addToCart} disabled={blocked}>
            Add to cart
          </Button>
        ) : (
          <a href={`tel:${site.phone.tel}`} className="flex min-h-12 items-center justify-center rounded-md bg-blaze text-ink font-semibold">
            Call for price
          </a>
        )}
      </div>

      <ul className="space-y-2 border-t border-line pt-4 text-[14px]">
        {isTent && (
          <li className="flex gap-2">
            <Icon name="info" className="size-4 shrink-0" /> Some custom tents may require 4 weeks production lead time.
          </li>
        )}
        <li className="flex gap-2">
          <Icon name="info" className="size-4 shrink-0" />
          <span>
            Returns within 30 days, authorized by Davis Tent; custom orders are not returnable.{" "}
            <Link href="/support/returns/" className="underline">
              Returns
            </Link>
          </span>
        </li>
        <li className="flex gap-2">
          <Icon name="phone" className="size-4 shrink-0" />
          <a href={`tel:${site.phone.tel}`} className="underline">
            Questions? Call {site.phone.display}
          </a>
        </li>
      </ul>

      {/* sticky mobile buy bar */}
      <div className="fixed inset-x-0 bottom-0 z-[45] flex items-center gap-3 border-t border-line bg-snow p-3 md:hidden">
        <p className="data flex-1 text-[18px] font-semibold">{priced ? formatPrice(total) : "Call for price"}</p>
        {priced ? (
          <Button onClick={addToCart} disabled={blocked}>
            Add to cart
          </Button>
        ) : (
          <a href={`tel:${site.phone.tel}`} className="inline-flex min-h-12 items-center rounded-md bg-blaze text-ink px-5 font-semibold">
            Call
          </a>
        )}
      </div>
    </div>
  );
}

function optionGroups(p: Product): { id: string; label: string; choices: Choice[] }[] {
  const spread = p.priceMax && p.priceMax > p.priceMin ? p.priceMax - p.priceMin : 0;
  if (p.category === "wall" || p.category === "package") {
    return [
      {
        id: "treatment",
        label: "Treatment",
        choices: [
          { id: "water-mildew", label: "Water and mildew", price: 0, note: "Our recommendation" },
          { id: "fire", label: "Water, mildew and fire", price: 0, note: "CPAI-84. Store price applies" },
        ],
      },
      ...(p.category === "package"
        ? [
            {
              id: "upgrades",
              label: "Upgrades",
              choices: [
                { id: "none", label: "Package as listed", price: 0 },
                { id: "full-floor", label: "Full floor", price: 40 },
                { id: "deluxe-bag", label: "Deluxe bag", price: 45 },
                { id: "windows", label: "Two extra windows", price: 138 },
                { id: "peak", label: "Peak stove upgrade", price: 46 },
                { id: "water-heater", label: "Water heater", price: 95 },
              ],
            },
          ]
        : [
            {
              id: "configure",
              label: "Options",
              choices: [
                { id: "base", label: "Tent with standard features", price: 0 },
                { id: "builder", label: "Windows, doors, floor and fly", price: 0, note: "Choose these in the tent builder" },
              ],
            },
          ]),
    ];
  }
  if (p.category === "glamping" && p.id === "cozy-hideaway") {
    return [
      {
        id: "treatment",
        label: "Canvas treatment",
        choices: [
          { id: "standard", label: "Standard treated canvas", price: 0 },
          { id: "all-pro", label: "Sunforger All Pro (mildew + sun)", price: 345 },
          { id: "sun-pro", label: "Sunforger Sun Pro (extreme UV)", price: 845, note: "White only" },
        ],
      },
    ];
  }
  if (p.category === "stove" && p.id === "wood-stove") {
    return [
      {
        id: "model",
        label: "Model",
        choices: [
          { id: "valley", label: "Valley", price: 0, note: "12' × 15' and smaller" },
          { id: "ridge", label: "Ridge", price: Math.round(spread / 2), note: "12' × 15' to 14' × 15' · price from store" },
          { id: "peak", label: "Peak", price: spread, note: "14' × 15' and larger · price from store" },
        ],
      },
      {
        id: "options",
        label: "Options",
        choices: [
          { id: "none", label: "No extras", price: 0 },
          { id: "water-jacket", label: "Water jacket", price: 95 },
          { id: "stove-bag", label: "Stove bag", price: 75 },
          { id: "baffle", label: "Baffle", price: 59 },
        ],
      },
    ];
  }
  if (spread) {
    return [
      {
        id: "option",
        label: "Option",
        choices: [
          { id: "base", label: "Starting configuration", price: 0 },
          { id: "top", label: "Fully optioned", price: spread, note: "Exact options from the store" },
        ],
      },
    ];
  }
  return [];
}
