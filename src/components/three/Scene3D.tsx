"use client";

import { useEffect, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Grid, Sparkles, Stars } from "@react-three/drei";

/* Un mundo 3D por sección DOM. Entre mundos: agujero negro.
   El mundo saliente gira y se succiona al vórtice; el entrante emerge de él. */
const SECTIONS = ["hero", "gpulse", "biteroute", "smartliving", "team", "contact"];

const CYAN = "#00FFD1";
const ORANGE = "#FF6B35";
const NAVY = "#4A6CF7";
const VOID = "#9d7bff"; // acreción del agujero negro

/* Centro del vórtice: los mundos colapsan/nacen aquí */
const HOLE = new THREE.Vector3(0, 2.2, -1);

/* Estado compartido scroll → escena (singleton: una sola escena por página) */
const world = { index: 0 };
const sim = { t: 0, trans: 0, dir: 1 };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

/* ─── Scroll → índice continuo ───────────────────────────────
   Cada sección aporta un blend 0→1 mientras su top recorre el
   viewport. Suma = índice fraccional (0..5).
   GSAP envuelve secciones pinneadas en .pin-spacer: medimos eso. */
function useScrollDrive() {
  useEffect(() => {
    const update = () => {
      const vh = window.innerHeight;
      let idx = 0;
      for (let i = 1; i < SECTIONS.length; i++) {
        const el = document.getElementById(SECTIONS[i]);
        if (!el) continue;
        const box = (el.closest(".pin-spacer") ?? el).getBoundingClientRect();
        idx += smooth(clamp01(1 - box.top / vh));
      }
      world.index = idx;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
}

/* ─── Driver: física del viaje + cámara ──────────────────────
   trans = 0 dentro de un mundo, 1 en pleno agujero negro.
   FOV punch + roll de cámara venden la succión. */
function Driver() {
  useFrame((state, delta) => {
    const t = THREE.MathUtils.damp(sim.t, world.index, 2.4, delta);
    if (Math.abs(world.index - t) > 0.002) sim.dir = Math.sign(world.index - t);
    sim.t = t;
    const f = t - Math.floor(t);
    sim.trans = smooth(1 - Math.abs(2 * f - 1));

    const cam = state.camera as THREE.PerspectiveCamera;
    cam.position.x = THREE.MathUtils.damp(cam.position.x, state.pointer.x * 0.7, 2.5, delta);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, 1.9 + state.pointer.y * 0.4, 2.5, delta);
    cam.fov = 50 + sim.trans * 16;
    cam.updateProjectionMatrix();
    cam.lookAt(HOLE);
    cam.rotateZ(sim.trans * 0.12 * sim.dir);
  });
  return null;
}

/* ─── WorldSlot: monta un mundo y lo succiona/expulsa ────────
   local = distancia al índice actual. |local|→1: colapsa en el
   vórtice girando. Pivote del grupo = centro del agujero. */
function WorldSlot({ index, gridColor, children }: { index: number; gridColor: string; children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    const local = sim.t - index;
    const a = Math.abs(local);
    g.visible = a < 0.99;
    if (!g.visible) return;
    const present = smooth(clamp01(1 - a));
    g.scale.setScalar(Math.max(0.12 + 0.88 * present, 0.0001));
    g.rotation.y = -local * 2.6; // remolino al cruzar
  });

  return (
    <group ref={ref} position={HOLE}>
      {/* suelo propio: cada mundo trae su color y colapsa con él */}
      <Grid
        position={[0, -2.2 + index * 0.004, 0]}
        args={[70, 70]}
        cellSize={1}
        cellColor="#0d111c"
        sectionSize={5}
        sectionColor={gridColor}
        fadeDistance={34}
        fadeStrength={2}
        infiniteGrid
      />
      {children}
    </group>
  );
}

/* ─── Agujero negro: solo existe entre mundos ────────────────── */
function BlackHole() {
  const root = useRef<THREE.Group>(null);
  const disc = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const r = root.current;
    if (!r) return;
    r.visible = sim.trans > 0.02;
    r.scale.setScalar(Math.max(sim.trans, 0.0001));
    if (disc.current) disc.current.rotation.z += delta * (2 + sim.trans * 6) * sim.dir;
  });

  return (
    <group ref={root} position={HOLE}>
      {/* horizonte de eventos */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      {/* halo de lente gravitacional */}
      <mesh>
        <sphereGeometry args={[1.12, 32, 32]} />
        <meshBasicMaterial color={VOID} transparent opacity={0.35} side={THREE.BackSide} />
      </mesh>
      {/* disco de acreción inclinado */}
      <group rotation={[-1.15, 0.2, 0]}>
        <group ref={disc}>
          <mesh>
            <ringGeometry args={[1.35, 2.5, 64]} />
            <meshBasicMaterial color={VOID} transparent opacity={0.25} side={THREE.DoubleSide} />
          </mesh>
          <mesh>
            <ringGeometry args={[1.18, 1.42, 64]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.45} side={THREE.DoubleSide} />
          </mesh>
          <Sparkles count={90} scale={[5, 5, 0.5]} size={2.4} speed={1.4} color={VOID} />
        </group>
      </group>
      <pointLight intensity={26} color={VOID} distance={12} />
    </group>
  );
}

/* ─── Mundos (coordenadas relativas al centro del vórtice) ──── */

function HeroWorld() {
  const outer = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (outer.current) {
      outer.current.rotation.y += delta * 0.25;
      outer.current.rotation.x += delta * 0.1;
    }
  });
  return (
    <group position={[0, 0.4, -1.5]}>
      <mesh ref={outer}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.45} wireframe />
      </mesh>
      <Float speed={2.4} rotationIntensity={0.6} floatIntensity={0.6}>
        <mesh>
          <icosahedronGeometry args={[0.7, 2]} />
          <meshStandardMaterial color="#06121a" emissive={CYAN} emissiveIntensity={0.18} metalness={0.9} roughness={0.15} />
        </mesh>
      </Float>
      <mesh rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[2.2, 0.015, 8, 90]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.25} />
      </mesh>
      <Sparkles count={60} scale={[6, 5, 6]} size={2} speed={0.5} color={CYAN} />
      <pointLight intensity={28} color={CYAN} distance={10} />
    </group>
  );
}

function GPulseWorld() {
  const knot = useRef<THREE.Mesh>(null);
  const rings = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (knot.current) {
      const m = knot.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.14; // latido
    }
    if (rings.current) rings.current.rotation.z += delta * 0.4;
  });
  return (
    <group position={[-5.5, 1.4, -7.5]}>
      <Float speed={2.2} rotationIntensity={0.9} floatIntensity={0.8}>
        <mesh ref={knot}>
          <torusKnotGeometry args={[1.05, 0.28, 220, 28]} />
          <meshStandardMaterial color="#052e28" emissive={CYAN} emissiveIntensity={0.35} metalness={0.7} roughness={0.35} />
        </mesh>
      </Float>
      <group ref={rings}>
        <mesh rotation={[0.4, 0, 0]}>
          <torusGeometry args={[2.6, 0.02, 8, 100]} />
          <meshBasicMaterial color={CYAN} transparent opacity={0.2} />
        </mesh>
        <mesh rotation={[-0.5, 0.6, 0]}>
          <torusGeometry args={[3.1, 0.015, 8, 100]} />
          <meshBasicMaterial color={CYAN} transparent opacity={0.12} />
        </mesh>
      </group>
      <Sparkles count={70} scale={[9, 6, 7]} size={2} speed={0.6} color={CYAN} />
      <pointLight intensity={14} color={CYAN} distance={14} />
    </group>
  );
}

function BiteRouteWorld() {
  const movers = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    movers.current?.children.forEach((c, i) => {
      c.position.z += delta * (2.4 + i * 0.9);
      if (c.position.z > 3) c.position.z = -18;
    });
  });
  return (
    <>
      {/* carriles al horizonte */}
      {[-1.6, 0, 1.6].map((x) => (
        <mesh key={x} position={[x, -2.16, -8]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.07, 26]} />
          <meshBasicMaterial color={ORANGE} transparent opacity={0.4} />
        </mesh>
      ))}
      {/* flota en ruta */}
      <group ref={movers}>
        {[-1.6, 0, 1.6, -1.6, 1.6, 0].map((x, i) => (
          <mesh key={i} position={[x, -1.88, -4 - i * 2.6]}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color="#1a0f08" emissive={ORANGE} emissiveIntensity={0.7} />
          </mesh>
        ))}
      </group>
      {/* faro logístico */}
      <Float speed={2.4} rotationIntensity={1.2} floatIntensity={0.8}>
        <mesh position={[0, 1.8, -6]}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={ORANGE} emissive={ORANGE} emissiveIntensity={0.55} wireframe />
        </mesh>
      </Float>
      <Sparkles count={60} scale={[10, 5, 8]} position={[0, 0, -5]} size={2} speed={0.5} color={ORANGE} />
      <pointLight position={[0, 2, -5]} intensity={28} color={ORANGE} distance={14} />
    </>
  );
}

function SmartLivingWorld() {
  return (
    <>
      {/* skyline en arco — alturas deterministas */}
      {Array.from({ length: 13 }).map((_, i) => {
        const a = ((i / 12) * 2 - 1) * (Math.PI / 2.6);
        const h = 1 + ((i * 37) % 6) * 0.5;
        return (
          <mesh key={i} position={[Math.sin(a) * 7, -2.2 + h / 2, -3.5 - Math.cos(a) * 4.5]}>
            <boxGeometry args={[0.9, h, 0.9]} />
            <meshStandardMaterial
              color="#080b18"
              emissive={NAVY}
              emissiveIntensity={0.3 + ((i * 13) % 4) * 0.1}
              metalness={0.5}
              roughness={0.4}
            />
          </mesh>
        );
      })}
      {/* dron guardián */}
      <Float speed={2} rotationIntensity={0.8} floatIntensity={1.1}>
        <mesh position={[0, 1.5, -4]}>
          <icosahedronGeometry args={[0.8, 0]} />
          <meshStandardMaterial color={NAVY} emissive={NAVY} emissiveIntensity={0.7} wireframe />
        </mesh>
      </Float>
      <Sparkles count={60} scale={[12, 5, 8]} position={[0, 0, -4]} size={2} speed={0.4} color={NAVY} />
      <pointLight position={[0, 2, -4]} intensity={28} color={NAVY} distance={14} />
    </>
  );
}

function TeamWorld() {
  const orbit = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (orbit.current) orbit.current.rotation.y += delta * 0.4;
  });
  return (
    <group position={[0, 0.4, -2]}>
      <mesh>
        <octahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial color="#0a0a14" emissive="#8899bb" emissiveIntensity={0.3} metalness={0.9} roughness={0.2} />
      </mesh>
      <group ref={orbit}>
        {[CYAN, ORANGE, NAVY].map((c, i) => {
          const a = (i / 3) * Math.PI * 2;
          return (
            <Float key={c} speed={2 + i * 0.4} floatIntensity={0.5}>
              <mesh position={[Math.sin(a) * 2, 0, Math.cos(a) * 2]}>
                <sphereGeometry args={[0.34, 24, 24]} />
                <meshStandardMaterial color="#0a0a14" emissive={c} emissiveIntensity={0.8} metalness={0.7} roughness={0.25} />
              </mesh>
            </Float>
          );
        })}
      </group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2, 0.012, 8, 80]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.18} />
      </mesh>
      <Sparkles count={40} scale={[5, 4, 5]} size={1.8} speed={0.4} />
      <pointLight intensity={22} color="#ffffff" distance={9} />
    </group>
  );
}

function ContactWorld() {
  const rings = useRef<THREE.Group>(null);
  useFrame((state) => {
    rings.current?.children.forEach((r, i) => {
      const t = (state.clock.elapsedTime * 0.5 + i / 3) % 1; // ondas de señal
      r.scale.setScalar(0.4 + t * 2.4);
      ((r as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = 0.45 * (1 - t);
    });
  });
  return (
    <group position={[0, -0.3, -2]}>
      <mesh position={[0, -0.8, 0]}>
        <cylinderGeometry args={[0.045, 0.11, 2.8, 12]} />
        <meshStandardMaterial color="#0a0a14" emissive={CYAN} emissiveIntensity={0.55} />
      </mesh>
      <mesh position={[0, 0.75, 0]}>
        <sphereGeometry args={[0.22, 20, 20]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.9} />
      </mesh>
      <group ref={rings} position={[0, 0.75, 0]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.9, 0.018, 8, 64]} />
            <meshBasicMaterial color={CYAN} transparent opacity={0.35} />
          </mesh>
        ))}
      </group>
      <Sparkles count={35} scale={[4, 4, 4]} size={1.8} speed={0.3} color={CYAN} />
      <pointLight intensity={24} color={CYAN} distance={9} />
    </group>
  );
}

/* ─── Escena raíz ────────────────────────────────────────────── */

export default function Scene3D() {
  useScrollDrive();
  return (
    <div className="scene3d" aria-hidden>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 1.9, 8], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={["#050508"]} />
        <fog attach="fog" args={["#050508", 10, 34]} />
        <ambientLight intensity={0.35} />
        <hemisphereLight args={["#3a4a6a", "#050508", 0.5]} />

        <Stars radius={70} depth={40} count={3500} factor={3.5} fade speed={0.5} />

        <Driver />
        <BlackHole />

        <WorldSlot index={0} gridColor="#1c2438">
          <HeroWorld />
        </WorldSlot>
        <WorldSlot index={1} gridColor="#0e3a33">
          <GPulseWorld />
        </WorldSlot>
        <WorldSlot index={2} gridColor="#3a1e0e">
          <BiteRouteWorld />
        </WorldSlot>
        <WorldSlot index={3} gridColor="#141e42">
          <SmartLivingWorld />
        </WorldSlot>
        <WorldSlot index={4} gridColor="#1c2438">
          <TeamWorld />
        </WorldSlot>
        <WorldSlot index={5} gridColor="#0e3a33">
          <ContactWorld />
        </WorldSlot>
      </Canvas>
    </div>
  );
}
