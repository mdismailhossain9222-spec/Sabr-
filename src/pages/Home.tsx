import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Reveal from "../components/Reveal";
import SplitText from "../components/SplitText";
import Checkout from "../components/Checkout";
import ProductModal from "../components/ProductModal";
import LiquidGlassButton from "../components/LiquidGlassButton";
import { PRODUCTS, CATEGORIES, type Product, type CartItem } from "../data/products";

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const daisySvg = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'><g transform='translate(30 30)' fill='#F09DBB'>${[0, 60, 120, 180, 240, 300]
    .map((r) => `<ellipse cx='0' cy='-9' rx='4.5' ry='8' transform='rotate(${r})'/>`)
    .join("")}<circle r='4' fill='#FBF8CE'/></g><g transform='translate(90 88) scale(.7)' fill='#9EB79B'>${[0, 72, 144, 216, 288]
    .map((r) => `<ellipse cx='0' cy='-9' rx='4.5' ry='8' transform='rotate(${r})'/>`)
    .join("")}<circle r='4' fill='#FBF8CE'/></g></svg>`
);

/* ------------------------------------------------------------------ */
/*  Small presentational pieces                                        */
/* ------------------------------------------------------------------ */

/** Page-width container used by every content section. */
function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl overflow-x-clip px-4 md:px-8 ${className}`}>{children}</div>;
}

function SectionHeading({ eyebrow, title, id }: { eyebrow: string; title: string; id: string }) {
  return (
    <Reveal className="text-center">
      <p className="mb-4 text-[10px] uppercase tracking-[0.5em] text-darkText/70">{eyebrow}</p>
      <h2 id={id} className="editorial-heading text-5xl md:text-7xl">
        <SplitText text={title} stagger={90} />
      </h2>
    </Reveal>
  );
}

function Daisy({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="-20 -20 40 40" className={className} style={style} aria-hidden="true">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((r) => (
        <ellipse key={r} cx="0" cy="-10" rx="4.5" ry="9" fill="#FBF8CE" transform={`rotate(${r})`} />
      ))}
      <circle r="5" fill="#F4C3D1" stroke="#FBF8CE" strokeWidth="1" />
    </svg>
  );
}

function Flamingo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
      <path d="M13 6c0-2 2-3 3.5-2.5S18 6 16.5 7.5 13 11 14 14s5 3 6 6-2 5-5 5-5-2-5-4" />
      <path d="M13 6l-2.5 1.5L13 8" />
      <path d="M15 25v5M15 27l3 1" />
    </svg>
  );
}

const IconCart = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M6 7h12l-1 13H7L6 7z" /><path d="M9 7a3 3 0 016 0" />
  </svg>
);

const IconSearch = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-darkText/70" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [bump, setBump] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>({});
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const cartCount = cart.reduce((n, i) => n + i.qty, 0);
  const filtered = PRODUCTS.filter(
    (p) => (category === "All" || p.category === category) && p.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToId = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const addToCart = (p: Product, size: string) => {
    // TODO: Stripe / Checkout API integration — sync cart with backend / Stripe line items here
    const key = `${p.id}-${size}`;
    setCart((c) => {
      const found = c.find((i) => i.key === key);
      return found ? c.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i)) : [...c, { key, product: p, size, qty: 1 }];
    });
    setBump(true);
    setTimeout(() => setBump(false), 400);
    setToast(`${p.name} (${size}) added to your bag`);
  };
  const setItemQty = (key: string, qty: number) =>
    setCart((c) => c.map((i) => (i.key === key ? { ...i, qty: Math.max(1, Math.min(10, qty)) } : i)));
  const removeItem = (key: string) => setCart((c) => c.filter((i) => i.key !== key));

  const navLinks = ["Collection", "Story", "Contact"];

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-lightPink font-sans text-darkText pt-32">
      {/* INTRO — portal keeps it above the other z-50 controls */}
      {createPortal(
        <div
          aria-hidden={!showIntro}
          className={`fixed inset-0 z-50 bg-[#FCE4EC] flex origin-center items-center justify-center transition-all duration-700 ease-in-out motion-reduce:scale-100 motion-reduce:transition-none ${
            showIntro ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-[1.03] pointer-events-none"
          }`}
        >
          <video className="absolute inset-0 h-full w-full object-cover" autoPlay muted playsInline preload="none" aria-label="Sabar by Simran intro video" />
          <div className="relative animate-intro-logo text-center transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:animate-none">
            <Flamingo className="mx-auto mb-4 h-14 w-14 text-darkText" />
            <p className="editorial-heading text-5xl text-darkText">Sabar</p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.5em] text-darkText/60">by Simran</p>
          </div>
        </div>,
        document.body
      )}

      {/* NAVBAR */}
      <header className={`fixed inset-x-0 z-40 px-4 transition-all duration-500 ${scrolled ? "top-2" : "top-4"}`}>
        <nav
          aria-label="Main navigation"
          className={`liquid-glass-light mx-auto flex max-w-6xl animate-fade-down items-center justify-between px-5 transition-all duration-500 md:px-8 ${scrolled ? "py-2" : "py-3"} ${scrolled ? "!bg-white/75" : ""}`}
        >
          <a href="#top" aria-label="Sabar by Simran home" className="group flex items-center gap-2">
            <Flamingo className="h-6 w-6 text-darkText transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110" />
            <span className="editorial-heading text-2xl text-darkText">Sabar</span>
            <span className="hidden text-[9px] uppercase tracking-[0.35em] text-darkText/60 sm:inline">by Simran</span>
          </a>
          <ul className="hidden items-center gap-10 md:flex">
            {navLinks.map((l, i) => (
              <li key={l} className="animate-fade-down" style={{ animationDelay: `${300 + i * 120}ms` }}>
                <a
                  href={`#${l.toLowerCase()}`}
                  aria-label={`Go to ${l}`}
                  className="group relative text-[11px] uppercase tracking-[0.35em] text-darkText/80 transition-colors hover:text-darkText"
                >
                  {l}
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-darkText transition-transform duration-500 group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>
          <div className="flex animate-fade-down items-center gap-3 [animation-delay:650ms]">
            <label className="sr-only" htmlFor="currency">Currency</label>
            <select id="currency" aria-label="Select currency" className="cursor-pointer rounded-full bg-transparent px-2 py-1 text-[11px] uppercase tracking-[0.25em] outline-none">
              <option>AED</option>
            </select>
            <button
              aria-label={`Cart, ${cartCount} items. Go to checkout`}
              onClick={() => scrollToId("checkout")}
              className={`relative rounded-full p-2 text-darkText transition-all duration-300 hover:scale-110 active:scale-95 ${bump ? "scale-125 -rotate-12" : ""}`}
            >
              <IconCart />
              {cartCount > 0 && (
                <span className={`absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#E87272] text-[9px] font-bold text-white ring-2 ring-white/70 transition-transform duration-300 ${bump ? "scale-150" : "scale-100"}`}>
                  {cartCount}
                </span>
              )}
            </button>
            <button aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)} className="p-2 md:hidden">
              <span className={`block h-px w-5 bg-darkText transition-transform duration-300 ${menuOpen ? "translate-y-[3.5px] rotate-45" : ""}`} />
              <span className={`mt-1.5 block h-px w-5 bg-darkText transition-transform duration-300 ${menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
            </button>
          </div>
        </nav>
        <ul
          className={`liquid-glass-light mx-auto mt-2 flex max-w-6xl flex-col items-center gap-4 !rounded-3xl py-6 transition-all duration-500 md:hidden ${
            menuOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-4 opacity-0"
          }`}
        >
          {navLinks.map((l) => (
            <li key={l}>
              <a href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)} aria-label={`Go to ${l}`} className="text-xs uppercase tracking-[0.35em]">{l}</a>
            </li>
          ))}
        </ul>
      </header>

      <main id="top" className="w-full break-words">
        {/* ============ HERO — full-bleed video; pt-32 keeps its text clear of the floating navbar ============ */}
        <section aria-labelledby="hero-title" className="relative flex min-h-[90vh] w-full items-center justify-center overflow-hidden bg-mainPink px-4 pb-20 pt-32 md:min-h-screen">
          {/* Landscape hero video — add your src */}
          <video
            src="/1.mp4"
            poster="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920"
            className="absolute inset-0 z-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            aria-label="Sabar by Simran campaign video"
          />
          <div className="absolute inset-0 z-10 bg-black/30" aria-hidden="true" />
          <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(74,59,66,0.45)_100%)]" aria-hidden="true" />
          <div className="absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-[#4A3B42]/40 to-transparent" aria-hidden="true" />

          <Reveal className="relative z-20 text-center">
            <p className="mb-8 text-[10px] uppercase tracking-[0.6em] text-white/85 drop-shadow">Sabar by Simran — Spring / Summer 2026</p>
            <h1
              id="hero-title"
              className="editorial-heading text-4xl leading-[0.95] text-white drop-shadow-[0_4px_24px_rgba(74,59,66,0.45)] sm:text-7xl md:text-8xl lg:text-[9rem]"
            >
              <SplitText text="Redefining" stagger={80} baseDelay={150} />
              <br />
              <SplitText text="Elegance." stagger={80} baseDelay={350} />
            </h1>
            <Reveal delay={600}>
              <p className="mx-auto mt-8 max-w-xl text-base leading-[1.8] text-white/90 drop-shadow md:text-lg">
                Premium clothing crafted for the modern UAE lifestyle.
              </p>
            </Reveal>
            <Reveal delay={800} className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <LiquidGlassButton
                wrapperClassName=""
                href="#collection"
                aria-label="Explore the collection"
                variant="onDark"
                className="px-10 py-4 text-xs font-semibold uppercase tracking-[0.3em]"
              >
                Explore Collection <span aria-hidden="true">→</span>
              </LiquidGlassButton>
              <LiquidGlassButton
                wrapperClassName=""
                href="#story"
                aria-label="Read our story"
                variant="onDark"
                className="px-10 py-4 text-xs font-semibold uppercase tracking-[0.3em]"
              >
                Our Story
              </LiquidGlassButton>
            </Reveal>
          </Reveal>

          <a href="#looks" aria-label="Scroll to the editorial" className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/80 md:flex">
            <span className="text-[9px] uppercase tracking-[0.5em]">Scroll</span>
            <span className="h-10 w-px animate-pulse bg-white/70" />
          </a>
        </section>

        {/* ============ SECTION 2 — SHOP THE COLLECTION ============ */}
        <section id="collection" aria-labelledby="collection-title" className="w-full scroll-mt-28 py-24 md:py-32">
          <Container>
            <SectionHeading id="collection-title" eyebrow="Curated Pieces" title="Shop the Collection" />

            {/* Search & filter bar */}
            <Reveal className="mx-auto mt-12 flex w-full max-w-2xl flex-col items-stretch gap-6 sm:flex-row">
              <label className="liquid-glass-light flex w-full items-center gap-3 px-6 py-4 transition-all duration-300 focus-within:shadow-[0_0_0_3px_rgba(232,114,114,0.35)]">
                <IconSearch />
                <span className="sr-only">Search products</span>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  aria-label="Search products by name"
                  className="w-full min-w-0 bg-transparent text-sm placeholder-darkText/50 outline-none"
                />
                {query && (
                  <button onClick={() => setQuery("")} aria-label="Clear search" className="text-darkText/60 transition-all duration-300 hover:rotate-90 hover:text-darkText">✕</button>
                )}
              </label>

              <div role="tablist" aria-label="Filter by category" className="flex flex-wrap justify-center gap-3">
                {CATEGORIES.map((c) => {
                  const active = category === c;
                  return (
                    <LiquidGlassButton
                      key={c}
                      wrapperClassName=""
                      role="tab"
                      aria-selected={active}
                      aria-label={`Show ${c}`}
                      onClick={() => setCategory(c)}
                      className={`px-5 py-2 text-[11px] uppercase tracking-[0.25em] ${active ? "border-darkText bg-darkText text-daisyYellow hover:bg-darkText" : ""}`}
                    >
                      {c}
                    </LiquidGlassButton>
                  );
                })}
              </div>
              <p className="text-center text-xs text-darkText/60" aria-live="polite">
                Showing {filtered.length} of {PRODUCTS.length} pieces
              </p>
            </Reveal>

            {filtered.length === 0 && (
              <div className="liquid-glass-light mx-auto mt-12 flex max-w-md flex-col items-center !rounded-3xl px-8 py-12 text-center">
                <p className="editorial-heading text-3xl">No pieces found</p>
                <p className="mt-2 text-sm text-darkText/70">Try another search or category.</p>
                <LiquidGlassButton
                  wrapperClassName="mt-6"
                  onClick={() => { setQuery(""); setCategory("All"); }}
                  aria-label="Reset filters"
                  className="text-xs uppercase tracking-[0.3em]"
                >
                  Reset filters
                </LiquidGlassButton>
              </div>
            )}

            {/* Product grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full mt-8">
              {filtered.map((p, i) => {
                const chosenSize = selectedSizes[p.id];
                // Map product name to actual image file
                const imageMap: Record<string, string> = {
                  "The Black Swan": "/The Black Swan.png",
                  "The Éclat": "/The Éclat.png",
                  "The Espresso": "/The Espresso.png",
                  "The Coco": "/The Coco.png",
                };
                const imageSrc = imageMap[p.name];
                return (
                  <Reveal key={p.id} delay={(i % 4) * 120} className="h-full">
                    <article className="flex flex-col h-full bg-white/40 backdrop-blur-md rounded-3xl p-4 border border-white/50 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(232,114,114,0.2)]">
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt={p.name}
                          loading="lazy"
                          draggable={false}
                          className="aspect-[3/4] w-full rounded-2xl object-cover mb-4"
                        />
                      ) : (
                        <div
                          role="img"
                          aria-label={`${p.name} product image placeholder`}
                          data-loading="lazy"
                          className={`mb-4 aspect-[3/4] w-full rounded-2xl object-cover ${p.id % 2 ? "bg-daisyYellow" : "bg-daisyGreen"}`}
                        />
                      )}
                      <p className="text-[10px] uppercase tracking-[0.3em] text-darkText/60">{p.category}</p>
                      <h3 className="mt-1 editorial-heading text-xl not-italic">{p.name}</h3>
                      <p className="mt-1 text-sm tracking-widest text-darkText/70">AED {p.price}</p>

                      {/* Size selector */}
                      <div role="radiogroup" aria-label={`Size for ${p.name}`} className="mt-4 flex gap-2">
                        {["S", "M", "L", "XL"].map((s) => {
                          const available = p.sizes.includes(s);
                          const active = chosenSize === s;
                          return (
                            <button
                              key={s}
                              type="button"
                              role="radio"
                              aria-checked={active}
                              aria-label={`Size ${s}${available ? "" : ", sold out"}`}
                              disabled={!available}
                              onClick={() => setSelectedSizes((m) => ({ ...m, [p.id]: s }))}
                              className={`h-10 w-11 rounded-xl text-xs font-semibold transition-all duration-300 ${
                                active
                                  ? "border-2 border-[#E87272] bg-[#E87272] text-white shadow-[0_0_12px_rgba(232,114,114,0.4)]"
                                  : available
                                  ? "border border-white/60 bg-white/40 hover:scale-105 hover:border-[#E87272]"
                                  : "cursor-not-allowed border border-white/40 bg-white/20 text-darkText/30 line-through"
                              }`}
                            >
                              {s}
                            </button>
                          );
                        })}
                      </div>

                      {/* Order Now — disabled until a size is picked */}
                      <LiquidGlassButton
                        wrapperClassName={`mt-auto w-full pt-5 ${chosenSize ? "" : "opacity-50 cursor-not-allowed"}`}
                        variant={chosenSize ? "primary" : "glass"}
                        disabled={!chosenSize}
                        onClick={() => {
                          if (!chosenSize) return;
                          addToCart(p, chosenSize);
                        }}
                        aria-label={chosenSize ? `Order ${p.name}, size ${chosenSize}, for AED ${p.price}` : `Select a size to order ${p.name}`}
                        className="w-full py-3 text-[11px] uppercase tracking-[0.3em]"
                      >
                        {chosenSize ? "Order Now" : "Select a Size"}
                      </LiquidGlassButton>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </Container>
        </section>

        {/* ============ STORY ============ */}
        <section id="story" aria-labelledby="story-title" className="relative w-full scroll-mt-28 overflow-hidden bg-daisyYellow py-24 md:py-32">
          <div className="pointer-events-none absolute inset-0 opacity-[0.35]" style={{ backgroundImage: `url("data:image/svg+xml,${daisySvg}")` }} aria-hidden="true" />
          <Container className="relative">
            <div className="flex flex-col items-center gap-16 md:flex-row">
              <Reveal className="md:w-1/2">
                <p className="mb-4 text-[10px] uppercase tracking-[0.5em] text-darkText/70">Our Story</p>
                <h2 id="story-title" className="editorial-heading text-5xl leading-tight md:text-6xl">
                  <SplitText text="Crafted for the bold." stagger={70} />
                </h2>
                <Reveal delay={300}>
                  <p className="mt-8 max-w-lg text-darkText/80" style={{ lineHeight: 1.8 }}>
                    Sabar — meaning patience — is born from the belief that true elegance is never rushed. Each piece is
                    thoughtfully designed by Simran, balancing timeless silhouettes with the vibrant spirit of the Emirates.
                  </p>
                  <p className="mt-5 max-w-lg text-darkText/80" style={{ lineHeight: 1.8 }}>
                    Like the flamingo, our woman stands tall, graceful and unapologetically herself — from Dubai's golden
                    evenings to Abu Dhabi's quiet mornings.
                  </p>
                  <p className="editorial-heading mt-8 text-2xl text-darkText">— Simran</p>
                </Reveal>
              </Reveal>
              <Reveal delay={200} className="w-full md:w-1/2">
                <div className="liquid-glass-light !rounded-[2.5rem] p-4">
                  <div role="img" aria-label="Brand story image placeholder" data-loading="lazy" className="aspect-square w-full rounded-[2rem] bg-mainPink" />
                </div>
              </Reveal>
            </div>
          </Container>
        </section>

        {/* ============ CHECKOUT ============ */}
        <div className="scroll-mt-28">
          <Checkout items={cart} setQty={setItemQty} remove={removeItem} clear={() => setCart([])} />
        </div>
      </main>

      {/* ============ FOOTER ============ */}
      <footer id="contact" className="w-full scroll-mt-28 border-t border-white/40 bg-mainPink py-20">
        <Container>
          <Reveal className="flex flex-col items-center gap-10 text-center">
            <a href="#top" aria-label="Back to top" className="group flex items-center gap-3">
              <Flamingo className="h-8 w-8 text-darkText transition-transform duration-500 group-hover:-rotate-12" />
              <span className="editorial-heading text-4xl text-darkText">
                Sabar <span className="text-2xl text-darkText/70">by Simran</span>
              </span>
            </a>
            <nav aria-label="Footer navigation">
              <ul className="flex flex-wrap justify-center gap-8">
                {["Customer Care", "Store Policies", "Order Tracking"].map((l) => (
                  <li key={l}>
                    <a href="#" aria-label={l} className="group relative text-[11px] uppercase tracking-[0.3em] text-darkText/80">
                      {l}
                      <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-darkText transition-transform duration-500 group-hover:scale-x-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex gap-4">
              {[
                { label: "Instagram", icon: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" /></> },
                { label: "TikTok", icon: <path d="M14 3v11a4 4 0 11-4-4M14 3c0 3 2 5 5 5" /> },
                { label: "WhatsApp", icon: <path d="M4 20l1.3-4A8 8 0 1112 20a8 8 0 01-4-1z" /> },
              ].map((s) => (
                <LiquidGlassButton key={s.label} wrapperClassName="" href="#" aria-label={s.label} className="h-10 w-10 p-0">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">{s.icon}</svg>
                </LiquidGlassButton>
              ))}
            </div>
            <p className="text-xs tracking-wider text-darkText/60">© 2026 Sabar by Simran. All rights reserved.</p>
          </Reveal>
        </Container>
      </footer>

      <ProductModal product={modalProduct} onClose={() => setModalProduct(null)} onAdd={addToCart} />

      {/* TOAST */}
      <div
        role="status"
        aria-live="polite"
        className={`fixed bottom-24 left-1/2 z-[95] flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-3 rounded-full border border-white/60 bg-darkText/90 px-5 py-3 text-sm text-daisyYellow shadow-2xl backdrop-blur-xl transition-all duration-500 md:bottom-6 ${
          toast ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
        }`}
      >
        <Daisy className="h-5 w-5 shrink-0 animate-spin-slow" />
        <span className="truncate">{toast}</span>
        <LiquidGlassButton
          wrapperClassName="shrink-0"
          variant="primary"
          onClick={() => scrollToId("checkout")}
          aria-label="View bag and checkout"
          className="px-3 py-1 text-[10px] uppercase tracking-widest"
        >
          View Bag
        </LiquidGlassButton>
      </div>
    </div>
  );
}
