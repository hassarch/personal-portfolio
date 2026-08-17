/**
 * Starfield Component
 *
 * A lightweight, canvas-based space backdrop that lives behind the content
 * "sheet" and shows through the surrounding gutters — the void the portfolio
 * floats in. It renders three kinds of space elements:
 *
 * - Twinkling parallax stars (varied size + brightness, slow drift)
 * - Occasional shooting stars streaking across the viewport
 * - A faint line-art ringed planet, matching the brutalist outline aesthetic
 *
 * Design notes:
 * - Colour is driven entirely by the `--star-color` CSS token, so it stays in
 *   sync with the active light/dark theme (dark specks on light, bright on dark).
 * - DevicePixelRatio-aware for crisp dots on retina displays.
 * - Respects `prefers-reduced-motion`: paints a single static frame, no loop.
 * - Pauses the animation loop while the tab is hidden to save CPU/battery.
 * - `pointer-events: none` + `aria-hidden` so it never interferes with the UI.
 */

import { useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  phase: number;
  drift: number;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  life: number;
  ttl: number;
}

// Roughly one star per this many square pixels, capped for performance.
const STAR_DENSITY = 1 / 7000;
const MAX_STARS = 180;

const Starfield = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Read the themed star colour once per (re)mount. `--star-color` is stored
    // as space-separated HSL channels (e.g. "0 0% 96%"), which slots straight
    // into the modern `hsl(H S% L% / alpha)` syntax.
    const starChannels =
      getComputedStyle(document.documentElement)
        .getPropertyValue('--star-color')
        .trim() || '0 0% 96%';
    const color = (alpha: number) => `hsl(${starChannels} / ${alpha})`;

    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    const meteors: Meteor[] = [];
    let rafId = 0;
    let lastTime = 0;
    let nextMeteorAt = 2500;

    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    const createStar = (): Star => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: rand(0.5, 1.6),
      baseAlpha: rand(0.4, 1),
      twinkleSpeed: rand(0.6, 2.2),
      phase: Math.random() * Math.PI * 2,
      drift: rand(3, 9),
    });

    const initStars = () => {
      const count = Math.min(
        MAX_STARS,
        Math.floor(width * height * STAR_DENSITY)
      );
      stars = Array.from({ length: count }, createStar);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initStars();
      // Under reduced motion there's no loop, so repaint the static frame here.
      if (prefersReducedMotion) renderStatic();
    };

    /** Faint ringed planet, drawn as thin outlines to match the line-art UI. */
    const drawPlanet = () => {
      const r = Math.max(30, Math.min(Math.min(width, height) * 0.055, 66));
      const cx = width * 0.85;
      const cy = height * 0.22;

      ctx.save();
      ctx.translate(cx, cy);

      // Soft body fill so it reads as a sphere, not just a ring.
      const glow = ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, r);
      glow.addColorStop(0, color(0.1));
      glow.addColorStop(1, color(0));
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.lineWidth = 1.2;
      ctx.strokeStyle = color(0.32);
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();

      // Tilted ring.
      ctx.rotate(-0.35);
      ctx.strokeStyle = color(0.22);
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 1.9, r * 0.52, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    };

    const spawnMeteor = () => {
      const angle = rand(Math.PI * 0.12, Math.PI * 0.32); // shallow downward
      const speed = rand(380, 620);
      const goRight = Math.random() > 0.4;
      meteors.push({
        x: goRight ? rand(-0.1, 0.5) * width : rand(0.5, 1.1) * width,
        y: rand(0, height * 0.4),
        vx: Math.cos(angle) * speed * (goRight ? 1 : -1),
        vy: Math.sin(angle) * speed,
        length: rand(90, 170),
        life: 0,
        ttl: rand(0.7, 1.2),
      });
    };

    const drawMeteor = (m: Meteor) => {
      const tailX = m.x - (m.vx / Math.hypot(m.vx, m.vy)) * m.length;
      const tailY = m.y - (m.vy / Math.hypot(m.vx, m.vy)) * m.length;
      // Fade in quickly, then out over the meteor's lifetime.
      const fade = Math.sin((m.life / m.ttl) * Math.PI);
      const gradient = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
      gradient.addColorStop(0, color(0.9 * fade));
      gradient.addColorStop(1, color(0));

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();
    };

    const drawStar = (star: Star, twinkle: number) => {
      const alpha = star.baseAlpha * (0.65 + 0.35 * twinkle);
      ctx.fillStyle = color(alpha);
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();

      // A subtle 4-point sparkle on the brightest stars.
      if (star.radius > 1.15) {
        const s = star.radius * 2.6;
        ctx.strokeStyle = color(alpha * 0.5);
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(star.x - s, star.y);
        ctx.lineTo(star.x + s, star.y);
        ctx.moveTo(star.x, star.y - s);
        ctx.lineTo(star.x, star.y + s);
        ctx.stroke();
      }
    };

    const renderStatic = () => {
      ctx.clearRect(0, 0, width, height);
      drawPlanet();
      stars.forEach((star) => drawStar(star, 1));
    };

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      const seconds = time / 1000;

      ctx.clearRect(0, 0, width, height);
      drawPlanet();

      stars.forEach((star) => {
        // Gentle downward drift with wrap-around.
        star.y += star.drift * dt;
        if (star.y > height + 2) {
          star.y = -2;
          star.x = Math.random() * width;
        }
        const twinkle = Math.sin(seconds * star.twinkleSpeed + star.phase);
        drawStar(star, (twinkle + 1) / 2);
      });

      if (time > nextMeteorAt && meteors.length < 2) {
        spawnMeteor();
        nextMeteorAt = time + rand(4000, 9000);
      }

      for (let i = meteors.length - 1; i >= 0; i -= 1) {
        const m = meteors[i];
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        m.life += dt;
        if (m.life >= m.ttl || m.y > height + 40) {
          meteors.splice(i, 1);
        } else {
          drawMeteor(m);
        }
      }

      rafId = window.requestAnimationFrame(render);
    };

    const start = () => {
      if (rafId || prefersReducedMotion) return;
      lastTime = performance.now();
      rafId = window.requestAnimationFrame(render);
    };

    const stop = () => {
      if (!rafId) return;
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    };

    const handleVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    };

    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', handleVisibility);

    if (prefersReducedMotion) {
      renderStatic();
    } else {
      start();
    }

    return () => {
      stop();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
};

export default Starfield;
