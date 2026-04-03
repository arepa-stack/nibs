"use client";

import { useRef, useEffect, type ReactNode } from "react";

export interface ShowcasePanel {
  title: string;
  subtitle: string;
  description: string;
  features?: string[];
  visual: ReactNode;
}

interface ProductShowcaseProps {
  id: string;
  worldClass: string;
  accentColor: string;
  glowClass: string;
  appName: string;
  panels: ShowcasePanel[];
}

export default function ProductShowcase({
  id,
  worldClass,
  accentColor,
  glowClass,
  appName,
  panels,
}: ProductShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotsRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let ctx: ReturnType<typeof import("gsap")["default"]["context"]> | undefined;

    const loadGsap = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (!containerRef.current) return;

      const totalPanels = panels.length;

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: `+=${(totalPanels - 1) * 100}%`,
            pin: true,
            scrub: 1,
            onUpdate: (self) => {
              const progress = self.progress;
              const panelIdx = Math.min(
                Math.round(progress * (totalPanels - 1)),
                totalPanels - 1
              );

              // Update dots
              const dots = dotsRef.current?.querySelectorAll(".panel-dot");
              dots?.forEach((dot, i) => {
                dot.classList.toggle("active", i === panelIdx);
              });

              // Update label
              if (labelRef.current && panels[panelIdx]) {
                labelRef.current.textContent = panels[panelIdx].title;
              }
            },
          },
        });

        // Animate panel transitions
        for (let i = 0; i < totalPanels - 1; i++) {
          const current = panelRefs.current[i];
          const next = panelRefs.current[i + 1];
          if (!current || !next) continue;

          // Alternating direction: odd slides from right, even from left
          const direction = i % 2 === 0 ? 1 : -1;

          // Current panel content elements
          const currentText = current.querySelector(".showcase-text");
          const currentVisual = current.querySelector(".showcase-visual");

          // Next panel content elements
          const nextText = next.querySelector(".showcase-text");
          const nextVisual = next.querySelector(".showcase-visual");

          // Phase: Transition current out and next in
          const phaseStart = i;

          // Current panel fades & slides out
          tl.to(
            current,
            {
              xPercent: -30 * direction,
              opacity: 0,
              scale: 0.9,
              duration: 1,
              ease: "power2.inOut",
            },
            phaseStart
          );

          // Add depth: text and visual move at different speeds (parallax)
          if (currentText) {
            tl.to(
              currentText,
              {
                x: -60 * direction,
                duration: 1,
                ease: "power2.inOut",
              },
              phaseStart
            );
          }
          if (currentVisual) {
            tl.to(
              currentVisual,
              {
                x: -20 * direction,
                rotateY: 5 * direction,
                duration: 1,
                ease: "power2.inOut",
              },
              phaseStart
            );
          }

          // Next panel slides in from opposite side
          tl.fromTo(
            next,
            {
              xPercent: 50 * direction,
              opacity: 0,
              scale: 0.85,
            },
            {
              xPercent: 0,
              opacity: 1,
              scale: 1,
              duration: 1,
              ease: "power2.inOut",
            },
            phaseStart
          );

          // Next panel content parallax entrance
          if (nextText) {
            tl.fromTo(
              nextText,
              { x: 80 * direction, opacity: 0 },
              { x: 0, opacity: 1, duration: 1, ease: "power2.out" },
              phaseStart + 0.15
            );
          }
          if (nextVisual) {
            tl.fromTo(
              nextVisual,
              {
                x: 40 * direction,
                opacity: 0,
                rotateY: -10 * direction,
                scale: 0.9,
              },
              {
                x: 0,
                opacity: 1,
                rotateY: 0,
                scale: 1,
                duration: 1,
                ease: "back.out(1.2)",
              },
              phaseStart + 0.1
            );
          }
        }
      }, containerRef);
    };

    loadGsap();

    return () => {
      ctx?.revert();
    };
  }, [panels]);

  return (
    <section
      id={id}
      ref={containerRef}
      className={`showcase-section ${worldClass}`}
      style={{ perspective: "1200px" }}
    >
      <div className="grid-overlay" />

      {/* Ambient orbs */}
      <div
        className="ambient-orb"
        style={{
          width: 500,
          height: 500,
          top: "10%",
          right: "5%",
          background: `radial-gradient(circle, ${accentColor}20, transparent 70%)`,
        }}
      />
      <div
        className="ambient-orb"
        style={{
          width: 350,
          height: 350,
          bottom: "15%",
          left: "8%",
          background: `radial-gradient(circle, ${accentColor}10, transparent 70%)`,
          animationDelay: "-8s",
        }}
      />

      {/* Panels */}
      {panels.map((panel, i) => (
        <div
          key={i}
          ref={(el) => {
            panelRefs.current[i] = el;
          }}
          className="showcase-panel"
          style={{
            opacity: i === 0 ? 1 : 0,
            zIndex: panels.length - i,
          }}
        >
          <div
            className={`showcase-panel-inner ${
              i % 2 !== 0 ? "reverse" : ""
            }`}
          >
            {/* Text side */}
            <div className="showcase-text">
              <div
                className="status-badge mb-4"
                style={{
                  color: accentColor,
                  borderColor: `${accentColor}44`,
                  background: `${accentColor}0a`,
                }}
              >
                <span
                  style={{ backgroundColor: accentColor }}
                  className="rounded-full w-1.5 h-1.5"
                />
                {appName}
              </div>

              <h2
                className={`text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-3 leading-[1.05] ${glowClass}`}
              >
                {panel.title}
              </h2>

              <p
                className="text-lg md:text-xl font-display text-white/70 mb-4"
                style={{ color: `${accentColor}cc` }}
              >
                {panel.subtitle}
              </p>

              <p className="text-gray-400 font-mono text-sm leading-relaxed max-w-md mb-6">
                {panel.description}
              </p>

              {panel.features && (
                <div className="showcase-features">
                  {panel.features.map((feat, j) => (
                    <span
                      key={j}
                      className="showcase-feature-tag"
                      style={{
                        borderColor: `${accentColor}20`,
                      }}
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Visual side */}
            <div className="showcase-visual">{panel.visual}</div>
          </div>
        </div>
      ))}

      {/* Progress dots */}
      <div
        ref={dotsRef}
        className="panel-dots"
        style={{ "--showcase-accent": accentColor } as React.CSSProperties}
      >
        {panels.map((_, i) => (
          <button
            key={i}
            className={`panel-dot ${i === 0 ? "active" : ""}`}
            aria-label={`Panel ${i + 1}`}
          />
        ))}
        <span ref={labelRef} className="panel-label">
          {panels[0]?.title}
        </span>
      </div>

      <div className="world-divider" />
    </section>
  );
}
