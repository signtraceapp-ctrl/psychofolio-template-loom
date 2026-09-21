"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LoomHeader } from "./loom-header";
import {
  LOOM,
  ThreadDivider,
  HeroThreadLines,
  bgLayerStyles,
} from "./loom-theme";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* -- Shared reveal hook -- */
export function useLoomReveal() {
  const scopeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
    const scope = scopeRef.current;
    if (!scope) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 30,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });
    }, scope);
    return () => ctx.revert();
  }, []);
  return scopeRef;
}

/* -- Shared page scaffold -- */
export function PageShell({
  kicker,
  title,
  accent,
  children,
  scopeRef,
  siteName,
}: {
  kicker: string;
  title: string;
  accent?: string;
  children: React.ReactNode;
  scopeRef: React.RefObject<HTMLDivElement | null>;
  siteName?: string;
}) {
  return (
    <div
      ref={scopeRef}
      className="loom-root loom-bg-layers min-h-screen pb-24 font-sans"
      style={{
        colorScheme: "light",
        color: LOOM.ink,
        background: `linear-gradient(165deg, ${LOOM.ecru} 0%, #f1ece3 40%, #eee9e0 100%)`,
      }}
    >
      <style>{`
        .loom-root :is(h1,h2,h3){font-family:var(--font-loom),var(--font-display),serif;font-weight:500;letter-spacing:-0.005em}
        .loom-root ::selection{background:${LOOM.warp}33}
        ${bgLayerStyles}
      `}</style>
      <LoomHeader siteName={siteName} />

      <header className="relative z-[1] pb-12 pt-28 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p
            data-reveal
            className="mx-auto flex items-center justify-center gap-3 text-[11px] tracking-[0.3em]"
            style={{ color: LOOM.muted }}
          >
            <span className="h-px w-8" style={{ background: LOOM.warp }} aria-hidden="true" />
            {kicker.toUpperCase()}
            <span className="h-px w-8" style={{ background: LOOM.weft }} aria-hidden="true" />
          </p>
          <div className="relative" data-reveal>
            <HeroThreadLines />
            <h1 className="relative z-[1] mx-auto mt-6 max-w-3xl text-6xl font-light leading-[0.95] sm:text-7xl md:text-8xl">
              {title}{" "}
              {accent && (
                <span className="italic font-medium" style={{ color: LOOM.warp }}>
                  {accent}
                </span>
              )}
            </h1>
          </div>
          <div data-reveal className="mt-8">
            <ThreadDivider />
          </div>
        </div>
      </header>

      {children}

      <footer className="relative z-[1] border-t py-10 text-center" style={{ borderColor: `${LOOM.ink}14` }}>
        <p className="text-xs tracking-[0.14em]" style={{ color: LOOM.muted }}>
          LOOM · desen ancak birlikte görünür
        </p>
      </footer>
    </div>
  );
}
