"use client";

import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 240;
const framePath = (i: number) =>
  `/viaje/frame-${String(i + 1).padStart(3, "0")}.jpg`;

// ponytail: 3 captions keyed to scroll progress, upgrade to data-driven if more scenes appear
const CAPTIONS = [
  { at: 0.02, until: 0.28, kicker: "EXPLORER 1", title: "Despegue" },
  { at: 0.4, until: 0.7, kicker: "TRAVESÍA", title: "Rumbo a Athel" },
  { at: 0.82, until: 1, kicker: "ATHEL", title: "Destino alcanzado" },
];

export default function ViajePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const capRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [progress, setProgress] = useState(0); // 0..1 preload
  const [ready, setReady] = useState(false);

  // Preload every frame, track progress
  useEffect(() => {
    let loaded = 0;
    let cancelled = false;
    const imgs: HTMLImageElement[] = [];
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = framePath(i);
      img.onload = img.onerror = () => {
        loaded++;
        if (cancelled) return;
        setProgress(loaded / FRAME_COUNT);
        if (loaded === FRAME_COUNT) setReady(true);
      };
      imgs[i] = img;
    }
    imagesRef.current = imgs;
    return () => {
      cancelled = true;
    };
  }, []);

  // Canvas draw + scroll scrubbing (runs once frames are ready)
  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const drawCover = (img: HTMLImageElement) => {
      const cw = canvas.width;
      const ch = canvas.height;
      const scale = Math.max(cw / img.width, ch / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    };

    const render = (frac: number) => {
      const idx = Math.min(
        FRAME_COUNT - 1,
        Math.max(0, Math.round(frac * (FRAME_COUNT - 1)))
      );
      const img = imagesRef.current[idx];
      if (img?.complete) drawCover(img);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      render(0);
    };
    resize();
    window.addEventListener("resize", resize);

    let gsapCtx: { revert: () => void } | undefined;
    (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (!containerRef.current) return;

      gsapCtx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: (self) => {
            render(self.progress);
            // fade captions by their progress window
            capRefs.current.forEach((el, i) => {
              if (!el) return;
              const c = CAPTIONS[i];
              const p = self.progress;
              const mid = (c.at + c.until) / 2;
              const half = (c.until - c.at) / 2;
              const o = Math.max(0, 1 - Math.abs(p - mid) / half);
              el.style.opacity = String(o);
              el.style.transform = `translateY(${(1 - o) * 20}px)`;
            });
          },
        });
      });
      ScrollTrigger.refresh();
    })();

    return () => {
      window.removeEventListener("resize", resize);
      gsapCtx?.revert();
    };
  }, [ready]);

  return (
    <main style={{ background: "#050508", color: "#f0f0f5" }}>
      {/* Preloader */}
      {!ready && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            background: "#050508",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "0.8rem",
              letterSpacing: "0.3em",
              color: "#00FFD1",
            }}
          >
            PREPARANDO EL VIAJE
          </div>
          <div
            style={{
              width: 220,
              height: 2,
              background: "rgba(255,255,255,0.1)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${Math.round(progress * 100)}%`,
                height: "100%",
                background: "#00FFD1",
                transition: "width 0.15s linear",
              }}
            />
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "0.7rem",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            {Math.round(progress * 100)}%
          </div>
        </div>
      )}

      {/* Scroll track: tall so there is room to scrub */}
      <div ref={containerRef} style={{ height: "500vh", position: "relative" }}>
        {/* Pinned viewport */}
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
          }}
        >
          <canvas
            ref={canvasRef}
            style={{ display: "block", width: "100%", height: "100%" }}
          />

          {/* Captions */}
          {CAPTIONS.map((c, i) => (
            <div
              key={i}
              ref={(el) => {
                capRefs.current[i] = el;
              }}
              style={{
                position: "absolute",
                left: "8vw",
                bottom: "12vh",
                opacity: 0,
                pointerEvents: "none",
                textShadow: "0 2px 30px rgba(0,0,0,0.8)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "0.8rem",
                  letterSpacing: "0.3em",
                  color: "#00FFD1",
                  marginBottom: 8,
                }}
              >
                {c.kicker}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display, sans-serif)",
                  fontSize: "clamp(2rem, 6vw, 4.5rem)",
                  fontWeight: 600,
                  lineHeight: 1,
                }}
              >
                {c.title}
              </div>
            </div>
          ))}

          {/* Scroll hint */}
          <div
            style={{
              position: "absolute",
              bottom: "4vh",
              left: "50%",
              transform: "translateX(-50%)",
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            SCROLL ↓
          </div>
        </div>
      </div>
    </main>
  );
}
