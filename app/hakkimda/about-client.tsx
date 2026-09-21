"use client";

import { PageShell, useLoomReveal } from "@/components/page-shell";
import {
  LOOM,
  WeaveBandDivider,
  LoomCard,
} from "@/components/loom-theme";
import type { SiteContent } from "@/lib/content";

export function AboutClient({ content: c }: { content: SiteContent }) {
  const scopeRef = useLoomReveal();

  return (
    <PageShell
      kicker="Hakkında"
      title="Tezgahın başında"
      accent="kim var"
      scopeRef={scopeRef}
      siteName={c.site.name.toUpperCase()}
    >
      <section className="relative z-[1] pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Tanıtım kartı */}
          <LoomCard
            data-reveal
            className="mx-auto max-w-2xl overflow-hidden p-10"
            motifColor={LOOM.warp}
          >
            <span
              className="absolute inset-x-0 top-0 h-1.5"
              style={{ background: `repeating-linear-gradient(90deg, ${LOOM.warp} 0 14px, ${LOOM.weft} 14px 28px)` }}
              aria-hidden="true"
            />
            <h2 className="text-3xl">{c.site.name}</h2>
            <p className="mt-1 text-sm tracking-[0.12em]" style={{ color: LOOM.warp }}>
              {c.site.title}
            </p>
            <p className="mt-5 leading-relaxed" style={{ color: LOOM.muted }}>
              {c.about.intro}
            </p>
          </LoomCard>

          <WeaveBandDivider />

          {/* Zaman çizelgesi */}
          <div className="relative mx-auto mt-10 max-w-3xl">
            <div
              className="absolute left-4 top-0 h-full w-px md:left-1/2"
              style={{
                background: `linear-gradient(to bottom, transparent, ${LOOM.warp}66 15%, ${LOOM.weft}66 85%, transparent)`,
              }}
              aria-hidden="true"
            />
            <div className="space-y-14">
              {c.about.credentials.map((item, i) => (
                <div
                  key={item.title}
                  data-reveal
                  className={`relative flex flex-col gap-2 pl-12 md:w-[46%] md:pl-0 ${
                    i % 2 === 0 ? "md:mr-auto md:pr-10 md:text-right" : "md:ml-auto md:pl-10"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-3 w-3 rounded-full border-2 md:top-2 ${
                      i % 2 === 0
                        ? "left-[10px] md:left-auto md:-right-[7px]"
                        : "left-[10px] md:-left-[7px]"
                    }`}
                    style={{
                      borderColor: i % 2 === 0 ? LOOM.warp : LOOM.weft,
                      background: LOOM.cloth,
                    }}
                    aria-hidden="true"
                  />
                  <p className="text-[11px] tracking-[0.3em]" style={{ color: i % 2 === 0 ? LOOM.warp : LOOM.weft }}>
                    {i % 2 === 0 ? "ÇÖZGÜ" : "ATKI"}
                  </p>
                  <h3 className="text-2xl">{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: LOOM.muted }}>
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
