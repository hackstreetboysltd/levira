import type { Metadata } from "next";
import { PartnersWall } from "@/components/sections/PartnersWall";

export const metadata: Metadata = {
  title: "Partners",
  description:
    "Governments, donors, private sector, and institutions we work with.",
};

export default function PartnersPage() {
  return <PartnersWall />;
}
