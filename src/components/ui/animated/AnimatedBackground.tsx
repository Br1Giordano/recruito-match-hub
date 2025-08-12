import { useEffect, useRef } from "react";

interface AnimatedBackgroundProps {
  className?: string;
}

// Lightweight animated canvas background that respects prefers-reduced-motion
const AnimatedBackground = ({ className }: AnimatedBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type Particle = { x: number; y: number; vx: number; vy: number; r: number; a: number };
    let particles: Particle[] = [];

    const init = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      // Create particles proportional to area (capped)
      const density = reduceMotion ? 0 : Math.min(80, Math.floor((width * height) / 14000));
      particles = new Array(density).fill(0).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -0.15 - Math.random() * 0.25,
        r: 1 + Math.random() * 2.5,
        a: 0.2 + Math.random() * 0.35,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle gradient overlay using design tokens
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, `hsla(var(--primary), 0.10)`);
      grad.addColorStop(1, `hsla(var(--primary), 0.04)`);
      ctx.fillStyle = grad as unknown as string;
      ctx.fillRect(0, 0, width, height);

      // Particles
      for (const p of particles) {
        ctx.beginPath();
        ctx.fillStyle = `hsla(var(--primary), ${p.a})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        // Motion
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.y < -5) {
          p.y = height + 5;
          p.x = Math.random() * width;
        }
        if (p.x < -5) p.x = width + 5;
        if (p.x > width + 5) p.x = -5;
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      init();
    };

    init();

    if (!reduceMotion) {
      rafRef.current = requestAnimationFrame(draw);
    } else {
      // If reduced motion, just render a static gradient once
      ctx.clearRect(0, 0, width, height);
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, `hsla(var(--primary), 0.10)`);
      grad.addColorStop(1, `hsla(var(--primary), 0.04)`);
      ctx.fillStyle = grad as unknown as string;
      ctx.fillRect(0, 0, width, height);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className={`absolute inset-0 -z-10 pointer-events-none ${className ?? ''}`} aria-hidden>
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
};

export default AnimatedBackground;
