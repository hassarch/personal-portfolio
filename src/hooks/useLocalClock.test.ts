import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalClock } from './useLocalClock';

describe('useLocalClock', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // 12:00:00 UTC — Asia/Kolkata is UTC+5:30, so 17:30:00 there
    vi.setSystemTime(new Date('2026-08-26T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('formats the current time as HH:MM:SS on first render', () => {
    const { result } = renderHook(() => useLocalClock('Asia/Kolkata'));

    expect(result.current).toBe('17:30:00');
  });

  it('applies the requested timezone rather than the host timezone', () => {
    const { result } = renderHook(() => useLocalClock('UTC'));

    expect(result.current).toBe('12:00:00');
  });

  it('uses 24-hour time with no AM/PM suffix', () => {
    vi.setSystemTime(new Date('2026-08-26T18:45:07Z'));

    const { result } = renderHook(() => useLocalClock('UTC'));

    expect(result.current).toBe('18:45:07');
    expect(result.current).not.toMatch(/[ap]m/i);
  });

  it('ticks forward once per second', () => {
    const { result } = renderHook(() => useLocalClock('UTC'));

    expect(result.current).toBe('12:00:00');

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current).toBe('12:00:01');

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current).toBe('12:00:03');
  });

  it('clears its interval on unmount', () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');

    const { unmount } = renderHook(() => useLocalClock('UTC'));
    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
