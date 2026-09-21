"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PageShell, useLoomReveal } from "@/components/page-shell";
import { LOOM, ThreadDivider } from "@/components/loom-theme";
import type { SiteContent } from "@/lib/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const LOOM_ROWS = 12;

export function ApproachClient({ content: c }: { content: SiteContent }) {
  const scopeRef = useLoomReveal();
  const stepsRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(SVGRectElement | null)[]>([]);

  useEffect(() => {
    const steps = stepsRef.current;
    if (!steps) return;
    rowRefs.current.forEach((r) => {
      if (r) r.setAttribute("width", "0");
    });
    const st = ScrollTrigger.create({
      trigger: steps,
      start: "top 70%",
      end: "bottom 55%",
      scrub: true,
      onUpdate: (self) => {
        const total = self.progress * LOOM_ROWS;
        rowRefs.current.forEach((rect, i) => {
          if (!rect) return;
          const k = Math.min(1, Math.max(0, total - i));
          rect.setAttribute("width", `${k * 168}`);
        });
      },
    });
    return () => st.kill();
  }, []);

  return (
    <PageShell
      kicker="Yaklaşım"
      title="Desen dört adımda"
      accent="belirir"
      scopeRef={scopeRef}
      siteName={c.site.name.toUpperCase()}
    >
      <section className="relative z-[1] pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl gap-14 lg:grid-cols-2">
            {/* Sol: sabit tezgah */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div
                className="w-full rounded-2xl border py-32 lg:py-10"
                style={{ background: LOOM.cloth, borderColor: `${LOOM.ink}12` }}
              >
                <div className="px-10">
                  <svg viewBox="0 0 200 170" fill="none" className="w-full" aria-hidden="true">
                    <rect x="8" y="6" width="184" height="7" rx="3" fill={`${LOOM.ink}55`} />
                    <rect x="8" y="157" width="184" height="7" rx="3" fill={`${LOOM.ink}55`} />
                    {Array.from({ length: 15 }).map((_, i) => (
                      <line
                        key={i}
                        x1={16 + i * 12}
                        y1="13"
                        x2={16 + i * 12}
                        y2="157"
                        stroke={LOOM.warp}
                        strokeOpacity="0.45"
                        strokeWidth="1.6"
                      />
                    ))}
                    {Array.from({ length: LOOM_ROWS }).map((_, i) => (
                      <rect
                        key={i}
                        ref={(el) => {
                          rowRefs.current[i] = el;
                        }}
                        x="16"
                        y={22 + i * 11}
                        width="0"
                        height="7"
                        rx="2"
                        fill={i % 2 === 0 ? LOOM.weft : `${LOOM.weft}bb`}
                      />
                    ))}
                  </svg>
                </div>
                <p className="mt-8 text-center text-sm tracking-[0.24em] sm:text-base" style={{ color: LOOM.muted }}>
                  KAYDIRDIKÇA KUMAŞ DOKUNUR
                </p>
              </div>
            </div>

            {/* Sağ: aşamalar */}
            <div ref={stepsRef} className="space-y-16 lg:py-10">
              {c.approach.principles.map((p, i) => (
                <div key={p.title} data-reveal>
                  <p className="text-[11px] tracking-[0.3em]" style={{ color: i % 2 === 0 ? LOOM.warp : LOOM.weft }}>
                    {`0${i + 1} · ${i % 2 === 0 ? "ÇÖZGÜ" : "ATKI"}`}
                  </p>
                  <h3 className="mt-2 text-3xl">{p.title}</h3>
                  <p className="mt-3 leading-relaxed" style={{ color: LOOM.muted }}>
                    {p.desc}
                  </p>
                  {i < c.approach.principles.length - 1 && (
                    <div className="mt-10">
                      <ThreadDivider w={140} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
