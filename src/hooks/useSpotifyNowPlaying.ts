import { useEffect, useRef, useState } from 'react';
// Type-only, and it must stay that way: the proxy owns the payload shape, but
// a value import from `api/` would pull server code holding the client secret
// into the browser bundle.
import type { Track } from '../../api/_spotify';

export type { Track };

export interface UseSpotifyNowPlayingResult {
  track: Track | null;
  loading: boolean;
  /** True only when there is nothing to show *and* the proxy is failing. */
  error: boolean;
}

/**
 * Matches the `s-maxage` on /api/spotify — polling faster would only ever hit
 * the CDN copy, so it would cost requests without showing anything newer.
 */
const POLL_MS = 30_000;

/** Progress is interpolated between polls so the bar glides instead of stepping. */
const TICK_MS = 1_000;

/**
 * Current (or last played) Spotify track, read through the server proxy.
 *
 * Credentials live in the Vercel function, so nothing sensitive is in the
 * bundle and the client only ever sees a normalized track payload.
 */
export const useSpotifyNowPlaying = (): UseSpotifyNowPlayingResult => {
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Mirrors `track` for the fetch loop, which would otherwise close over a
  // stale value and misjudge whether a failure is worth surfacing.
  const latestTrack = useRef<Track | null>(null);
  useEffect(() => {
    latestTrack.current = track;
  }, [track]);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const load = async () => {
      try {
        const response = await fetch('/api/spotify', { signal });

        // 204: player idle and no history, or Spotify isn't configured.
        if (response.status === 204) {
          setTrack(null);
          setError(false);
          return;
        }

        if (!response.ok) {
          throw new Error(`Spotify proxy returned ${response.status}`);
        }

        setTrack((await response.json()) as Track);
        setError(false);
      } catch (err) {
        if (signal.aborted) return;

        console.error('Failed to load Spotify track:', err);
        // A blip shouldn't blank a tile that already has something in it —
        // only a cold failure, with nothing to fall back to, shows an error.
        setError(latestTrack.current === null);
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    };

    // Chained timeouts rather than setInterval: a slow response delays the
    // next poll instead of stacking requests behind it.
    const run = async () => {
      await load();
      if (signal.aborted) return;

      clearTimeout(timer);
      // A hidden tab shouldn't spend the rate limit; the listener below
      // refetches the moment it comes back.
      if (!document.hidden) timer = setTimeout(run, POLL_MS);
    };

    const onVisibilityChange = () => {
      if (!document.hidden) void run();
    };

    void run();
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      controller.abort();
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  // Advance progress locally between polls. Keyed on identity and play state
  // only, so the ticker isn't torn down and rebuilt on every tick it causes.
  useEffect(() => {
    if (!track?.isPlaying) return;

    const id = setInterval(() => {
      setTrack((current) => {
        if (!current?.isPlaying) return current;

        const next = Math.min(current.progress + TICK_MS, current.duration);
        return next === current.progress ? current : { ...current, progress: next };
      });
    }, TICK_MS);

    return () => clearInterval(id);
  }, [track?.isPlaying, track?.spotifyUrl]);

  return { track, loading, error };
};
