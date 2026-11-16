"use client";

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, EffectCoverflow, Keyboard } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import { partnerGroups } from "@/content/levira";
import { cn } from "@/lib/utils";

import "swiper/css";
import "swiper/css/effect-coverflow";

type PartnerSlide = {
  id: string;
  name: string;
  description: string[];
  groupLabel: string;
};

const SLIDES: PartnerSlide[] = partnerGroups.flatMap((group) =>
  group.partners.map((partner, i) => ({
    id: `${group.id}-${i}`,
    name: partner.name,
    description: partner.description,
    groupLabel: group.label,
  })),
);

/** Fixed coverflow geometry — same angles at every width. */
const COVERFLOW = {
  rotate: 38,
  depth: 220,
  stretch: -60,
  scale: 0.92,
  modifier: 1,
  slideShadows: false,
} as const;

/** Five cards + tip slivers (desktop). */
const STAGE_DESIGN_WIDTH_WIDE = 1280;

/**
 * Three readable cards + slim ±2 peeks pinned to the left/right edges.
 * Tighter crop → larger scale → readable type below 600px.
 */
const STAGE_DESIGN_WIDTH_NARROW = 920;

const NARROW_QUERY = "(max-width: 599px)";

function subscribeNarrow(onChange: () => void) {
  const mq = window.matchMedia(NARROW_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function useNarrowViewport() {
  return useSyncExternalStore(
    subscribeNarrow,
    () => window.matchMedia(NARROW_QUERY).matches,
    () => false,
  );
}

export function PartnerCoverflow() {
  const reduce = useReducedMotion();
  const isNarrow = useNarrowViewport();
  const swiperRef = useRef<SwiperInstance | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const descriptionRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const [stageHeight, setStageHeight] = useState<number | undefined>(undefined);

  const active = SLIDES[activeIndex] ?? SLIDES[0];
  const canLoop = !reduce && SLIDES.length >= 4;
  const useCoverflow = !reduce;
  const designWidth = isNarrow
    ? STAGE_DESIGN_WIDTH_NARROW
    : STAGE_DESIGN_WIDTH_WIDE;

  const syncScale = useCallback(() => {
    const frame = frameRef.current;
    const stage = stageRef.current;
    if (!frame || !stage) return;

    const nextScale = Math.min(1, frame.clientWidth / designWidth);
    setScale(nextScale);
    setStageHeight(stage.scrollHeight * nextScale);
  }, [designWidth]);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    syncScale();

    const ro = new ResizeObserver(() => {
      syncScale();
    });
    ro.observe(frame);
    return () => ro.disconnect();
  }, [syncScale, useCoverflow, designWidth]);

  const goPrev = useCallback(() => {
    swiperRef.current?.slidePrev();
  }, []);

  const goNext = useCallback(() => {
    swiperRef.current?.slideNext();
  }, []);

  const scrollToDescription = useCallback(() => {
    descriptionRef.current?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  }, [reduce]);

  const goToSlide = useCallback(
    (realIndex: number) => {
      const swiper = swiperRef.current;
      if (!swiper || realIndex === swiper.realIndex) return;
      if (swiper.params.loop) {
        swiper.slideToLoop(realIndex);
      } else {
        swiper.slideTo(realIndex);
      }
    },
    [],
  );

  const selectSlide = useCallback(
    (realIndex: number) => {
      goToSlide(realIndex);
      // Defer so the description for the newly selected slide is in the DOM.
      requestAnimationFrame(() => {
        requestAnimationFrame(scrollToDescription);
      });
    },
    [goToSlide, scrollToDescription],
  );

  return (
    <div className="w-full">
      <div
        ref={frameRef}
        className="partner-coverflow relative w-full overflow-hidden"
        style={{ height: stageHeight }}
      >
        <div
          ref={stageRef}
          className="absolute top-0 left-1/2 py-2"
          style={{
            width: designWidth,
            transform: `translateX(-50%) scale(${scale})`,
            transformOrigin: "top center",
            transformStyle: useCoverflow ? "preserve-3d" : undefined,
            ...(useCoverflow ? { perspective: "1200px" } : null),
          }}
        >
          <Swiper
            key={`${useCoverflow ? "3d" : "flat"}-${designWidth}`}
            modules={[EffectCoverflow, Keyboard, A11y]}
            effect={useCoverflow ? "coverflow" : "slide"}
            grabCursor
            centeredSlides
            slideToClickedSlide
            slidesPerView="auto"
            loop={canLoop}
            speed={reduce ? 0 : 450}
            keyboard={{ enabled: true }}
            a11y={{
              enabled: true,
              prevSlideMessage: "Previous partner",
              nextSlideMessage: "Next partner",
            }}
            coverflowEffect={useCoverflow ? { ...COVERFLOW } : undefined}
            initialSlide={0}
            onSwiper={(instance) => {
              swiperRef.current = instance;
              setActiveIndex(instance.realIndex);
              requestAnimationFrame(syncScale);
            }}
            onSlideChange={(instance) => {
              setActiveIndex(instance.realIndex);
            }}
            className="!overflow-visible px-6"
          >
            {SLIDES.map((slide, index) => (
              <SwiperSlide key={slide.id} className="!h-auto !w-[17rem]">
                {({ isActive }) => (
                  <article
                    className={cn(
                      "flex min-h-[16.5rem] cursor-pointer flex-col items-center justify-center rounded-2xl border bg-deep px-7 py-8 text-center text-mist transition-[border-color,box-shadow]",
                      isActive
                        ? "border-gold shadow-[0_0_0_1px_rgba(184,137,61,0.35)]"
                        : "border-deep/40 opacity-90 hover:border-cyan/35 hover:opacity-100",
                    )}
                    aria-current={isActive ? "true" : undefined}
                    aria-label={`Show ${slide.name}, ${slide.groupLabel}`}
                    onClick={() => selectSlide(index)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        selectSlide(index);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <p className="font-display text-[clamp(1.4rem,0.2rem+2.4vw,1.9rem)] leading-[1.1] font-bold tracking-[-0.03em] text-balance">
                      {slide.name}
                    </p>
                    <div
                      className="mt-5 h-px w-12 bg-cyan/55"
                      aria-hidden="true"
                    />
                  </article>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <div className="mx-auto mt-6 flex items-center justify-center gap-4 px-4 safe-px sm:mt-10 sm:gap-5 sm:px-6">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous partner"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-deep/15 bg-paper text-deep transition-colors hover:border-cyan/40 hover:text-cyan focus-ring"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={goNext}
          aria-label="Next partner"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-deep/15 bg-paper text-deep transition-colors hover:border-cyan/40 hover:text-cyan focus-ring"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div
        ref={descriptionRef}
        className="mx-auto mt-6 max-w-2xl scroll-mt-20 px-4 sm:mt-8 sm:scroll-mt-24 sm:px-6"
      >
        {active ? (
          <div
            key={active.id}
            className="space-y-4 text-left font-serif-body text-sm leading-relaxed text-deep/75 sm:text-base"
            aria-live="polite"
          >
            {active.description.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
