import { useEffect, useRef, useState } from "react";

export function useInView<T extends Element = HTMLDivElement>(options: IntersectionObserverInit = { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }) {
  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || isInView) return;
    if (typeof IntersectionObserver === "undefined") { setIsInView(true); return; }
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsInView(true); obs.disconnect(); }
    }, options);
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView]);

  return { ref, isInView };
}
