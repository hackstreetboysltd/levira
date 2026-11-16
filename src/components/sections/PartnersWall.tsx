import { Suspense } from "react";
import { AtmospherePlane } from "@/components/atmosphere/AtmospherePlane";
import { PartnerCoverflow } from "@/components/sections/PartnerCoverflow";
import { partnersIntro } from "@/content/levira";

function CoverflowFallback() {
  return (
    <div
      className="mx-auto mt-8 flex min-h-[12rem] max-w-6xl items-center justify-center px-4 sm:mt-10 sm:min-h-[20rem] sm:px-6"
      aria-hidden="true"
    >
      <div className="aspect-[17/16.5] h-auto w-[min(42vw,17rem)] rounded-2xl border border-deep/10 bg-deep/90 sm:h-64 sm:w-60" />
    </div>
  );
}

export function PartnersWall() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 sm:h-52">
        <AtmospherePlane variant="strip" />
      </div>

      <div className="relative w-full pt-12 pb-14 safe-px sm:pt-20 sm:pb-20">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <h1 className="text-center font-display text-[clamp(1.25rem,3.5vw,1.75rem)] leading-[1.15] font-bold tracking-tight text-deep text-balance">
            {partnersIntro.title}
          </h1>
        </div>

        <div className="mt-6 sm:mt-8">
          <Suspense fallback={<CoverflowFallback />}>
            <PartnerCoverflow />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
