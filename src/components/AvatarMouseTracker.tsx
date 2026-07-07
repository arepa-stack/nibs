"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

function TrackModel() {
  const gltf = useGLTF("/round+cartoon+robot+3d+model.glb");
  const modelRef = useRef<THREE.Group>(null);
  const animState = useRef({ isAnimating: false, startTime: 0 });

  useFrame((state) => {
    if (!modelRef.current) return;
    
    // Normal targets
    let targetRotY = Math.PI + (state.pointer.x * Math.PI) / 3;
    const targetRotX = -(state.pointer.y * Math.PI) / 4;
    let targetY = -0.6;
    
    if (animState.current.isAnimating) {
      const elapsed = (Date.now() - animState.current.startTime) / 1000;
      const duration = 0.8;
      
      if (elapsed < duration) {
        const p = elapsed / duration;
        
        // Small jump
        targetY = -0.6 + Math.sin(p * Math.PI) * 0.4;
        
        // Wiggle side to side (salute)
        targetRotY = Math.PI + Math.sin(p * Math.PI * 4) * 0.5;
      } else {
        animState.current.isAnimating = false;
      }
    }
    
    // Lerp towards the targets smoothly
    modelRef.current.rotation.y = THREE.MathUtils.lerp(modelRef.current.rotation.y, targetRotY, 0.15);
    modelRef.current.rotation.x = THREE.MathUtils.lerp(modelRef.current.rotation.x, targetRotX, 0.15);
    modelRef.current.position.y = THREE.MathUtils.lerp(modelRef.current.position.y, targetY, 0.2);
  });

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (!animState.current.isAnimating) {
      animState.current.isAnimating = true;
      animState.current.startTime = Date.now();
    }
  };

  return (
    <group 
      ref={modelRef} 
      scale={2.4} 
      position={[0, -0.6, 0]} 
      rotation={[0, Math.PI, 0]}
      onClick={handleClick}
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'auto'}
    >
      <primitive object={gltf.scene} />
    </group>
  );
}

export default function AvatarMouseTracker() {
  return (
    <div className="avatar-tracker-container" style={{ width: 240, height: 240, margin: "0 auto", position: "relative" }}>
      {/* Background glow to make it match the UI */}
      <div 
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "160px",
          height: "160px",
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
