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
    const count = window.innerWidth < 768 ? 200 : 400;

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
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-2/3 left-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }} />

      {stars.map((star) => (
        <div
          key={star.id}
          className="star absolute rounded-full bg-star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            '--duration': `${star.duration}s`,
            '--delay': `${star.delay}s`,
            opacity: star.opacity,
          } as React.CSSProperties}
        />
      ))}

      <ShootingStar delay={0} />
      <ShootingStar delay={7} />
      <ShootingStar delay={14} />
      <ShootingStar delay={21} />
      <ShootingStar delay={28} />
      <ShootingStar delay={35} />
    </div>
  );
};

const ShootingStar = ({ delay }: { delay: number }) => {
  const [position, setPosition] = useState({ x: 0, y: 0, visible: false });

  useEffect(() => {
    const animate = () => {
      setPosition({
        x: Math.random() * 80 + 10,
        y: Math.random() * 40,
        visible: true,
      });

      setTimeout(() => {
        setPosition((prev) => ({ ...prev, visible: false }));
      }, 1000);
    };

    const interval = setInterval(animate, 8000);
    const timeout = setTimeout(animate, delay * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [delay]);

  if (!position.visible) return null;

  return (
    <div
      className="absolute w-1 h-1 bg-star rounded-full"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        boxShadow: '0 0 6px 2px hsl(var(--star-color))',
        animation: 'shooting-star 1s linear forwards',
      }}
    >
      <style>{`
        @keyframes shooting-star {
          0% {
            transform: translateX(0) translateY(0) rotate(-45deg);
            opacity: 1;
          }
          100% {
            transform: translateX(200px) translateY(200px) rotate(-45deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default StarBackground;
