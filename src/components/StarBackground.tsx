import { useEffect, useState, useCallback } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

const StarBackground = () => {
  const [stars, setStars] = useState<Star[]>([]);

  const generateStars = useCallback(() => {
    const newStars: Star[] = [];
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 50 : 400;

    for (let i = 0; i < count; i++) {
      newStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 4 + 2,
        delay: Math.random() * 4,
        opacity: Math.random() * 0.7 + 0.3,
      });
    }
    setStars(newStars);
  }, []);

  useEffect(() => {
    generateStars();
    window.addEventListener('resize', generateStars);
    return () => window.removeEventListener('resize', generateStars);
  }, [generateStars]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-black" />

      {stars.map((star) => (
        <div
          key={star.id}
          className="star absolute rounded-full bg-star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            ['--duration' as string]: `${star.duration}s`,
            ['--delay' as string]: `${star.delay}s`,
            opacity: star.opacity,
            transform: 'translate3d(0,0,0)', // GPU acceleration
          } as React.CSSProperties}
        />
      ))}

      <ShootingStars max={8} />
    </div>
  );
};

type ActiveStar = {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  duration: number;
  angle: number;
  size: number;
  expiresAt: number;
};

function ShootingStars({ max = 4 }: { max?: number }) {
  const [stars, setStars] = useState<ActiveStar[]>([]);
  const now = () => Date.now();

  useEffect(() => {
    // Disable shooting stars on mobile for performance
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    const tickMs = 100; // fast tick for probability spawning
    const baseProb = 0.15; // increased spawn chance per tick
    const burstChance = 0.08; // increased chance to temporarily boost spawn rate

    const interval = setInterval(() => {
      setStars((prev) => {
        const t = now();
        const alive = prev.filter((s) => s.expiresAt > t);
        if (alive.length >= max) return alive;

        // probabilistic spawn
        const inBurst = Math.random() < burstChance;
        const spawnProb = inBurst ? baseProb * 2.2 : baseProb;
        if (Math.random() >= spawnProb) return alive;

        // Reference-inspired NW→SE spawn from top or left
        const w = window.innerWidth || 1200;
        const h = window.innerHeight || 800;
        const fromTop = Math.random() < 0.6;
        const startX = fromTop ? Math.random() * w : -80;
        const startY = fromTop ? -80 : Math.random() * (h * 0.6);

        // speed in px per tick; angle ~45deg +/- 22.5deg
        const speed = 7 + Math.random() * 6; // 7-13
        const angleRad = Math.PI / 4 + Math.random() * (Math.PI / 8);
        const vx = Math.cos(angleRad) * speed;
        const vy = Math.sin(angleRad) * speed;
        const life = 70 + Math.random() * 50; // frames (~8.4s max at 120ms tick) but we convert to ms duration

        const dx = vx * life; // px
        const dy = vy * life; // px
        const duration = life * tickMs; // ms
        const angle = 45; // visual rotation
        const size = Math.random() * 1.2 + 1.8; // 1.8 - 3.0px head

        const star: ActiveStar = {
          id: t + Math.floor(Math.random() * 1000),
          x: (startX / w) * 100, // convert px to % for positioning
          y: (startY / h) * 100,
          dx,
          dy,
          duration,
          angle,
          size,
          expiresAt: t + duration,
        };
        return [...alive, star];
      });
    }, tickMs);

    return () => clearInterval(interval);
  }, [max]);

  return (
    <>
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute shooting-star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            ['--dx' as string]: `${s.dx}px`,
            ['--dy' as string]: `${s.dy}px`,
            ['--shoot-duration' as string]: `${s.duration}ms`,
            ['--angle' as string]: `${s.angle}deg`,
          } as React.CSSProperties}
        />
      ))}
    </>
  );
}

export default StarBackground;
