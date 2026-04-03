"use client";

import { useRef, useEffect } from "react";

const founders = [
  {
    name: "Jholbert",
    role: "DevOps & Backend",
    accent: "#00FFD1",
    description:
      "Arquitecto de infraestructura en la nube y optimización de bases de datos de alto rendimiento.",
    initial: "J",
  },
  {
    name: "Founder 2",
    role: "Frontend Lead",
    accent: "#FF6B35",
    description:
      "Especialista en experiencias de usuario interactivas, WebGL y desarrollo con React/Next.js.",
    initial: "F",
  },
  {
    name: "Founder 3",
    role: "Product Manager",
    accent: "#4A6CF7",
    description:
      "Estratega de producto, experto en agilidad y lanzamiento de MVPs funcionales.",
    initial: "P",
  },
];

export default function TeamSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const loadGsap = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (!sectionRef.current) return;

      const heading = sectionRef.current.querySelector(".team-heading");
      const cards = sectionRef.current.querySelectorAll(".founder-card");

      if (heading) {
        gsap.fromTo(
          heading,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: heading,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 80, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.9,
            delay: i * 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    };

    loadGsap();
  }, []);

  return (
    <section id="team" ref={sectionRef} className="section-world world-team">
      <div className="grid-overlay" />

      {/* Multi-color ambient orbs */}
      <div
        className="ambient-orb"
        style={{
          width: 300,
          height: 300,
          top: "15%",
          left: "10%",
          background: "radial-gradient(circle, rgba(0,255,209,0.1), transparent 70%)",
        }}
      />
      <div
        className="ambient-orb"
        style={{
          width: 300,
          height: 300,
          top: "20%",
          right: "10%",
          background: "radial-gradient(circle, rgba(255,107,53,0.08), transparent 70%)",
          animationDelay: "-10s",
        }}
      />
      <div
        className="ambient-orb"
        style={{
          width: 250,
          height: 250,
          bottom: "15%",
          left: "40%",
          background: "radial-gradient(circle, rgba(74,108,247,0.08), transparent 70%)",
          animationDelay: "-5s",
        }}
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-20 text-center">
        <h2 className="team-heading text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-4">
          The Founders
        </h2>
        <p className="team-heading text-gray-500 font-mono text-sm mb-16 max-w-md mx-auto">
          El equipo detrás de cada producto que lanzamos.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {founders.map((founder) => (
            <div
              key={founder.name}
              className="founder-card text-left"
              style={
                {
                  "--accent": founder.accent,
                  "--accent-glow": `${founder.accent}40`,
                } as React.CSSProperties
              }
            >
              {/* Avatar circle */}
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold font-display mb-6"
                style={{
                  background: `${founder.accent}15`,
                  color: founder.accent,
                  border: `1px solid ${founder.accent}30`,
                }}
              >
                {founder.initial}
              </div>

              <h3 className="text-xl font-bold font-display text-white mb-1">
                {founder.name}
              </h3>
              <p
                className="text-sm font-mono mb-4"
                style={{ color: founder.accent }}
              >
                {founder.role}
              </p>
              <p className="text-gray-500 text-sm leading-relaxed">
                {founder.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
