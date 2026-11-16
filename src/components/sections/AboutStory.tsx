"use client";

import { useCallback, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { AssignmentArc } from "@/components/sections/about/AssignmentArc";
import {
  AboutChapter,
  CHAPTER_TONE_HEX,
} from "@/components/sections/about/AboutChapter";
import { about } from "@/content/levira";

const CHAPTER_TONES = ["mist", "deep", "paper"] as const;

function bandIndex(progress: number, stages: number) {
  return Math.min(
    stages - 1,
    Math.max(0, Math.floor(progress * stages + 0.001)),
  );
}

export function AboutStory() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (reduce) return;
    const next = bandIndex(value, about.arc.length);
    setActiveIndex((prev) => (prev === next ? prev : next));
  });

  const scrollToBand = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) return;
      const stages = about.arc.length;
      const clamped = Math.min(stages - 1, Math.max(0, index));
      const rect = track.getBoundingClientRect();
      const trackTop = window.scrollY + rect.top;
      const scrollable = Math.max(1, track.offsetHeight - window.innerHeight);
      const targetProgress = clamped / stages;
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

  const activeTone = CHAPTER_TONES[activeIndex] ?? "mist";
  const onDark = activeTone === "deep";
  const activeStage = about.arc[activeIndex] ?? about.arc[0];

  return (
    <div
      ref={trackRef}
      className="relative w-full h-[220vh] sm:h-[300vh]"
    >
      <motion.div
        className="sticky top-14 z-30 flex h-[calc(100dvh-3.5rem)] flex-col overflow-hidden sm:top-16 sm:h-[calc(100dvh-4rem)]"
        initial={false}
        animate={{ backgroundColor: CHAPTER_TONE_HEX[activeTone] }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="mx-auto flex h-full w-full max-w-6xl flex-col px-4 pt-4 pb-4 safe-px sm:px-6 sm:pt-5 sm:pb-5">
          <AssignmentArc
            activeIndex={activeIndex}
            reduceMotion={false}
            onSelect={scrollToBand}
            embedded
            onDark={onDark}
          />

          <div className="relative mt-4 min-h-0 flex-1 sm:mt-6">
            <AnimatePresence mode="wait">
              <AboutChapter
                key={activeStage.id}
                stage={activeStage}
                tone={activeTone}
                showYears={activeStage.id === "field"}
                showPillars={activeStage.id === "evidence"}
                showCtas={activeStage.id === "policy"}
                variant="stage"
              />
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
