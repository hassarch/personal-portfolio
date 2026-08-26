import { useState, useEffect } from 'react';
import { GITHUB_USERNAME } from '@/constants/profile';

export interface GithubStats {
  stars: number;
  repos: number;
  pullRequests: number;
  followers: number;
}

export interface UseGithubStatsResult {
  stats: GithubStats | null;
  loading: boolean;
  /** True when the fetch failed — the tile shows an offline state rather than zeros */
  error: boolean;
}

const CACHE_KEY = `gh-stats:${GITHUB_USERNAME}`;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

interface CachedPayload {
  stats: GithubStats;
  cachedAt: number;
}

const readCache = (): GithubStats | null => {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    const payload = JSON.parse(raw) as CachedPayload;
    if (Date.now() - payload.cachedAt > CACHE_TTL_MS) return null;

    return payload.stats;
  } catch {
    // Malformed or unavailable storage — fall through to a live fetch
    return null;
  }
};

const writeCache = (stats: GithubStats): void => {
  try {
    const payload: CachedPayload = { stats, cachedAt: Date.now() };
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Storage full or blocked — caching is best-effort
  }
};

const fetchJson = async <T,>(url: string, signal: AbortSignal): Promise<T> => {
  const response = await fetch(url, {
    signal,
    headers: { Accept: 'application/vnd.github+json' },
  });

  if (!response.ok) {
    throw new Error(`GitHub API ${response.status} for ${url}`);
  }

  return response.json() as Promise<T>;
};

/**
 * Fetches public GitHub stats for the profile user, cached in sessionStorage.
 *
 * Three unauthenticated requests on a cold load (user, repos, PR search).
 * Rate limits are 60/hr core and 10/min search, so the cache matters.
 */
export const useGithubStats = (): UseGithubStatsResult => {
  const [stats, setStats] = useState<GithubStats | null>(() => readCache());
  const [loading, setLoading] = useState(() => readCache() === null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (stats !== null) return;

    const controller = new AbortController();
    const { signal } = controller;

    const load = async () => {
      try {
        const base = `https://api.github.com/users/${GITHUB_USERNAME}`;
        const searchUrl =
          `https://api.github.com/search/issues` +
          `?q=author:${GITHUB_USERNAME}+type:pr&per_page=1`;

        const [user, repos, prs] = await Promise.all([
          fetchJson<{ public_repos: number; followers: number }>(base, signal),
          fetchJson<Array<{ stargazers_count: number }>>(
            `${base}/repos?per_page=100`,
            signal
          ),
          fetchJson<{ total_count: number }>(searchUrl, signal),
        ]);

        const next: GithubStats = {
          stars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
          repos: user.public_repos,
          pullRequests: prs.total_count,
          followers: user.followers,
        };

        writeCache(next);
        setStats(next);
        setError(false);
      } catch (err) {
        if (signal.aborted) return;
        console.error('Failed to load GitHub stats:', err);
        setError(true);
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    };

    load();

    return () => controller.abort();
  }, [stats]);

  return { stats, loading, error };
};
