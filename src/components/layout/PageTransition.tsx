"use client";

export function PageTransition({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-1 flex-col animate-in fade-in duration-500">{children}</div>;
}
