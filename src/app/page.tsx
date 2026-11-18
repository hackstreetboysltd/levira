import { Hero } from "@/components/sections/Hero";
import { MaintenanceHero } from "@/components/sections/MaintenanceHero";

const maintenanceMode = process.env.MAINTENANCE_MODE === "true";

export default function HomePage() {
  return maintenanceMode ? <MaintenanceHero /> : <Hero />;
}
