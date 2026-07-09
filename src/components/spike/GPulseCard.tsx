'use client'
import { useEffect, useState } from 'react'

const features = [
  { label: 'Rutinas IA', icon: '⚡' },
  { label: 'Gamificación', icon: '🏆' },
  { label: 'Social', icon: '👥' },
  { label: 'Analytics', icon: '📊' },
]

export default function GPulseCard() {
  const [opacity, setOpacity] = useState(0)
  const [translateY, setTranslateY] = useState(12)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollY / docHeight

      let newOpacity = 0
      let newY = 12

      if (progress > 0.55) {
        const p = Math.min((progress - 0.55) / 0.1, 1.0)
        newOpacity = p
        newY = 12 * (1 - p)
      }
      if (progress > 0.85) {
        newOpacity = Math.max(0, 1 - (progress - 0.85) / 0.15)
      }
      setOpacity(newOpacity)
      setTranslateY(newY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        left: 'clamp(1.5rem, 5vw, 4rem)',
        top: '50%',
        transform: `translateY(calc(-50% + ${translateY}px))`,
        zIndex: 10,
        opacity,
        pointerEvents: opacity < 0.05 ? 'none' : 'auto',
        transition: 'opacity 0.3s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'opacity, transform',
      }}
    >
      <div
        style={{
          background: 'rgba(5,5,8,0.85)',
          border: '1px solid rgba(0,255,209,0.18)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: '1.25rem',
          padding: '1.75rem 1.5rem',
          width: '260px',
          color: 'white',
          fontFamily: '"Space Grotesk", sans-serif',
          boxShadow: '0 0 0 1px rgba(0,255,209,0.05), 0 24px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.6rem',
            fontFamily: '"JetBrains Mono", monospace',
            fontWeight: 500,
            letterSpacing: '0.18em',
            color: '#00FFD1',
            border: '1px solid rgba(0,255,209,0.3)',
            borderRadius: '999px',
            padding: '0.25rem 0.75rem',
            marginBottom: '1.25rem',
            textTransform: 'uppercase',
            background: 'rgba(0,255,209,0.05)',
          }}
        >
          <span style={{ width: '5px', height: '5px', background: '#00FFD1', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 6px rgba(0,255,209,0.8)' }} />
          Producto
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: '2.25rem',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            margin: '0 0 0.2rem',
            color: 'white',
            lineHeight: 1,
          }}
        >
          G-Pulse
        </h2>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '0.85rem',
            fontWeight: 300,
            color: 'rgba(240,240,245,0.5)',
            margin: '0 0 1.5rem',
            lineHeight: 1.5,
            letterSpacing: '0.01em',
          }}
        >
          Tu entrenamiento, gamificado
        </p>

        {/* Divider */}
        <div
          style={{
            height: '1px',
            background: 'linear-gradient(to right, rgba(0,255,209,0.2), transparent)',
            marginBottom: '1.25rem',
          }}
        />

        {/* Feature chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {features.map((f) => (
            <span
              key={f.label}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.68rem',
                fontWeight: 500,
                letterSpacing: '0.03em',
                color: 'rgba(240,240,245,0.8)',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '0.375rem',
                padding: '0.3rem 0.65rem',
              }}
            >
              {f.label}
            </span>
          ))}
        </div>

        {/* CTA */}
        <button
          style={{
            display: 'block',
            width: '100%',
            marginTop: '1.5rem',
            padding: '0.7rem 1rem',
            background: '#00FFD1',
            color: '#050508',
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            border: 'none',
            borderRadius: '0.625rem',
            cursor: 'pointer',
          }}
        >
          Explorar
        </button>
      </div>
    </div>
  )
}
