'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'

const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying vec3 vObjectNormal;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vObjectNormal = normalize(normal);
    vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform float uOpacity;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying vec3 vObjectNormal;

  const vec3 CYAN = vec3(0.0, 1.0, 0.82);

  // Value noise for subtle surface variation
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float valueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  // One great-circle seam: returns (coreIntensity, haloIntensity)
  // angle = angular distance from the great circle plane (in radians)
  // CORE: very thin bright tube (0.04 rad half-width)
  // HALO: narrow soft falloff (0.05 rad) — just a tight glow ring around the core tube.
  //       With 3 seams at 45°+ angular separation, this leaves large dark panels between seams.
  vec2 seamLayer(float angle) {
    float core = 1.0 - smoothstep(0.0, 0.04, angle);
    float halo = 1.0 - smoothstep(0.03, 0.08, angle);
    halo = halo * halo; // quadratic falloff — bright near core, near-zero at edge
    return vec2(core, halo);
  }

  void main() {
    vec3 norm = normalize(vNormal);

    // Procedural dark surface noise
    vec2 nuv = vObjectNormal.xy * 3.5 + vec2(vObjectNormal.z * 1.8, 0.4);
    float n = valueNoise(nuv);
    float n2 = valueNoise(nuv * 2.1 + vec2(3.7, 1.1));
    float sn = n * 0.65 + n2 * 0.35;

    // Dark base: near-black with faint blue-teal tint (these are very low linear values)
    vec3 darkA = vec3(0.003, 0.007, 0.010);
    vec3 darkB = vec3(0.006, 0.016, 0.020);
    vec3 baseColor = mix(darkA, darkB, sn);

    // TWO seams: X-axis and Y-axis great circles.
    // Two 90°-perpendicular seams divide the sphere into 4 dark panels (like a beach ball).
    // Maximum angular separation from any seam = 45° — large dark panels between seams.
    // Halo of 0.08 rad = 4.6° — stays well within each panel boundary.
    float a1 = asin(clamp(abs(dot(norm, vec3(1.0, 0.0, 0.0))), 0.0, 1.0));
    float a2 = asin(clamp(abs(dot(norm, vec3(0.0, 1.0, 0.0))), 0.0, 1.0));

    vec2 s1 = seamLayer(a1);
    vec2 s2 = seamLayer(a2);

    float seamCore = max(s1.x, s2.x);
    float seamHalo = max(s1.y, s2.y);

    // Pulse the seam gently
    float pulse = 1.0 + sin(uTime * 2.0) * 0.1;

    // BRIGHT CORE — above bloom threshold so seam tubes get a tight local bloom sparkle.
    // CYAN * 1.5 → luminance ≈ 1.1 (clearly above threshold, bloom stays local at low radius)
    vec3 coreColor = CYAN * seamCore * 1.5 * pulse;

    // BAKED HALO — nearly invisible, just a very soft edge around the seam core.
    // Kept near-zero so dark panels stay truly dark.
    vec3 haloColor = CYAN * seamHalo * 0.005;

    // Fresnel — very tight silhouette rim only
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fd = max(dot(norm, viewDir), 0.0);
    float rimMask = 1.0 - fd;
    float rimGlow = smoothstep(0.8, 1.0, pow(rimMask, 6.0));
    // Rim is just bright enough to catch bloom
    vec3 rimColor = CYAN * rimGlow * 0.9;

    // Final: dark base + tight halo + bright core + rim
    vec3 color = baseColor + haloColor + coreColor + rimColor;

    gl_FragColor = vec4(color, uOpacity);
  }
`

export default function GPulsePlanet() {
  const meshRef = useRef<THREE.Mesh>(null)
  const scroll = useScroll()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0.0 },
      uOpacity: { value: 0.0 },
    }),
    []
  )

  useFrame((state) => {
    if (!meshRef.current) return
    const t = scroll.offset

    uniforms.uTime.value = state.clock.elapsedTime

    // Fade in during Act 3 (scroll > 0.5)
    const targetOpacity = t > 0.5 ? Math.min((t - 0.5) / 0.15, 1.0) : 0.0
    uniforms.uOpacity.value += (targetOpacity - uniforms.uOpacity.value) * 0.05

    // Slow rotation
    meshRef.current.rotation.y += 0.002
    meshRef.current.rotation.x += 0.0005
  })

  return (
    <mesh ref={meshRef} position={[-0.5, 0, -20]}>
      <sphereGeometry args={[2.5, 64, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite
      />
    </mesh>
  )
}
