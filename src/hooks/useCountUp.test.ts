import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCountUp } from './useCountUp';

/** Replaces window.matchMedia so the hook sees a specific reduced-motion preference */
const mockReducedMotion = (matches: boolean) => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia;
};

describe('useCountUp', () => {
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    mockReducedMotion(false);
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    vi.restoreAllMocks();
  });

  it('returns 0 while the target is still loading', () => {
    const { result } = renderHook(() => useCountUp({ target: null }));

    expect(result.current).toBe(0);
  });

  it('jumps straight to the target when reduced motion is preferred', () => {
    mockReducedMotion(true);

    const { result } = renderHook(() => useCountUp({ target: 31 }));

    // No animation frames needed — the value is final on first render
    expect(result.current).toBe(31);
  });

  it('ramps up to the target when motion is allowed', async () => {
    const { result } = renderHook(() => useCountUp({ target: 26, duration: 50 }));

    await waitFor(() => {
      expect(result.current).toBe(26);
    });
  });

  it('jumps straight to the target when duration is zero', () => {
    const { result } = renderHook(() => useCountUp({ target: 25, duration: 0 }));

    expect(result.current).toBe(25);
  });

  it('never overshoots the target', async () => {
    const { result } = renderHook(() => useCountUp({ target: 9, duration: 50 }));

    await waitFor(() => {
      expect(result.current).toBe(9);
    });

    // Give any stray frames a chance to run past the end of the ramp
    await new Promise((resolve) => setTimeout(resolve, 60));
    expect(result.current).toBe(9);
  });

  it('resets to 0 when the target goes back to null', async () => {
    const { result, rerender } = renderHook(
      ({ target }: { target: number | null }) => useCountUp({ target, duration: 50 }),
      { initialProps: { target: 31 as number | null } }
    );

    await waitFor(() => {
      expect(result.current).toBe(31);
    });

    rerender({ target: null });

    expect(result.current).toBe(0);
  });
});
