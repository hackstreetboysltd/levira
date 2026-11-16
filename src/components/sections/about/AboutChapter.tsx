"use client";

import { useState } from "react";
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
}: AboutChapterProps) {
  const reduce = useReducedMotion();
  const colors = chapterToneClasses[tone];
  const [activePillar, setActivePillar] = useState(0);
  const pillar = about.pillars[activePillar] ?? about.pillars[0];
  const isStage = variant === "stage";
  const showReveal = !reduce && !isStage;

  const body = (
    <div
      className={cn(
        "mx-auto grid w-full max-w-6xl gap-8 px-4 safe-px sm:grid-cols-[1.1fr_0.9fr] sm:gap-14 sm:px-6",
        isStage
          ? "h-full items-center gap-6 py-4 sm:py-6"
          : "gap-10 py-16 sm:py-24",
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
              ? "text-[clamp(1.65rem,4.5vw,3rem)]"
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
              "mt-5 max-w-xl font-serif-body text-base leading-relaxed text-pretty sm:mt-6 sm:text-lg",
              colors.body,
            )}
            staggerDelay={0.028}
          />
        ) : (
          <p
            className={cn(
              "mt-5 max-w-xl font-serif-body text-base leading-relaxed text-pretty sm:mt-6 sm:text-lg",
              colors.body,
            )}
          >
            {stage.body}
          </p>
        )}

        {showCtas ? (
          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center">
            <MagneticButton
              asChild
              size="lg"
              className="h-12 min-h-11 w-full rounded-xl bg-cyan px-8 text-base text-paper hover:bg-cyan/90 sm:w-auto"
              strength={0.45}
            >
              <Link href="/expertise">See services</Link>
            </MagneticButton>
            <Link
              href="/contact"
              className={cn(
                "inline-flex h-12 min-h-11 w-full items-center justify-center rounded-xl border px-6 text-sm font-medium transition-colors sm:w-auto",
                tone === "deep"
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
          "flex flex-col justify-center gap-6",
          isStage && "min-w-0",
        )}
      >
        {showYears ? (
          <div
            className={cn(
              "border-t border-b py-5 sm:py-6",
              tone === "deep" ? "border-paper/15" : "border-deep/10",
            )}
          >
            <div className="flex flex-wrap items-end gap-3">
              <YearsCounter
                to={about.years}
                className="text-5xl sm:text-6xl"
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
            <p className={cn("mt-4 text-sm leading-relaxed", colors.muted)}>
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
                    onClick={() => setActivePillar(index)}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/70",
                      selected
                        ? tone === "deep"
                          ? "border-cyan bg-cyan/20 text-paper"
                          : "border-cyan bg-cyan/15 text-deep"
                        : tone === "deep"
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
                "mt-4 max-w-sm font-serif-body text-base leading-relaxed",
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
              "border-t pt-6 font-serif-body text-base leading-relaxed",
              tone === "deep" ? "border-paper/15" : "border-deep/10",
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
    return (
      <motion.section
        id={`about-chapter-${stage.id}`}
        aria-labelledby={`about-chapter-title-${stage.id}`}
        data-arc-stage={stage.id}
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduce ? undefined : { opacity: 0, y: -10 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="absolute inset-0 overflow-y-auto overscroll-contain"
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
        colors.section,
      )}
    >
      {body}
    </section>
  );
}
