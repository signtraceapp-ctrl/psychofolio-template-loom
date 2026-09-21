"use client";

/**
 * LOOM - 3D dokuma sahnesi (twisted yarn edition).
 * Basta iki ayri iplik demeti (kizil + civit) havada suzulur;
 * kaydirdikca dikey cozgu iplikleri belirir ve civit atki ipligi
 * satir satir, altindan-ustunden gecerek kumasi dokur.
 *
 * Her iplik 3 ince fiberin sarmal (helix) biciminde bukulmus halidir.
 * meshStandardMaterial + aydinlatma ile gercekci tekstil gorunumu.
 *
 * progressRef: 0 -> iki ayri demet, 1 -> dokunmus kumas.
 * Aydinlik (ecru) zemin uzerinde calisir - canvas seffaftir.
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const WOOD = "#8a6a4a";

/* Slight color variations for threads */
const WARP_TONES = ["#b3502e", "#a8482a", "#be5832", "#b04d2b", "#c06034"];
const WEFT_TONES = ["#3a5a8c", "#355488", "#3f5e90", "#375786", "#426294"];

const WARP_COUNT = 22;
const ROWS = 9;
const FRAME_W = 4.6;
const FRAME_H = 3.4;
const ROW_DY = FRAME_H / (ROWS + 1);
const OVER_Z = 0.22;

/* Helix / twisted yarn parameters */
const HELIX_RADIUS = 0.028;
const FIBER_RADIUS_MIN = 0.014;
const FIBER_RADIUS_MAX = 0.020;
const PLY_COUNT = 3;

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const smoothstep = (a: number, b: number, x: number) => {
  const k = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return k * k * (3 - 2 * k);
};

function createTwistedYarn(
  baseCurve: THREE.CatmullRomCurve3,
  segmentCount: number,
  tones: string[],
  toneOffset: number,
  twistCount: number,
  helixRadius: number,
  fiberRadius: number,
  tubularSegments: number,
  radialSegments: number,
  rng: () => number,
): { geo: THREE.TubeGeometry; tone: string }[] {
  const basePoints = baseCurve.getPoints(segmentCount);
  const frames = baseCurve.computeFrenetFrames(segmentCount);
  const result: { geo: THREE.TubeGeometry; tone: string }[] = [];

  for (let ply = 0; ply < PLY_COUNT; ply++) {
    const phase = (ply * Math.PI * 2) / PLY_COUNT;
    const plyRadius = fiberRadius * (0.9 + rng() * 0.2);
    const plyPoints: THREE.Vector3[] = [];

    for (let i = 0; i <= segmentCount; i++) {
      const t = i / segmentCount;
      const angle = phase + t * twistCount * Math.PI * 2;
      const normal = frames.normals[i];
      const binormal = frames.binormals[i];
      const base = basePoints[i];

      plyPoints.push(
        base
          .clone()
          .add(normal.clone().multiplyScalar(Math.cos(angle) * helixRadius))
          .add(binormal.clone().multiplyScalar(Math.sin(angle) * helixRadius)),
      );
    }

    const plyCurve = new THREE.CatmullRomCurve3(plyPoints);
    const geo = new THREE.TubeGeometry(
      plyCurve,
      tubularSegments,
      plyRadius,
      radialSegments,
      false,
    );

    result.push({
      geo,
      tone: tones[(toneOffset + ply) % tones.length],
    });
  }
  return result;
}

/* -- Serbest iplik demeti - giris fazi -- */
function ThreadBundle({
  side,
  progressRef,
}: {
  side: 1 | -1;
  progressRef: React.MutableRefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const matRefs = useRef<THREE.MeshStandardMaterial[]>([]);

  const tones = side === -1 ? WARP_TONES : WEFT_TONES;
  const BUNDLE_COUNT = 4;

  const fibers = useMemo(() => {
    const rnd = mulberry32(side === 1 ? 91 : 17);
    const allFibers: { geo: THREE.TubeGeometry; tone: string }[] = [];

    for (let i = 0; i < BUNDLE_COUNT; i++) {
      const pts: THREE.Vector3[] = [];
      const x0 = side * (4.2 + rnd() * 1.4);
      const y0 = (rnd() - 0.5) * 2.6;
      for (let k = 0; k <= 6; k++) {
        pts.push(
          new THREE.Vector3(
            x0 - side * k * (0.55 + rnd() * 0.2),
            y0 + Math.sin(k * 1.3 + rnd() * 2) * (0.5 + rnd() * 0.3),
            (rnd() - 0.5) * 1.2,
          ),
        );
      }
      const baseCurve = new THREE.CatmullRomCurve3(pts);
      const twisted = createTwistedYarn(
        baseCurve,
        30,
        tones,
        i,
        4,
        HELIX_RADIUS,
        FIBER_RADIUS_MIN + rnd() * (FIBER_RADIUS_MAX - FIBER_RADIUS_MIN),
        20,
        5,
        rnd,
      );
      allFibers.push(...twisted);
    }
    return allFibers;
  }, [side, tones]);

  useFrame(({ clock }) => {
    const p = progressRef.current;
    const fade = 1 - smoothstep(0.16, 0.34, p);
    matRefs.current.forEach((m) => {
      if (m) m.opacity = fade * 0.85;
    });
    if (groupRef.current) {
      const t = clock.getElapsedTime();
      groupRef.current.visible = fade > 0.01;
      groupRef.current.position.y = Math.sin(t * 0.5 + side) * 0.12;
      groupRef.current.position.x = -side * p * 1.6;
      groupRef.current.rotation.z = Math.sin(t * 0.3 + side * 2) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {fibers.map((f, i) => (
        <mesh key={i} geometry={f.geo}>
          <meshStandardMaterial
            ref={(el) => {
              if (el) matRefs.current[i] = el;
            }}
            color={f.tone}
            roughness={0.82}
            metalness={0}
            transparent
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* -- Cozgu - dikey kizil iplikler (catenary + twisted) + tezgah cubuklari -- */
function WarpThreads({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  const matRefs = useRef<THREE.MeshStandardMaterial[]>([]);
  const woodMatRefs = useRef<THREE.MeshStandardMaterial[]>([]);
  const warpGroupRef = useRef<THREE.Group>(null);

  const animOffsets = useMemo(() => {
    const rnd = mulberry32(7777);
    const offsets: { phaseX: number; phaseZ: number; ampX: number; ampZ: number }[] = [];
    for (let i = 0; i < WARP_COUNT; i++) {
      offsets.push({
        phaseX: rnd() * Math.PI * 2,
        phaseZ: rnd() * Math.PI * 2,
        ampX: 0.003 + rnd() * 0.004,
        ampZ: 0.002 + rnd() * 0.003,
      });
    }
    return offsets;
  }, []);

  const fibers = useMemo(() => {
    const rnd = mulberry32(42);
    const allFibers: {
      geo: THREE.TubeGeometry;
      tone: string;
      x: number;
      threadIdx: number;
    }[] = [];

    for (let i = 0; i < WARP_COUNT; i++) {
      const x = -FRAME_W / 2 + (i / (WARP_COUNT - 1)) * FRAME_W;
      const sagAmount = 0.04 + rnd() * 0.03;

      const sagPts: THREE.Vector3[] = [];
      const ptCount = 8;
      for (let k = 0; k <= ptCount; k++) {
        const t = k / ptCount;
        const y = FRAME_H / 2 + 0.25 - t * (FRAME_H + 0.5);
        const sag = sagAmount * Math.sin(t * Math.PI);
        sagPts.push(new THREE.Vector3(x, y, sag));
      }

      const baseCurve = new THREE.CatmullRomCurve3(sagPts);
      const fiberRadius =
        FIBER_RADIUS_MIN + rnd() * (FIBER_RADIUS_MAX - FIBER_RADIUS_MIN);

      const twisted = createTwistedYarn(
        baseCurve,
        16,
        WARP_TONES,
        i,
        5,
        HELIX_RADIUS * 0.8,
        fiberRadius,
        16,
        5,
        rnd,
      );

      twisted.forEach((f) => {
        allFibers.push({ ...f, x, threadIdx: i });
      });
    }

    return allFibers;
  }, []);

  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    const vis = smoothstep(0.2, 0.38, progressRef.current);
    matRefs.current.forEach((m) => {
      if (m) m.opacity = vis * 0.75;
    });
    woodMatRefs.current.forEach((m) => {
      if (m) m.opacity = vis * 0.9;
    });

    const t = clock.getElapsedTime();
    const damping = vis * 0.6;
    for (let i = 0; i < meshRefs.current.length; i++) {
      const mesh = meshRefs.current[i];
      if (!mesh) continue;
      const threadIdx = fibers[i].threadIdx;
      const off = animOffsets[threadIdx];
      mesh.position.x =
        fibers[i].x + Math.sin(t * 0.7 + off.phaseX) * off.ampX * damping;
      mesh.position.z =
        Math.sin(t * 0.5 + off.phaseZ) * off.ampZ * damping;
    }
  });

  return (
    <group ref={warpGroupRef}>
      {fibers.map((f, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshRefs.current[i] = el;
          }}
          geometry={f.geo}
          position={[f.x, 0, 0]}
        >
          <meshStandardMaterial
            ref={(el) => {
              if (el) matRefs.current[i] = el;
            }}
            color={f.tone}
            roughness={0.85}
            metalness={0}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      ))}
      {/* Tezgah cubuklari */}
      <mesh position={[0, FRAME_H / 2 + 0.32, 0]}>
        <boxGeometry args={[FRAME_W + 0.7, 0.12, 0.12]} />
        <meshStandardMaterial
          ref={(el) => {
            if (el) woodMatRefs.current[0] = el;
          }}
          color={WOOD}
          roughness={0.7}
          metalness={0.05}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, -FRAME_H / 2 - 0.32, 0]}>
        <boxGeometry args={[FRAME_W + 0.7, 0.12, 0.12]} />
        <meshStandardMaterial
          ref={(el) => {
            if (el) woodMatRefs.current[1] = el;
          }}
          color={WOOD}
          roughness={0.7}
          metalness={0.05}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* -- Atki - tek uzun civit iplik, satir satir dokur (twisted yarn) -- */
function WeftThread({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  const meshRefs = useRef<THREE.Mesh[]>([]);

  const { fibers, indexCounts } = useMemo(() => {
    const rnd = mulberry32(999);
    const pts: THREE.Vector3[] = [];

    for (let r = 0; r < ROWS; r++) {
      const y = FRAME_H / 2 - ROW_DY * (r + 1);
      const leftToRight = r % 2 === 0;

      for (let i = 0; i < WARP_COUNT; i++) {
        const idx = leftToRight ? i : WARP_COUNT - 1 - i;
        const x = -FRAME_W / 2 + (idx / (WARP_COUNT - 1)) * FRAME_W;
        const over = (idx + r) % 2 === 0 ? OVER_Z : -OVER_Z;

        const sagBetween =
          i > 0 && i < WARP_COUNT - 1
            ? Math.sin((i / (WARP_COUNT - 1)) * Math.PI) * 0.008
            : 0;

        const puffY = Math.sin(idx * 2.3 + r * 1.7) * 0.006;
        const puffZ = Math.sin(idx * 1.8 + r * 2.1) * 0.004;

        pts.push(
          new THREE.Vector3(x, y + puffY + sagBetween, over + puffZ),
        );
      }
      const endX = leftToRight
        ? FRAME_W / 2 + 0.22
        : -FRAME_W / 2 - 0.22;
      pts.push(new THREE.Vector3(endX, y - ROW_DY / 2, 0));
    }

    const baseCurve = new THREE.CatmullRomCurve3(pts);
    const segCount = ROWS * WARP_COUNT * 2;

    const twistedFibers = createTwistedYarn(
      baseCurve,
      segCount,
      WEFT_TONES,
      0,
      8,
      HELIX_RADIUS * 0.7,
      0.016,
      segCount,
      5,
      rnd,
    );

    const counts = twistedFibers.map((f) =>
      f.geo.index ? f.geo.index.count : 0,
    );

    return { fibers: twistedFibers, indexCounts: counts };
  }, []);

  const smoothP = useRef(0);

  useFrame(() => {
    smoothP.current += (progressRef.current - smoothP.current) * 0.1;
    const p = smoothP.current;
    const fill = smoothstep(0.3, 0.96, p);
    const visible = fill > 0.002;

    for (let i = 0; i < meshRefs.current.length; i++) {
      const mesh = meshRefs.current[i];
      if (!mesh) continue;
      mesh.visible = visible;
      fibers[i].geo.setDrawRange(0, Math.floor(indexCounts[i] * fill));
    }
  });

  return (
    <group>
      {fibers.map((f, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) meshRefs.current[i] = el;
          }}
          geometry={f.geo}
        >
          <meshStandardMaterial
            color={f.tone}
            roughness={0.8}
            metalness={0}
            transparent
            opacity={0.92}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* -- Background loom layer -- */
function BackgroundLoom({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  const bgWarpMats = useRef<THREE.MeshStandardMaterial[]>([]);
  const bgWeftMats = useRef<THREE.MeshStandardMaterial[]>([]);

  const bgWarpGeo = useMemo(
    () => new THREE.CylinderGeometry(0.008, 0.008, 2.0, 4),
    [],
  );
  const bgWeftGeo = useMemo(
    () => new THREE.CylinderGeometry(0.006, 0.006, 4.0, 4),
    [],
  );

  const xs = useMemo(() => {
    const arr: number[] = [];
    for (let i = 0; i < 16; i++) {
      arr.push(-2.0 + (i / 15) * 4.0);
    }
    return arr;
  }, []);

  const ys = useMemo(() => {
    const arr: number[] = [];
    for (let i = 0; i < 8; i++) {
      arr.push(-0.8 + (i / 7) * 1.6);
    }
    return arr;
  }, []);

  useFrame(() => {
    const vis = smoothstep(0.25, 0.5, progressRef.current) * 0.2;
    bgWarpMats.current.forEach((m) => {
      if (m) m.opacity = vis;
    });
    bgWeftMats.current.forEach((m) => {
      if (m) m.opacity = vis * 0.8;
    });
  });

  return (
    <group position={[0.5, 0.2, -3]} scale={[0.7, 0.7, 0.7]}>
      {xs.map((x, i) => (
        <mesh key={`v${i}`} geometry={bgWarpGeo} position={[x, 0, 0]}>
          <meshStandardMaterial
            ref={(el) => {
              if (el) bgWarpMats.current[i] = el;
            }}
            color={WARP_TONES[i % WARP_TONES.length]}
            roughness={0.85}
            metalness={0}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      ))}
      {ys.map((y, i) => (
        <mesh
          key={`h${i}`}
          geometry={bgWeftGeo}
          position={[0, y, 0]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <meshStandardMaterial
            ref={(el) => {
              if (el) bgWeftMats.current[i] = el;
            }}
            color={WEFT_TONES[i % WEFT_TONES.length]}
            roughness={0.8}
            metalness={0}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* -- Ground shadow plane -- */
function GroundShadow({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  const texture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        size / 2,
      );
      gradient.addColorStop(0, "rgba(60, 40, 20, 0.18)");
      gradient.addColorStop(0.6, "rgba(60, 40, 20, 0.06)");
      gradient.addColorStop(1, "rgba(60, 40, 20, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  useFrame(() => {
    const vis = smoothstep(0.2, 0.5, progressRef.current);
    if (matRef.current) {
      matRef.current.opacity = vis * 0.7;
    }
  });

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -FRAME_H / 2 - 0.6, 0]}
    >
      <planeGeometry args={[7, 5]} />
      <meshBasicMaterial
        ref={matRef}
        map={texture}
        transparent
        opacity={0}
        depthWrite={false}
      />
    </mesh>
  );
}

/* -- Scene rig: camera + lighting + children -- */
function SceneRig({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const smoothP = useRef(0);
  const look = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useFrame(({ clock }) => {
    smoothP.current += (progressRef.current - smoothP.current) * 0.06;
    const p = smoothP.current;
    const t = clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y =
        Math.sin(t * 0.25) * 0.06 + (1 - p) * 0.25;
    }

    const radius = 8.2 - p * 3.6;
    const az = 0.5 - p * 0.5;
    const height = 0.4 - p * 0.9;
    camera.position.set(
      Math.sin(az) * radius,
      height,
      Math.cos(az) * radius,
    );
    look.set(0, -p * 0.4, 0);
    camera.lookAt(look);
  });

  return (
    <group ref={groupRef}>
      <ThreadBundle side={-1} progressRef={progressRef} />
      <ThreadBundle side={1} progressRef={progressRef} />
      <WarpThreads progressRef={progressRef} />
      <WeftThread progressRef={progressRef} />
      <BackgroundLoom progressRef={progressRef} />
      <GroundShadow progressRef={progressRef} />
    </group>
  );
}

export function LoomScene({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  return (
    <Canvas
      className="absolute inset-0"
      camera={{ position: [4, 0.4, 7], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
      }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.6} color="#f5efe5" />
      <directionalLight
        intensity={1.0}
        position={[3, 5, 4]}
        color="#fff8ee"
      />
      {/* Rim light for warm amber textile feel */}
      <directionalLight
        intensity={0.3}
        position={[-2, 3, -3]}
        color="#d4a574"
      />
      <SceneRig progressRef={progressRef} />
    </Canvas>
  );
}
