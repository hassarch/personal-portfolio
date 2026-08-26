/**
 * Starfield Component
 *
 * A lightweight, canvas-based space backdrop that lives behind the content
 * "sheet" and shows through the surrounding gutters — the void the portfolio
 * floats in. It renders:
 *
 * - Three parallax depth layers of twinkling stars (far/mid/near), each with
 *   its own size, brightness, drift and scroll-parallax rate
 * - Frequent shooting stars with a bright glowing head and a tapered tail
 * - A faint line-art ringed planet, matching the brutalist outline aesthetic
 *
 * Design notes:
 * - Colour is driven entirely by the `--star-color` CSS token, so it stays in
 *   sync with the active light/dark theme and never introduces a hue into the
 *   strictly greyscale palette. The token is re-read whenever the theme flips.
 * - No edge vignette: the field is mostly seen through the gutters beside the
 *   content sheet, so darkening the edges would hide the very thing on show.
 *   Depth comes from the parallax layers instead.
 * - DevicePixelRatio-aware for crisp dots on retina displays.
 * - Respects `prefers-reduced-motion`: paints a single static frame, no loop.
 * - Pauses the animation loop while the tab is hidden to save CPU/battery.
 * - `pointer-events: none` + `aria-hidden` so it never interferes with the UI.
 * - Returns early when there's no 2D context (e.g. jsdom under test).
 *
 * Tuning lives in the constants below — METEOR_* controls how busy the sky is.
 */

import { useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { wrapCoord } from '@/lib/starfield';

interface StarLayer {
  /** Share of the total star budget allocated to this layer */
  share: number;
  radius: [number, number];
  alpha: [number, number];
  /** Downward drift in px/sec */
  drift: [number, number];
  /** How strongly this layer shifts with page scroll (0 = pinned) */
  parallax: number;
  twinkle: [number, number];
  /** Draw the 4-point cross sparkle on this layer's brighter stars */
  sparkle: boolean;
}

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  phase: number;
  drift: number;
  layer: StarLayer;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  thickness: number;
  brightness: number;
  life: number;
  ttl: number;
}

/** Roughly one star per this many square pixels, capped for performance. */
const STAR_DENSITY = 1 / 4200;
const MAX_STARS = 260;

/** Sky business: shorter gaps and a higher cap mean more visible activity. */
const METEOR_FIRST_AT = 700;
const METEOR_GAP: [number, number] = [800, 2400];
const MAX_METEORS = 4;

const STAR_LAYERS: StarLayer[] = [
  // Far: dense, dim, barely moves — reads as depth.
  {
    share: 0.55,
    radius: [0.4, 0.9],
    alpha: [0.22, 0.5],
    drift: [2, 5],
    parallax: 0.05,
    twinkle: [0.4, 1.1],
    sparkle: false,
  },
  // Mid.
  {
    share: 0.3,
    radius: [0.8, 1.4],
    alpha: [0.45, 0.8],
    drift: [5, 10],
    parallax: 0.13,
    twinkle: [0.7, 1.8],
    sparkle: false,
  },
  // Near: sparse, bright, fastest parallax — the foreground specks.
  {
    share: 0.15,
    radius: [1.2, 2.1],
    alpha: [0.7, 1],
    drift: [10, 18],
    parallax: 0.26,
    twinkle: [1, 2.4],
    sparkle: true,
  },
];

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

    // Themed colour tokens. Both are stored as space-separated HSL channels
    // (e.g. "0 0% 96%"), which slot straight into `hsl(H S% L% / alpha)`.
    //
    // These must be re-read whenever the theme flips: this effect depends on
    // [theme], but React runs child effects before parent ones, so it fires
    // *before* ThemeProvider has added/removed the `.dark` class on <html>.
    // Reading once here would therefore latch the previous theme's colours.
    // Instead the loop watches the class string and refreshes on change.
    let starChannels = '0 0% 96%';
    let themeClass = '';

    const refreshTokens = () => {
      const root = document.documentElement;
      themeClass = root.className;
      starChannels =
        getComputedStyle(root).getPropertyValue('--star-color').trim() ||
        '0 0% 96%';
    };

    const color = (alpha: number) => `hsl(${starChannels} / ${alpha})`;

    refreshTokens();

    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    const meteors: Meteor[] = [];
    let rafId = 0;
    let lastTime = 0;
    let nextMeteorAt = METEOR_FIRST_AT;
    let scrollY = window.scrollY;

    const rand = (min: number, max: number) => min + Math.random() * (max - min);
    const randOf = ([min, max]: [number, number]) => rand(min, max);

    const createStar = (layer: StarLayer): Star => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: randOf(layer.radius),
      baseAlpha: randOf(layer.alpha),
      twinkleSpeed: randOf(layer.twinkle),
      phase: Math.random() * Math.PI * 2,
      drift: randOf(layer.drift),
      layer,
    });

    const initStars = () => {
      const total = Math.min(
        MAX_STARS,
        Math.floor(width * height * STAR_DENSITY)
      );
      stars = STAR_LAYERS.flatMap((layer) =>
        Array.from({ length: Math.round(total * layer.share) }, () =>
          createStar(layer)
        )
      );
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
      // Drifts slowly upward as the page scrolls, like the most distant object.
      const cy = height * 0.22 - scrollY * 0.03;

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
      const angle = rand(Math.PI * 0.1, Math.PI * 0.34); // shallow downward
      // Occasional slower, fatter, brighter "fireball".
      const isFireball = Math.random() < 0.18;
      const speed = isFireball ? rand(260, 380) : rand(420, 720);
      const goRight = Math.random() > 0.4;

      meteors.push({
        // Start off the leading edge so it streaks in rather than popping into view.
        x: goRight ? rand(-0.15, 0.55) * width : rand(0.45, 1.15) * width,
        y: rand(-0.05, 0.6) * height,
        vx: Math.cos(angle) * speed * (goRight ? 1 : -1),
        vy: Math.sin(angle) * speed,
        length: isFireball ? rand(150, 240) : rand(90, 180),
        thickness: isFireball ? rand(1.8, 2.6) : rand(1, 1.6),
        brightness: isFireball ? 1 : rand(0.7, 0.95),
        life: 0,
        ttl: isFireball ? rand(1.1, 1.6) : rand(0.6, 1.1),
      });
    };

    const drawMeteor = (m: Meteor) => {
      const speed = Math.hypot(m.vx, m.vy) || 1;
      const tailX = m.x - (m.vx / speed) * m.length;
      const tailY = m.y - (m.vy / speed) * m.length;
      // Fade in quickly, then out over the meteor's lifetime.
      const fade = Math.sin((m.life / m.ttl) * Math.PI) * m.brightness;

      // Tapered tail: bright at the head, transparent at the tip.
      const tail = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
      tail.addColorStop(0, color(0.95 * fade));
      tail.addColorStop(0.35, color(0.45 * fade));
      tail.addColorStop(1, color(0));

      ctx.save();
      ctx.lineCap = 'round';
      ctx.strokeStyle = tail;
      ctx.lineWidth = m.thickness;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();

      // Glowing head.
      const headRadius = m.thickness * 5;
      const head = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, headRadius);
      head.addColorStop(0, color(0.9 * fade));
      head.addColorStop(0.4, color(0.28 * fade));
      head.addColorStop(1, color(0));
      ctx.fillStyle = head;
      ctx.beginPath();
      ctx.arc(m.x, m.y, headRadius, 0, Math.PI * 2);
      ctx.fill();

      // Hot core.
      ctx.fillStyle = color(Math.min(1, 1.1 * fade));
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.thickness * 0.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawStar = (star: Star, drawX: number, drawY: number, twinkle: number) => {
      const alpha = star.baseAlpha * (0.65 + 0.35 * twinkle);
      ctx.fillStyle = color(alpha);
      ctx.beginPath();
      ctx.arc(drawX, drawY, star.radius, 0, Math.PI * 2);
      ctx.fill();

      // A subtle 4-point sparkle on the brightest foreground stars.
      if (star.layer.sparkle && star.radius > 1.55) {
        const s = star.radius * 2.8;
        ctx.strokeStyle = color(alpha * 0.45);
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(drawX - s, drawY);
        ctx.lineTo(drawX + s, drawY);
        ctx.moveTo(drawX, drawY - s);
        ctx.lineTo(drawX, drawY + s);
        ctx.stroke();
      }
    };

    /** Local alias for the exported, unit-tested wrap helper. */
    const wrap = wrapCoord;

    const renderStatic = () => {
      refreshTokens();
      ctx.clearRect(0, 0, width, height);
      drawPlanet();
      stars.forEach((star) =>
        drawStar(star, star.x, wrap(star.y - scrollY * star.layer.parallax, height), 1)
      );
    };

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      const seconds = time / 1000;

      // Cheap guard against the theme flipping under us (see refreshTokens).
      if (document.documentElement.className !== themeClass) refreshTokens();

      ctx.clearRect(0, 0, width, height);
      drawPlanet();

      stars.forEach((star) => {
        // Gentle downward drift, kept inside the field.
        star.y = wrap(star.y + star.drift * dt, height);
        // Scroll parallax is applied at paint time only, so scrolling back up
        // returns the field to exactly where it was.
        const drawY = wrap(star.y - scrollY * star.layer.parallax, height);
        const twinkle = Math.sin(seconds * star.twinkleSpeed + star.phase);
        drawStar(star, star.x, drawY, (twinkle + 1) / 2);
      });

      if (time > nextMeteorAt && meteors.length < MAX_METEORS) {
        spawnMeteor();
        nextMeteorAt = time + randOf(METEOR_GAP);
      }

      for (let i = meteors.length - 1; i >= 0; i -= 1) {
        const m = meteors[i];
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        m.life += dt;
        if (m.life >= m.ttl || m.y > height + 60) {
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

    const handleScroll = () => {
      scrollY = window.scrollY;
      // Reduced motion draws no frames, so repaint to keep parallax in sync.
      if (prefersReducedMotion) renderStatic();
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);

    if (prefersReducedMotion) {
      renderStatic();
    } else {
      start();
    }

    return () => {
      stop();
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', handleScroll);
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
