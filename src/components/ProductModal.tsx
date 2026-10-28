import { useEffect, useState } from "react";
import type { Product } from "../data/products";
import LiquidGlassButton from "./LiquidGlassButton";

type Props = { product: Product | null; onClose: () => void; onAdd: (p: Product, size: string) => void };

export default function ProductModal({ product, onClose, onAdd }: Props) {
  const [size, setSize] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!product) return;
    setSize(null);
    const raf = requestAnimationFrame(() => setVisible(true));
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const close = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  if (!product) return null;

  return (
    <div
      className={`fixed inset-0 z-[90] flex items-end justify-center bg-black/40 backdrop-blur-md transition-opacity duration-300 md:items-center md:p-6 ${visible ? "opacity-100" : "opacity-0"}`}
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-[2rem] border border-white/50 bg-lightPink/85 shadow-2xl backdrop-blur-2xl transition-all duration-300 ease-out md:rounded-[2rem] ${
          visible ? "translate-y-0 md:scale-100" : "translate-y-full md:translate-y-6 md:scale-95"
        }`}
      >
        {/* mobile grabber */}
        <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-darkText/20 md:hidden" aria-hidden="true" />
        <LiquidGlassButton
          onClick={close}
          aria-label="Close product details"
          className="absolute right-4 top-4 z-10 h-10 w-10 p-0 hover:rotate-90"
        >
          ✕
        </LiquidGlassButton>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-4 md:p-6">
            <div
              role="img"
              aria-label={`${product.name} image placeholder`}
              data-loading="lazy"
              className={`relative aspect-[4/5] w-full overflow-hidden rounded-[1.5rem] md:aspect-[3/4] ${product.id % 2 ? "bg-daisyYellow" : "bg-daisyGreen"}`}
            >
              {/* <img src="" alt={product.name} loading="lazy" className="h-full w-full object-cover" /> */}
              <span className="absolute left-4 top-4 rounded-full bg-daisyGreen px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-daisyYellow">
                {product.category}
              </span>
            </div>
          </div>

          <div className="flex flex-col px-6 pb-8 md:py-10 md:pl-2 md:pr-10">
            <p className="text-[10px] uppercase tracking-[0.5em] text-darkText/60">{product.tag} · Sabar by Simran</p>
            <h3 id="modal-title" className="editorial-heading mt-3 text-4xl md:text-5xl">{product.name}</h3>
            <p className="mt-3 text-xl font-semibold tracking-wide">AED {product.price}</p>
            <p className="mt-5 text-sm text-darkText/80" style={{ lineHeight: 1.8 }}>{product.description}</p>

            <div className="mt-8">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.3em]">Select Size</span>
                <span className="text-xs text-darkText/60 underline underline-offset-4">Size guide</span>
              </div>
              <div role="radiogroup" aria-label="Size" className="mt-4 flex flex-wrap gap-3">
                {["S", "M", "L", "XL"].map((s) => {
                  const available = product.sizes.includes(s);
                  const active = size === s;
                  return (
                    <button
                      key={s}
                      role="radio"
                      aria-checked={active}
                      aria-label={`Size ${s}${available ? "" : ", sold out"}`}
                      disabled={!available}
                      onClick={() => setSize(s)}
                      className={`h-12 w-14 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        active
                          ? "scale-105 border-2 border-[#E87272] bg-[#E87272] text-white shadow-[0_0_15px_rgba(232,114,114,0.4)]"
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
            </div>

            <LiquidGlassButton
              wrapperClassName="mt-8 w-full"
              variant={size ? "primary" : "glass"}
              disabled={!size}
              aria-label={size ? `Add ${product.name} size ${size} to cart` : "Select a size first"}
              onClick={() => {
                if (!size) return;
                onAdd(product, size);
                close();
              }}
              className={`w-full py-4 text-base font-bold tracking-wide ${size ? "animate-pulse-glow" : "text-darkText/60"}`}
            >
              {size ? `Add to Cart • AED ${product.price}` : "Select a Size"}
            </LiquidGlassButton>

            <ul className="mt-6 space-y-2 text-xs text-darkText/70">
              <li>✿ Complimentary delivery across the UAE</li>
              <li>✿ Easy 7-day exchanges</li>
              <li>✿ Cash on Delivery available</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
