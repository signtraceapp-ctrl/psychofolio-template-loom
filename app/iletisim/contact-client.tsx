"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { PageShell, useLoomReveal } from "@/components/page-shell";
import { LOOM, LoomCard } from "@/components/loom-theme";
import type { SiteContent } from "@/lib/content";

export function ContactClient({ content: c }: { content: SiteContent }) {
  const scopeRef = useLoomReveal();
  const [name, setName] = useState("");
  const [partner, setPartner] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const knotRef = useRef<SVGSVGElement>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent("İletişim Formu");
    const body = encodeURIComponent(`Ad: ${name}${partner ? `\nPartner: ${partner}` : ""}\nE-posta: ${email}`);
    window.location.href = `mailto:${c.site.email}?subject=${subject}&body=${body}`;
    setSent(true);
    requestAnimationFrame(() => {
      if (knotRef.current) {
        gsap.fromTo(
          knotRef.current,
          { scale: 0.5, rotate: -30, opacity: 0 },
          { scale: 1, rotate: 0, opacity: 1, duration: 0.8, ease: "back.out(1.6)" },
        );
      }
    });
  };

  const inputStyle: React.CSSProperties = {
    background: LOOM.ecru,
    border: `1px solid ${LOOM.ink}22`,
    borderRadius: 12,
    color: LOOM.ink,
  };

  return (
    <PageShell
      kicker="İletişim"
      title="İlk ilmeği"
      accent="birlikte atalım"
      scopeRef={scopeRef}
      siteName={c.site.name.toUpperCase()}
    >
      <section className="relative z-[1] pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-4xl gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <LoomCard
              data-reveal
              className="overflow-hidden p-8 sm:p-10"
              motifColor={LOOM.warp}
            >
              <span
                className="absolute inset-x-0 top-0 h-1.5"
                style={{ background: `repeating-linear-gradient(90deg, ${LOOM.warp} 0 14px, ${LOOM.weft} 14px 28px)` }}
                aria-hidden="true"
              />
              {!sent ? (
                <form onSubmit={submit} className="space-y-5">
                  <p className="text-sm leading-relaxed" style={{ color: LOOM.muted }}>
                    {c.contact.intro}
                  </p>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="loom-name" className="mb-1.5 block text-[11px] tracking-[0.2em]" style={{ color: LOOM.warp }}>
                        ADINIZ
                      </label>
                      <input
                        id="loom-name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 text-sm outline-none transition-shadow duration-200 focus:shadow-[0_0_0_2px_rgba(179,80,46,0.3)]"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label htmlFor="loom-partner" className="mb-1.5 block text-[11px] tracking-[0.2em]" style={{ color: LOOM.weft }}>
                        PARTNERİNİZİN ADI (İSTEĞE BAĞLI)
                      </label>
                      <input
                        id="loom-partner"
                        value={partner}
                        onChange={(e) => setPartner(e.target.value)}
                        className="w-full px-4 py-3 text-sm outline-none transition-shadow duration-200 focus:shadow-[0_0_0_2px_rgba(58,90,140,0.3)]"
                        style={inputStyle}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="loom-email" className="mb-1.5 block text-[11px] tracking-[0.2em]" style={{ color: LOOM.muted }}>
                      E-POSTA
                    </label>
                    <input
                      id="loom-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 text-sm outline-none transition-shadow duration-200 focus:shadow-[0_0_0_2px_rgba(51,44,36,0.2)]"
                      style={inputStyle}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-full py-3.5 text-sm tracking-[0.2em] text-white transition-transform duration-200 hover:scale-[1.01]"
                    style={{ background: `linear-gradient(90deg, ${LOOM.warp}, ${LOOM.weft})` }}
                  >
                    {c.contact.formSubmit.toUpperCase()}
                  </button>
                </form>
              ) : (
                <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                  <svg ref={knotRef} width="76" height="76" viewBox="0 0 76 76" fill="none" aria-hidden="true">
                    <path
                      d="M14 38 C 14 20, 38 20, 38 38 S 62 56, 62 38 S 38 20, 38 38 S 14 56, 14 38 Z"
                      stroke={LOOM.warp}
                      strokeWidth="3.4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M14 38 C 14 56, 38 56, 38 38 S 62 20, 62 38"
                      stroke={LOOM.weft}
                      strokeWidth="3.4"
                      strokeLinecap="round"
                    />
                  </svg>
                  <h3 className="mt-6 text-3xl">
                    İlmek atıldı{name ? `, ${name.split(" ")[0]}` : ""}
                    {partner ? ` & ${partner.split(" ")[0]}` : ""}
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed" style={{ color: LOOM.muted }}>
                    En geç bir iş günü içinde{" "}
                    {email ? <span style={{ color: LOOM.warp }}>{email}</span> : "e-postanıza"}{" "}
                    adresinden dönüş yapılır.
                  </p>
                </div>
              )}
            </LoomCard>

            <div data-reveal className="space-y-8 lg:pt-4">
              {[
                { k: "SEANS", v: c.site.hours, c: LOOM.warp },
                { k: "KONUM", v: c.site.address, c: LOOM.weft },
                { k: "E-POSTA", v: c.site.email, c: LOOM.warp },
                { k: "TELEFON", v: c.site.phone, c: LOOM.weft },
              ].map((row) => (
                <div key={row.k} className="border-b pb-5" style={{ borderColor: `${LOOM.ink}14` }}>
                  <p className="text-[11px] tracking-[0.3em]" style={{ color: row.c }}>
                    {row.k}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed">{row.v}</p>
                </div>
              ))}
              <p className="text-xs leading-relaxed" style={{ color: LOOM.muted }}>
                Şiddet içeren bir ilişki içindeyseniz öncelikle güvenliğiniz gelir:
                Aile İçi Şiddet Hattı 183&apos;ü arayabilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
