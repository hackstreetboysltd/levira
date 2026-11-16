"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";
import { nav, site } from "@/content/levira";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const reduce = useReducedMotion();
  const isImmersive = pathname === "/";
  const showBrand = !isImmersive;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setHidden(false);
      return;
    }

    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;

      if (y < 8) {
        setHidden(false);
      } else if (delta > 6) {
        setHidden(true);
      } else if (delta < -6) {
        setHidden(false);
      }

      lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open, pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 bg-transparent safe-pt",
          reduce
            ? undefined
            : "transition-transform duration-300 ease-out",
          hidden && !open ? "-translate-y-full" : "translate-y-0",
        )}
      >
        <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto] items-center gap-3 safe-px py-4 sm:h-16 sm:grid-cols-[1fr_auto_1fr] sm:px-6 sm:py-0">
          {showBrand ? (
            <Link
              href="/"
              className="font-display justify-self-start text-xl font-bold tracking-tight text-deep sm:text-2xl"
              onClick={() => setOpen(false)}
            >
              {site.brand}
            </Link>
          ) : (
            <div className="justify-self-start" aria-hidden />
          )}

          <nav
            className="hidden items-center gap-1 sm:flex"
            aria-label="Primary"
          >
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 text-sm font-medium transition-colors",
                    isImmersive
                      ? active
                        ? "text-mist underline decoration-cyan decoration-2 underline-offset-8"
                        : "text-mist/70 hover:text-mist"
                      : active
                        ? "text-deep underline decoration-cyan decoration-2 underline-offset-8"
                        : "text-deep/65 hover:text-deep",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="justify-self-end">
            <button
              type="button"
              className={cn(
                "inline-flex size-11 items-center justify-center rounded-xl border sm:hidden",
                isImmersive
                  ? "border-mist/25 bg-mist/10 text-mist"
                  : "border-deep/15 bg-paper text-deep",
              )}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Reserves header height in flow; scrolls away so page content can cover the top. */}
      {!isImmersive ? (
        <div className="h-14 shrink-0 sm:h-16" aria-hidden />
      ) : null}

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.22 }}
            className={cn(
              "fixed inset-0 z-[60] flex flex-col sm:hidden",
              isImmersive ? "bg-deep text-paper" : "bg-paper text-deep",
            )}
          >
            <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between border-b border-current/10 safe-px safe-pt">
              {showBrand ? (
                <span className="font-display text-xl font-bold tracking-tight">
                  {site.brand}
                </span>
              ) : (
                <span aria-hidden />
              )}
              <button
                type="button"
                className={cn(
                  "inline-flex size-11 items-center justify-center rounded-xl border",
                  isImmersive
                    ? "border-mist/25 bg-mist/10 text-mist"
                    : "border-deep/15 bg-mist text-deep",
                )}
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              >
                <X className="size-5" />
              </button>
            </div>
            <nav
              className="flex flex-1 flex-col items-center gap-1 px-4 pb-8 pt-4 safe-pb"
              aria-label="Mobile"
            >
              {nav.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex min-h-12 w-full max-w-xs items-center justify-center rounded-xl px-4 py-3 text-center text-lg font-medium",
                      isImmersive
                        ? active
                          ? "bg-cyan/25 text-paper"
                          : "text-paper/80 hover:bg-paper/10"
                        : active
                          ? "bg-cyan/15 text-deep"
                          : "text-deep/80 hover:bg-mist",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
