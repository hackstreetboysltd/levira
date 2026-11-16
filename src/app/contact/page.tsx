import type { Metadata } from "next";
import { ContactPanel } from "@/components/sections/ContactPanel";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "We take on program design, evaluations, research, policy support, training, and technical advisory assignments.",
};

export default function ContactPage() {
  return <ContactPanel />;
}
