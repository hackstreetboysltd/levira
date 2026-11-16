import type { Metadata } from "next";
import { AboutStory } from "@/components/sections/AboutStory";

export const metadata: Metadata = {
  title: "About",
  description:
    "We are a Nairobi-based research and consultancy practice for WASH and public health. Field depth, policy clarity.",
};

export default function AboutPage() {
  return <AboutStory />;
}
