import { useState, useEffect } from 'react';

/**
 * Returns true when the user has asked for reduced motion.
 * The global reduced-motion block in index.css only reaches CSS animations,
 * so JS-driven counts have to check this themselves.
 */
const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export interface UseCountUpOptions {
  /** Final value to count to. Pass null while the value is still loading. */
  target: number | null;
  /** Ramp duration in milliseconds (default: 900) */
  duration?: number;
}

/**
 * Custom hook that ramps a number from 0 to `target` using requestAnimationFrame.
 * Jumps straight to the final value when reduced motion is preferred, or when
 * the target arrives after the ramp would already have finished.
 * @returns The current display value (0 while target is null)
 */
export const useCountUp = ({ target, duration = 900 }: UseCountUpOptions): number => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target === null) {
      setValue(0);
      return;
    }

    if (prefersReducedMotion() || duration <= 0) {
      setValue(target);
      return;
    }

    let frame = 0;
    // Seed the start time from the first frame's own timestamp. Mixing
    // performance.now() with rAF timestamps is unsafe — they are not
    // guaranteed to share a time origin.
    let start: number | null = null;

    const step = (now: number) => {
      if (start === null) start = now;

      const elapsed = now - start;
      const progress = Math.min(Math.max(elapsed / duration, 0), 1);
      // easeOutCubic — fast start, gentle settle
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    };

    frame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
};
