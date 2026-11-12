"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { formatPrice } from "@/content/catalog";
import { Button, Icon } from "./ui";

export type CartLine = { id: string; name: string; price: number; qty: number; options?: string[]; href: string };

type Ctx = {
  lines: CartLine[];
  count: number;
  total: number;
  add: (l: Omit<CartLine, "qty">) => void;
  remove: (id: string) => void;
  open: () => void;
  toast: string | null;
};

const CartCtx = createContext<Ctx | null>(null);
export const useCart = () => {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
};

const KEY = "dt-cart";

/**
 * Cart drawer on the main site (ch. 15). Lines are held in the browser and
 * handed to the WooCommerce Store API cart at checkout once the Phase 1 spike
 * confirms add-on pricing through the API.
 */
export function CartProvider({ children, checkoutUrl }: { children: React.ReactNode; checkoutUrl: string }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  }, [lines]);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (isOpen && !d.open) d.showModal();
    if (!isOpen && d.open) {
      d.close();
      opener.current?.focus();
    }
  }, [isOpen]);

  const add = useCallback((l: Omit<CartLine, "qty">) => {
    setLines((prev) => {
      const hit = prev.find((p) => p.id === l.id);
      return hit ? prev.map((p) => (p.id === l.id ? { ...p, qty: p.qty + 1 } : p)) : [...prev, { ...l, qty: 1 }];
    });
    setToast(`${l.name} added to cart`);
    window.setTimeout(() => setToast(null), 3500);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      lines,
      count: lines.reduce((s, l) => s + l.qty, 0),
      total: lines.reduce((s, l) => s + l.qty * l.price, 0),
      add,
      remove: (id) => setLines((p) => p.filter((l) => l.id !== id)),
      open: () => {
        opener.current = document.activeElement as HTMLElement;
        setOpen(true);
      },
      toast,
    }),
    [lines, add, toast],
  );

  return (
    <CartCtx.Provider value={value}>
      {children}
      <dialog
        ref={dialog}
        aria-labelledby="cart-title"
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === dialog.current && setOpen(false)}
        className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-dvh w-full max-w-md bg-snow p-0 text-charcoal backdrop:bg-charcoal/50"
        style={{ zIndex: 60 }}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-line p-4">
            <h2 id="cart-title" className="text-[26px]">
              Your cart
            </h2>
            <button className="grid size-11 place-items-center rounded-md hover:bg-canvas" onClick={() => setOpen(false)}>
              <Icon name="close" />
              <span className="sr-only">Close cart</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4" aria-live="polite">
            {lines.length === 0 ? (
              <div className="py-12 text-center">
                <p className="mb-4 text-stone">Your cart is empty.</p>
                <a className="font-semibold text-pine underline" href="/hunting/packages/">
                  See our most popular hunt camp packages
                </a>
              </div>
            ) : (
              <ul className="divide-y divide-line">
                {lines.map((l) => (
                  <li key={l.id} className="flex gap-3 py-4">
                    <div className="flex-1">
                      <a href={l.href} className="font-semibold hover:underline">
                        {l.name}
                      </a>
                      {l.options && <p className="mt-1 text-[13px] leading-5 text-stone">{l.options.join(" · ")}</p>}
                      <p className="data mt-1">
                        {l.qty} × {formatPrice(l.price)}
                      </p>
                    </div>
                    <button className="self-start text-[13px] text-stone underline" onClick={() => value.remove(l.id)}>
                      Remove<span className="sr-only"> {l.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {lines.length > 0 && (
            <div className="border-t border-line p-4">
              <p className="mb-1 flex justify-between font-semibold">
                <span>Subtotal</span>
                <span className="data text-[16px]">{formatPrice(value.total)}</span>
              </p>
              <p className="mb-4 text-[13px] text-stone">
                Shipping, coupons, gift certificates and the optional conservation donation are added at checkout.
              </p>
              <Button className="w-full" onClick={() => (window.location.href = checkoutUrl)}>
                Checkout
              </Button>
            </div>
          )}
        </div>
      </dialog>
      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-20 z-[80] flex justify-center px-4 md:bottom-6">
        {toast && <p className="pointer-events-auto rounded-md bg-charcoal px-4 py-3 text-[15px] text-bone shadow-2">{toast}</p>}
      </div>
    </CartCtx.Provider>
  );
}

export function CartButton() {
  const { count, open } = useCart();
  return (
    <button onClick={open} className="relative grid size-11 place-items-center rounded-md hover:bg-black/5">
      <Icon name="cart" />
      <span className="sr-only">Cart, {count} items</span>
      {count > 0 && (
        <span aria-hidden className="absolute right-1 top-1 grid min-w-5 place-items-center rounded-full bg-tan px-1 text-[11px] font-bold text-ink">
          {count}
        </span>
      )}
    </button>
  );
}

export function AddToCart({ line, label = "Add to cart", className = "" }: { line: Omit<CartLine, "qty">; label?: string; className?: string }) {
  const { add } = useCart();
  return (
    <Button className={className} onClick={() => add(line)}>
      {label}
    </Button>
  );
}
