'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'
import Dumbbell from './Dumbbell'

// Planet center: [1.5, 0, -18], planet radius: 2.5
// Safe orbit radii: 3.3-4.0 (1.3-1.6× planet radius)
// Left wall of card zone: x ≈ -1.5 in world space (approximately)
// At orbit radius 3.5 the leftmost point is 1.5 - 3.5 = -2.0 — too far
// Solution: use orbit radii 3.0-3.6 AND bias phase so orbits spend most
// of their time on the right half. A phase offset near 0 means the dumbbell
// starts at cos(0)*r = +r to the right of planet. It'll pass through the left
// only briefly. For a 1440px canvas at FOV 75 and z=-18, the left third
// boundary is roughly x < -4.0 in world space — so even r=3.6 is fine.

interface OrbitData {
  radius: number
  speed: number
  phaseOffset: number
  // Euler tilt for orbit-plane inclination (X and Z axes)
  tiltX: number
  tiltZ: number
}

const ORBITS: OrbitData[] = [
  // Equatorial-ish — on the right side of planet at start
  { radius: 3.3, speed: 0.42, phaseOffset: 0.2,             tiltX: 0.12, tiltZ: 0.0  },
  // Polar-tilted — starts above the planet
  { radius: 3.7, speed: 0.29, phaseOffset: Math.PI * 0.5,   tiltX: 0.0,  tiltZ: 0.62 },
  // Diagonal — starts below and right
  { radius: 3.5, speed: 0.23, phaseOffset: Math.PI * 1.1,   tiltX: 0.38, tiltZ: 0.28 },
]

const PLANET = new THREE.Vector3(-0.5, 0, -20)

function OrbitingDumbbell({ radius, speed, phaseOffset, tiltX, tiltZ }: OrbitData) {
  const groupRef = useRef<THREE.Group>(null)
  const scroll = useScroll()

  // Orbit plane tilt quaternion — computed once
  const tiltQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(tiltX, 0, tiltZ))

  useFrame((state) => {
    if (!groupRef.current) return
    const t = scroll.offset

    // Appear in Act 3
    const visible = t > 0.6
    groupRef.current.visible = visible
    if (!visible) return

    const angle = state.clock.elapsedTime * speed + phaseOffset

    // Orbit in the tilted plane
    const localPos = new THREE.Vector3(
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius
    ).applyQuaternion(tiltQuat)

    groupRef.current.position.copy(PLANET).add(localPos)

    // Point the dumbbell bar along the tangent of the orbit
    groupRef.current.rotation.y = -angle
  })

  return (
    <group ref={groupRef}>
      <Dumbbell />
    </group>
  )
}

export default function Orbits() {
  const scroll = useScroll()
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (!groupRef.current) return
    const t = scroll.offset
    groupRef.current.visible = t > 0.55
  })

  return (
    <group ref={groupRef}>
      {/* Warm key light for steel shading */}
      <pointLight position={[3, 3, -14]} intensity={3} color="#ffffff" distance={25} />
      {/* Subtle cyan fill from below/behind planet */}
      <pointLight position={[-0.5, -3, -22]} intensity={1.5} color="#00FFD1" distance={20} />
      {ORBITS.map((orbit, i) => (
        <OrbitingDumbbell key={i} {...orbit} />
      ))}
    </group>
  )
}
