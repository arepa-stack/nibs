"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";

// Dynamically import WebGL components (must be client-only)
const AvatarRunner = dynamic(() => import("@/components/AvatarRunner"), {
  ssr: false,
});
const AvatarMouseTracker = dynamic(() => import("@/components/AvatarMouseTracker"), {
  ssr: false,
});

interface FormState {
  nombre: string;
  apellido: string;
  correo: string;
  idea: string;
}

const EMPTY_FORM: FormState = { nombre: "", apellido: "", correo: "", idea: "" };

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [isSent, setIsSent] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [runCount, setRunCount] = useState(0);
  const [errors, setErrors] = useState<Partial<FormState>>({});

  /* ── Scroll reveal animation ─────────────────────────────────── */
  useEffect(() => {
    const loadGsap = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (!sectionRef.current || !contentRef.current) return;

      const elements = contentRef.current.querySelectorAll(".contact-reveal");
      gsap.fromTo(
        elements,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );
    };

    loadGsap();
  }, []);

  /* ── Validation ──────────────────────────────────────────────── */
  const validate = useCallback(() => {
    const newErrors: Partial<FormState> = {};
    if (!form.nombre.trim()) newErrors.nombre = "Requerido";
    if (!form.apellido.trim()) newErrors.apellido = "Requerido";
    if (!form.correo.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo))
      newErrors.correo = "Correo inválido";
    if (!form.idea.trim()) newErrors.idea = "Cuéntanos tu idea";
    return newErrors;
  }, [form]);

  /* ── Submit handler ──────────────────────────────────────────── */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setIsRunning(true);
    setRunCount((c) => c + 1);
  };

  const handleRunComplete = useCallback(() => {
    setIsRunning(false);
    setIsSent(true);
    setForm(EMPTY_FORM);
  }, []);

  const handleReset = () => {
    setIsSent(false);
  };

  return (
    <>
      {/* Avatar runner overlay */}
      <AvatarRunner runCount={runCount} onComplete={handleRunComplete} />

      <section
        id="contact"
        ref={sectionRef}
        className="section-world world-contact"
      >
        <div className="grid-overlay" />

        {/* Ambient orbs */}
        <div
          className="ambient-orb"
          style={{
            width: 500,
            height: 500,
            top: "10%",
            right: "-10%",
            background: "radial-gradient(circle, rgba(0,255,209,0.08), transparent 70%)",
          }}
        />
        <div
          className="ambient-orb"
          style={{
            width: 400,
            height: 400,
            bottom: "5%",
            left: "-5%",
            background: "radial-gradient(circle, rgba(74,108,247,0.06), transparent 70%)",
            animationDelay: "-8s",
          }}
        />

        <div ref={contentRef} className="contact-container">
          {/* Header */}
          <div className="contact-header contact-reveal">
            <span
              className="status-badge"
              style={{
                color: "#00FFD1",
                borderColor: "rgba(0,255,209,0.25)",
                background: "rgba(0,255,209,0.05)",
              }}
            >
              <span
                style={{ backgroundColor: "#00FFD1" }}
                className="rounded-full w-1.5 h-1.5"
              />
              Hablemos
            </span>
            <h2 className="contact-title">
              Solicita tu{" "}
              <span className="contact-title-accent text-glow-cyan">Demo</span>
            </h2>
            <p className="contact-subtitle">
              Cuéntanos tu idea y te mostramos cómo podemos hacerla realidad.
              Respondemos en menos de 24 horas.
            </p>
          </div>

          {/* Form card */}
          <div className="contact-card contact-reveal">
            {isSent ? (
              /* ── Success state ── */
              <div className="contact-success">
                <AvatarMouseTracker />
                <h3 className="contact-success-title">¡Mensaje enviado!</h3>
                <p className="contact-success-text">
                  Gracias por contactarnos. Nuestro equipo revisará tu idea y te
                  responderá pronto.
                </p>
                <button className="contact-btn" onClick={handleReset}>
                  Enviar otra solicitud
                </button>
              </div>
            ) : (
              /* ── Form ── */
              <form onSubmit={handleSubmit} noValidate>
                <div className="contact-form-grid">
                  {/* Nombre */}
                  <div className="contact-field">
                    <label htmlFor="contact-nombre" className="contact-label">
                      Nombre
                    </label>
                    <input
                      id="contact-nombre"
                      type="text"
                      className={`contact-input ${errors.nombre ? "contact-input-error" : ""}`}
                      placeholder="Tu nombre"
                      value={form.nombre}
                      onChange={(e) =>
                        setForm({ ...form, nombre: e.target.value })
                      }
                      disabled={isRunning}
                    />
                    {errors.nombre && (
                      <span className="contact-error">{errors.nombre}</span>
                    )}
                  </div>

                  {/* Apellido */}
                  <div className="contact-field">
                    <label htmlFor="contact-apellido" className="contact-label">
                      Apellido
                    </label>
                    <input
                      id="contact-apellido"
                      type="text"
                      className={`contact-input ${errors.apellido ? "contact-input-error" : ""}`}
                      placeholder="Tu apellido"
                      value={form.apellido}
                      onChange={(e) =>
                        setForm({ ...form, apellido: e.target.value })
                      }
                      disabled={isRunning}
                    />
                    {errors.apellido && (
                      <span className="contact-error">{errors.apellido}</span>
                    )}
                  </div>
                </div>

                {/* Correo */}
                <div className="contact-field">
                  <label htmlFor="contact-correo" className="contact-label">
                    Correo electrónico
                  </label>
                  <input
                    id="contact-correo"
                    type="email"
                    className={`contact-input ${errors.correo ? "contact-input-error" : ""}`}
                    placeholder="tu@correo.com"
                    value={form.correo}
                    onChange={(e) =>
                      setForm({ ...form, correo: e.target.value })
                    }
                    disabled={isRunning}
                  />
                  {errors.correo && (
                    <span className="contact-error">{errors.correo}</span>
                  )}
                </div>

                {/* Idea */}
                <div className="contact-field">
                  <label htmlFor="contact-idea" className="contact-label">
                    Tu idea
                  </label>
                  <textarea
                    id="contact-idea"
                    className={`contact-textarea ${errors.idea ? "contact-input-error" : ""}`}
                    placeholder="Cuéntanos de qué trata tu proyecto, problema a resolver o funcionalidades que imaginas..."
                    value={form.idea}
                    onChange={(e) =>
                      setForm({ ...form, idea: e.target.value })
                    }
                    rows={4}
                    disabled={isRunning}
                  />
                  {errors.idea && (
                    <span className="contact-error">{errors.idea}</span>
                  )}
                </div>

                {/* Submit */}
                <button
                  id="contact-submit"
                  type="submit"
                  className={`contact-btn ${isRunning ? "contact-btn-loading" : ""}`}
                  disabled={isRunning}
                >
                  {isRunning ? (
                    <>
                      <span className="contact-btn-spinner" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Enviar solicitud
                      <span className="contact-btn-arrow">→</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Bottom info row */}
          <div className="contact-info-row contact-reveal">
            {[
              { icon: "⚡", label: "Respuesta en 24h" },
              { icon: "🔒", label: "Tus datos son privados" },
              { icon: "🚀", label: "Sin compromiso" },
            ].map((item) => (
              <div key={item.label} className="contact-info-chip">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="world-divider" />
      </section>
    </>
  );
}
