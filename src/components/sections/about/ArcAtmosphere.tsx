"use client";

import type { MotionValue } from "motion/react";
import { motion, useTransform } from "motion/react";

type ArcAtmosphereProps = {
  progress: MotionValue<number>;
  reduceMotion: boolean;
};

/**
 * Continuous mist → deep → paper wash plus a rising water plane.
 * Washes stay translucent so the scrolling WASH underlay reads through evenly.
 * All values scrub from scroll progress (no discrete snaps).
 */
export function ArcAtmosphere({ progress, reduceMotion }: ArcAtmosphereProps) {
  // Cap below 1 so the underlay photo stays visible (Evidence-panel opacity).
  const mistOpacity = useTransform(progress, [0, 0.28, 0.42], [0.72, 0.72, 0]);
  const deepOpacity = useTransform(
    progress,
    [0.22, 0.36, 0.58, 0.72],
    [0, 0.82, 0.82, 0],
  );
  const paperOpacity = useTransform(progress, [0.58, 0.72, 1], [0, 0.72, 0.72]);

  const waterScale = useTransform(progress, (v) =>
    reduceMotion ? 0.35 : 0.08 + v * 0.78,
  );
  const waterOpacity = useTransform(progress, (v) =>
    reduceMotion ? 0.12 : 0.1 + v * 0.22,
  );
  const surfaceTop = useTransform(progress, [0, 1], ["92%", "18%"]);
  const surfaceOpacity = useTransform(progress, [0, 0.15, 1], [0, 0.6, 0.85]);

  if (reduceMotion) {
    return (
      <div className="pointer-events-none absolute inset-0 bg-mist" aria-hidden />
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute inset-0 bg-mist"
        style={{ opacity: mistOpacity }}
      />
      <motion.div
        className="absolute inset-0 bg-deep"
        style={{ opacity: deepOpacity }}
      />
      <motion.div
        className="absolute inset-0 bg-paper"
        style={{ opacity: paperOpacity }}
      />

      <motion.div
        className="absolute inset-x-0 bottom-0 h-full origin-bottom"
        style={{
          scaleY: waterScale,
          opacity: waterOpacity,
          background:
            "linear-gradient(180deg, color-mix(in srgb, #2ec4bc 35%, transparent), color-mix(in srgb, #061a2a 55%, #2ec4bc))",
        }}
      />

      <motion.div
        className="absolute inset-x-0 h-px bg-cyan/40"
        style={{
          top: surfaceTop,
          opacity: surfaceOpacity,
        }}
      />
    </div>
  );
}
