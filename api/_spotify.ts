/**
 * Spotify now-playing, server side.
 *
 * Lives outside `src/` so Vite never bundles it: the client secret and refresh
 * token must not reach the browser. Vercel treats `api/_*.ts` as a helper
 * module rather than a route, so this is importable but not addressable.
 *
 * Consumed by both the deployed function (`api/spotify.ts`) and the dev-server
 * middleware in `vite.config.ts`, so `npm run dev` behaves like production.
 */

export interface Track {
  name: string;
  artist: string;
  album: string;
  imageUrl: string;
  isPlaying: boolean;
  progress: number;
  duration: number;
  spotifyUrl: string;
}

export type NowPlaying =
  /** Something to show — either live playback or the last played track. */
  | { status: 'ok'; track: Track }
  /** Authenticated fine, but the player is idle and there is no history. */
  | { status: 'idle' }
  /** No credentials configured. The tile is optional, so this isn't an error. */
  | { status: 'unconfigured' };

export interface SpotifyEnv {
  SPOTIFY_CLIENT_ID?: string;
  SPOTIFY_CLIENT_SECRET?: string;
  SPOTIFY_REFRESH_TOKEN?: string;
  /** Lets `process.env` and Vite's `loadEnv()` output both be passed directly. */
  [key: string]: string | undefined;
}

/** An upstream failure worth surfacing as a 503 rather than an empty tile. */
export class SpotifyError extends Error {
  readonly status: number;
  readonly retryAfter?: number;

  constructor(message: string, status: number, retryAfter?: number) {
    super(message);
    this.name = 'SpotifyError';
    this.status = status;
    this.retryAfter = retryAfter;
  }
}

const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const API_BASE = 'https://api.spotify.com/v1';

/** Re-mint a minute early so a request can't straddle the expiry boundary. */
const EXPIRY_MARGIN_MS = 60_000;

interface Credentials {
  id: string;
  secret: string;
  refresh: string;
}

/**
 * Module scope, so a warm invocation reuses the token instead of spending a
 * refresh grant per request.
 */
let cachedToken: { value: string; expiresAt: number } | null = null;

/** Test seam — lets a suite start from a known-cold cache. */
export const resetTokenCache = (): void => {
  cachedToken = null;
};

const readCredentials = (env: SpotifyEnv): Credentials | null => {
  const id = env.SPOTIFY_CLIENT_ID;
  const secret = env.SPOTIFY_CLIENT_SECRET;
  const refresh = env.SPOTIFY_REFRESH_TOKEN;

  return id && secret && refresh ? { id, secret, refresh } : null;
};

const getAccessToken = async (creds: Credentials, force: boolean): Promise<string> => {
  if (!force && cachedToken && Date.now() < cachedToken.expiresAt - EXPIRY_MARGIN_MS) {
    return cachedToken.value;
  }

  const basic = Buffer.from(`${creds.id}:${creds.secret}`).toString('base64');

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${basic}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: creds.refresh,
    }),
  });

  if (!response.ok) {
    // Usually 400 invalid_grant: the refresh token was revoked, or the client
    // secret was rotated without regenerating it. Retrying will not help.
    cachedToken = null;
    throw new SpotifyError(`Token refresh failed (${response.status})`, response.status);
  }

  const data = (await response.json()) as { access_token: string; expires_in: number };

  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  return cachedToken.value;
};

/**
 * One authenticated GET, retried once on 401.
 *
 * The clock-based expiry check above can't catch a token Spotify has already
 * invalidated server-side, and a warm lambda may hold one for a long time.
 * Forcing a refresh on the single retry is what stops the tile latching into a
 * permanent offline state once a token goes stale.
 */
const authedGet = async (path: string, creds: Credentials): Promise<Response> => {
  let response = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${await getAccessToken(creds, false)}` },
  });

  if (response.status === 401) {
    response = await fetch(`${API_BASE}${path}`, {
      headers: { Authorization: `Bearer ${await getAccessToken(creds, true)}` },
    });
  }

  if (response.status === 429) {
    const retryAfter = Number(response.headers.get('Retry-After')) || 30;
    throw new SpotifyError('Spotify rate limit reached', 429, retryAfter);
  }

  return response;
};

interface SpotifyTrack {
  name: string;
  duration_ms: number;
  artists: Array<{ name: string }>;
  album: { name: string; images: Array<{ url: string }> };
  external_urls: { spotify: string };
}

const toTrack = (item: SpotifyTrack, isPlaying: boolean, progress: number): Track => ({
  name: item.name,
  artist: item.artists.map((artist) => artist.name).join(', '),
  album: item.album.name,
  // images[0] is the largest; the tile renders it at 64px but retina doubles that.
  imageUrl: item.album.images[0]?.url ?? '',
  isPlaying,
  progress,
  duration: item.duration_ms,
  spotifyUrl: item.external_urls.spotify,
});

/**
 * Current track if the player is active, else the most recent one.
 *
 * Throws {@link SpotifyError} on an upstream fault so the caller can answer 503
 * and let the client keep showing its last good payload — distinct from a
 * genuinely idle player, which resolves to `idle`.
 */
export const fetchNowPlaying = async (env: SpotifyEnv): Promise<NowPlaying> => {
  const creds = readCredentials(env);
  if (!creds) return { status: 'unconfigured' };

  const current = await authedGet('/me/player/currently-playing?additional_types=track', creds);

  // 204 counts as `ok` on a Response but carries no body, so it has to be
  // checked before any attempt to parse one.
  if (current.status !== 204) {
    if (!current.ok) {
      throw new SpotifyError(`currently-playing returned ${current.status}`, current.status);
    }

    const data = (await current.json()) as {
      item: SpotifyTrack | null;
      is_playing: boolean;
      progress_ms: number | null;
    };

    // A podcast episode with `additional_types=track` comes back with a null
    // item; treat that like an idle player rather than a failure.
    if (data.item) {
      return {
        status: 'ok',
        track: toTrack(data.item, data.is_playing, data.progress_ms ?? 0),
      };
    }
  }

  const recent = await authedGet('/me/player/recently-played?limit=1', creds);
  if (!recent.ok) {
    throw new SpotifyError(`recently-played returned ${recent.status}`, recent.status);
  }

  const history = (await recent.json()) as { items: Array<{ track: SpotifyTrack }> };
  const last = history.items[0]?.track;

  return last ? { status: 'ok', track: toTrack(last, false, 0) } : { status: 'idle' };
};
