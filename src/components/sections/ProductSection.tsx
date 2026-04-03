"use client";

import { useRef, useEffect } from "react";

interface ProductSectionProps {
  id: string;
  worldClass: string;
  accentColor: string;
  glowClass: string;
  statusText: string;
  statusColor: string;
  title: string;
  description: string;
  features: { icon: string; title: string; text: string }[];
  alignRight?: boolean;
}

export default function ProductSection({
  id,
  worldClass,
  accentColor,
  glowClass,
  statusText,
  statusColor,
  title,
  description,
  features,
  alignRight = false,
}: ProductSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ctx: ReturnType<typeof import("gsap")["default"]["context"]> | undefined;

    const loadGsap = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (!sectionRef.current) return;

      ctx = gsap.context(() => {
        const section = sectionRef.current!;

        // Parallax on background orb
        const orb = section.querySelector(".ambient-orb");
        if (orb) {
          gsap.to(orb, {
            y: -80,
            x: 30,
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
          });
        }

        // Title — clip-path wipe reveal
        const title = section.querySelector("h2");
        if (title) {
          gsap.fromTo(
            title,
            {
              clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)",
              opacity: 0,
            },
            {
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
              opacity: 1,
              duration: 1.2,
              ease: "power3.inOut",
              scrollTrigger: {
                trigger: title,
                start: "top 82%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        // Status badge & description — staggered slide-up
        const textEls = section.querySelectorAll(
          ".reveal-up"
        );
        textEls.forEach((el, i) => {
          gsap.fromTo(
            el,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              delay: i * 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 88%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });

        // Feature cards — 3D rotate + spring reveal
        const cards = section.querySelectorAll(".feature-card");
        cards.forEach((card, i) => {
          gsap.fromTo(
            card,
            {
              rotateY: alignRight ? -12 : 12,
              rotateX: 6,
              y: 50,
              opacity: 0,
              transformPerspective: 800,
            },
            {
              rotateY: 0,
              rotateX: 0,
              y: 0,
              opacity: 1,
              duration: 0.9,
              delay: i * 0.12,
              ease: "back.out(1.4)",
              scrollTrigger: {
                trigger: card,
                start: "top 92%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });
      }, sectionRef);
    };

    loadGsap();

    return () => {
      ctx?.revert();
    };
  }, [alignRight]);

  return (
    <section id={id} ref={sectionRef} className={`section-world ${worldClass}`}>
      <div className="grid-overlay" />

      {/* Ambient orb */}
      <div
        className="ambient-orb"
        style={{
          width: 500,
          height: 500,
          top: alignRight ? "20%" : "10%",
          [alignRight ? "left" : "right"]: "5%",
          background: `radial-gradient(circle, ${accentColor}22, transparent 70%)`,
          animationDelay: "-5s",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 py-20">
        <div
          className={`flex flex-col ${
            alignRight ? "md:flex-row-reverse" : "md:flex-row"
          } items-center gap-12 md:gap-20`}
        >
          {/* Text block */}
          <div className="flex-1 w-full">
            <div className={`reveal-up`}>
              <div
                className="status-badge mb-6"
                style={{
                  color: accentColor,
                  borderColor: `${accentColor}44`,
                  background: `${accentColor}0a`,
                }}
              >
                <span style={{ backgroundColor: accentColor }} className="rounded-full w-1.5 h-1.5" />
                {statusText}
              </div>
            </div>

            <h2
              className={`reveal-up text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white mb-6 leading-[1.05] ${glowClass}`}
            >
              {title}
            </h2>

            <p className="reveal-up text-gray-400 font-mono text-sm md:text-base leading-relaxed max-w-lg">
              {description}
            </p>
          </div>

          {/* Features grid */}
          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <div
                key={i}
                className="feature-card reveal-scale"
                style={{ transitionDelay: `${i * 0.05}s` }}
              >
                <div className="text-2xl mb-3">{feature.icon}</div>
                <h4 className="text-white font-display font-semibold text-sm mb-1">
                  {feature.title}
                </h4>
                <p className="text-gray-500 text-xs font-mono leading-relaxed">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="world-divider" />
    </section>
  );
}
