"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

function TrackModel() {
  const gltf = useGLTF("/Meshy_AI_Circuit_Egg_0403235903_texture.glb");
  const modelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!modelRef.current) return;
    
    // state.pointer goes from -1 to 1 based on mouse position over the canvas
    // We reverse y because pointer.y is positive at top, but rotation.x is positive pitched down
    const targetRotY = (state.pointer.x * Math.PI) / 3;
    const targetRotX = -(state.pointer.y * Math.PI) / 4;
    
    modelRef.current.rotation.y = THREE.MathUtils.lerp(modelRef.current.rotation.y, targetRotY, 0.1);
    modelRef.current.rotation.x = THREE.MathUtils.lerp(modelRef.current.rotation.x, targetRotX, 0.1);
  });

  return (
    <group ref={modelRef} scale={1.8} position={[0, -0.4, 0]}>
      <primitive object={gltf.scene} />
    </group>
  );
}

export default function AvatarMouseTracker() {
  return (
    <div className="avatar-tracker-container" style={{ width: 180, height: 180, margin: "0 auto", position: "relative" }}>
      {/* Background glow to make it match the UI */}
      <div 
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "120px",
          height: "120px",
          background: "radial-gradient(circle, rgba(0,255,209,0.15), transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none"
        }} 
      />
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ pointerEvents: "auto", cursor: "crosshair" }} // Capture mouse events nicely
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={2} color="#00FFD1" />
        <directionalLight position={[-5, -2, -5]} intensity={0.8} color="#4A6CF7" />
        <pointLight position={[0, 2, 2]} intensity={1.5} color="#fff" />
        <Suspense fallback={null}>
          <TrackModel />
        </Suspense>
      </Canvas>
    </div>
  );
}
