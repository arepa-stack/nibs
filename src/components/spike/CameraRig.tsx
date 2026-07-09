'use client'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'

export default function CameraRig() {
  const scroll = useScroll()

  useFrame((state) => {
    const t = scroll.offset

    // Act 1 (0-0.25): camera at z=10
    // Act 2 (0.25-0.5): camera moves forward z: 10 → -5
    // Act 3 (0.5-1.0): camera settles at z=-15, slight right offset
    let targetZ: number
    let targetFov: number
    let targetX: number

    if (t < 0.25) {
      targetZ = 10
      targetFov = 75
      targetX = 0
    } else if (t < 0.5) {
      const p = (t - 0.25) / 0.25
      targetZ = 10 - p * 15
      targetFov = 75 + p * 25
      targetX = 0
    } else {
      const p = (t - 0.5) / 0.5
      targetZ = -5 - p * 10
      targetFov = 100 - p * 25
      targetX = p * -2
    }

    state.camera.position.z += (targetZ - state.camera.position.z) * 0.1
    state.camera.position.x += (targetX - state.camera.position.x) * 0.1

    if (state.camera instanceof THREE.PerspectiveCamera) {
      state.camera.fov += (targetFov - state.camera.fov) * 0.1
      state.camera.updateProjectionMatrix()
    }
  })

  return null
}
