import { getContent } from "@/lib/content";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Hizmetler" };
export default function ServicesPage() {
  const c = getContent();
  return (
    <div className="font-sans bg-bg text-fg">
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-14">
            <div className="text-center space-y-4">
              <h1 className="font-display text-4xl font-semibold tracking-tight text-fg">Terapi Hizmetleri</h1>
              <p className="text-sm text-fg-muted">Seans bilgisi icin iletisime gecin.</p>
            </div>
            <div className="mx-auto max-w-3xl grid gap-5 sm:grid-cols-2">
              {c.services.map((s, i) => (
                <div key={i} className="rounded-[16px] border border-border/40 bg-bg p-7 space-y-3 hover:border-primary/30 hover:shadow-md transition-all duration-300">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-display text-lg font-semibold text-fg">{s.title}</h2>
                    <span className="flex-shrink-0 text-[10px] tracking-wider uppercase text-accent bg-accent/10 rounded-[8px] px-3 py-1 font-semibold">{s.duration}</span>
                  </div>
                  <p className="text-sm text-fg-muted leading-relaxed">{s.desc}</p>
                  <p className="text-xs text-fg-muted/60">{s.method}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
