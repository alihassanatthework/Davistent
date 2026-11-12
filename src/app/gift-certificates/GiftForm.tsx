"use client";

import { useState } from "react";
import { formatPrice } from "@/content/catalog";
import { useCart } from "@/components/Cart";
import { Button } from "@/components/ui";

const amounts = [50, 100, 250, 500, 750, 1000, 2500];

export function GiftForm() {
  const [amount, setAmount] = useState(100);
  const [when, setWhen] = useState<"now" | "date">("now");
  const [date, setDate] = useState("");
  const { add } = useCart();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        add({ id: `gift-${amount}-${when}-${date}`, name: `Gift certificate ${formatPrice(amount)}`, price: amount, href: "/gift-certificates/", options: [when === "now" ? "Deliver now" : `Deliver on ${date}`] });
      }}
      className="space-y-6"
    >
      <fieldset>
        <legend className="mb-2 font-semibold">Amount</legend>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {amounts.map((a) => (
            <label key={a} className={`flex min-h-12 cursor-pointer items-center justify-center rounded-md border font-semibold has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-pine ${amount === a ? "border-pine bg-pine text-snow" : "border-line"}`}>
              <input type="radio" name="amount" className="sr-only" checked={amount === a} onChange={() => setAmount(a)} />
              <span className="data">{formatPrice(a)}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-2 font-semibold">Delivery</legend>
        <label className="flex min-h-11 items-center gap-3">
          <input type="radio" name="when" checked={when === "now"} onChange={() => setWhen("now")} className="size-5 accent-[#1F3A2E]" /> Deliver now
        </label>
        <label className="flex min-h-11 items-center gap-3">
          <input type="radio" name="when" checked={when === "date"} onChange={() => setWhen("date")} className="size-5 accent-[#1F3A2E]" /> On a chosen date
        </label>
        {when === "date" && (
          <label className="mt-2 block">
            <span className="text-[14px]">Delivery date</span>
            <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block h-12 rounded-md border border-line px-3" />
          </label>
        )}
      </fieldset>
      <Button type="submit">Add {formatPrice(amount)} gift certificate</Button>
    </form>
  );
}
