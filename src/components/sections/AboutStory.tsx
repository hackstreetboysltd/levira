"use client";

import { useCallback, useRef, useState } from "react";
import {
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { AssignmentArc } from "@/components/sections/about/AssignmentArc";
import { AboutChapter } from "@/components/sections/about/AboutChapter";
import { ArcAtmosphere } from "@/components/sections/about/ArcAtmosphere";
import { ArcScrollSvg } from "@/components/sections/about/ArcScrollSvg";
import { ArcScrollUnderlay } from "@/components/sections/about/ArcScrollUnderlay";
import { about } from "@/content/levira";

const CHAPTER_TONES = ["mist", "deep", "paper"] as const;

/** Progress windows → opacity for each chapter (overlap for crossfade). */
const OPACITY_WINDOWS: [number, number, number, number][] = [
  [0, 0, 0.28, 0.38],
  [0.28, 0.38, 0.62, 0.72],
  [0.62, 0.72, 1, 1],
];

function bandIndex(progress: number, stages: number) {
  return Math.min(
    stages - 1,
    Math.max(0, Math.floor(progress * stages + 0.001)),
  );
}

function useChapterScrub(progress: MotionValue<number>, index: number) {
  const window = OPACITY_WINDOWS[index] ?? OPACITY_WINDOWS[0];
  const opacityOut: number[] =
    index === 0 ? [1, 1, 1, 0] : index === 2 ? [0, 1, 1, 1] : [0, 1, 1, 0];
  const yOut: number[] =
    index === 0 ? [0, 0, 0, -16] : index === 2 ? [18, 0, 0, 0] : [18, 0, 0, -16];
  const opacity = useTransform(progress, window, opacityOut);
  const y = useTransform(progress, window, yOut);
  return { opacity, y };
}

export function AboutStory() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    restDelta: 0.001,
  });

  useMotionValueEvent(smooth, "change", (value) => {
    if (reduce) return;
    const next = bandIndex(value, about.arc.length);
    setActiveIndex((prev) => (prev === next ? prev : next));
  });

  const fieldScrub = useChapterScrub(smooth, 0);
  const policyScrub = useChapterScrub(smooth, 1);
  const evidenceScrub = useChapterScrub(smooth, 2);
  const scrubs = [fieldScrub, policyScrub, evidenceScrub];

  const onDark = activeIndex === 1;

  const scrollToBand = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) return;
      const stages = about.arc.length;
      const clamped = Math.min(stages - 1, Math.max(0, index));
      const rect = track.getBoundingClientRect();
      const trackTop = window.scrollY + rect.top;
      const scrollable = Math.max(1, track.offsetHeight - window.innerHeight);
      // Land mid-band so the chapter is fully visible
      const targetProgress = (clamped + 0.35) / stages;
      const top = trackTop + targetProgress * scrollable;
      setActiveIndex(clamped);
      window.scrollTo({
        top,
        behavior: reduce ? "auto" : "smooth",
      });
    },
    [reduce],
  );

  const onSelectStacked = useCallback(
    (index: number) => {
      const stage = about.arc[index];
      if (!stage) return;
      const el = document.getElementById(`about-chapter-${stage.id}`);
      if (!el) return;
      setActiveIndex(index);
      el.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
    },
    [reduce],
  );

  if (reduce) {
    return (
      <div className="relative w-full">
        <div className="border-b border-deep/10 bg-paper/90 px-4 py-3 safe-px sm:px-6">
          <div className="mx-auto max-w-6xl">
            <AssignmentArc
              activeIndex={activeIndex}
              reduceMotion
              onSelect={onSelectStacked}
              embedded
              onDark={false}
            />
          </div>
        </div>
        {about.arc.map((stage, index) => (
          <AboutChapter
            key={stage.id}
            stage={stage}
            tone={CHAPTER_TONES[index] ?? "mist"}
            showYears={stage.id === "field"}
            showPillars={stage.id === "evidence"}
            showCtas={stage.id === "policy"}
            variant="stacked"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={trackRef}
      className="relative w-full min-h-[360vh] sm:min-h-[420vh]"
    >
      <ArcScrollUnderlay />

      <div className="sticky top-0 z-30 flex h-dvh flex-col overflow-hidden">
        <ArcAtmosphere progress={smooth} reduceMotion={false} />

        <div className="pointer-events-none absolute inset-0 z-[1] opacity-90">
          <ArcScrollSvg progress={smooth} reduceMotion={false} />
        </div>

        <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col px-4 pt-16 pb-4 safe-px sm:px-6 sm:pt-[4.5rem] sm:pb-5">
          <AssignmentArc
            activeIndex={activeIndex}
            reduceMotion={false}
            onSelect={scrollToBand}
            embedded
            onDark={onDark}
          />

          <div className="relative mt-3 min-h-0 flex-1 sm:mt-5">
            {about.arc.map((stage, index) => {
              const scrub = scrubs[index]!;
              return (
                <AboutChapter
                  key={stage.id}
                  stage={stage}
                  tone={CHAPTER_TONES[index] ?? "mist"}
                  showYears={stage.id === "field"}
                  showPillars={stage.id === "evidence"}
                  showCtas={stage.id === "policy"}
                  variant="stage"
                  scrubOpacity={scrub.opacity}
                  scrubY={scrub.y}
                  interactive={index === activeIndex}
                  onDark={index === 1}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
