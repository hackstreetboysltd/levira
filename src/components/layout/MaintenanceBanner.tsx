"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";

export function MaintenanceBanner() {
  const [open, setOpen] = useState(true);
  const reduce = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          role="status"
          aria-live="polite"
          initial={reduce ? false : { y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.35, ease }}
          className="fixed inset-x-0 bottom-0 z-50 rounded-t-[1.5rem] bg-paper px-4 py-3 text-deep shadow-[0_-8px_28px_rgba(0,0,0,0.18)]"
        >
          <div className="flex items-start gap-3">
            <p className="min-w-0 flex-1 text-center font-sans text-sm leading-snug text-deep">
              We’re Under Maintenance. Thank you for your patience
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Dismiss maintenance notice"
              className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-deep/60 transition-colors hover:bg-deep/5 hover:text-deep"
            >
              <X className="size-4" strokeWidth={2} aria-hidden />
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
