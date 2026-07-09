'use client'
import { Canvas } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { KernelSize } from 'postprocessing'
import CameraRig from './CameraRig'
import Starfield from './Starfield'
import WarpEffect from './WarpEffect'
import GPulsePlanet from './GPulsePlanet'
import Orbits from './Orbits'
import Nebula from './Nebula'
import HeroOverlay from './HeroOverlay'
import GPulseCard from './GPulseCard'

export default function SpaceJourneyCanvas() {
  return (
    <>
      <Canvas
        style={{ position: 'fixed', inset: 0, zIndex: 1 }}
        dpr={[1, 1.5]}
        camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 0, 10] }}
        gl={{ antialias: false }}
      >
        <ScrollControls pages={4.5} damping={0.1}>
          <CameraRig />
          {/* Nebula background layer — behind stars */}
          <Nebula />
          <Starfield />
          <WarpEffect />
          <GPulsePlanet />
          <Orbits />
        </ScrollControls>

        {/* Postprocessing: bloom on planet seams and dumbbell emissives.
            luminanceThreshold=0.85 keeps it selective — only seam/fresnel bright areas bloom.
            Dark planet base (~0.02-0.09 luminance) stays well below the threshold.
            mipmapBlur gives soft cinematic spread. */}
        {/* Bloom: tight to avoid flooding the dark planet body.
            luminanceThreshold=0.65 activates on seams (CYAN*1.4 luminance≈1.08) and rim.
            intensity=0.6 + radius=0.3 keeps the glow tight around the seam tubes. */}
        {/* Bloom: KernelSize.VERY_SMALL = tightest possible kernel (3px effective blur).
            Seam core (CYAN*1.5 ≈ luminance 1.1) blooms with a tiny local sparkle.
            Dark panels on planet body stay dark. */}
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.4}
            luminanceThreshold={0.68}
            luminanceSmoothing={0.05}
            kernelSize={KernelSize.VERY_SMALL}
          />
        </EffectComposer>
      </Canvas>
      <HeroOverlay />
      <GPulseCard />
    </>
  )
}
