"use client";

/**
 * LOOM — Ana sayfa: iki ipliğin dokuma yolculuğu.
 * Pinned 3D sahne: iki demet yaklaşır, çözgü kurulur, atkı satır satır dokur.
 * Ardından: dokuma ritüeli, felsefe, hizmet özeti, alıntı ve kapanış.
 */

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LazyLoomScene } from "@/components/three/lazy-loom-scene";
import { LoomHeader } from "@/components/loom-header";
import {
  LOOM,
  ThreadDivider,
  WeaveBandDivider,
  LoomCard,
  KilimMotif,
  bgLayerStyles,
} from "@/components/loom-theme";
import type { SiteContent } from "@/lib/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const journeyPhases = [
  {
    title: "İki ayrı",
    accent: "iplik",
    body: "Herkes ilişkiye kendi rengi, kendi geçmişi ve kendi düğümleriyle gelir.",
  },
  {
    title: "Gerilim,",
    accent: "düşman değildir",
    body: "Tezgahta gevşek iplik dokunamaz. Sorun gerilim değil, onun nereye çekildiğidir.",
  },
  {
    title: "Altından ve üstünden —",
    accent: "sırayla",
    body: "Dokuma sıra ister: bir dinlemek, bir konuşmak. Terapide bu sırayı yeniden öğreniriz.",
  },
  {
    title: "Desen ancak birlikte",
    accent: "görünür",
    body: "Tek iplik çizgidir; iki iplik desendir. İlişkiniz ikinizden büyüktür.",
  },
  {
    title: "İlk ilmeği birlikte",
    accent: "atalım",
    body: "",
  },
] as const;

const PHASE_THRESHOLDS = [0.2, 0.45, 0.65, 0.87];

function phaseFor(p: number) {
  for (let i = 0; i < PHASE_THRESHOLDS.length; i++) {
    if (p < PHASE_THRESHOLDS[i]) return i;
  }
  return journeyPhases.length - 1;
}

/* İki kelimeyi harf harf iki renkte dokuyan yardımcı */
function interleave(a: string, b: string) {
  const out: { ch: string; from: 0 | 1 }[] = [];
  const max = Math.max(a.length, b.length);
  for (let i = 0; i < max; i++) {
    if (i < a.length) out.push({ ch: a[i], from: 0 });
    if (i < b.length) out.push({ ch: b[i], from: 1 });
  }
  return out;
}

/* — Dokuma ritüeli — */
function WeaveRitual() {
  const [w1, setW1] = useState("");
  const [w2, setW2] = useState("");
  const [woven, setWoven] = useState(false);
  const clothRef = useRef<HTMLDivElement>(null);

  const weave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!w1.trim() || !w2.trim() || woven) return;
    setWoven(true);
    requestAnimationFrame(() => {
      const cloth = clothRef.current;
      if (!cloth) return;
      gsap.fromTo(
        cloth.querySelectorAll("[data-letter]"),
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power2.out" },
      );
      gsap.fromTo(
        cloth.querySelectorAll("[data-row]"),
        { scaleX: 0 },
        { scaleX: 1, duration: 0.7, stagger: 0.12, ease: "power2.inOut", transformOrigin: "left center" },
      );
    });
  };

  return (
    <section className="relative z-[1] py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p data-reveal className="text-[11px] tracking-[0.3em]" style={{ color: LOOM.warp }}>
            KÜÇÜK BİR RİTÜEL
          </p>
          <h2 data-reveal className="mt-4 text-4xl sm:text-5xl">
            İki kelime, tek{" "}
            <span className="italic" style={{ color: LOOM.warp }}>
              desen
            </span>
          </h2>
          <p data-reveal className="mx-auto mt-4 max-w-md text-sm leading-relaxed" style={{ color: LOOM.muted }}>
            Siz bir kelime yazın, partneriniz bir kelime — ilişkinizden
            beklediğiniz iki şey. Tezgah ikisini tek desende dokusun.
          </p>
          <LoomCard
            data-reveal
            className="mt-10 overflow-hidden p-8 sm:p-12"
            motifColor={LOOM.weft}
          >
            {!woven ? (
              <form onSubmit={weave} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="loom-w1" className="mb-1.5 block text-[11px] tracking-[0.2em]" style={{ color: LOOM.warp }}>
                      SİZİN KELİMENİZ
                    </label>
                    <input
                      id="loom-w1"
                      value={w1}
                      onChange={(e) => setW1(e.target.value)}
                      maxLength={14}
                      placeholder="ör. güven"
                      className="w-full rounded-xl px-4 py-3 text-center text-sm outline-none transition-shadow duration-200 focus:shadow-[0_0_0_2px_rgba(179,80,46,0.3)]"
                      style={{ background: LOOM.ecru, border: `1px solid ${LOOM.warp}44`, color: LOOM.warp }}
                    />
                  </div>
                  <div>
                    <label htmlFor="loom-w2" className="mb-1.5 block text-[11px] tracking-[0.2em]" style={{ color: LOOM.weft }}>
                      PARTNERİNİZİN KELİMESİ
                    </label>
                    <input
                      id="loom-w2"
                      value={w2}
                      onChange={(e) => setW2(e.target.value)}
                      maxLength={14}
                      placeholder="ör. sabır"
                      className="w-full rounded-xl px-4 py-3 text-center text-sm outline-none transition-shadow duration-200 focus:shadow-[0_0_0_2px_rgba(58,90,140,0.3)]"
                      style={{ background: LOOM.ecru, border: `1px solid ${LOOM.weft}44`, color: LOOM.weft }}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="rounded-full px-8 py-3 text-xs tracking-[0.2em] text-white transition-transform duration-200 hover:scale-[1.02]"
                  style={{ background: `linear-gradient(90deg, ${LOOM.warp}, ${LOOM.weft})` }}
                >
                  DOKUMAYA BAŞLA
                </button>
              </form>
            ) : (
              <div ref={clothRef}>
                <div className="mx-auto max-w-xs space-y-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      data-row
                      className="h-1.5 rounded-full"
                      style={{ background: i % 2 === 0 ? `${LOOM.warp}66` : `${LOOM.weft}66` }}
                    />
                  ))}
                </div>
                <p className="mt-6 text-3xl tracking-wide" style={{ fontFamily: "var(--font-loom), serif" }}>
                  {interleave(w1.trim(), w2.trim()).map((l, i) => (
                    <span key={i} data-letter style={{ color: l.from === 0 ? LOOM.warp : LOOM.weft }}>
                      {l.ch}
                    </span>
                  ))}
                </p>
                <p className="mt-4 text-sm leading-relaxed" style={{ color: LOOM.muted }}>
                  Okunması zor, değil mi? Dokuma böyledir — iki iplik iç içe
                  geçer ama hiçbiri kaybolmaz. Terapide bu deseni birlikte
                  okunur hâle getiririz.
                </p>
                <Link
                  href="/iletisim"
                  className="mt-5 inline-block text-xs tracking-[0.2em] underline decoration-2 underline-offset-4"
                  style={{ color: LOOM.warp, textDecorationColor: `${LOOM.weft}88` }}
                >
                  İLK GÖRÜŞMEYİ PLANLAYIN
                </Link>
              </div>
            )}
            <p className="mt-6 text-[11px]" style={{ color: `${LOOM.muted}cc` }}>
              Yazdıklarınız hiçbir yere gönderilmez, kaydedilmez.
            </p>
          </LoomCard>
        </div>
      </div>
    </section>
  );
}

export function HomeClient({ content: c }: { content: SiteContent }) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const phaseIdxRef = useRef(0);

  const handleUpdate = useCallback((self: ScrollTrigger) => {
    progressRef.current = self.progress;
    const next = phaseFor(self.progress);
    if (next !== phaseIdxRef.current) {
      phaseIdxRef.current = next;
      setPhaseIdx(next);
    }
  }, []);

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

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const pin = pinRef.current;
    if (!wrapper || !pin) return;

    const st = ScrollTrigger.create({
      trigger: wrapper,
      start: "top top",
      end: "bottom bottom",
      pin,
      scrub: true,
      onUpdate: handleUpdate,
    });
    return () => st.kill();
  }, [handleUpdate]);

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
      <LoomHeader siteName={c.site.name.toUpperCase()} />

      {/* — Pinned dokuma yolculuğu — */}
      <section ref={wrapperRef} className="relative" style={{ height: "420vh" }} aria-label="Dokuma yolculuğu">
        <div ref={pinRef} className="relative h-screen w-full overflow-hidden">
          {/* Subtle fabric noise overlay */}
          <div
            className="pointer-events-none absolute inset-0 z-[1] opacity-[0.025]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: "256px 256px",
            }}
            aria-hidden="true"
          />

          <LazyLoomScene progressRef={progressRef} />

          {/* Marka çipi */}
          <div className="pointer-events-none absolute left-6 top-16 z-10 lg:left-10">
            <p
              className="rounded-full border px-4 py-2 text-[11px] tracking-[0.24em]"
              style={{
                background: `${LOOM.cloth}cc`,
                borderColor: `${LOOM.ink}14`,
                color: LOOM.muted,
                backdropFilter: "blur(6px)",
              }}
            >
              {c.site.name.toUpperCase()} · ÇİFT VE AİLE TERAPİSİ
            </p>
          </div>

          {/* Faz metinleri */}
          {journeyPhases.map((ph, i) => (
            <div
              key={i}
              className={`absolute inset-x-0 bottom-24 z-10 transition-[transform,opacity] duration-300 sm:bottom-28 ${
                phaseIdx === i ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-5 opacity-0"
              }`}
              aria-hidden={phaseIdx !== i}
            >
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div
                  className="max-w-xl rounded-2xl border p-7 sm:p-9"
                  style={{
                    background: `${LOOM.cloth}d9`,
                    borderColor: `${LOOM.ink}12`,
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <h2
                    className="text-4xl font-light leading-[1.08] sm:text-5xl md:text-6xl"
                    style={{ textShadow: `0 1px 2px ${LOOM.ink}0a` }}
                  >
                    {ph.title}{" "}
                    <span className="italic font-medium" style={{ color: i % 2 === 0 ? LOOM.warp : LOOM.weft }}>
                      {ph.accent}
                    </span>
                  </h2>
                  {ph.body && (
                    <p className="mt-4 max-w-md text-sm leading-relaxed sm:text-base" style={{ color: LOOM.muted }}>
                      {ph.body}
                    </p>
                  )}
                  {i === journeyPhases.length - 1 && (
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link
                        href="/iletisim"
                        className="rounded-full px-6 py-3 text-xs tracking-[0.2em] text-white transition-transform duration-200 hover:scale-[1.02]"
                        style={{ background: `linear-gradient(90deg, ${LOOM.warp}, ${LOOM.weft})` }}
                      >
                        RANDEVU AL
                      </Link>
                      <Link
                        href="/yaklasim"
                        className="rounded-full border px-6 py-3 text-xs tracking-[0.2em] transition-colors duration-200"
                        style={{ borderColor: `${LOOM.warp}55`, color: LOOM.warp }}
                      >
                        YAKLAŞIMI TANIYIN
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Faz göstergesi — ilmek sayacı */}
          <div className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-3 lg:right-14 lg:flex">
            {journeyPhases.map((_, i) => (
              <span
                key={i}
                className="block rounded-full border-2 transition-[width,height,background-color] duration-300"
                style={{
                  width: phaseIdx === i ? 14 : 9,
                  height: phaseIdx === i ? 14 : 9,
                  borderColor: i % 2 === 0 ? LOOM.warp : LOOM.weft,
                  background: phaseIdx === i ? (i % 2 === 0 ? LOOM.warp : LOOM.weft) : "transparent",
                }}
                aria-hidden="true"
              />
            ))}
          </div>

          {/* Kaydır ipucu */}
          <div
            className={`absolute bottom-20 left-1/2 z-10 -translate-x-1/2 transition-opacity duration-300 ${
              phaseIdx === 0 ? "opacity-70" : "opacity-0"
            }`}
          >
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] tracking-[0.24em]" style={{ color: LOOM.warp }}>
                KAYDIR
              </span>
              <span
                className="h-6 w-px animate-pulse"
                style={{ background: `linear-gradient(to bottom, ${LOOM.warp}, transparent)` }}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </section>

      <WeaveBandDivider />

      {/* — Dokuma ritüeli — */}
      <WeaveRitual />

      <WeaveBandDivider />

      {/* — Felsefe — */}
      <section className="relative z-[1] py-24" style={{ background: `${LOOM.cloth}99` }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p data-reveal className="text-[11px] tracking-[0.3em]" style={{ color: LOOM.weft }}>
              FELSEFE
            </p>
            <h2 data-reveal className="mt-4 text-4xl sm:text-5xl">
              Tezgahın üç{" "}
              <span className="italic" style={{ color: LOOM.warp }}>
                kuralı
              </span>
            </h2>
          </div>
          <div className="mx-auto mt-16 grid max-w-4xl gap-10 sm:grid-cols-3">
            {[
              {
                t: "Renkler korunur",
                d: "Amaç iki insanı aynılaştırmak değil; farklılıkların yan yana durabildiği bir düzen kurmaktır.",
              },
              {
                t: "Gerilim ayarlanır",
                d: "Gerilimsiz iplik dokunamaz, aşırı gerilen iplik kopar. Doğru gerginlik birlikte bulunur.",
              },
              {
                t: "Sıra bozulmaz",
                d: "Bir altından, bir üstünden. Dinlemeden konuşulmaz; konuşulmadan hüküm verilmez.",
              },
            ].map((p, i) => (
              <div key={p.t} data-reveal className="text-center">
                <div className="mx-auto w-fit">
                  <KilimMotif kind={i} size={48} />
                </div>
                <h3 className="mt-4 text-2xl">{p.t}</h3>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: LOOM.muted }}>
                  {p.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WeaveBandDivider />

      {/* — Hizmet özeti — */}
      <section className="relative z-[1] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <p data-reveal className="text-center text-[11px] tracking-[0.3em]" style={{ color: LOOM.warp }}>
              ÇALIŞMA ALANLARI
            </p>
            <h2 data-reveal className="mt-4 text-center text-4xl sm:text-5xl">
              Tezgahta neler{" "}
              <span className="italic" style={{ color: LOOM.weft }}>
                dokunur
              </span>
            </h2>
            <div className="mt-12">
              {c.services.map((s, i) => (
                <Link
                  key={s.title}
                  href="/hizmetler"
                  data-reveal
                  className="group flex items-baseline justify-between gap-4 border-b py-6 transition-colors duration-200"
                  style={{ borderColor: `${LOOM.ink}1f` }}
                >
                  <span
                    className="text-2xl transition-colors duration-200 group-hover:italic sm:text-3xl"
                    style={{ fontFamily: "var(--font-loom), serif" }}
                  >
                    {s.title}
                  </span>
                  <span className="hidden text-sm sm:block" style={{ color: LOOM.muted }}>
                    {s.desc}
                  </span>
                  <span
                    className="text-lg transition-transform duration-200 group-hover:translate-x-1"
                    style={{ color: i % 2 === 0 ? LOOM.warp : LOOM.weft }}
                    aria-hidden="true"
                  >
                    &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <WeaveBandDivider />

      {/* — Alıntı — */}
      <section className="relative z-[1] py-24" style={{ background: `${LOOM.cloth}99` }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <blockquote data-reveal className="mx-auto max-w-2xl text-center">
            <p className="text-3xl italic leading-snug sm:text-4xl" style={{ fontFamily: "var(--font-loom), serif" }}>
              &ldquo;{c.home.quote}&rdquo;
            </p>
            <footer className="mt-5 text-xs tracking-[0.3em]" style={{ color: LOOM.muted }}>
              {c.home.quoteAuthor.toUpperCase()}
            </footer>
          </blockquote>
        </div>
      </section>

      <WeaveBandDivider />

      {/* — Kapanış CTA — */}
      <section className="relative z-[1] py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <LoomCard
            data-reveal
            className="mx-auto max-w-2xl overflow-hidden p-10 text-center sm:p-14"
            motifColor={LOOM.weft}
          >
            <span
              className="absolute inset-x-0 top-0 h-1.5"
              style={{ background: `repeating-linear-gradient(90deg, ${LOOM.warp} 0 14px, ${LOOM.weft} 14px 28px)` }}
              aria-hidden="true"
            />
            <h2 className="text-4xl sm:text-5xl">
              İlk görüşme, ilk{" "}
              <span className="italic" style={{ color: LOOM.warp }}>
                sıra
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed" style={{ color: LOOM.muted }}>
              Tanışma görüşmesinde iki tarafı da dinlerim; tezgahı nereden
              kuracağımıza birlikte karar veririz.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/iletisim"
                className="rounded-full px-7 py-3.5 text-xs tracking-[0.2em] text-white transition-transform duration-200 hover:scale-[1.02]"
                style={{ background: `linear-gradient(90deg, ${LOOM.warp}, ${LOOM.weft})` }}
              >
                RANDEVU AL
              </Link>
              <Link
                href="/sss"
                className="rounded-full border px-7 py-3.5 text-xs tracking-[0.2em] transition-colors duration-200"
                style={{ borderColor: `${LOOM.weft}55`, color: LOOM.weft }}
              >
                SORULARINIZ MI VAR?
              </Link>
            </div>
          </LoomCard>
          <div data-reveal className="mt-10">
            <ThreadDivider />
          </div>
        </div>
      </section>

      <footer className="relative z-[1] border-t py-10 text-center" style={{ borderColor: `${LOOM.ink}14` }}>
        <p className="text-xs tracking-[0.14em]" style={{ color: LOOM.muted }}>
          LOOM · desen ancak birlikte görünür
        </p>
      </footer>
    </div>
  );
}
