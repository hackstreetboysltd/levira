"use client";

import { useLayoutEffect, useRef } from "react";
import type { MotionValue } from "motion/react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "motion/react";

/** Shared route through Field → Policy → Evidence stations (viewBox 1000×700). */
export const ARC_PATH =
  "M 140 110 C 260 90, 220 260, 340 300 S 480 250, 520 360 S 620 520, 780 480 S 900 560, 860 620";

export const ARC_STATIONS = [
  { id: "field", x: 140, y: 110, at: 0 },
  { id: "policy", x: 520, y: 360, at: 1 / 3 },
  { id: "evidence", x: 860, y: 620, at: 2 / 3 },
] as const;

type ArcScrollSvgProps = {
  progress: MotionValue<number>;
  reduceMotion: boolean;
};

export function ArcScrollSvg({ progress, reduceMotion }: ArcScrollSvgProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const travelerX = useMotionValue(140);
  const travelerY = useMotionValue(110);

  const pathLength = useTransform(progress, (v) =>
    reduceMotion ? 1 : Math.min(1, Math.max(0, v)),
  );

  const placeTraveler = (v: number) => {
    const path = pathRef.current;
    if (!path) return;
    const t = reduceMotion ? 1 : Math.min(1, Math.max(0, v));
    const len = path.getTotalLength();
    if (len <= 0) return;
    const pt = path.getPointAtLength(t * len);
    travelerX.set(pt.x);
    travelerY.set(pt.y);
  };

  useLayoutEffect(() => {
    placeTraveler(progress.get());
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount sample only
  }, []);

  useMotionValueEvent(progress, "change", placeTraveler);

  const travelerOpacity = useTransform(progress, (v) =>
    reduceMotion ? 1 : v < 0.02 ? v / 0.02 : 1,
  );

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1000 700"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <path
        d={ARC_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        className="text-cyan/20"
      />

      <motion.path
        ref={pathRef}
        d={ARC_PATH}
        fill="none"
        stroke="#2ec4bc"
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ pathLength }}
      />

      {ARC_STATIONS.map((station) => (
        <StationDot
          key={station.id}
          x={station.x}
          y={station.y}
          unlockAt={station.at}
          progress={progress}
          reduceMotion={reduceMotion}
        />
      ))}

      <motion.circle
        r={9}
        fill="#b8893d"
        stroke="#f7fbfa"
        strokeWidth={2}
        style={{
          cx: travelerX,
          cy: travelerY,
          opacity: travelerOpacity,
        }}
      />
    </svg>
  );
}

function StationDot({
  x,
  y,
  unlockAt,
  progress,
  reduceMotion,
}: {
  x: number;
  y: number;
  unlockAt: number;
  progress: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const scale = useTransform(progress, (v) => {
    if (reduceMotion) return 1;
    const t = (v - unlockAt) / 0.08;
    return Math.min(1, Math.max(0.15, t));
  });
  const opacity = useTransform(progress, (v) => {
    if (reduceMotion) return 1;
    if (v < unlockAt - 0.04) return 0.25;
    return Math.min(1, Math.max(0.25, (v - unlockAt + 0.04) / 0.08));
  });

  return (
    <motion.circle
      cx={x}
      cy={y}
      r={7}
      fill="#b8893d"
      stroke="#f7fbfa"
      strokeWidth={2}
      style={{
        scale,
        opacity,
        transformBox: "fill-box",
        transformOrigin: "center",
      }}
    />
  );
}
