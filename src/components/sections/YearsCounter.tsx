"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type YearsCounterProps = {
  to: number;
  className?: string;
  suffix?: string;
};

export function YearsCounter({
  to,
  className,
  suffix = "+",
}: YearsCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  // Always start at 0 so SSR and the first client paint match (reduce is null→bool).
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    if (reduce) {
      const id = requestAnimationFrame(() => setValue(to));
      return () => cancelAnimationFrame(id);
    }

    const durationMs = 1400;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * to));
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduce, to]);

  return (
    <span
      ref={ref}
      aria-label={`${to}${suffix} years`}
      className={cn(
        "inline-flex items-baseline font-display font-bold tabular-nums tracking-tight text-cyan",
        className,
      )}
    >
      <span aria-hidden>
        {value}
        {suffix}
      </span>
    </span>
  );
}
