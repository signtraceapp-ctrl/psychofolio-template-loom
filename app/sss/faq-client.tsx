"use client";

import { useState } from "react";
import { PageShell, useLoomReveal } from "@/components/page-shell";
import { LOOM } from "@/components/loom-theme";
import type { SiteContent } from "@/lib/content";

export function FaqClient({ content: c }: { content: SiteContent }) {
  const scopeRef = useLoomReveal();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <PageShell
      kicker="SSS"
      title="Düğümleri birlikte"
      accent="çözelim"
      scopeRef={scopeRef}
      siteName={c.site.name.toUpperCase()}
    >
      <section className="relative z-[1] pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl space-y-4">
            {c.faq.map((f, i) => (
              <div
                key={f.q}
                data-reveal
                className="relative overflow-hidden rounded-2xl border shadow-[0_10px_30px_rgba(51,44,36,0.05)] ring-1 ring-inset transition-[border-color,box-shadow] duration-200"
                style={{
                  background: LOOM.cloth,
                  borderColor: open === i ? (i % 2 === 0 ? `${LOOM.warp}66` : `${LOOM.weft}66`) : `${LOOM.ink}12`,
                  boxShadow: `inset 0 0 0 1px ${LOOM.ink}08, 0 10px 30px rgba(51,44,36,0.05)`,
                }}
              >
                <button
                  className="flex w-full items-center gap-4 px-6 py-5 text-left"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                >
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="shrink-0" aria-hidden="true">
                    {open === i ? (
                      <path d="M2 11 L20 11" stroke={i % 2 === 0 ? LOOM.warp : LOOM.weft} strokeWidth="2" strokeLinecap="round" />
                    ) : (
                      <path
                        d="M4 14 C 7 6, 10 17, 13 9 C 15 4, 18 13, 19 8"
                        stroke={i % 2 === 0 ? LOOM.warp : LOOM.weft}
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    )}
                  </svg>
                  <span className="flex-1 text-lg leading-snug" style={{ fontFamily: "var(--font-loom), serif" }}>
                    {f.q}
                  </span>
                </button>
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ${
                    open === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 pl-[62px] text-sm leading-relaxed" style={{ color: LOOM.muted }}>
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
