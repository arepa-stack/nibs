'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'

export default function WarpEffect() {
  const ref = useRef<THREE.LineSegments>(null)
  const scroll = useScroll()

  const geometry = useMemo(() => {
    const lineCount = 200
    const vertices: number[] = []

    for (let i = 0; i < lineCount; i++) {
      const angle = (i / lineCount) * Math.PI * 2 + Math.random() * 0.3
      const radiusNear = 0.5 + Math.random() * 2
      const radiusFar = radiusNear + 1 + Math.random() * 5

      const xNear = Math.cos(angle) * radiusNear
      const yNear = Math.sin(angle) * radiusNear
      const xFar = Math.cos(angle) * radiusFar
      const yFar = Math.sin(angle) * radiusFar

      // From near point to far point, at varying depths
      const zNear = -5 + Math.random() * 10
      vertices.push(xNear, yNear, zNear)
      vertices.push(xFar, yFar, zNear - 2)
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    return geo
  }, [])

  useFrame(() => {
    if (!ref.current) return
    const t = scroll.offset

    let warpProgress = 0
    if (t >= 0.25 && t <= 0.5) {
      warpProgress = (t - 0.25) / 0.25
    }

    const mat = ref.current.material as THREE.LineBasicMaterial
    mat.opacity = warpProgress * 0.8
    ref.current.visible = warpProgress > 0.01
  })

  return (
    <lineSegments ref={ref} geometry={geometry}>
      <lineBasicMaterial
        color="#00FFD1"
        transparent
        opacity={0}
        depthWrite={false}
      />
    </lineSegments>
  )
}
