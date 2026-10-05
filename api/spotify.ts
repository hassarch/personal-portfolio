import type { IncomingMessage, ServerResponse } from 'http';
import { fetchNowPlaying, SpotifyError } from './_spotify';

/**
 * Vercel's Node runtime hands the handler Node's req/res with a few
 * Express-style helpers bolted on. Typed structurally here so the project
 * doesn't take a dependency on @vercel/node for two type names.
 */
type ApiRequest = IncomingMessage;
type ApiResponse = ServerResponse & {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
};

/**
 * Edge-cached so Spotify call volume stays flat as traffic grows: every
 * visitor polling this route shares one upstream request per window. Without
 * it, each open tab would spend the account's rate limit on its own.
 */
const CACHE_CONTROL = 'public, s-maxage=30, stale-while-revalidate=120';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).end();
    return;
  }

  try {
    const result = await fetchNowPlaying(process.env);

    res.setHeader('Cache-Control', CACHE_CONTROL);

    if (result.status === 'ok') {
      res.status(200).json(result.track);
      return;
    }

    // Idle and unconfigured both read as "nothing to show" to the client.
    res.status(204).end();
  } catch (error) {
    if (error instanceof SpotifyError && error.retryAfter) {
      res.setHeader('Retry-After', String(error.retryAfter));
    }

    // The reason goes to the server log only — the response body stays generic
    // so nothing about the credentials can leak to the browser.
    console.error('Spotify proxy failed:', error);

    res.setHeader('Cache-Control', 'no-store');
    res.status(503).json({ error: 'spotify_unavailable' });
  }
}
