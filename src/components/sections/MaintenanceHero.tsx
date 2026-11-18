"use client";

import { useCallback, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import type { DotLottie } from "@lottiefiles/dotlottie-web";
import { motion, useReducedMotion } from "motion/react";
import { AtmospherePlane } from "@/components/atmosphere/AtmospherePlane";
import { site } from "@/content/levira";
import { cn } from "@/lib/utils";

const POSTER_SRC = "/lottie/under-maintenance-poster.png";
const LOTTIE_SRC = "/lottie/under-maintenance.lottie";

function MaintenanceLoop({ reduce }: { reduce: boolean | null }) {
  const [ready, setReady] = useState(false);
  const ease = [0.22, 1, 0.36, 1] as const;

  const onDotLottieRef = useCallback((instance: DotLottie | null) => {
    if (!instance) return;

    const start = () => {
      instance.unfreeze();
      if (!instance.isPlaying) {
        instance.play();
      }
      setReady(true);
    };

    if (instance.isLoaded) {
      start();
      return;
    }

    instance.addEventListener("load", start);
    instance.addEventListener("ready", start);
  }, []);

  return (
    <motion.div
      className="relative mt-8 aspect-square w-full max-w-[18rem] sm:max-w-[20rem]"
      initial={reduce ? false : { y: 10 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.45, ease, delay: reduce ? 0 : 0.22 }}
      aria-hidden
    >
      {/* Player stays fully opaque underneath — opacity:0 freezes DotLottie via freezeOnOffscreen. */}
      {!reduce ? (
        <div className="absolute inset-0">
          <DotLottieReact
            src={LOTTIE_SRC}
            loop
            autoplay
            dotLottieRefCallback={onDotLottieRef}
            renderConfig={{ freezeOnOffscreen: false }}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      ) : null}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={POSTER_SRC}
        alt=""
        width={500}
        height={500}
        decoding="async"
        fetchPriority="high"
        draggable={false}
        className={cn(
          "pointer-events-none absolute inset-0 z-10 h-full w-full select-none object-contain transition-opacity duration-300",
          !reduce && ready ? "opacity-0" : "opacity-100",
        )}
      />
    </motion.div>
  );
}

export function MaintenanceHero() {
  const reduce = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section className="relative isolate min-h-[100svh] w-full overflow-hidden text-paper">
      <AtmospherePlane variant="hero" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col items-center justify-center px-4 py-24 text-center safe-px sm:px-6">
        <motion.div
          className="hero-lockup max-w-full"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease }}
        >
          <h1 className="font-display text-[clamp(3.25rem,16vw,8.5rem)] leading-[0.88] font-bold tracking-[-0.045em] text-paper drop-shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
            {site.brand}
          </h1>
          <span className="hero-waterline" aria-hidden />
        </motion.div>

        <motion.p
          className="mt-7 max-w-[20rem] px-1 font-serif-body text-[clamp(1.15rem,3.2vw,1.7rem)] leading-snug text-balance text-paper/90 sm:max-w-xl"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: reduce ? 0 : 0.12 }}
        >
          This site is under maintenance
        </motion.p>

        <MaintenanceLoop reduce={reduce} />

        <motion.p
          className="mt-2 max-w-[20rem] px-1 font-serif-body text-[clamp(1.15rem,3.2vw,1.7rem)] leading-snug text-balance text-paper/90 sm:max-w-xl"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: reduce ? 0 : 0.28 }}
        >
          Thank you for your patience
        </motion.p>
      </div>
    </section>
  );
}
