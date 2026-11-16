"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { MagneticButton } from "@/components/unlumen-ui/magnetic-button";
import { AtmospherePlane } from "@/components/atmosphere/AtmospherePlane";
import { site } from "@/content/levira";

export function Hero() {
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
          className="mt-7 whitespace-nowrap font-serif-body text-[clamp(1.15rem,3.2vw,1.7rem)] leading-snug text-paper/90"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: reduce ? 0 : 0.12 }}
        >
          {site.headline}
        </motion.p>

        <motion.div
          className="mt-10 w-auto"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease, delay: reduce ? 0 : 0.22 }}
        >
          <MagneticButton
            asChild
            size="lg"
            className="h-12 min-h-11 w-auto rounded-xl bg-cyan px-8 text-base text-paper hover:bg-cyan/90"
            strength={0.55}
          >
            <Link href="/contact">Start a conversation</Link>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
