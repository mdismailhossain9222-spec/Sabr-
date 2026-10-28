import { useState, type FormEvent, type ReactNode } from "react";
import Reveal from "./Reveal";
import SplitText from "./SplitText";
import LiquidGlassButton from "./LiquidGlassButton";

import type { CartItem } from "../data/products";
type PaymentId = "apple" | "google" | "card" | "cod";

const INPUT =
  "w-full bg-white/40 backdrop-blur-md border border-white/60 rounded-xl px-5 py-4 text-[#4A3B42] focus:outline-none focus:ring-2 focus:ring-[#E87272] transition-all";

const PAYMENTS: { id: PaymentId; label: string; sub: string; icon: ReactNode }[] = [
  {
    id: "apple",
    label: "Apple Pay",
    sub: "Touch / Face ID",
    icon: <path d="M16.4 12.6c0-2.4 2-3.5 2-3.6-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.8-3.5.8s-1.9-.8-3.1-.8C6.9 7.2 5 8.6 5 11.5c0 1.8.7 3.7 1.5 4.9.7 1 1.4 2 2.4 2s1.3-.6 2.6-.6 1.5.6 2.6.6 1.7-1 2.3-1.9c.7-1 1-2 1-2.1 0 0-2-.8-2-3.8zM14.5 5.5c.5-.7.9-1.6.8-2.5-.8 0-1.8.5-2.3 1.2-.5.6-.9 1.5-.8 2.4.9.1 1.8-.4 2.3-1.1z" fill="currentColor" stroke="none" />,
  },
  {
    id: "google",
    label: "Google Pay",
    sub: "One-tap checkout",
    icon: <><path d="M20 12.2c0-.6 0-1.1-.1-1.7H12v3.2h4.5a3.9 3.9 0 01-1.7 2.5v2.1h2.7c1.6-1.5 2.5-3.6 2.5-6.1z" /><path d="M12 20c2.3 0 4.2-.8 5.5-2.1l-2.7-2.1c-.7.5-1.7.8-2.8.8a4.9 4.9 0 01-4.6-3.4H4.6v2.2A8 8 0 0012 20z" /><path d="M7.4 13.2a4.8 4.8 0 010-3.1V7.9H4.6a8 8 0 000 7.3z" /><path d="M12 6.6c1.2 0 2.4.4 3.3 1.3l2.4-2.4A8 8 0 004.6 7.9l2.8 2.2A4.9 4.9 0 0112 6.6z" /></>,
  },
  {
    id: "card",
    label: "Visa / Mastercard",
    sub: "Credit & debit",
    icon: <><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 10h18M7 15h3" /></>,
  },
  {
    id: "cod",
    label: "Cash on Delivery",
    sub: "Pay at your door",
    icon: <><rect x="3" y="7" width="18" height="10" rx="2" /><circle cx="12" cy="12" r="2.5" /><path d="M6 10v4M18 10v4" /></>,
  },
];

type Props = { items: CartItem[]; setQty: (key: string, qty: number) => void; remove: (key: string) => void; clear: () => void };

export default function Checkout({ items, setQty, remove, clear }: Props) {
  const [payment, setPayment] = useState<PaymentId>("apple");
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [placed, setPlaced] = useState(false);

  const subtotal = items.reduce((n, i) => n + i.product.price * i.qty, 0);
  const count = items.reduce((n, i) => n + i.qty, 0);
  const total = subtotal;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: Stripe / Checkout API integration
    // - apple/google/card → create a Stripe PaymentIntent (currency: "aed") and confirm via Payment Request / Elements
    // - cod → POST order to backend with status "pending_cod"
    if (!items.length) return;
    console.info("Order", { items: items.map((i) => ({ name: i.product.name, size: i.size, qty: i.qty })), total, payment, ...form });
    setPlaced(true);
    clear();
    setTimeout(() => setPlaced(false), 4000);
  };

  return (
    <section id="checkout" aria-labelledby="checkout-title" className="bg-lightPink px-4 py-28 md:px-12">
      <Reveal>
        <form
          onSubmit={handleSubmit}
          className="liquid-glass-light mx-auto max-w-6xl !rounded-[2.5rem] px-5 py-10 sm:px-8 md:px-12 md:py-14"
          aria-label="Checkout form"
        >
          <div className="mb-12 text-center">
            <p className="mb-3 text-[10px] uppercase tracking-[0.5em] text-darkText/70">One-page checkout</p>
            <h2 id="checkout-title" className="editorial-heading text-4xl md:text-5xl">
              <SplitText text="Secure Checkout in AED" stagger={60} />
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            {/* LEFT: customer & payment */}
            <div>
              <h3 className="font-serif text-2xl">Customer Details</h3>
              <div className="mt-6 space-y-4">
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.2em] text-darkText/70">Full Name</span>
                  <input required className={INPUT} placeholder="Full Name" autoComplete="name" aria-label="Full name"
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.2em] text-darkText/70">Phone Number</span>
                  <input required type="tel" className={INPUT} placeholder="Phone Number (+971 5X XXX XXXX)" autoComplete="tel" aria-label="Phone number"
                    value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.2em] text-darkText/70">Delivery Address</span>
                  <textarea required rows={3} className={`${INPUT} resize-none`} placeholder="Delivery Address (Building, Street, Area, Emirate)" autoComplete="street-address" aria-label="Delivery address"
                    value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                </label>
              </div>

              <h3 className="mt-10 flex items-center gap-2 font-serif text-2xl">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" />
                </svg>
                Payment Method
              </h3>
              <div role="radiogroup" aria-label="Payment method" className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {PAYMENTS.map((p) => {
                  const active = payment === p.id;
                  return (
                    <button
                      type="button"
                      key={p.id}
                      role="radio"
                      aria-checked={active}
                      aria-label={`Pay with ${p.label}`}
                      onClick={() => setPayment(p.id)}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl p-4 text-left transition-all duration-300 hover:scale-[1.02] ${
                        active
                          ? "scale-[1.02] border-2 border-[#E87272] bg-white/60 shadow-[0_0_15px_rgba(232,114,114,0.3)]"
                          : "border border-white/50 bg-white/30"
                      }`}
                    >
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${active ? "bg-[#E87272] text-white" : "bg-daisyYellow text-darkText"}`}>
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{p.icon}</svg>
                      </span>
                      <span className="flex-1">
                        <span className="block text-sm font-semibold">{p.label}</span>
                        <span className="block text-xs text-darkText/60">{p.sub}</span>
                      </span>
                      <span className={`flex h-4 w-4 items-center justify-center rounded-full border ${active ? "border-[#E87272]" : "border-darkText/30"}`}>
                        <span className={`h-2 w-2 rounded-full bg-[#E87272] transition-transform ${active ? "scale-100" : "scale-0"}`} />
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-6 flex items-center gap-2 text-xs text-darkText/60">
                <span className="rounded-full bg-daisyGreen px-2 py-0.5 text-[10px] uppercase tracking-widest text-daisyYellow">SSL</span>
                256-bit encrypted. Direct one-page checkout for a seamless experience.
              </p>
            </div>

            {/* RIGHT: order summary */}
            <div className="lg:pt-2">
              <div className="animate-float rounded-2xl border border-white/50 bg-white/30 p-6 backdrop-blur-md">
                <h3 className="font-serif text-2xl">Order Summary</h3>

                <div className="mt-6 max-h-80 space-y-4 overflow-y-auto border-b border-darkText/10 pb-6 pr-1">
                  {items.length === 0 && (
                    <div className="rounded-xl border border-dashed border-darkText/20 py-10 text-center">
                      <p className="editorial-heading text-xl">Your bag is empty</p>
                      <a href="#collection" aria-label="Browse the collection" className="mt-3 inline-block text-xs uppercase tracking-[0.3em] underline underline-offset-4">Browse the collection</a>
                    </div>
                  )}
                  {items.map((it) => (
                    <div key={it.key} className="flex items-center gap-4 transition-all duration-300">
                      <div role="img" aria-label={`${it.product.name} thumbnail placeholder`} data-loading="lazy"
                        className={`relative h-24 w-20 shrink-0 rounded-xl ${it.product.id % 2 ? "bg-daisyYellow" : "bg-daisyGreen"}`}>
                        <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-darkText text-[10px] text-daisyYellow">{it.qty}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-serif text-lg">{it.product.name}</p>
                        <p className="text-xs uppercase tracking-widest text-darkText/60">Size {it.size}</p>
                        <div className="mt-2 flex items-center gap-3">
                          <div className="inline-flex items-center rounded-full border border-white/60 bg-white/40">
                            <button type="button" aria-label={`Decrease quantity of ${it.product.name}`} onClick={() => setQty(it.key, it.qty - 1)} disabled={it.qty <= 1}
                              className="h-8 w-8 rounded-full text-lg transition-all duration-300 hover:scale-110 active:scale-90 disabled:opacity-30">−</button>
                            <span className="w-7 text-center text-sm font-semibold" aria-live="polite">{it.qty}</span>
                            <button type="button" aria-label={`Increase quantity of ${it.product.name}`} onClick={() => setQty(it.key, it.qty + 1)}
                              className="h-8 w-8 rounded-full text-lg transition-all duration-300 hover:scale-110 active:scale-90">+</button>
                          </div>
                          <button type="button" onClick={() => remove(it.key)} aria-label={`Remove ${it.product.name} from cart`}
                            className="text-[11px] uppercase tracking-widest text-darkText/60 underline underline-offset-4 transition-colors hover:text-[#E87272]">Remove</button>
                        </div>
                      </div>
                      <p className="whitespace-nowrap text-sm font-semibold">AED {it.product.price * it.qty}</p>
                    </div>
                  ))}
                </div>

                <dl className="mt-6 space-y-3 text-sm">
                  <div className="border-t border-dashed border-[#E87272]/40"></div>
                  <div className="flex justify-between"><dt className="text-darkText/70">Subtotal ({count} {count === 1 ? "item" : "items"})</dt><dd>AED {subtotal}</dd></div>
                  <div className="flex justify-between"><dt className="text-darkText/70">Shipping</dt><dd className="text-daisyGreen font-semibold">Complimentary</dd></div>
                  <div className="flex justify-between"><dt className="text-darkText/70">VAT (incl.)</dt><dd>Included</dd></div>
                  <div className="flex items-end justify-between border-t border-dashed border-[#E87272]/40 pt-4">
                    <dt className="font-serif text-lg font-bold">Total</dt>
                    <dd className="font-serif text-2xl font-bold">AED {total}</dd>
                  </div>
                </dl>

                <LiquidGlassButton
                  wrapperClassName="mt-6 w-full"
                  type="submit"
                  variant="primary"
                  disabled={!items.length && !placed}
                  aria-label={`Place order, total AED ${total}`}
                  className="w-full bg-[#E87272] text-white font-medium text-lg py-5 rounded-2xl shadow-lg hover:-translate-y-1 transition-all disabled:animate-none"
                >
                  {placed ? "✓ Order Received — Thank you!" : `Place Order • AED ${total}`}
                </LiquidGlassButton>
                <p className="mt-4 text-center text-xs text-darkText/60">Delivery in 1–3 days across all Emirates</p>
              </div>
            </div>
          </div>
        </form>
      </Reveal>
    </section>
  );
}
