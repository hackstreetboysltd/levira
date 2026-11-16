"use client";

import { useState } from "react";
import type { MotionStyle, MotionValue } from "motion/react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { YearsCounter } from "@/components/sections/YearsCounter";
import { MagneticButton } from "@/components/unlumen-ui/magnetic-button";
import { TextReveal } from "@/components/unlumen-ui/text-reveal";
import { about, type AboutArcStage } from "@/content/levira";
import { cn } from "@/lib/utils";

type ChapterTone = "mist" | "paper" | "deep";

type AboutChapterProps = {
  stage: AboutArcStage;
  tone: ChapterTone;
  showYears?: boolean;
  showPillars?: boolean;
  showCtas?: boolean;
  /** stacked = normal page section; stage = absolute layered panel in pin */
  variant?: "stacked" | "stage";
  /** Scrubbed opacity for stage mode (MotionValue). */
  scrubOpacity?: MotionValue<number>;
  /** Scrubbed y offset for stage mode. */
  scrubY?: MotionValue<number>;
  /** Whether this chapter is the active interactive layer. */
  interactive?: boolean;
  /** Force light/dark type for stage overlays (background is atmospheric). */
  onDark?: boolean;
};

export const chapterToneClasses: Record<
  ChapterTone,
  { section: string; headline: string; body: string; muted: string }
> = {
  mist: {
    section: "bg-mist text-deep",
    headline: "text-deep",
    body: "text-deep/80",
    muted: "text-deep/55",
  },
  paper: {
    section: "bg-paper text-deep",
    headline: "text-deep",
    body: "text-deep/80",
    muted: "text-deep/55",
  },
  deep: {
    section: "bg-deep text-paper",
    headline: "text-paper",
    body: "text-paper/80",
    muted: "text-paper/55",
  },
};

export const CHAPTER_TONE_HEX: Record<ChapterTone, string> = {
  mist: "#e7f3f1",
  deep: "#061a2a",
  paper: "#f7fbfa",
};

export function AboutChapter({
  stage,
  tone,
  showYears = false,
  showPillars = false,
  showCtas = false,
  variant = "stacked",
  scrubOpacity,
  scrubY,
  interactive = true,
  onDark,
}: AboutChapterProps) {
  const reduce = useReducedMotion();
  const base = chapterToneClasses[tone];
  const dark = onDark ?? tone === "deep";
  const colors =
    variant === "stage"
      ? {
          headline: dark ? "text-paper" : "text-deep",
          body: dark ? "text-paper/80" : "text-deep/80",
          muted: dark ? "text-paper/55" : "text-deep/55",
        }
      : base;
  const [activePillar, setActivePillar] = useState(0);
  const pillar = about.pillars[activePillar] ?? about.pillars[0];
  const isStage = variant === "stage";
  const showReveal = !reduce && !isStage;

  const body = (
    <div
      className={cn(
        "mx-auto grid w-full max-w-6xl gap-6 px-0 sm:grid-cols-[1.1fr_0.9fr] sm:gap-12",
        isStage
          ? "h-full items-center py-2 sm:py-4"
          : "gap-10 px-4 py-16 safe-px sm:px-6 sm:py-24",
      )}
    >
      <div className={cn(isStage && "min-w-0")}>
        {!isStage ? (
          <p className="text-sm font-medium tracking-[0.18em] text-cyan uppercase">
            {stage.label}
          </p>
        ) : null}
        <h2
          id={`about-chapter-title-${stage.id}`}
          className={cn(
            "font-display leading-[1.05] font-bold tracking-tight text-balance",
            isStage
              ? "text-[clamp(1.5rem,4vw,2.75rem)]"
              : "mt-3 text-[clamp(1.85rem,5.5vw,3.25rem)]",
            colors.headline,
          )}
        >
          {stage.headline}
        </h2>

        {showReveal ? (
          <TextReveal
            text={stage.body}
            as="p"
            className={cn(
              "mt-4 max-w-xl font-serif-body text-base leading-relaxed text-pretty sm:mt-5 sm:text-lg",
              colors.body,
            )}
            staggerDelay={0.028}
          />
        ) : (
          <p
            className={cn(
              "mt-4 max-w-xl font-serif-body text-sm leading-relaxed text-pretty sm:mt-5 sm:text-base lg:text-lg",
              colors.body,
            )}
          >
            {stage.body}
          </p>
        )}

        {showCtas ? (
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">
            <MagneticButton
              asChild
              size="lg"
              className="h-11 min-h-11 w-full rounded-xl bg-cyan px-8 text-base text-paper hover:bg-cyan/90 sm:w-auto"
              strength={0.45}
            >
              <Link href="/expertise">See services</Link>
            </MagneticButton>
            <Link
              href="/contact"
              className={cn(
                "inline-flex h-11 min-h-11 w-full items-center justify-center rounded-xl border px-6 text-sm font-medium transition-colors sm:w-auto",
                dark
                  ? "border-paper/25 text-paper/85 hover:border-cyan hover:text-paper"
                  : "border-deep/15 text-deep/80 hover:border-cyan hover:text-deep",
              )}
            >
              Discuss an assignment
            </Link>
          </div>
        ) : null}
      </div>

      <aside
        className={cn(
          "flex flex-col justify-center gap-5",
          isStage && "min-w-0",
        )}
      >
        {showYears ? (
          <div
            className={cn(
              "border-t border-b py-4 sm:py-5",
              dark ? "border-paper/15" : "border-deep/10",
            )}
          >
            <div className="flex flex-wrap items-end gap-3">
              <YearsCounter
                to={about.years}
                className="text-4xl sm:text-5xl lg:text-6xl"
              />
              <span
                className={cn(
                  "mb-1.5 max-w-[10rem] text-sm leading-snug",
                  colors.muted,
                )}
              >
                {about.yearsLabel}
              </span>
            </div>
            <p className={cn("mt-3 text-sm leading-relaxed", colors.muted)}>
              {about.locationLine}
            </p>
          </div>
        ) : null}

        {showPillars ? (
          <div>
            <p
              className={cn(
                "text-[0.65rem] font-medium tracking-[0.18em] uppercase",
                colors.muted,
              )}
            >
              Practice pillars
            </p>
            <div
              className="mt-3 flex flex-wrap gap-2"
              role="list"
              aria-label="Practice pillars"
            >
              {about.pillars.map((item, index) => {
                const selected = index === activePillar;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="listitem"
                    aria-pressed={selected}
                    tabIndex={interactive ? undefined : -1}
                    onClick={() => setActivePillar(index)}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/70",
                      selected
                        ? dark
                          ? "border-cyan bg-cyan/20 text-paper"
                          : "border-cyan bg-cyan/15 text-deep"
                        : dark
                          ? "border-paper/20 text-paper/65 hover:border-paper/40 hover:text-paper"
                          : "border-deep/12 text-deep/60 hover:border-deep/25 hover:text-deep",
                    )}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
            <motion.p
              key={pillar.id}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28 }}
              className={cn(
                "mt-3 max-w-sm font-serif-body text-sm leading-relaxed sm:text-base",
                colors.body,
              )}
            >
              {pillar.blurb}
            </motion.p>
          </div>
        ) : null}

        {showCtas ? (
          <p
            className={cn(
              "border-t pt-5 font-serif-body text-sm leading-relaxed sm:text-base",
              dark ? "border-paper/15" : "border-deep/10",
              colors.muted,
            )}
          >
            {about.locationLine}
          </p>
        ) : null}
      </aside>
    </div>
  );

  if (isStage) {
    const style: MotionStyle = {
      opacity: scrubOpacity,
      y: scrubY,
    };

    return (
      <motion.section
        id={`about-chapter-${stage.id}`}
        aria-labelledby={`about-chapter-title-${stage.id}`}
        data-arc-stage={stage.id}
        aria-hidden={!interactive}
        {...(!interactive ? { inert: true } : {})}
        style={style}
        className={cn(
          "absolute inset-0",
          interactive ? "z-10 pointer-events-auto" : "z-0 pointer-events-none",
        )}
      >
        {body}
      </motion.section>
    );
  }

  return (
    <section
      id={`about-chapter-${stage.id}`}
      aria-labelledby={`about-chapter-title-${stage.id}`}
      data-arc-stage={stage.id}
      className={cn(
        "relative scroll-mt-28 sm:scroll-mt-32",
        base.section,
      )}
    >
      {body}
    </section>
  );
}
