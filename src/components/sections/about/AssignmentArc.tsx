"use client";

import { ScrambleText } from "@/components/unlumen-ui/scramble-text";
import { about } from "@/content/levira";
import { cn } from "@/lib/utils";

type AssignmentArcProps = {
  activeIndex: number;
  reduceMotion: boolean;
  onSelect: (index: number) => void;
  /** When true, HUD sits inside the pinned stage (not a page chrome bar). */
  embedded?: boolean;
  /** Light text for deep-tone scenes. */
  onDark?: boolean;
};

export function AssignmentArc({
  activeIndex,
  reduceMotion,
  onSelect,
  embedded = true,
  onDark = false,
}: AssignmentArcProps) {
  const stages = about.arc;
  const active = stages[activeIndex] ?? stages[0];

  return (
    <div
      className={cn(
        embedded ? "relative z-10 shrink-0" : "sticky top-14 z-40 sm:top-16",
        !embedded && "border-b border-deep/10 bg-paper/90 backdrop-blur-xl",
      )}
      role="navigation"
      aria-label="Assignment arc"
    >
      <div
        className={cn(
          "flex items-end justify-between gap-4",
          embedded ? "px-0 py-0" : "mx-auto max-w-6xl px-4 py-3 safe-px sm:px-6 sm:py-3.5",
        )}
      >
        <div className="min-w-0">
          <p
            className={cn(
              "text-[0.65rem] font-medium tracking-[0.2em] uppercase",
              onDark ? "text-paper/45" : "text-deep/45",
            )}
          >
            Assignment arc
          </p>
          <p
            className={cn(
              "mt-0.5 font-display text-lg leading-tight font-bold tracking-tight sm:text-xl",
              onDark ? "text-paper" : "text-deep",
            )}
            aria-live="polite"
          >
            {reduceMotion ? (
              active.label
            ) : (
              <ScrambleText
                key={active.id}
                text={active.label}
                scrambleSpeed={28}
                scrambledLetterCount={3}
                characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                className={onDark ? "text-paper" : "text-deep"}
                scrambledClassName="text-cyan"
              />
            )}
          </p>
        </div>

        <div
          className="flex shrink-0 items-center gap-2"
          role="list"
          aria-label="Arc stages"
        >
          {stages.map((stage, index) => (
            <button
              key={stage.id}
              type="button"
              role="listitem"
              aria-label={`Go to ${stage.label}`}
              aria-current={index === activeIndex ? "step" : undefined}
              onClick={() => onSelect(index)}
              className={cn(
                "relative flex size-9 items-center justify-center rounded-full transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/70 focus-visible:ring-offset-2",
                onDark
                  ? "focus-visible:ring-offset-deep"
                  : "focus-visible:ring-offset-paper",
                index > activeIndex &&
                  (onDark ? "hover:bg-paper/10" : "hover:bg-deep/5"),
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "size-2.5 rounded-full transition-transform",
                  index === activeIndex
                    ? "scale-110 bg-gold"
                    : index < activeIndex
                      ? "bg-gold/70"
                      : onDark
                        ? "bg-paper/25"
                        : "bg-deep/25",
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
