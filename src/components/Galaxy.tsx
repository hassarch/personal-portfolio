import { useEffect, useRef } from 'react';

interface GalaxyProps {
  mouseRepulsion?: boolean;
  mouseInteraction?: boolean;
  density?: number;
  glowIntensity?: number;
  saturation?: number;
  hueShift?: number;
  twinkleIntensity?: number;
  rotationSpeed?: number;
  repulsionStrength?: number;
  autoCenterRepulsion?: number;
  starSpeed?: number;
  speed?: number;
}

const Galaxy = ({
  density = 1,
  glowIntensity = 0.3,
  saturation = 0,
  hueShift = 140,
  twinkleIntensity = 0.3,
  starSpeed = 0.5,
  speed = 1,
}: GalaxyProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let stars: any[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      const numStars = Math.floor(200 * density); // Reduced from 500
      stars = [];
      
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: (Math.random() - 0.5) * 2000,
          y: (Math.random() - 0.5) * 2000,
          z: Math.random() * 2000,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.5,
          twinkle: Math.random() * Math.PI * 2,
          twinkleSpeed: (Math.random() - 0.5) * 0.03,
        });
      }
    };

    const animate = () => {
      // Clear with full transparency
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      stars.forEach((star) => {
        // Update twinkle
        star.twinkle += star.twinkleSpeed * twinkleIntensity;
        const twinkleFactor = (Math.sin(star.twinkle) + 1) / 2;

        // Move star toward viewer
        star.z -= starSpeed * speed;
        
        // Reset star when it gets too close
        if (star.z <= 1) {
          star.z = 2000;
          star.x = (Math.random() - 0.5) * 2000;
          star.y = (Math.random() - 0.5) * 2000;
        }

        // 3D to 2D projection
        const scale = 1000 / (star.z + 1000);
        const x = star.x * scale + centerX;
        const y = star.y * scale + centerY;

        // Only draw if on screen
        if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
          const size = star.size * scale * 3;
          const depth = 1 - star.z / 2000;
          const opacity = star.opacity * twinkleFactor * depth;

          // Skip very small or transparent stars
          if (size < 0.3 || opacity < 0.1) return;

          // Color
          const hue = (hueShift + depth * 60) % 360;
          const sat = saturation * 100;
          const light = 80 + depth * 20;

          // Draw star
          ctx.fillStyle = `hsla(${hue}, ${sat}%, ${light}%, ${opacity})`;
          ctx.beginPath();
          ctx.arc(x, y, Math.max(size, 0.5), 0, Math.PI * 2);
          ctx.fill();

          // Add glow only for larger, closer stars
          if (glowIntensity > 0 && size > 2 && depth > 0.5) {
            ctx.shadowBlur = 15 * glowIntensity * depth;
            ctx.shadowColor = `hsla(${hue}, ${sat}%, ${light}%, ${opacity * 0.6})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [density, glowIntensity, saturation, hueShift, twinkleIntensity, starSpeed, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ 
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
};

export default Galaxy;
