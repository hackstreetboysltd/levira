"use client";

import { useCallback, useRef, useState, useSyncExternalStore } from "react";
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

/** Desktop coverflow — room for a five-card fan. */
const COVERFLOW_WIDE = {
  rotate: 38,
  depth: 220,
  stretch: -60,
  scale: 0.92,
  modifier: 1,
  slideShadows: false,
} as const;

/**
 * Mobile coverflow — native width (no parent CSS scale).
 * Parent `transform: scale()` flattens Swiper 3D on iOS Safari.
 * Milder depth/rotate keeps ±1 neighbors readable in ~390px.
 */
const COVERFLOW_NARROW = {
  rotate: 22,
  depth: 90,
  stretch: -8,
  scale: 0.88,
  modifier: 1,
  slideShadows: false,
} as const;

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
  const descriptionRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const active = SLIDES[activeIndex] ?? SLIDES[0];
  // Coverflow is layout, not decoration — keep it with reduced motion; only zero speed.
  const canLoop = SLIDES.length >= 4;
  const coverflow = isNarrow ? COVERFLOW_NARROW : COVERFLOW_WIDE;

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

  const goToSlide = useCallback((realIndex: number) => {
    const swiper = swiperRef.current;
    if (!swiper || realIndex === swiper.realIndex) return;
    if (swiper.params.loop) {
      swiper.slideToLoop(realIndex);
    } else {
      swiper.slideTo(realIndex);
    }
  }, []);

  const selectSlide = useCallback(
    (realIndex: number) => {
      goToSlide(realIndex);
      requestAnimationFrame(() => {
        requestAnimationFrame(scrollToDescription);
      });
    },
    [goToSlide, scrollToDescription],
  );

  return (
    <div className="w-full">
      <div
        className="partner-coverflow relative w-full overflow-hidden py-2"
        style={{ perspective: "1200px" }}
      >
        <Swiper
          key={isNarrow ? "narrow" : "wide"}
          modules={[EffectCoverflow, Keyboard, A11y]}
          effect="coverflow"
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
          coverflowEffect={{ ...coverflow }}
          initialSlide={0}
          onSwiper={(instance) => {
            swiperRef.current = instance;
            setActiveIndex(instance.realIndex);
          }}
          onSlideChange={(instance) => {
            setActiveIndex(instance.realIndex);
          }}
          className="!overflow-visible px-4 sm:px-6"
        >
          {SLIDES.map((slide, index) => (
            <SwiperSlide
              key={slide.id}
              className={cn(
                "!h-auto",
                isNarrow ? "!w-[min(13.25rem,64vw)]" : "!w-[17rem]",
              )}
            >
              {({ isActive }) => (
                <article
                  className={cn(
                    "flex cursor-pointer flex-col items-center justify-center rounded-2xl border bg-deep px-5 py-6 text-center text-mist transition-[border-color,box-shadow] sm:px-7 sm:py-8",
                    isNarrow ? "min-h-[13.25rem]" : "min-h-[16.5rem]",
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
                  <p className="font-display text-[clamp(1.25rem,0.4rem+3.2vw,1.9rem)] leading-[1.1] font-bold tracking-[-0.03em] text-balance">
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
