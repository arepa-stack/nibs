'use client'
import { useEffect, useRef, useState } from 'react'

export default function HeroOverlay() {
  const [opacity, setOpacity] = useState(1)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollY / docHeight
      // Fade out completely by 25% scroll
      const newOpacity = Math.max(0, 1 - progress * 4)
      setOpacity(newOpacity)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
        pointerEvents: opacity < 0.05 ? 'none' : 'auto',
        transition: 'opacity 0.1s linear',
      }}
    >
      {/* Subtle radial vignette to make text pop against nebula */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 55% 45% at 50% 50%, transparent 30%, rgba(5,5,8,0.65) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Eyebrow label */}
      <span
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '0.65rem',
          fontWeight: 400,
          color: '#00FFD1',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          marginBottom: '1rem',
          opacity: 0.9,
          position: 'relative',
        }}
      >
        G-Pulse Universe
      </span>

      {/* Wordmark */}
      <h1
        style={{
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: 'clamp(4.5rem, 13vw, 11rem)',
          fontWeight: 800,
          color: 'white',
          letterSpacing: '-0.05em',
          margin: 0,
          lineHeight: 0.9,
          position: 'relative',
          // Subtle text-shadow gives a glow feel without postprocessing on DOM
          textShadow: '0 0 60px rgba(0,255,209,0.25), 0 0 120px rgba(0,255,209,0.08)',
        }}
      >
        nibs
      </h1>

      {/* Tagline */}
      <p
        style={{
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: 'clamp(0.9rem, 2.2vw, 1.35rem)',
          fontWeight: 300,
          color: 'rgba(240,240,245,0.55)',
          marginTop: '1.25rem',
          letterSpacing: '0.06em',
          position: 'relative',
        }}
      >
        El universo digital, en tus manos
      </p>

      {/* Scroll hint */}
      <div
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.6rem',
        }}
      >
        <span
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '0.6rem',
            color: 'rgba(240,240,245,0.35)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          Desplázate para explorar
        </span>
        <div
          style={{
            width: '1px',
            height: '2.5rem',
            background: 'linear-gradient(to bottom, rgba(0,255,209,0.9), transparent)',
            animation: 'scroll-hint 1.8s ease-in-out infinite',
          }}
        />
        <style>{`
          @keyframes scroll-hint {
            0%, 100% { opacity: 1; transform: scaleY(1) translateY(0); }
            50% { opacity: 0.3; transform: scaleY(0.5) translateY(4px); }
          }
        `}</style>
      </div>
    </div>
  )
}
