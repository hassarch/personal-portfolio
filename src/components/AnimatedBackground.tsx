import { useEffect, useState } from 'react';

const AnimatedBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate random particles
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 1.5,
    duration: Math.random() * 30 + 25,
    delay: Math.random() * 10,
    x: Math.random() * 100,
    y: Math.random() * 100,
    opacity: Math.random() * 0.6 + 0.2,
  }));

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-background">
      {/* Soft gradient orbs with blur - depth layer */}
      <div 
        className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(120, 100, 80, 0.15) 0%, transparent 70%)',
          animation: 'float 40s ease-in-out infinite',
          opacity: 0.08,
        }} 
      />
      
      <div 
        className="absolute -bottom-1/4 right-1/3 w-80 h-80 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(100, 85, 70, 0.12) 0%, transparent 70%)',
          animation: 'float 45s ease-in-out infinite reverse',
          animationDelay: '3s',
          opacity: 0.08,
        }} 
      />

      {/* Floating particles */}
      {mounted && particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: `rgba(120, 100, 80, ${particle.opacity * 0.5})`,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.size * 4}px rgba(120, 100, 80, ${particle.opacity * 0.3})`,
            animation: `floatParticle ${particle.duration}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
            filter: 'blur(0.8px)',
            willChange: 'transform, opacity',
          }}
        />
      ))}

      {/* Subtle grid overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(120, 100, 80, 0.01) 25%, rgba(120, 100, 80, 0.01) 26%, transparent 27%, transparent 74%, rgba(120, 100, 80, 0.01) 75%, rgba(120, 100, 80, 0.01) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(120, 100, 80, 0.01) 25%, rgba(120, 100, 80, 0.01) 26%, transparent 27%, transparent 74%, rgba(120, 100, 80, 0.01) 75%, rgba(120, 100, 80, 0.01) 76%, transparent 77%, transparent)
          `,
          backgroundSize: '60px 60px',
          opacity: 0.1,
        }} 
      />

      {/* Soft vignette effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(120, 100, 80, 0.1) 100%)',
          opacity: 0.06,
        }} 
      />
    </div>
  );
};

export default AnimatedBackground;
