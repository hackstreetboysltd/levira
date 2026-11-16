"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { AtmospherePlane } from "@/components/atmosphere/AtmospherePlane";
import { MagneticButton } from "@/components/unlumen-ui/magnetic-button";
import { expertise, expertiseIntro } from "@/content/levira";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;
const lastIndex = expertise.length - 1;

type NavDirection = 1 | -1;

export function ExpertiseGrid() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<NavDirection>(1);
  const indexRef = useRef(0);
  const reduceMotion = useReducedMotion();
  const reduce = !!reduceMotion;

  indexRef.current = activeIndex;

  const active = expertise[activeIndex] ?? expertise[0];
  const sectionRef = useRef<HTMLElement>(null);
  const scrollLockRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);

  const go = useCallback((delta: NavDirection) => {
    const current = indexRef.current;
    const nextIndex =
      delta === 1
        ? current >= lastIndex
          ? 0
          : current + 1
        : current <= 0
          ? lastIndex
          : current - 1;
    setDirection(delta);
    setActiveIndex(nextIndex);
  }, []);

  const select = useCallback((index: number) => {
    if (index < 0 || index > lastIndex || index === indexRef.current) return;
    setDirection(index > indexRef.current ? 1 : -1);
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        go(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const unlockSoon = () => {
      window.setTimeout(() => {
        scrollLockRef.current = false;
      }, 420);
    };

    const stepFromDelta = (deltaY: number, threshold = 12) => {
      if (Math.abs(deltaY) < threshold || scrollLockRef.current) return;
      scrollLockRef.current = true;
      // Swipe/scroll up → next; down → previous
      go(deltaY > 0 ? 1 : -1);
      unlockSoon();
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      stepFromDelta(e.deltaY);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0]?.clientY ?? null;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const startY = touchStartYRef.current;
      touchStartYRef.current = null;
      if (startY == null) return;
      const endY = e.changedTouches[0]?.clientY;
      if (endY == null) return;
      // Finger moves up → positive delta → next
      stepFromDelta(startY - endY, 40);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [go]);

  if (!active) return null;

  const enterY = direction * 28;
  const exitY = direction * -20;
  const progress = (activeIndex + 1) / expertise.length;

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-dvh w-full flex-col"
      aria-roledescription="carousel"
      aria-label="Expertise domains"
    >
      <DomainBar
        activeIndex={activeIndex}
        progress={progress}
        reduce={reduce}
        onSelect={select}
      />

      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-36 opacity-35 sm:h-44">
          <AtmospherePlane variant="strip" />
        </div>

        <div className="relative mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col px-4 py-5 pb-20 safe-px sm:px-6 sm:py-6 sm:pb-6 lg:py-8 lg:pb-8">
          <div className="grid min-h-0 content-start gap-[15px] sm:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] sm:flex-1 sm:items-center sm:gap-12">
            <aside className="flex min-h-0 flex-col sm:pr-2">
              <p className="hidden text-sm font-semibold tracking-[0.18em] text-deep uppercase sm:block">
                {expertiseIntro.eyebrow}
              </p>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={active.id}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: enterY }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: exitY }}
                  transition={{ duration: reduce ? 0.12 : 0.28, ease }}
                >
                  <h1
                    id="expertise-active-title"
                    className="mt-2 max-w-xl font-display text-[clamp(1.5rem,4.2vw,2.75rem)] leading-[1.05] font-bold tracking-tight text-deep text-balance lg:mt-3 lg:text-[clamp(1.85rem,4vw,3.1rem)]"
                  >
                    {active.title}
                  </h1>
                  <p className="mt-3 max-w-md font-serif-body text-sm leading-relaxed text-deep/80 sm:text-base lg:mt-4 lg:text-lg">
                    {active.summary}
                  </p>
                </motion.div>
              </AnimatePresence>
            </aside>

            <div className="relative flex min-h-0 flex-col pr-14 sm:justify-center sm:pr-16">
              <div className="relative -ml-[max(1rem,env(safe-area-inset-left))] -mr-[calc(3.5rem+max(1rem,env(safe-area-inset-right)))] w-[calc(100%+3.5rem+max(1rem,env(safe-area-inset-left))+max(1rem,env(safe-area-inset-right)))] overflow-hidden border-y border-deep/10 py-5 pl-[max(1rem,env(safe-area-inset-left))] pr-14 sm:ml-0 sm:mr-0 sm:w-auto sm:px-0 sm:pr-0 sm:py-6">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={active.id}
                    role="group"
                    aria-labelledby="expertise-active-title"
                    aria-live="polite"
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: enterY }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: exitY }}
                    transition={{ duration: reduce ? 0.12 : 0.28, ease }}
                  >
                    <ul className="flex flex-col gap-2">
                      {active.items.map((item) => (
                        <li
                          key={item}
                          className={cn(
                            "box-border w-full rounded-full border border-deep/10 bg-mist/90 px-3.5 py-2 text-sm leading-snug text-deep/85",
                            "transition-[transform,background-color,border-color] duration-200",
                            "hover:-translate-y-0.5 hover:border-cyan/40 hover:bg-cyan/10",
                            reduce && "hover:translate-y-0",
                          )}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="fixed inset-x-0 bottom-0 z-40 flex w-full justify-center px-4 pt-3 pb-[max(2.75rem,env(safe-area-inset-bottom))] safe-px sm:static sm:z-auto sm:px-0 sm:pt-8 sm:pb-2">
            <MagneticButton
              asChild
              size="lg"
              className="mx-auto h-11 min-h-11 rounded-xl bg-cyan px-7 text-sm text-paper hover:bg-cyan/90 sm:h-12 sm:px-8 sm:text-base"
              strength={0.45}
            >
              <Link href="/contact">{expertiseIntro.cta}</Link>
            </MagneticButton>
          </div>
        </div>
      </div>

      <div className="pointer-events-none fixed top-1/2 right-4 z-40 flex -translate-y-1/2 flex-col gap-3 sm:right-6 md:right-[max(1.5rem,calc((100vw-72rem)/2+0.5rem))]">
        <NavButton
          label="Previous domain"
          onClick={() => go(-1)}
          reduce={reduce}
          className="pointer-events-auto shadow-sm"
        >
          <ChevronUp className="size-4 sm:size-5" />
        </NavButton>
        <NavButton
          label="Next domain"
          onClick={() => go(1)}
          reduce={reduce}
          className="pointer-events-auto shadow-sm"
        >
          <ChevronDown className="size-4 sm:size-5" />
        </NavButton>
      </div>
    </section>
  );
}

function DomainBar({
  activeIndex,
  progress,
  reduce,
  onSelect,
}: {
  activeIndex: number;
  progress: number;
  reduce: boolean;
  onSelect: (index: number) => void;
}) {
  const fill = Math.min(1, Math.max(0, progress));

  return (
    <div
      className="sticky top-0 z-40 border-b border-deep/10 bg-paper/90 backdrop-blur-xl"
      role="navigation"
      aria-label="Expertise domains"
    >
      <div className="mx-auto max-w-6xl py-3 sm:px-6 sm:py-3.5">
        <p className="mb-2.5 px-4 text-center text-sm font-semibold tracking-[0.18em] text-deep uppercase safe-px sm:hidden">
          {expertiseIntro.eyebrow}
        </p>
        <div className="about-arc-track relative h-1.5 w-full rounded-none bg-deep/8 sm:rounded-full">
          <div className="absolute inset-0 overflow-hidden rounded-none sm:rounded-full" aria-hidden>
            {reduce ? (
              <motion.div
                className="about-arc-fill h-full w-full rounded-none bg-cyan sm:rounded-full"
                initial={false}
                animate={{ scaleX: fill }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{ transformOrigin: "center" }}
              />
            ) : (
              <motion.div
                className="about-arc-fill h-full w-full rounded-none bg-cyan sm:rounded-full"
                initial={false}
                animate={{ scaleX: fill }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: "center" }}
              />
            )}
          </div>
          {expertise.map((domain, index) => (
            <button
              key={domain.id}
              type="button"
              aria-label={`Go to ${domain.title}`}
              aria-current={index === activeIndex ? "step" : undefined}
              onClick={() => onSelect(index)}
              className={cn(
                "absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-paper transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/70",
                index <= activeIndex ? "bg-gold" : "bg-deep/25 hover:bg-deep/40",
              )}
              style={{
                left: `${((index + 1) / expertise.length) * 100}%`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function NavButton({
  children,
  label,
  disabled,
  onClick,
  reduce,
  className,
}: {
  children: ReactNode;
  label: string;
  disabled?: boolean;
  onClick: () => void;
  reduce: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-cyan bg-cyan text-paper transition-all duration-300 sm:size-11",
        "hover:bg-cyan/90",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
        "disabled:pointer-events-none disabled:bg-cyan disabled:opacity-40",
        reduce && "transition-none",
        className,
      )}
    >
      {children}
    </button>
  );
}
