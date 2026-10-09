import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchNowPlaying, SpotifyError, resetTokenCache } from './_spotify';

const ENV = {
  SPOTIFY_CLIENT_ID: 'id',
  SPOTIFY_CLIENT_SECRET: 'secret',
  SPOTIFY_REFRESH_TOKEN: 'refresh',
};

const API_TRACK = {
  name: 'Teardrop',
  duration_ms: 200_000,
  artists: [{ name: 'Massive Attack' }, { name: 'Elizabeth Fraser' }],
  album: { name: 'Mezzanine', images: [{ url: 'https://i.scdn.co/image/abc' }] },
  external_urls: { spotify: 'https://open.spotify.com/track/abc' },
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const empty = (status: number, headers?: Record<string, string>) =>
  new Response(null, { status, headers });

const tokenResponse = () => json({ access_token: 'token-1', expires_in: 3600 });

/** Routes a mocked fetch by URL so tests only describe the parts they care about. */
const route = (handlers: {
  token?: () => Response;
  current?: () => Response;
  recent?: () => Response;
}) => {
  const fetchMock = vi.fn(async (input: string | URL | Request) => {
    const url = String(input);
    if (url.includes('accounts.spotify.com')) return (handlers.token ?? tokenResponse)();
    if (url.includes('currently-playing')) return handlers.current!();
    if (url.includes('recently-played')) return handlers.recent!();
    throw new Error(`unexpected request: ${url}`);
  });

  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
};

describe('fetchNowPlaying', () => {
  beforeEach(() => {
    resetTokenCache();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reports unconfigured when credentials are missing', async () => {
    const fetchMock = route({});

    await expect(fetchNowPlaying({})).resolves.toEqual({ status: 'unconfigured' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('normalizes the currently-playing track', async () => {
    route({
      current: () => json({ item: API_TRACK, is_playing: true, progress_ms: 42_000 }),
    });

    const result = await fetchNowPlaying(ENV);

    expect(result).toEqual({
      status: 'ok',
      track: {
        name: 'Teardrop',
        artist: 'Massive Attack, Elizabeth Fraser',
        album: 'Mezzanine',
        imageUrl: 'https://i.scdn.co/image/abc',
        isPlaying: true,
        progress: 42_000,
        duration: 200_000,
        spotifyUrl: 'https://open.spotify.com/track/abc',
      },
    });
  });

  it('falls back to recently-played on a 204 from an idle player', async () => {
    route({
      current: () => empty(204),
      recent: () => json({ items: [{ track: API_TRACK }] }),
    });

    const result = await fetchNowPlaying(ENV);

    expect(result).toMatchObject({
      status: 'ok',
      track: { name: 'Teardrop', isPlaying: false, progress: 0 },
    });
  });

  it('falls back when the player returns a null item', async () => {
    route({
      current: () => json({ item: null, is_playing: false, progress_ms: null }),
      recent: () => json({ items: [{ track: API_TRACK }] }),
    });

    await expect(fetchNowPlaying(ENV)).resolves.toMatchObject({ status: 'ok' });
  });

  it('reports idle when there is no history either', async () => {
    route({
      current: () => empty(204),
      recent: () => json({ items: [] }),
    });

    await expect(fetchNowPlaying(ENV)).resolves.toEqual({ status: 'idle' });
  });

  // The regression that made the tile go permanently offline after an hour:
  // an expired token must be re-minted, not treated as "nothing playing".
  it('re-mints the token and retries once on a 401', async () => {
    let currentCalls = 0;
    const fetchMock = route({
      current: () => {
        currentCalls += 1;
        return currentCalls === 1
          ? empty(401)
          : json({ item: API_TRACK, is_playing: true, progress_ms: 0 });
      },
    });

    await expect(fetchNowPlaying(ENV)).resolves.toMatchObject({ status: 'ok' });

    expect(currentCalls).toBe(2);
    // Two token grants: the initial one, then the forced refresh after the 401.
    const tokenCalls = fetchMock.mock.calls.filter(([url]) =>
      String(url).includes('accounts.spotify.com')
    );
    expect(tokenCalls).toHaveLength(2);
  });

  it('reuses a cached token across calls', async () => {
    const fetchMock = route({
      current: () => json({ item: API_TRACK, is_playing: true, progress_ms: 0 }),
    });

    await fetchNowPlaying(ENV);
    await fetchNowPlaying(ENV);

    const tokenCalls = fetchMock.mock.calls.filter(([url]) =>
      String(url).includes('accounts.spotify.com')
    );
    expect(tokenCalls).toHaveLength(1);
  });

  it('surfaces a rate limit with its Retry-After', async () => {
    route({
      current: () => empty(429, { 'Retry-After': '12' }),
    });

    await expect(fetchNowPlaying(ENV)).rejects.toMatchObject({
      name: 'SpotifyError',
      status: 429,
      retryAfter: 12,
    });
  });

  it('throws when the refresh token has been revoked', async () => {
    route({
      token: () => json({ error: 'invalid_grant' }, 400),
      current: () => json({}),
    });

    await expect(fetchNowPlaying(ENV)).rejects.toBeInstanceOf(SpotifyError);
  });

  it('throws rather than reporting idle when the player errors', async () => {
    route({
      current: () => empty(500),
    });

    await expect(fetchNowPlaying(ENV)).rejects.toMatchObject({ status: 500 });
  });
});
