"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type AtmosphereVariant = "hero" | "panel" | "strip";

type AtmospherePlaneProps = {
  variant?: AtmosphereVariant;
  className?: string;
};

export function AtmospherePlane({
  variant = "hero",
  className,
}: AtmospherePlaneProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setFinePointer(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduce || !finePointer || variant === "strip") return;
    const el = rootRef.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setOffset({ x, y });
    };

    const onLeave = () => setOffset({ x: 0, y: 0 });

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [finePointer, reduce, variant]);

  const parallax = reduce || !finePointer ? 0 : 1;

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={cn(
        "atmosphere-plane absolute inset-0 overflow-hidden",
        `atmosphere-plane--${variant}`,
        className,
      )}
    >
      <div className="atmosphere-plane__base absolute inset-0" />

      <motion.div
        className="atmosphere-plane__glow atmosphere-plane__glow--a absolute"
        animate={
          parallax
            ? { x: offset.x * 18, y: offset.y * 14 }
            : undefined
        }
        transition={{ type: "spring", stiffness: 60, damping: 20, mass: 0.4 }}
      />
      <motion.div
        className="atmosphere-plane__glow atmosphere-plane__glow--b absolute"
        animate={
          parallax
            ? { x: offset.x * -12, y: offset.y * -10 }
            : undefined
        }
        transition={{ type: "spring", stiffness: 50, damping: 22, mass: 0.45 }}
      />
      <div className="atmosphere-plane__glow atmosphere-plane__glow--c absolute" />

      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={cn(
            "atmosphere-plane__band absolute left-[-20%] right-[-20%]",
            `atmosphere-plane__band--${i}`,
          )}
          animate={
            parallax
              ? { x: offset.x * (6 + i * 3) }
              : undefined
          }
          transition={{ type: "spring", stiffness: 40, damping: 18 }}
        />
      ))}

      <div className="atmosphere-plane__grain absolute inset-0" />
      <div className="atmosphere-plane__vignette absolute inset-0" />
    </div>
  );
}
