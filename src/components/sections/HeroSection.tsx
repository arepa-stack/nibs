"use client";

import { useRef, useEffect } from "react";
import AvatarMouseTracker from "@/components/AvatarMouseTracker";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadGsap = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (!sectionRef.current) return;

      // Entrance animation (immediate, no scroll needed)
      const tl = gsap.timeline({ delay: 0.3 });

      if (headlineRef.current) {
        const lines = headlineRef.current.querySelectorAll(".hero-line");
        tl.fromTo(
          lines,
          { y: 80, opacity: 0, skewY: 3 },
          { y: 0, opacity: 1, skewY: 0, duration: 1, stagger: 0.15, ease: "power3.out" }
        );
      }

      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
          "-=0.4"
        );
      }

      if (scrollIndicatorRef.current) {
        tl.fromTo(
          scrollIndicatorRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1 },
          "-=0.2"
        );
      }
    };

    loadGsap();
  }, []);

  return (
    <section id="hero" ref={sectionRef} className="section-world world-hero">
      <div className="grid-overlay" />

      {/* Ambient orbs */}
      <div
        className="ambient-orb"
        style={{
          width: 400,
          height: 400,
          top: "10%",
          right: "10%",
          background: "radial-gradient(circle, rgba(0,255,209,0.15), transparent 70%)",
        }}
      />
      <div
        className="ambient-orb"
        style={{
          width: 300,
          height: 300,
          bottom: "20%",
          left: "5%",
          background: "radial-gradient(circle, rgba(74,108,247,0.1), transparent 70%)",
          animationDelay: "-7s",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center justify-center">
        <div ref={headlineRef} className="overflow-hidden relative z-10">
          <div className="hero-line">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold text-white leading-[0.95] tracking-tight">
              No esperamos
            </h1>
          </div>
          <div className="hero-line mt-2">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold text-white leading-[0.95] tracking-tight">
              el futuro.
            </h1>
          </div>
          <div className="hero-line mt-2">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold text-cyan-accent leading-[0.95] tracking-tight text-glow-cyan">
              Lo programamos.
            </h1>
          </div>
        </div>

        <p
          ref={subtitleRef}
          className="mt-8 md:mt-10 text-base md:text-lg text-gray-400 font-mono max-w-2xl mx-auto leading-relaxed opacity-0"
        >
          Somos un laboratorio de software. Construimos, iteramos y lanzamos
          productos digitales de alto impacto.
        </p>

        {/* Avatar placed below text */}
        <div className="mt-10 z-20 pointer-events-auto">
          <AvatarMouseTracker />
        </div>
      </div>

      {/* Scroll indicator */}
      <div ref={scrollIndicatorRef} className="scroll-indicator opacity-0">
        <span className="text-xs font-mono text-gray-500 tracking-widest uppercase">Scroll</span>
        <div className="scroll-indicator-line" />
      </div>

      <div className="world-divider" />
    </section>
  );
}
