"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";

const founders = [
  {
    name: "Jholbert",
    role: "DevOps & Backend",
    initial: "J",
    avatar: "/avatar-jholbert.png",
    accent: "#00FFD1",
    description:
      "Arquitecto de infraestructura en la nube y optimización de bases de datos de alto rendimiento.",
    stack: ["Node.js", "PostgreSQL", "Docker", "AWS", "Firebase", "TypeScript"],
    contributions: [
      "Arquitectura de microservicios",
      "CI/CD pipelines",
      "Optimización de bases de datos",
      "Infraestructura cloud",
    ],
  },
  {
    name: "Diango",
    role: "Frontend Lead",
    initial: "D",
    avatar: "/avatar-diango.png",
    accent: "#FF6B35",
    description:
      "Especialista en experiencias de usuario interactivas, WebGL y desarrollo con React/Next.js.",
    stack: ["React", "Next.js", "TypeScript", "Three.js", "GSAP", "Tailwind CSS"],
    contributions: [
      "Diseño de interfaces",
      "Animaciones avanzadas",
      "Arquitectura frontend",
      "Experiencia de usuario",
    ],
  },
  {
    name: "Luis",
    role: "Product Manager",
    initial: "L",
    avatar: "/avatar-luis.png",
    accent: "#4A6CF7",
    description:
      "Estratega de producto, experto en agilidad y lanzamiento de MVPs funcionales.",
    stack: ["Figma", "Jira", "Analytics", "Notion", "Miro", "Scrum"],
    contributions: [
      "Estrategia de producto",
      "Gestión ágil",
      "Research & Discovery",
      "Métricas y KPIs",
    ],
  },
];

export default function TeamSection() {
  const containerRef = useRef<HTMLElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const avatarRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotsRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let ctx: ReturnType<typeof import("gsap")["default"]["context"]> | undefined;

    const loadGsap = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (!containerRef.current) return;

      const total = founders.length;

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: `+=${(total - 1) * 120}%`,
            pin: true,
            scrub: 1.2,
            onUpdate: (self) => {
              const progress = self.progress;
              const idx = Math.min(
                Math.round(progress * (total - 1)),
                total - 1
              );

              // Update dots
              const dots = dotsRef.current?.querySelectorAll(".panel-dot");
              dots?.forEach((dot, i) => {
                dot.classList.toggle("active", i === idx);
              });

              // Update label text
              if (labelRef.current) {
                labelRef.current.textContent = founders[idx].name;
              }

              // Update dot accent color per founder
              if (dotsRef.current) {
                dotsRef.current.style.setProperty(
                  "--showcase-accent",
                  founders[idx].accent
                );
              }
            },
          },
        });

        // Continuous scroll-driven rotation for all visible avatars
        avatarRefs.current.forEach((avatarEl) => {
          if (!avatarEl) return;
          gsap.to(avatarEl, {
            rotateY: 360,
            duration: 1,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: `+=${(total - 1) * 120}%`,
              scrub: 2,
            },
          });
        });

        // 3D flip transitions between founders
        for (let i = 0; i < total - 1; i++) {
          const current = panelRefs.current[i];
          const next = panelRefs.current[i + 1];
          if (!current || !next) continue;

          const direction = i % 2 === 0 ? 1 : -1;

          // Current founder flips out with 3D rotation
          tl.to(
            current,
            {
              rotateY: -90 * direction,
              opacity: 0,
              scale: 0.8,
              duration: 1,
              ease: "power3.inOut",
            },
            i
          );

          // Next founder flips in from opposite side
          tl.fromTo(
            next,
            {
              rotateY: 90 * direction,
              opacity: 0,
              scale: 0.8,
            },
            {
              rotateY: 0,
              opacity: 1,
              scale: 1,
              duration: 1,
              ease: "power3.inOut",
            },
            i
          );

          // Stagger-animate inner content of the incoming panel
          const nextContent = next.querySelectorAll(".founder-animate");
          if (nextContent.length) {
            tl.fromTo(
              nextContent,
              { y: 25, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.5,
                stagger: 0.06,
                ease: "power2.out",
              },
              i + 0.5
            );
          }
        }
      }, containerRef);
    };

    loadGsap();
    return () => {
      ctx?.revert();
    };
  }, []);

  return (
    <section
      id="team"
      ref={containerRef}
      className="showcase-section world-team"
      style={{ perspective: "1200px" }}
    >
      <div className="grid-overlay" />

      {/* Ambient orbs */}
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

      {/* Founder panels */}
      {founders.map((founder, i) => (
        <div
          key={founder.name}
          ref={(el) => {
            panelRefs.current[i] = el;
          }}
          className="showcase-panel"
          style={{
            opacity: i === 0 ? 1 : 0,
            zIndex: founders.length - i,
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className={`showcase-panel-inner ${i % 2 !== 0 ? "reverse" : ""}`}
          >
            {/* Avatar / Visual */}
            <div className="showcase-visual">
              <div className="founder-avatar-wrapper">
                {/* Animated orbit rings */}
                <div
                  className="founder-ring founder-ring-outer"
                  style={{ borderColor: `${founder.accent}25` }}
                />
                <div
                  className="founder-ring founder-ring-mid"
                  style={{ borderColor: `${founder.accent}18` }}
                />
                <div
                  className="founder-ring founder-ring-inner"
                  style={{ borderColor: `${founder.accent}12` }}
                />

                {/* Main avatar with image */}
                <div
                  ref={(el) => {
                    avatarRefs.current[i] = el;
                  }}
                  className="founder-avatar-large"
                  style={{
                    background: `linear-gradient(135deg, ${founder.accent}18, ${founder.accent}06)`,
                    border: `2px solid ${founder.accent}35`,
                    boxShadow: `0 0 60px ${founder.accent}20, inset 0 0 40px ${founder.accent}08`,
                    transformStyle: "preserve-3d",
                  }}
                >
                  <Image
                    src={founder.avatar}
                    alt={founder.name}
                    width={150}
                    height={150}
                    className="founder-avatar-img"
                    style={{ borderRadius: "50%", objectFit: "cover" }}
                    priority
                  />
                </div>

                {/* Glow underneath */}
                <div
                  className="founder-glow"
                  style={{
                    background: `radial-gradient(circle, ${founder.accent}12, transparent 70%)`,
                  }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="showcase-text">
              <div className="founder-animate">
                <span
                  className="status-badge mb-4"
                  style={{
                    color: founder.accent,
                    borderColor: `${founder.accent}44`,
                    background: `${founder.accent}0a`,
                  }}
                >
                  <span
                    style={{ backgroundColor: founder.accent }}
                    className="rounded-full w-1.5 h-1.5"
                  />
                  The Founders
                </span>
              </div>

              <h2
                className="founder-animate text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-2 leading-[1.05]"
                style={{ textShadow: `0 0 40px ${founder.accent}30` }}
              >
                {founder.name}
              </h2>

              <p
                className="founder-animate text-lg font-mono mb-4"
                style={{ color: founder.accent }}
              >
                {founder.role}
              </p>

              <p className="founder-animate text-gray-400 font-mono text-sm leading-relaxed mb-6 max-w-md">
                {founder.description}
              </p>

              {/* Tech Stack */}
              <div className="founder-animate mb-6">
                <div className="text-xs font-mono text-gray-500 mb-3 uppercase tracking-wider">
                  Stack
                </div>
                <div className="flex flex-wrap gap-2">
                  {founder.stack.map((tech) => (
                    <span
                      key={tech}
                      className="tech-badge"
                      style={{ borderColor: `${founder.accent}20` }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contributions */}
              <div className="founder-animate">
                <div className="text-xs font-mono text-gray-500 mb-3 uppercase tracking-wider">
                  Contribuciones
                </div>
                <div className="space-y-1">
                  {founder.contributions.map((c) => (
                    <div
                      key={c}
                      className="contribution-item"
                      style={
                        {
                          "--founder-accent": founder.accent,
                        } as React.CSSProperties
                      }
                    >
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Progress dots */}
      <div
        ref={dotsRef}
        className="panel-dots"
        style={
          { "--showcase-accent": founders[0].accent } as React.CSSProperties
        }
      >
        {founders.map((_, i) => (
          <button
            key={i}
            className={`panel-dot ${i === 0 ? "active" : ""}`}
            aria-label={`Founder ${i + 1}`}
          />
        ))}
        <span ref={labelRef} className="panel-label">
          {founders[0].name}
        </span>
      </div>

      <div className="world-divider" />
    </section>
  );
}
