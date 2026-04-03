"use client";

import HeroSection from "@/components/sections/HeroSection";
import ProductShowcase from "@/components/sections/ProductShowcase";
import type { ShowcasePanel } from "@/components/sections/ProductShowcase";
import ProductSection from "@/components/sections/ProductSection";
import TeamSection from "@/components/sections/TeamSection";
import CommandPalette from "@/components/CommandPalette";

/* ───────────────────────────────────────────────────────────────
   PHONE MOCKUP SCREENS — G-PULSE
   ─────────────────────────────────────────────────────────────── */

function GPulseHome() {
  return (
    <div className="phone-frame">
      <div className="phone-notch" />
      <div className="phone-screen">
        <div className="mock-header">
          <span className="mock-header-title" style={{ color: "#00FFD1" }}>G-PULSE</span>
          <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>≡</span>
        </div>
        <div style={{ padding: "0 12px", marginBottom: 8 }}>
          <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.4)", fontFamily: "JetBrains Mono, monospace" }}>
            Tu entrenamiento de hoy
          </div>
        </div>
        <div className="mock-card" style={{ borderColor: "rgba(0,255,209,0.15)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: "1rem" }}>🏋️</span>
            <div>
              <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "#fff" }}>Pecho & Tríceps</div>
              <div style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.3)" }}>4 ejercicios · 45 min</div>
            </div>
          </div>
          <div className="mock-bar" style={{ marginBottom: 4 }}>
            <div className="mock-bar-fill" style={{ width: "65%", background: "linear-gradient(90deg, #00FFD1, #00cc99)" }} />
          </div>
        </div>
        <div className="mock-card">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: "1rem" }}>🦵</span>
            <div>
              <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "#fff" }}>Pierna</div>
              <div style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.3)" }}>5 ejercicios · 50 min</div>
            </div>
          </div>
        </div>
        <div className="mock-card">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: "1rem" }}>💪</span>
            <div>
              <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "#fff" }}>Espalda & Bíceps</div>
              <div style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.3)" }}>4 ejercicios · 40 min</div>
            </div>
          </div>
        </div>
        <div style={{ padding: "8px 12px", marginTop: 4 }}>
          <div className="mock-bar" style={{ height: 4, marginBottom: 4 }}>
            <div className="mock-bar-fill" style={{ width: "72%", background: "#00FFD1" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.5rem", color: "#00FFD1", fontFamily: "JetBrains Mono" }}>XP 680</span>
            <span style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono" }}>Nivel 5</span>
          </div>
        </div>
        <div className="mock-nav">
          <span>🏠</span><span>💪</span><span>🤖</span><span>📊</span>
        </div>
      </div>
    </div>
  );
}

function GPulseRutinas() {
  return (
    <div className="phone-frame">
      <div className="phone-notch" />
      <div className="phone-screen">
        <div className="mock-header">
          <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}>←</span>
          <span className="mock-header-title">Nueva Rutina</span>
          <span style={{ fontSize: "0.6rem", color: "#00FFD1" }}>✓</span>
        </div>
        <div style={{ padding: "0 12px 6px" }}>
          <div style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono" }}>
            Personaliza tu entrenamiento
          </div>
        </div>
        {[
          { name: "Press de banca", sets: "4×12", icon: "🏋️" },
          { name: "Fondos", sets: "3×15", icon: "💪" },
          { name: "Aperturas", sets: "3×12", icon: "🫁" },
          { name: "Tríceps polea", sets: "4×10", icon: "💪" },
        ].map((ex, i) => (
          <div className="mock-card" key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px" }}>
            <span style={{ fontSize: "0.85rem" }}>{ex.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.65rem", color: "#fff", fontWeight: 500 }}>{ex.name}</div>
            </div>
            <span style={{ fontSize: "0.55rem", color: "#00FFD1", fontFamily: "JetBrains Mono" }}>{ex.sets}</span>
          </div>
        ))}
        <div style={{ margin: "10px 12px", padding: "10px", borderRadius: 12, border: "1px dashed rgba(0,255,209,0.3)", textAlign: "center" }}>
          <span style={{ fontSize: "0.6rem", color: "#00FFD1" }}>+ Agregar ejercicio</span>
        </div>
        <div className="mock-nav">
          <span>🏠</span><span style={{ opacity: 1 }}>💪</span><span>🤖</span><span>📊</span>
        </div>
      </div>
    </div>
  );
}

function GPulseIA() {
  return (
    <div className="phone-frame">
      <div className="phone-notch" />
      <div className="phone-screen">
        <div className="mock-header">
          <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}>←</span>
          <span className="mock-header-title">Asistente IA</span>
          <span style={{ fontSize: "0.7rem" }}>🤖</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", padding: "4px 0", height: "calc(100% - 100px)", justifyContent: "flex-end" }}>
          <div className="mock-chat-bubble ai" style={{ borderColor: "rgba(0,255,209,0.15)" }}>
            ¡Hola! Soy tu entrenador IA. ¿En qué puedo ayudarte hoy?
          </div>
          <div className="mock-chat-bubble user" style={{ background: "rgba(0,255,209,0.12)", color: "#00FFD1" }}>
            Quiero una rutina para ganar masa muscular
          </div>
          <div className="mock-chat-bubble ai" style={{ borderColor: "rgba(0,255,209,0.15)" }}>
            Perfecto. Basado en tu historial, te recomiendo un programa push/pull/legs de 4 días. ¿Empezamos?
          </div>
          <div className="mock-chat-bubble user" style={{ background: "rgba(0,255,209,0.12)", color: "#00FFD1" }}>
            ¡Sí, vamos!
          </div>
          <div className="mock-chat-bubble ai" style={{ borderColor: "rgba(0,255,209,0.15)" }}>
            🎯 Rutina generada. Empezamos con pecho el lunes...
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 44, left: 12, right: 12, padding: "8px 12px", borderRadius: 20, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.25)", flex: 1 }}>Escribe tu pregunta...</span>
          <span style={{ color: "#00FFD1", fontSize: "0.7rem" }}>→</span>
        </div>
        <div className="mock-nav">
          <span>🏠</span><span>💪</span><span style={{ opacity: 1 }}>🤖</span><span>📊</span>
        </div>
      </div>
    </div>
  );
}

function GPulseProgreso() {
  return (
    <div className="phone-frame">
      <div className="phone-notch" />
      <div className="phone-screen">
        <div className="mock-header">
          <span className="mock-header-title">Mi Progreso</span>
          <span style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono" }}>Abril 2026</span>
        </div>
        <div className="mock-stat-row">
          <div className="mock-stat-box">
            <div className="mock-stat-value" style={{ color: "#00FFD1" }}>78</div>
            <div className="mock-stat-label">kg peso</div>
          </div>
          <div className="mock-stat-box">
            <div className="mock-stat-value" style={{ color: "#00FFD1" }}>↑12%</div>
            <div className="mock-stat-label">fuerza</div>
          </div>
          <div className="mock-stat-box">
            <div className="mock-stat-value" style={{ color: "#00FFD1" }}>92%</div>
            <div className="mock-stat-label">consist.</div>
          </div>
        </div>
        <div className="mock-chart" style={{ background: "rgba(0,255,209,0.03)", border: "1px solid rgba(0,255,209,0.08)", borderRadius: 12 }}>
          {[35, 50, 45, 65, 55, 75, 80, 70, 85].map((h, i) => (
            <div key={i} className="mock-chart-bar" style={{
              left: `${8 + i * 11}%`,
              height: `${h}%`,
              background: `linear-gradient(to top, rgba(0,255,209,0.6), rgba(0,255,209,0.15))`,
            }} />
          ))}
        </div>
        <div style={{ padding: "0 12px", marginTop: 6 }}>
          <div style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>Récords recientes</div>
        </div>
        {[
          { name: "Press banca", val: "100kg 🏆" },
          { name: "Sentadilla", val: "120kg 🔥" },
        ].map((r, i) => (
          <div key={i} className="mock-list-item" style={{ padding: "6px 12px" }}>
            <span style={{ fontSize: "0.6rem", color: "#fff", flex: 1 }}>{r.name}</span>
            <span style={{ fontSize: "0.55rem", color: "#00FFD1", fontFamily: "JetBrains Mono" }}>{r.val}</span>
          </div>
        ))}
        <div className="mock-nav">
          <span>🏠</span><span>💪</span><span>🤖</span><span style={{ opacity: 1 }}>📊</span>
        </div>
      </div>
    </div>
  );
}

function GPulseGamificacion() {
  return (
    <div className="phone-frame">
      <div className="phone-notch" />
      <div className="phone-screen">
        <div className="mock-header">
          <span className="mock-header-title">Logros</span>
          <span style={{ fontSize: "0.6rem", color: "#00FFD1", fontFamily: "JetBrains Mono" }}>Nivel 5</span>
        </div>
        <div style={{ padding: "0 12px", marginBottom: 6 }}>
          <div className="mock-bar" style={{ height: 8, background: "rgba(0,255,209,0.1)", borderRadius: 4 }}>
            <div className="mock-bar-fill" style={{ width: "72%", background: "linear-gradient(90deg, #00FFD1, #00aa88)", borderRadius: 4, height: "100%" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
            <span style={{ fontSize: "0.45rem", color: "#00FFD1", fontFamily: "JetBrains Mono" }}>680 XP</span>
            <span style={{ fontSize: "0.45rem", color: "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono" }}>1000 XP</span>
          </div>
        </div>
        <div className="mock-badge-grid">
          {["🔥", "💪", "🏆", "⚡", "🎯", "🦁", "⭐", "🚀"].map((b, i) => (
            <div key={i} className="mock-badge" style={{
              background: i < 5 ? "rgba(0,255,209,0.08)" : "rgba(255,255,255,0.02)",
              borderColor: i < 5 ? "rgba(0,255,209,0.2)" : "rgba(255,255,255,0.05)",
              opacity: i < 5 ? 1 : 0.4,
            }}>
              {b}
            </div>
          ))}
        </div>
        <div style={{ padding: "6px 12px" }}>
          <div style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>Ranking</div>
        </div>
        {[
          { pos: "1", name: "Carlos M.", xp: "1,240", me: false },
          { pos: "2", name: "Ana R.", xp: "980", me: false },
          { pos: "3", name: "Tú", xp: "680", me: true },
        ].map((r, i) => (
          <div key={i} className="mock-list-item" style={{
            padding: "7px 12px",
            background: r.me ? "rgba(0,255,209,0.06)" : "transparent",
            borderRadius: r.me ? 8 : 0,
            margin: r.me ? "0 8px" : 0,
          }}>
            <span style={{ fontSize: "0.6rem", color: r.me ? "#00FFD1" : "rgba(255,255,255,0.3)", fontWeight: 700, width: 16 }}>{r.pos}</span>
            <div className="mock-avatar" style={{ background: r.me ? "rgba(0,255,209,0.15)" : "rgba(255,255,255,0.05)", color: r.me ? "#00FFD1" : "rgba(255,255,255,0.4)" }}>
              {r.name[0]}
            </div>
            <span style={{ fontSize: "0.6rem", color: r.me ? "#00FFD1" : "#fff", flex: 1 }}>{r.name}</span>
            <span style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono" }}>{r.xp} XP</span>
          </div>
        ))}
        <div className="mock-nav">
          <span>🏠</span><span>💪</span><span>🤖</span><span>📊</span>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────
   PHONE MOCKUP SCREENS — SMARTLIVING
   ─────────────────────────────────────────────────────────────── */

function SmartLivingHome() {
  return (
    <div className="phone-frame">
      <div className="phone-notch" />
      <div className="phone-screen">
        <div className="mock-header">
          <span className="mock-header-title" style={{ color: "#4A6CF7" }}>SMARTLIVING</span>
          <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>🔔</span>
        </div>
        <div style={{ padding: "0 12px 6px" }}>
          <div style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono" }}>
            Residencial Los Pinos
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, padding: "0 12px", marginBottom: 8 }}>
          {[
            { icon: "🔐", label: "Accesos" },
            { icon: "💬", label: "Mensajes" },
            { icon: "🧾", label: "Finanzas" },
            { icon: "🏢", label: "Amenidades" },
          ].map((item, i) => (
            <div key={i} style={{
              padding: "14px 8px",
              borderRadius: 12,
              background: "rgba(74,108,247,0.06)",
              border: "1px solid rgba(74,108,247,0.12)",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "1.1rem", marginBottom: 4 }}>{item.icon}</div>
              <div style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.6)" }}>{item.label}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: "0 12px" }}>
          <div style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>Anuncios</div>
        </div>
        <div className="mock-card" style={{ borderColor: "rgba(74,108,247,0.15)" }}>
          <div style={{ fontSize: "0.6rem", color: "#4A6CF7", fontWeight: 600, marginBottom: 2 }}>Mantenimiento ascensor</div>
          <div style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.3)" }}>Mañana 8:00 AM - 12:00 PM</div>
        </div>
        <div className="mock-card">
          <div style={{ fontSize: "0.6rem", color: "#fff", fontWeight: 600, marginBottom: 2 }}>Junta de residentes</div>
          <div style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.3)" }}>Sábado 5:00 PM · Salón comunal</div>
        </div>
        <div className="mock-nav">
          <span>🏠</span><span>🔐</span><span>💬</span><span>🧾</span>
        </div>
      </div>
    </div>
  );
}

function SmartLivingAcceso() {
  return (
    <div className="phone-frame">
      <div className="phone-notch" />
      <div className="phone-screen">
        <div className="mock-header">
          <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}>←</span>
          <span className="mock-header-title">Acceso Digital</span>
          <span style={{ fontSize: "0.6rem", color: "#4A6CF7" }}>+</span>
        </div>
        {/* QR Code visual */}
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0" }}>
          <div style={{
            width: 120,
            height: 120,
            background: "#fff",
            borderRadius: 16,
            padding: 8,
            display: "grid",
            gridTemplateColumns: "repeat(8,1fr)",
            gridTemplateRows: "repeat(8,1fr)",
            gap: 1,
          }}>
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} style={{
                background: [0,1,2,6,7,8,9,15,16,23,24,25,31,32,39,40,41,42,47,48,49,55,56,57,58,62,63].includes(i) ? "#0a0a1a" : "transparent",
                borderRadius: 1,
              }} />
            ))}
          </div>
        </div>
        <div style={{ textAlign: "center", padding: "0 12px", marginBottom: 8 }}>
          <div style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono" }}>
            QR dinámico · Expira en 5:00
          </div>
        </div>
        <div style={{ margin: "0 12px", padding: "10px 14px", borderRadius: 12, background: "rgba(74,108,247,0.1)", border: "1px solid rgba(74,108,247,0.2)", textAlign: "center" }}>
          <span style={{ fontSize: "0.6rem", color: "#4A6CF7" }}>Compartir acceso temporal</span>
        </div>
        <div style={{ padding: "10px 12px 0" }}>
          <div style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>Visitantes recientes</div>
        </div>
        {[
          { name: "María López", time: "Hoy 14:30" },
          { name: "Delivery", time: "Hoy 11:20" },
        ].map((v, i) => (
          <div key={i} className="mock-list-item" style={{ padding: "6px 12px" }}>
            <div className="mock-avatar" style={{ background: "rgba(74,108,247,0.1)", color: "#4A6CF7" }}>{v.name[0]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.6rem", color: "#fff" }}>{v.name}</div>
              <div style={{ fontSize: "0.45rem", color: "rgba(255,255,255,0.3)" }}>{v.time}</div>
            </div>
          </div>
        ))}
        <div className="mock-nav">
          <span>🏠</span><span>🔐</span><span>💬</span><span>🧾</span>
        </div>
      </div>
    </div>
  );
}

function SmartLivingComunicacion() {
  return (
    <div className="phone-frame">
      <div className="phone-notch" />
      <div className="phone-screen">
        <div className="mock-header">
          <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}>←</span>
          <span className="mock-header-title">Comunicación</span>
          <span style={{ fontSize: "0.6rem", color: "#4A6CF7" }}>✏️</span>
        </div>
        {[
          { name: "Administración", msg: "La cuota de abril ya está disponible", time: "2:30 PM", unread: true },
          { name: "Vigilancia", msg: "Su paquete está en recepción", time: "11:00 AM", unread: true },
          { name: "Vecino 4B", msg: "¿Alguien vio una mascota en el piso 3?", time: "Ayer", unread: false },
          { name: "Mantenimiento", msg: "Reparación del hidroneumático completada", time: "Lun", unread: false },
        ].map((thread, i) => (
          <div key={i} className="mock-list-item" style={{ padding: "10px 12px" }}>
            <div className="mock-avatar" style={{
              background: thread.unread ? "rgba(74,108,247,0.15)" : "rgba(255,255,255,0.05)",
              color: thread.unread ? "#4A6CF7" : "rgba(255,255,255,0.4)",
            }}>
              {thread.name[0]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.6rem", color: "#fff", fontWeight: thread.unread ? 600 : 400 }}>{thread.name}</span>
                <span style={{ fontSize: "0.45rem", color: "rgba(255,255,255,0.25)" }}>{thread.time}</span>
              </div>
              <div style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.35)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{thread.msg}</div>
            </div>
            {thread.unread && (
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4A6CF7", flexShrink: 0 }} />
            )}
          </div>
        ))}
        <div className="mock-nav">
          <span>🏠</span><span>🔐</span><span>💬</span><span>🧾</span>
        </div>
      </div>
    </div>
  );
}

function SmartLivingFinanzas() {
  return (
    <div className="phone-frame">
      <div className="phone-notch" />
      <div className="phone-screen">
        <div className="mock-header">
          <span className="mock-header-title">Finanzas</span>
          <span style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono" }}>Abril 2026</span>
        </div>
        <div className="mock-card" style={{ borderColor: "rgba(74,108,247,0.15)", textAlign: "center" as const }}>
          <div style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Balance del condominio</div>
          <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#4A6CF7", fontFamily: "Space Grotesk" }}>$45,320</div>
          <div style={{ fontSize: "0.45rem", color: "rgba(0,255,100,0.6)", marginTop: 2 }}>↑ 8% vs mes anterior</div>
        </div>
        <div className="mock-stat-row">
          <div className="mock-stat-box">
            <div className="mock-stat-value" style={{ color: "#4A6CF7", fontSize: "0.7rem" }}>$12.5k</div>
            <div className="mock-stat-label">ingresos</div>
          </div>
          <div className="mock-stat-box">
            <div className="mock-stat-value" style={{ color: "#FF6B35", fontSize: "0.7rem" }}>$8.2k</div>
            <div className="mock-stat-label">gastos</div>
          </div>
        </div>
        <div style={{ padding: "4px 12px" }}>
          <div style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>Gastos por categoría</div>
        </div>
        {[
          { name: "Mantenimiento", pct: 40, color: "#4A6CF7" },
          { name: "Seguridad", pct: 25, color: "#00FFD1" },
          { name: "Servicios", pct: 20, color: "#FF6B35" },
          { name: "Otros", pct: 15, color: "#888" },
        ].map((cat, i) => (
          <div key={i} style={{ padding: "4px 12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
              <span style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.5)" }}>{cat.name}</span>
              <span style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono" }}>{cat.pct}%</span>
            </div>
            <div className="mock-bar" style={{ height: 4, marginBottom: 4 }}>
              <div className="mock-bar-fill" style={{ width: `${cat.pct}%`, background: cat.color, height: "100%" }} />
            </div>
          </div>
        ))}
        <div className="mock-nav">
          <span>🏠</span><span>🔐</span><span>💬</span><span>🧾</span>
        </div>
      </div>
    </div>
  );
}

function SmartLivingAreas() {
  return (
    <div className="phone-frame">
      <div className="phone-notch" />
      <div className="phone-screen">
        <div className="mock-header">
          <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}>←</span>
          <span className="mock-header-title">Áreas Comunes</span>
          <span style={{ fontSize: "0.6rem", color: "#4A6CF7" }}>📅</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, padding: "0 12px", marginBottom: 8 }}>
          {[
            { icon: "🏊", name: "Piscina", avail: true },
            { icon: "🏋️", name: "Gimnasio", avail: true },
            { icon: "🎾", name: "Cancha", avail: false },
            { icon: "🎉", name: "Salón", avail: true },
          ].map((area, i) => (
            <div key={i} style={{
              padding: "12px 8px",
              borderRadius: 12,
              background: area.avail ? "rgba(74,108,247,0.06)" : "rgba(255,255,255,0.02)",
              border: `1px solid ${area.avail ? "rgba(74,108,247,0.15)" : "rgba(255,255,255,0.05)"}`,
              textAlign: "center" as const,
              opacity: area.avail ? 1 : 0.5,
            }}>
              <div style={{ fontSize: "1.1rem", marginBottom: 3 }}>{area.icon}</div>
              <div style={{ fontSize: "0.55rem", color: "#fff" }}>{area.name}</div>
              <div style={{ fontSize: "0.4rem", color: area.avail ? "#00FFD1" : "#FF6B35", fontFamily: "JetBrains Mono", marginTop: 2 }}>
                {area.avail ? "Disponible" : "Ocupado"}
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: "0 12px" }}>
          <div style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>Reservas hoy</div>
        </div>
        {[
          { area: "🏊 Piscina", time: "10:00 - 12:00", user: "Apto 3A" },
          { area: "🎉 Salón", time: "15:00 - 18:00", user: "Apto 7B" },
        ].map((res, i) => (
          <div key={i} className="mock-list-item" style={{ padding: "8px 12px" }}>
            <span style={{ fontSize: "0.75rem" }}>{res.area.split(" ")[0]}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.6rem", color: "#fff" }}>{res.area.split(" ").slice(1).join(" ")}</div>
              <div style={{ fontSize: "0.45rem", color: "rgba(255,255,255,0.3)" }}>{res.time} · {res.user}</div>
            </div>
          </div>
        ))}
        <div className="mock-nav">
          <span>🏠</span><span>🔐</span><span>💬</span><span>🧾</span>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────
   PANEL DATA
   ─────────────────────────────────────────────────────────────── */

const gpulsePanels: ShowcasePanel[] = [
  {
    title: "G-Pulse",
    subtitle: "Tu entrenamiento, gamificado",
    description:
      "Plataforma de fitness que convierte cada sesión en una misión. Rutinas inteligentes, IA integrada y un sistema de progresión que te mantiene motivado.",
    features: ["Rutinas IA", "Gamificación", "Social", "Analytics"],
    visual: <GPulseHome />,
  },
  {
    title: "Crear Rutinas",
    subtitle: "Entrena con inteligencia",
    description:
      "Diseña rutinas personalizadas con nuestro constructor inteligente. Algoritmos adaptativos ajustan series, repeticiones y descansos según tu nivel y objetivos.",
    features: ["Personalización", "Auto-ajuste", "Templates"],
    visual: <GPulseRutinas />,
  },
  {
    title: "Asistente IA",
    subtitle: "Tu entrenador personal 24/7",
    description:
      "Pregunta cualquier cosa sobre nutrición, técnica o planificación. Nuestro asistente IA aprende de tu historial para darte recomendaciones cada vez más precisas.",
    features: ["Chat natural", "Nutrición", "Técnica", "Planificación"],
    visual: <GPulseIA />,
  },
  {
    title: "Ver Progreso",
    subtitle: "Datos que te impulsan",
    description:
      "Dashboard completo con métricas de peso, fuerza y consistencia. Visualiza tu evolución con gráficos detallados y celebra cada récord personal.",
    features: ["Métricas", "Gráficos", "Récords", "Histórico"],
    visual: <GPulseProgreso />,
  },
  {
    title: "Gamificación",
    subtitle: "Compite, sube de nivel, domina",
    description:
      "Sistema de XP, logros desbloqueables y rankings entre amigos. Cada repetición suma puntos. ¿Llegarás al top del leaderboard?",
    features: ["XP System", "Logros", "Rankings", "Desafíos"],
    visual: <GPulseGamificacion />,
  },
];

const smartlivingPanels: ShowcasePanel[] = [
  {
    title: "SmartLiving",
    subtitle: "Tu condominio, conectado",
    description:
      "Gestión inteligente para condominios modernos. Accesos digitales, comunicación directa, transparencia financiera y reserva de amenidades en una sola app.",
    features: ["Accesos QR", "Comunicación", "Finanzas", "Amenidades"],
    visual: <SmartLivingHome />,
  },
  {
    title: "Acceso Digital",
    subtitle: "Seguridad sin complicaciones",
    description:
      "Control de accesos con QR dinámicos que cambian cada minuto. Comparte accesos temporales para visitantes y consulta el historial de entradas en tiempo real.",
    features: ["QR dinámico", "Acceso temporal", "Historial", "Registro auto."],
    visual: <SmartLivingAcceso />,
  },
  {
    title: "Comunicación",
    subtitle: "Conecta sin ruido",
    description:
      "Canal directo entre residentes, administración y vigilancia. Anuncios importantes, reportes de incidencias y comunicación vecinal organizada por temas.",
    features: ["Chat directo", "Anuncios", "Incidencias", "Notificaciones"],
    visual: <SmartLivingComunicacion />,
  },
  {
    title: "Transparencia",
    subtitle: "Cada peso, rastreable",
    description:
      "Reportes financieros en tiempo real con desglose por categorías. Cada gasto documentado y accesible para todos los residentes. Confianza total.",
    features: ["Balance real", "Categorías", "Documentos", "Alertas"],
    visual: <SmartLivingFinanzas />,
  },
  {
    title: "Áreas Comunes",
    subtitle: "Reserva en segundos",
    description:
      "Calendario compartido para piscina, gimnasio, salón y más. Reserva en un toque, recibe confirmaciones y evita conflictos de horarios.",
    features: ["Calendario", "Reserva online", "Disponibilidad", "Reglas"],
    visual: <SmartLivingAreas />,
  },
];

const biterouteFeatures = [
  {
    icon: "🗺️",
    title: "Rutas óptimas",
    text: "Algoritmos de optimización que reducen tiempos de entrega hasta un 40%.",
  },
  {
    icon: "⚡",
    title: "Tiempo real",
    text: "Tracking en vivo de pedidos y flota con actualizaciones instantáneas.",
  },
  {
    icon: "📦",
    title: "Multi-cocina",
    text: "Gestión centralizada de pedidos para múltiples dark kitchens.",
  },
  {
    icon: "📈",
    title: "Predicción",
    text: "IA predictiva para anticipar demanda y preparar recursos.",
  },
];

/* ───────────────────────────────────────────────────────────────
   PAGE
   ─────────────────────────────────────────────────────────────── */

export default function Home() {
  return (
    <main>
      <CommandPalette />
      <HeroSection />

      <ProductShowcase
        id="gpulse"
        worldClass="world-ares"
        accentColor="#00FFD1"
        glowClass="text-glow-cyan"
        appName="G-Pulse"
        panels={gpulsePanels}
      />

      <ProductSection
        id="biteroute"
        worldClass="world-biteroute"
        accentColor="#FF6B35"
        glowClass="text-glow-orange"
        statusText="Beta"
        statusColor="#FF6B35"
        title="BiteRoute"
        description="Optimización logística y rutas en tiempo real para Dark Kitchens. Más entregas, menos kilómetros."
        features={biterouteFeatures}
        alignRight
      />

      <ProductShowcase
        id="smartliving"
        worldClass="world-smartliving"
        accentColor="#4A6CF7"
        glowClass="text-glow-navy"
        appName="SmartLiving"
        panels={smartlivingPanels}
      />

      <TeamSection />
    </main>
  );
}
