"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LOOM } from "./loom-theme";

const navLinks = [
  { label: "Hakkında", path: "/hakkimda" },
  { label: "Hizmetler", path: "/hizmetler" },
  { label: "Yaklaşım", path: "/yaklasim" },
  { label: "SSS", path: "/sss" },
  { label: "İletişim", path: "/iletisim" },
] as const;

interface LoomHeaderProps {
  siteName?: string;
}

export function LoomHeader({ siteName = "LOOM" }: LoomHeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Ustte sadece kucuk marka dokusu */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center pt-5">
        <Link
          href="/"
          className="pointer-events-auto text-[13px] tracking-[0.5em]"
          style={{ fontFamily: "var(--font-loom), serif", color: LOOM.ink }}
        >
          {siteName}
        </Link>
      </div>

      {/* Alt band */}
      <header className="fixed inset-x-0 bottom-0 z-40">
        <div
          className="relative border-t"
          style={{
            background: `linear-gradient(to bottom, ${LOOM.cloth}f2, ${LOOM.ecru}f7)`,
            borderColor: `${LOOM.ink}1a`,
            backdropFilter: "blur(8px)",
          }}
        >
          {/* gergin iplik cizgisi */}
          <span
            className="pointer-events-none absolute inset-x-6 top-1/2 hidden h-px lg:block"
            style={{ background: `linear-gradient(90deg, ${LOOM.warp}66, ${LOOM.weft}66)` }}
            aria-hidden="true"
          />
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
            <span
              className="hidden text-[11px] tracking-[0.28em] sm:block"
              style={{ color: LOOM.muted }}
            >
              İKİ İPLİK · BİR DOKUMA
            </span>

            {/* Dugumler */}
            <nav className="relative hidden items-center gap-7 lg:flex" aria-label="Site menüsü">
              {navLinks.map((l, i) => (
                <Link key={l.path} href={l.path} className="group relative flex flex-col items-center">
                  <span
                    className="mb-1 block h-2.5 w-2.5 rounded-full border-2 transition-transform duration-200 group-hover:scale-125"
                    style={{
                      borderColor: i % 2 === 0 ? LOOM.warp : LOOM.weft,
                      background: isActive(l.path)
                        ? i % 2 === 0
                          ? LOOM.warp
                          : LOOM.weft
                        : LOOM.cloth,
                    }}
                    aria-hidden="true"
                  />
                  <span
                    className="text-[11px] tracking-[0.14em] transition-colors duration-200"
                    style={{ color: isActive(l.path) ? LOOM.ink : LOOM.muted }}
                  >
                    {l.label}
                  </span>
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/iletisim"
                className="rounded-full px-5 py-2 text-[11px] tracking-[0.18em] text-white transition-transform duration-200 hover:scale-[1.03]"
                style={{ background: `linear-gradient(90deg, ${LOOM.warp}, ${LOOM.weft})` }}
              >
                RANDEVU
              </Link>
              <button
                className="flex h-9 w-9 items-center justify-center lg:hidden"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
                aria-expanded={menuOpen}
                style={{ color: LOOM.ink }}
              >
                <span className="relative block h-3 w-4" aria-hidden="true">
                  <span className={`absolute left-0 top-0 h-px w-full bg-current transition-transform duration-300 ${menuOpen ? "top-1/2 rotate-45" : ""}`} />
                  <span className={`absolute left-0 top-1/2 h-px w-full bg-current transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
                  <span className={`absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-300 ${menuOpen ? "bottom-1/2 -rotate-45" : ""}`} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobil menu */}
      <div
        className={`fixed inset-x-0 bottom-16 z-30 border-t transition-[transform,opacity] duration-300 lg:hidden ${
          menuOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
        style={{ background: `${LOOM.cloth}fa`, borderColor: `${LOOM.ink}14`, backdropFilter: "blur(8px)" }}
        aria-hidden={!menuOpen}
      >
        <nav className="flex flex-col px-8 py-5" aria-label="Mobil menü">
          {[{ label: "Ana Sayfa", path: "/" }, ...navLinks].map((l, i) => (
            <Link
              key={l.path}
              href={l.path}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 border-b py-3 text-sm"
              style={{ borderColor: `${LOOM.ink}0d`, color: isActive(l.path) ? LOOM.warp : LOOM.ink }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: i % 2 === 0 ? LOOM.warp : LOOM.weft }}
                aria-hidden="true"
              />
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
