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
      {/* Animated gradient orbs with parallax */}
      <div
        className={`absolute top-0 -left-4 w-[500px] h-[500px] bg-primary/5 dark:bg-primary/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl transition-all duration-1000 ${
          mounted ? 'opacity-70 animate-blob' : 'opacity-0'
        }`}
        style={{ 
          animationDelay: '0s',
          transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
        }}
      />
      <div
        className={`absolute top-0 -right-4 w-[500px] h-[500px] bg-accent/5 dark:bg-accent/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl transition-all duration-1000 ${
          mounted ? 'opacity-70 animate-blob' : 'opacity-0'
        }`}
        style={{ 
          animationDelay: '2s',
          transform: `translate(${mousePosition.x * -0.3}px, ${mousePosition.y * 0.3}px)`,
        }}
      />
      <div
        className={`absolute -bottom-8 left-20 w-[500px] h-[500px] bg-primary/5 dark:bg-primary/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl transition-all duration-1000 ${
          mounted ? 'opacity-70 animate-blob' : 'opacity-0'
        }`}
        style={{ 
          animationDelay: '4s',
          transform: `translate(${mousePosition.x * 0.4}px, ${mousePosition.y * -0.4}px)`,
        }}
      />
      <div
        className={`absolute bottom-20 right-20 w-[500px] h-[500px] bg-accent/5 dark:bg-accent/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl transition-all duration-1000 ${
          mounted ? 'opacity-70 animate-blob' : 'opacity-0'
        }`}
        style={{ 
          animationDelay: '6s',
          transform: `translate(${mousePosition.x * -0.5}px, ${mousePosition.y * -0.3}px)`,
        }}
      />
      
      {/* Enhanced floating particles with varied sizes */}
      <div className="absolute inset-0">
        {[...Array(40)].map((_, i) => {
          const size = Math.random() * 2 + 0.5;
          return (
            <div
              key={i}
              className="absolute bg-foreground/10 rounded-full animate-float-particle"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${15 + Math.random() * 15}s`,
              }}
            />
          );
        })}
      </div>

      {/* Animated lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10 dark:opacity-20">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.5" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line 
          x1="0" y1="20%" x2="100%" y2="20%" 
          stroke="url(#lineGradient)" 
          strokeWidth="1"
          className="animate-pulse-slow"
        />
        <line 
          x1="0" y1="50%" x2="100%" y2="50%" 
          stroke="url(#lineGradient)" 
          strokeWidth="1"
          className="animate-pulse-slow"
          style={{ animationDelay: '1s' }}
        />
        <line 
          x1="0" y1="80%" x2="100%" y2="80%" 
          stroke="url(#lineGradient)" 
          strokeWidth="1"
          className="animate-pulse-slow"
          style={{ animationDelay: '2s' }}
        />
      </svg>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.03]" />
      
      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/50" />
    </div>
  );
};

export default AnimatedBackground;
