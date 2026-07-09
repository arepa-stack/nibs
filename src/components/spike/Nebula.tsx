'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'

// FBM noise-based nebula background plane.
// Renders as a large sphere behind the stars, fades out during warp.
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform float uFade;
  varying vec2 vUv;

  // --- noise helpers ---
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
  }

  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(st);
      st *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    // Slow drift
    vec2 uv = vUv + vec2(uTime * 0.004, uTime * 0.002);

    // Two-layer FBM for depth
    float n1 = fbm(uv * 2.5);
    float n2 = fbm(uv * 1.2 + vec2(n1 * 0.8, 0.3));

    float nebula = fbm(uv * 1.5 + vec2(n2 * 0.6, n1 * 0.4));

    // Purple-violet palette: #1a0a2e → #2d1254 → #4a1580
    vec3 color1 = vec3(0.10, 0.04, 0.18); // deep purple
    vec3 color2 = vec3(0.18, 0.07, 0.33); // mid violet
    vec3 color3 = vec3(0.29, 0.08, 0.50); // bright violet accent

    vec3 col = mix(color1, color2, nebula);
    col = mix(col, color3, pow(nebula, 2.5) * 0.6);

    // Subtle blue-indigo edge clouds
    vec3 indigo = vec3(0.08, 0.10, 0.40);
    col = mix(col, indigo, (1.0 - nebula) * 0.3 * fbm(uv * 3.0 + 1.5));

    // Vignette toward edges so it doesn't fight the center
    vec2 center = vUv - 0.5;
    float vignette = 1.0 - smoothstep(0.25, 0.75, length(center));
    vignette = pow(vignette, 0.7);

    float alpha = nebula * vignette * 0.45 * uFade;

    gl_FragColor = vec4(col, alpha);
  }
`

export default function Nebula() {
  const meshRef = useRef<THREE.Mesh>(null)
  const scroll = useScroll()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0.0 },
      uFade: { value: 1.0 },
    }),
    []
  )

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime
    const t = scroll.offset

    // Fade nebula out as warp begins, bring back softly in Act 3
    if (t < 0.2) {
      uniforms.uFade.value = 1.0
    } else if (t < 0.4) {
      uniforms.uFade.value = 1.0 - ((t - 0.2) / 0.2)
    } else if (t < 0.55) {
      uniforms.uFade.value = 0.0
    } else {
      // Gently bring back a tinted version in planet act for depth
      uniforms.uFade.value = Math.min((t - 0.55) / 0.15, 1.0) * 0.4
    }
  })

  return (
    // Large plane behind everything — at z=-75 (just inside the far plane)
    <mesh ref={meshRef} position={[0, 0, -74]}>
      <planeGeometry args={[240, 150]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.FrontSide}
      />
    </mesh>
  )
}
