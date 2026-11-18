import type { Metadata } from "next";
import { Figtree, Source_Serif_4, Syne } from "next/font/google";
import { PageTransition } from "@/components/layout/PageTransition";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Waterline } from "@/components/layout/Waterline";
import { site } from "@/content/levira";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800"],
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "600"],
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-ui",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `${site.brand} · ${site.tagline}`,
    template: `%s · ${site.brand}`,
  },
  description: site.description,
};

const maintenanceMode = process.env.MAINTENANCE_MODE === "true";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${syne.variable} ${sourceSerif.variable} ${figtree.variable} h-full`}
    >
      {maintenanceMode ? (
        <head>
          <link
            rel="preload"
            href="/lottie/under-maintenance-poster.png"
            as="image"
            type="image/png"
          />
          <link
            rel="preload"
            href="/lottie/under-maintenance.json"
            as="fetch"
            crossOrigin="anonymous"
          />
        </head>
      ) : null}
      <body className="flex min-h-full flex-col font-sans">
        <ThemeProvider>
          <Waterline />
          {!maintenanceMode ? <SiteHeader /> : null}
          <main className="flex flex-1 flex-col">
            <PageTransition>{children}</PageTransition>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
