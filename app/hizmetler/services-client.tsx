"use client";

import { PageShell, useLoomReveal } from "@/components/page-shell";
import {
  LOOM,
  WeaveBandDivider,
  LoomCard,
  KilimMotif,
} from "@/components/loom-theme";
import type { SiteContent } from "@/lib/content";

export function ServicesClient({ content: c }: { content: SiteContent }) {
  const scopeRef = useLoomReveal();

  return (
    <PageShell
      kicker="Hizmetler"
      title="Her ilişki kendi"
      accent="desenini dokur"
      scopeRef={scopeRef}
      siteName={c.site.name.toUpperCase()}
    >
      <section className="relative z-[1] pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl gap-7 md:grid-cols-2 lg:grid-cols-3">
            {c.services.map((s, i) => (
              <LoomCard
                key={s.title}
                data-reveal
                className="p-7"
                motifColor={i % 2 === 0 ? LOOM.warp : LOOM.weft}
              >
                <div className="transition-transform duration-300 group-hover:scale-110" style={{ width: 56 }}>
                  <KilimMotif kind={i} />
                </div>
                <h3 className="mt-4 text-2xl">{s.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed" style={{ color: LOOM.muted }}>
                  {s.desc}
                </p>
                <div className="mt-5 flex gap-2">
                  <span
                    className="rounded-full border px-3 py-1 text-[11px]"
                    style={{ borderColor: `${LOOM.warp}55`, color: LOOM.warp }}
                  >
                    {s.duration}
                  </span>
                  <span
                    className="rounded-full border px-3 py-1 text-[11px]"
                    style={{ borderColor: `${LOOM.weft}55`, color: LOOM.weft }}
                  >
                    {s.method}
                  </span>
                </div>
              </LoomCard>
            ))}
          </div>

          <WeaveBandDivider />

          <p
            data-reveal
            className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed"
            style={{ color: LOOM.muted }}
          >
            İlk görüşmeye çift olarak da tek başınıza da gelebilirsiniz — tezgah
            iki kişiyle kurulur ama ilk iplik çoğu zaman tek elden gelir.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
