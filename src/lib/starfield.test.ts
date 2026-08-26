import { describe, it, expect } from 'vitest';
import { wrapCoord } from './starfield';

/**
 * wrapCoord underpins the starfield's scroll parallax: each depth layer is
 * painted at `star.y - scrollY * layer.parallax`, wrapped back into the field.
 * Getting negatives or a zero height wrong leaves visible gaps or NaNs.
 */
describe('wrapCoord', () => {
  it('leaves values already inside the range untouched', () => {
    expect(wrapCoord(0, 720)).toBe(0);
    expect(wrapCoord(300, 720)).toBe(300);
    expect(wrapCoord(719, 720)).toBe(719);
  });

  it('wraps values past the end back to the start', () => {
    expect(wrapCoord(720, 720)).toBe(0);
    expect(wrapCoord(725, 720)).toBe(5);
    expect(wrapCoord(1445, 720)).toBe(5);
  });

  it('wraps negative values to the far end rather than going out of range', () => {
    // A star scrolled "above" the field must reappear at the bottom.
    expect(wrapCoord(-1, 720)).toBe(719);
    expect(wrapCoord(-720, 720)).toBe(0);
    expect(wrapCoord(-725, 720)).toBe(715);
  });

  it('always returns a value within [0, size)', () => {
    const size = 720;
    for (const v of [-5000, -721, -0.5, 0, 0.5, 719.5, 720, 100000]) {
      const wrapped = wrapCoord(v, size);
      expect(wrapped).toBeGreaterThanOrEqual(0);
      expect(wrapped).toBeLessThan(size);
    }
  });

  it('is stable for a given absolute offset, so scrolling back restores the field', () => {
    // Parallax is applied at paint time from absolute scrollY, never accumulated.
    const starY = 412;
    const parallax = 0.26;
    const at0 = wrapCoord(starY - 0 * parallax, 720);
    const at600 = wrapCoord(starY - 600 * parallax, 720);
    const backTo0 = wrapCoord(starY - 0 * parallax, 720);

    expect(at600).not.toBe(at0);
    expect(backTo0).toBe(at0);
  });

  it('shifts each depth layer by a different amount', () => {
    const starY = 400;
    const scrollY = 600;
    const far = wrapCoord(starY - scrollY * 0.05, 720);
    const mid = wrapCoord(starY - scrollY * 0.13, 720);
    const near = wrapCoord(starY - scrollY * 0.26, 720);

    expect(new Set([far, mid, near]).size).toBe(3);
    // Nearer layers travel further against the scroll.
    expect(starY - far).toBeLessThan(starY - mid);
    expect(starY - mid).toBeLessThan(starY - near);
  });

  it('passes the value through unchanged when size is zero', () => {
    // Guards the pre-resize state, where width/height are still 0.
    expect(wrapCoord(42, 0)).toBe(42);
    expect(Number.isNaN(wrapCoord(42, 0))).toBe(false);
  });
});
