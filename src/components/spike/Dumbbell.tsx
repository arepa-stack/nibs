'use client'

// Neutral dark-steel dumbbell with a subtle #00FFD1 emissive rim accent.
// No color prop — all dumbbells share the same steel look for visual cohesion.
export default function Dumbbell() {
  const steelColor = '#1a2226'
  const accentEmissive = '#00FFD1'

  return (
    // scale 0.16: small satellite, visible but clearly subordinate to planet
    <group scale={0.16}>
      {/* Handle — dark steel cylinder */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 2, 8]} />
        <meshStandardMaterial
          color={steelColor}
          emissive={accentEmissive}
          emissiveIntensity={0.08}
          metalness={0.9}
          roughness={0.25}
        />
      </mesh>
      {/* Left weight disc */}
      <mesh position={[-1.1, 0, 0]}>
        <sphereGeometry args={[0.42, 16, 16]} />
        <meshStandardMaterial
          color={steelColor}
          emissive={accentEmissive}
          emissiveIntensity={0.35}
          metalness={0.85}
          roughness={0.2}
          toneMapped={false}
        />
      </mesh>
      {/* Right weight disc */}
      <mesh position={[1.1, 0, 0]}>
        <sphereGeometry args={[0.42, 16, 16]} />
        <meshStandardMaterial
          color={steelColor}
          emissive={accentEmissive}
          emissiveIntensity={0.35}
          metalness={0.85}
          roughness={0.2}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}
