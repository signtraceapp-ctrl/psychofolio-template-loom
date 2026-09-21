"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const LoomScene = dynamic(
  () => import("./loom-scene").then((mod) => mod.LoomScene),
  { ssr: false },
);

interface LazyLoomSceneProps {
  progressRef: React.MutableRefObject<number>;
}

export function LazyLoomScene({ progressRef }: LazyLoomSceneProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  if (reducedMotion) {
    return (
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 35% 50%, rgba(179,80,46,0.14), transparent 55%), radial-gradient(ellipse at 65% 50%, rgba(58,90,140,0.14), transparent 55%)",
        }}
        aria-hidden="true"
      />
    );
  }

  return <LoomScene progressRef={progressRef} />;
}
