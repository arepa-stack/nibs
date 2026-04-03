"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const sections = [
  { id: "hero", name: "Inicio", icon: "🏠", description: "Página principal", accent: "#00FFD1" },
  { id: "gpulse", name: "G-Pulse", icon: "💪", description: "Fitness gamificado con IA", accent: "#00FFD1" },
  { id: "biteroute", name: "BiteRoute", icon: "🚀", description: "Logística para Dark Kitchens", accent: "#FF6B35" },
  { id: "smartliving", name: "SmartLiving", icon: "🏢", description: "Gestión de condominios", accent: "#4A6CF7" },
  { id: "team", name: "The Founders", icon: "👥", description: "El equipo detrás de Nibs", accent: "#00FFD1" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = sections.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.description.toLowerCase().includes(query.toLowerCase())
  );

  // Clamp selectedIdx to valid range
  const safeIdx = Math.min(selectedIdx, Math.max(filtered.length - 1, 0));

  const openPalette = useCallback(() => {
    setQuery("");
    setSelectedIdx(0);
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const closePalette = useCallback(() => {
    setOpen(false);
  }, []);

  // Keyboard shortcut: Ctrl+K / ⌘+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => {
          if (!prev) {
            setQuery("");
            setSelectedIdx(0);
            setTimeout(() => inputRef.current?.focus(), 50);
          }
          return !prev;
        });
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setSelectedIdx(0);
  };

  const navigate = useCallback(
    (id: string) => {
      setOpen(false);
      // Small delay so the overlay closes first
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    },
    []
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && filtered[safeIdx]) {
      navigate(filtered[safeIdx].id);
    }
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        className="cmd-trigger"
        onClick={openPalette}
        aria-label="Abrir buscador de secciones"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span className="kbd-hint">⌘K</span>
      </button>

      {/* Overlay */}
      {open && (
        <div className="cmd-overlay" onClick={closePalette}>
          <div className="cmd-card" onClick={(e) => e.stopPropagation()}>
            {/* Search input */}
            <div className="cmd-input-wrap">
              <span className="search-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                ref={inputRef}
                type="text"
                className="cmd-input"
                placeholder="Buscar sección..."
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* Results */}
            <div className="cmd-results">
              {filtered.map((section, i) => (
                <div
                  key={section.id}
                  className={`cmd-result ${i === safeIdx ? "active" : ""}`}
                  onClick={() => navigate(section.id)}
                  onMouseEnter={() => setSelectedIdx(i)}
                >
                  <div
                    className="cmd-result-icon"
                    style={{
                      background: `${section.accent}12`,
                      border: `1px solid ${section.accent}25`,
                    }}
                  >
                    {section.icon}
                  </div>
                  <div className="cmd-result-meta">
                    <div className="cmd-result-name">{section.name}</div>
                    <div className="cmd-result-desc">{section.description}</div>
                  </div>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              ))}

              {filtered.length === 0 && (
                <div style={{ padding: "24px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono, monospace", fontSize: "0.8rem" }}>
                  No se encontraron secciones
                </div>
              )}
            </div>

            {/* Footer hints */}
            <div className="cmd-footer">
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <kbd>↑↓</kbd>
                <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.25)" }}>navegar</span>
              </div>
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <kbd>↵</kbd>
                <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.25)" }}>ir</span>
              </div>
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <kbd>esc</kbd>
                <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.25)" }}>cerrar</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
