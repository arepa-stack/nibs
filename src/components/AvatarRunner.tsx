"use client";

import { useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

/* ─── 3D Model inside the canvas ─────────────────────────────── */
function AvatarModel({ spinning }: { spinning: boolean }) {
  const gltf = useGLTF("/Meshy_AI_Circuit_Egg_0403235903_texture.glb");
  const modelRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!modelRef.current) return;
    modelRef.current.rotation.y += delta * (spinning ? 6 : 2);
    modelRef.current.rotation.z = Math.sin(Date.now() * 0.008) * 0.15;
  });

  return (
    <group ref={modelRef} scale={1.4} position={[0, -0.5, 0]}>
      <primitive object={gltf.scene} />
    </group>
  );
}

/* ─── Public API ──────────────────────────────────────────────── */
interface AvatarRunnerProps {
  /**
   * Increment this number to trigger one run.
   * Every unique value (> 0) fires the animation.
   */
  runCount: number;
  /** Called when the run animation finishes */
  onComplete?: () => void;
  /** If true the avatar comes from the right; default is left to right */
  fromRight?: boolean;
}

export default function AvatarRunner({
  runCount,
  onComplete,
  fromRight = false,
}: AvatarRunnerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    if (runCount === 0) return;

    const runAnimation = async () => {
      const gsap = (await import("gsap")).default;

      setVisible(true);
      setSpinning(true);

      // Wait one frame so the wrapper is mounted before we animate it
      await new Promise<void>((r) => requestAnimationFrame(() => r()));

      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const startX = fromRight ? "110vw" : "-180px";
      const endX = fromRight ? "-180px" : "110vw";

      gsap.set(wrapper, { x: startX, opacity: 1 });

      gsap.to(wrapper, {
        x: endX,
        duration: 3.5,
        ease: "none",
        onComplete: () => {
          setVisible(false);
          setSpinning(false);
          onComplete?.();
        },
      });
    };

    runAnimation();
  }, [runCount, fromRight, onComplete]);

  if (!visible) return null;

  return (
    <div className="avatar-runner-overlay" aria-hidden="true">
      <div
        ref={wrapperRef}
        className="avatar-runner-wrapper"
        style={{
          transform: fromRight ? "translateX(110vw)" : "translateX(-180px)",
        }}
      >
        {/* Glow trail */}
        <div
          className="avatar-runner-trail"
          style={{
            background: fromRight
              ? "linear-gradient(to left, rgba(0,255,209,0.3), transparent)"
              : "linear-gradient(to right, rgba(0,255,209,0.3), transparent)",
          }}
        />

        {/* 3D Avatar Canvas */}
        <Canvas
          className="avatar-runner-canvas"
          camera={{ position: [0, 0, 3.5], fov: 45 }}
          gl={{ alpha: true, antialias: true }}
        >
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 5, 5]} intensity={2} color="#00FFD1" />
          <directionalLight position={[-5, -2, -5]} intensity={0.8} color="#4A6CF7" />
          <pointLight position={[0, 2, 2]} intensity={1.5} color="#fff" />
          <Suspense fallback={null}>
            <AvatarModel spinning={spinning} />
          </Suspense>
        </Canvas>

        {/* Speed lines */}
        <div className={`avatar-runner-speed-lines ${fromRight ? "reverse" : ""}`}>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="speed-line"
              style={{ animationDelay: `${i * 0.08}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
