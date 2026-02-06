import { useEffect, useState } from 'react';

const AnimatedBackground = () => {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 20 - 10,
        y: (e.clientY / window.innerHeight) * 20 - 10,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Animated gradient orbs with parallax - reduced for performance */}
      <div
        className={`absolute top-0 -left-4 w-[400px] h-[400px] bg-primary/4 dark:bg-primary/8 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl transition-all duration-1000 ${
          mounted ? 'opacity-60 animate-blob' : 'opacity-0'
        }`}
        style={{ 
          animationDelay: '0s',
          transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`,
        }}
      />
      <div
        className={`absolute bottom-20 right-20 w-[400px] h-[400px] bg-accent/4 dark:bg-accent/8 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl transition-all duration-1000 ${
          mounted ? 'opacity-60 animate-blob' : 'opacity-0'
        }`}
        style={{ 
          animationDelay: '3s',
          transform: `translate(${mousePosition.x * -0.3}px, ${mousePosition.y * -0.3}px)`,
        }}
      />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.03]" />
      
      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/50" />
    </div>
  );
};

export default AnimatedBackground;
