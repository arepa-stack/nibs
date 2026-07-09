'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'

// Vertex shader: attenuation capped low so most stars stay as tiny pinpoints
const vertexShader = `
  uniform float uWarp;
  uniform float uTime;
  attribute float aSize;
  attribute float aBrightness;
  varying float vBrightness;
  varying float vWarp;

  void main() {
    vBrightness = aBrightness;
    vWarp = uWarp;

    vec3 pos = position;

    // Warp: stretch stars along Z axis toward camera
    if (uWarp > 0.0) {
      pos.z += uWarp * 30.0 * (pos.z / 80.0);
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    // Size attenuation: use small base sizes so distant stars are tiny pinpoints
    // aSize is 0.5–2.0; multiply by distance factor then clamp to prevent bokeh blobs
    float dist = -mvPosition.z;
    float attenuated = aSize * (80.0 / dist);
    // Clamp: most stars 1–3px, only the "giant" ones up to 5px
    gl_PointSize = clamp(attenuated, 0.8, aSize > 1.5 ? 5.0 : 3.0);

    // During warp, streak points larger
    if (uWarp > 0.0) {
      gl_PointSize *= (1.0 + uWarp * 2.0);
    }

    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = `
  uniform float uWarp;
  varying float vBrightness;
  varying float vWarp;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float dist = length(uv);

    if (uWarp > 0.0) {
      // Elongated streak during warp
      float streak = 1.0 - smoothstep(0.0, 0.3, abs(uv.x));
      float fade = 1.0 - smoothstep(0.0, 0.5, abs(uv.y));
      float alpha = streak * fade * uWarp;
      vec3 col = mix(vec3(1.0), vec3(0.0, 1.0, 0.82), uWarp);
      gl_FragColor = vec4(col, alpha);
    } else {
      // Crisp circular star: very tight falloff so stars are pinpoints
      // Only the larger stars get a tiny soft halo
      float sharpness = mix(8.0, 4.0, step(0.4, dist)); // sharp center
      float alpha = 1.0 - smoothstep(0.05, 0.5, dist);
      // Hard core + very faint glow
      float core = 1.0 - smoothstep(0.0, 0.15, dist);
      float halo = (1.0 - smoothstep(0.15, 0.5, dist)) * 0.15;
      alpha = core + halo;
      alpha *= vBrightness;
      if (alpha < 0.01) discard;
      // Slight color variation: most white, rare warm/cool tints
      gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
    }
  }
`

export default function Starfield() {
  const meshRef = useRef<THREE.Points>(null)
  const scroll = useScroll()

  const { positions, sizes, brightness } = useMemo(() => {
    const count = 3500
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const brightness = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Random positions in a sphere of radius 80
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 12 + Math.random() * 68

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)

      // Realistic distribution: most stars tiny (0.5), a few medium (1.0), rare large (1.8)
      const roll = Math.random()
      if (roll < 0.75) {
        // 75% — small stars, slightly brighter so they show against nebula
        sizes[i] = 0.5 + Math.random() * 0.5
        brightness[i] = 0.55 + Math.random() * 0.35
      } else if (roll < 0.94) {
        // 19% — medium stars
        sizes[i] = 0.9 + Math.random() * 0.6
        brightness[i] = 0.8 + Math.random() * 0.2
      } else {
        // 6% — bright stars (the "twinkle" ones)
        sizes[i] = 1.5 + Math.random() * 0.7
        brightness[i] = 1.0
      }
    }

    return { positions, sizes, brightness }
  }, [])

  const uniforms = useMemo(
    () => ({
      uWarp: { value: 0.0 },
      uTime: { value: 0.0 },
    }),
    []
  )

  useFrame((state) => {
    const t = scroll.offset
    uniforms.uTime.value = state.clock.elapsedTime

    // Act 2: warp
    if (t >= 0.25 && t <= 0.5) {
      uniforms.uWarp.value = (t - 0.25) / 0.25
    } else {
      uniforms.uWarp.value = 0
    }
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aSize"
          args={[sizes, 1]}
        />
        <bufferAttribute
          attach="attributes-aBrightness"
          args={[brightness, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  )
}
