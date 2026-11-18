"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { motion, useReducedMotion } from "motion/react";
import { AtmospherePlane } from "@/components/atmosphere/AtmospherePlane";
import { site } from "@/content/levira";

function MaintenanceLoop({ reduce }: { reduce: boolean | null }) {
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <motion.div
      className="mt-8 aspect-square w-full max-w-[18rem] sm:max-w-[20rem]"
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease, delay: reduce ? 0 : 0.22 }}
      aria-hidden
    >
      <DotLottieReact
        src="/lottie/under-maintenance.lottie"
        loop
        autoplay={!reduce}
        style={{ width: "100%", height: "100%" }}
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
          <br />
          Thank you for your patience
        </motion.p>

        <MaintenanceLoop reduce={reduce} />
      </div>
    </section>
  );
}
