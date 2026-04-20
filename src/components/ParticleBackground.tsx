"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  type: "orange" | "gold" | "white";
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    const el = canvas;
    let animationId: number;
    let particles: Particle[] = [];
    let w = 0;
    let h = 0;

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      el.width = w;
      el.height = h;
    }

    function createParticles() {
      const count = Math.floor((w * h) / 12000);
      particles = Array.from({ length: count }, () => {
        const r = Math.random();
        const type = r > 0.5 ? "orange" : r > 0.25 ? "gold" : "white";
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 2.5 + 0.8,
          duration: Math.random() * 30 + 20,
          delay: Math.random() * 15,
          type,
        };
      });
    }

    function draw(t: number) {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        const progress = ((t + p.delay) % p.duration) / p.duration;
        const py = h - progress * h * 1.4;
        const px = p.x + Math.sin(progress * Math.PI * 2) * 25;
        const alpha = Math.sin(progress * Math.PI) * 0.75;

        const colors: Record<string, string> = {
          orange: `rgba(242, 114, 32, ${alpha})`,
          gold: `rgba(255, 215, 0, ${alpha * 0.5})`,
          white: `rgba(229, 226, 225, ${alpha * 0.3})`,
        };

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = colors[p.type];
        ctx.fill();

        if (p.type === "orange") {
          ctx.beginPath();
          ctx.arc(px, py, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(242, 114, 32, ${alpha * 0.12})`;
          ctx.fill();
        }
      });
      animationId = requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    animationId = requestAnimationFrame(draw);

    const handleResize = () => { resize(); createParticles(); };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  );
}
