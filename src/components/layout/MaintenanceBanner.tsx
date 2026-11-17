"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";

/** Survives client navigations; resets on full page refresh. */
let dismissedInSession = false;

export function MaintenanceBanner() {
  const [open, setOpen] = useState(!dismissedInSession);
  const reduce = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;

  function dismiss() {
    dismissedInSession = true;
    setOpen(false);
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          role="status"
          aria-live="polite"
          initial={reduce ? false : { opacity: 0, y: -12, x: -8 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -12, x: -8 }}
          transition={{ duration: 0.3, ease }}
          className="fixed top-4 left-4 z-[60] w-auto max-w-[calc(100vw-2rem)] rounded-xl bg-paper text-deep shadow-[0_8px_28px_rgba(0,0,0,0.18)] sm:top-5 sm:left-5 sm:max-w-[calc(100vw-2.5rem)]"
        >
          <div className="flex items-center gap-2.5 p-2.5">
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss maintenance notice"
              className="inline-flex shrink-0 items-center justify-center text-primary transition-colors hover:text-primary/80"
            >
              <X className="size-4" strokeWidth={2} aria-hidden />
            </button>
            <p className="m-0 font-sans text-sm leading-snug whitespace-nowrap text-deep">
              We’re Under Maintenance.
              <br />
              Thank you for your patience
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
