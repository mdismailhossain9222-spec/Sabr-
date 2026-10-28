import { useReveal } from "./Reveal";

type Props = { text: string; className?: string; wordClassName?: string; stagger?: number; baseDelay?: number };

export default function SplitText({ text, className = "", wordClassName = "", stagger = 50, baseDelay = 0 }: Props) {
  const isInView = useReveal();
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <span
            className={`inline-block transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${isInView ? "translate-y-0" : "translate-y-full"} ${wordClassName}`}
            style={{ transitionDelay: `${baseDelay + i * stagger}ms` }}
          >
            {w}
          </span>
          {i < words.length - 1 && "\u00A0"}
        </span>
      ))}
    </span>
  );
}
