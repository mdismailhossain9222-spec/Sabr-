import React from "react";
import { twMerge } from "tailwind-merge";

type Variant = "glass" | "primary" | "onDark";

interface Props extends Omit<React.ComponentPropsWithoutRef<"button">, "onClick" | "type" | "children"> {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  className?: string;
  type?: "button" | "submit";
  /** When provided the component renders as an <a> (for in-page / external links). */
  href?: string;
  /** glass = default frosted glass · primary = salmon-tinted CTA · onDark = white text for video / dark backgrounds */
  variant?: Variant;
  /** Wraps the button in `.liquid-btn-wrapper` (flex-safe holder). Pass layout classes here, e.g. "mt-auto w-full". */
  wrapperClassName?: string;
}

// Frosted-glass base — the exact look from the spec.
// `group/btn` is a *named* group so a button inside a hoverable card (also a `group`) only shines when the button itself is hovered.
const BASE =
  "relative inline-block overflow-hidden group/btn rounded-full px-8 py-3.5 text-center text-sm font-medium text-[#4A3B42] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] bg-white/20 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(232,114,114,0.15),inset_0_1px_1px_rgba(255,255,255,0.9)] hover:scale-[1.03] hover:bg-white/30 hover:shadow-[0_12px_40px_rgba(232,114,114,0.25),inset_0_1px_2px_rgba(255,255,255,1)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 disabled:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4A3B42]";

const VARIANTS: Record<Variant, string> = {
  glass: "",
  primary:
    "bg-[#E87272]/75 text-white font-bold border-white/50 shadow-[0_10px_30px_rgba(232,114,114,0.4),inset_0_1px_1px_rgba(255,255,255,0.6)] hover:bg-[#E87272]/90 hover:shadow-[0_14px_44px_rgba(232,114,114,0.55),inset_0_1px_2px_rgba(255,255,255,0.8)]",
  onDark:
    "bg-white/15 text-white border-white/50 [text-shadow:0_1px_12px_rgba(74,59,66,0.35)] hover:bg-white/30 focus-visible:outline-white",
};

export default function LiquidGlassButton({
  children,
  onClick,
  className = "",
  type = "button",
  href,
  variant = "glass",
  wrapperClassName,
  disabled,
  ...rest
}: Props) {
  const classes = twMerge(BASE, VARIANTS[variant], className);

  const content = (
    <>
      {/* Liquid Inner Glow / Refraction */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/50 to-transparent opacity-0 transition-opacity duration-500 group-hover/btn:opacity-100"
      />
      {/* Shine Effect — sweeps fully across the button while hovered */}
      {!disabled && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover/btn:animate-shimmer group-hover/btn:opacity-100"
        />
      )}
      {/* Button Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </>
  );

  const element = href ? (
    <a href={href} onClick={onClick} className={classes} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
      {content}
    </a>
  ) : (
    <button type={type} onClick={onClick} disabled={disabled} className={classes} {...rest}>
      {content}
    </button>
  );

  return wrapperClassName === undefined ? element : <div className={twMerge("liquid-btn-wrapper", wrapperClassName)}>{element}</div>;
}
