import { createContext, useContext, type CSSProperties, type ElementType, type ReactNode } from "react";
import { useInView } from "../hooks/useInView";

const RevealContext = createContext(true);
export const useReveal = () => useContext(RevealContext);

type Props = { children: ReactNode; className?: string; delay?: number; as?: ElementType; style?: CSSProperties };

export default function Reveal({ children, className = "", delay = 0, as: Tag = "div", style }: Props) {
  const { ref, isInView } = useInView<HTMLElement>();
  return (
    <RevealContext.Provider value={isInView}>
      <Tag
        ref={ref}
        style={{ transitionDelay: `${delay}ms`, ...style }}
        className={`transition-all duration-700 ease-out ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} ${className}`}
      >
        {children}
      </Tag>
    </RevealContext.Provider>
  );
}
