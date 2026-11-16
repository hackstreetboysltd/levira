import type { Metadata } from "next";
import { ExpertiseGrid } from "@/components/sections/ExpertiseGrid";

export const metadata: Metadata = {
  title: "Expertise",
  description:
    "We cover WASH programming, public health, research, policy, and leadership across African contexts.",
};

export default function ExpertisePage() {
  return <ExpertiseGrid />;
}
