"use client";

import { useEffect, useRef } from "react";

interface Dash {
  x: number;
  y: number;
  speed: number;
  length: number;
  opacity: number;
  width: number;
  color: string;
}

const COLORS = [
  "167, 139, 250",  // violet-400
  "139, 92, 246",   // violet-500
  "196, 181, 253",  // violet-300
  "255, 255, 255",  // white
];

export default function RisingDashes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const dashes: Dash[] = Array.from({ length: 70 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      speed: 0.6 + Math.random() * 1.8,
      length: 10 + Math.random() * 28,
      opacity: 0.15 + Math.random() * 0.55,
      width: 0.8 + Math.random() * 1.4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const d of dashes) {
        const gradient = ctx.createLinearGradient(d.x, d.y, d.x, d.y - d.length);
        gradient.addColorStop(0, `rgba(${d.color}, 0)`);
        gradient.addColorStop(1, `rgba(${d.color}, ${d.opacity})`);

        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x, d.y - d.length);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = d.width;
        ctx.lineCap = "round";
        ctx.stroke();

        d.y -= d.speed;

        if (d.y + d.length < 0) {
          d.y = canvas.height + d.length;
          d.x = Math.random() * canvas.width;
          d.speed = 0.6 + Math.random() * 1.8;
          d.opacity = 0.15 + Math.random() * 0.55;
          d.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        }
      }

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0"
    />
  );
}