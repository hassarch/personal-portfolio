import { useEffect, useState, useCallback, type ReactNode } from 'react';
import { Music, Play, Pause, SkipBack, SkipForward, Heart } from 'lucide-react';
import TerminalFrame from './TerminalFrame';

interface Track {
  name: string;
  artist: string;
  album: string;
  imageUrl: string;
  isPlaying: boolean;
  progress: number;
  duration: number;
  spotifyUrl: string;
}

const SpotifyPlayer = () => {
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const getAccessToken = async () => {
    try {
      const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
      const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
      const refreshToken = import.meta.env.VITE_SPOTIFY_REFRESH_TOKEN;

      if (!clientId || !clientSecret || !refreshToken) {
        throw new Error('Spotify credentials not configured');
      }

      const authResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
        },
        body: 'grant_type=refresh_token&refresh_token=' + refreshToken,
      });

      if (!authResponse.ok) {
        throw new Error('Failed to get Spotify access token');
      }

      const authData = await authResponse.json();
      return authData.access_token;
    } catch (err) {
      console.error('Error getting access token:', err);
      return null;
    }
  };

  const fetchRecentlyPlayed = async (token: string) => {
    try {
      const recentResponse = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', {
        headers: {
          'Authorization': 'Bearer ' + token,
        },
      });

      if (!recentResponse.ok) {
        return null;
      }

      const recentData = await recentResponse.json();

      if (!recentData.items || recentData.items.length === 0) {
        return null;
      }

      const lastTrack = recentData.items[0].track;
      return {
        name: lastTrack.name,
        artist: lastTrack.artists[0].name,
        album: lastTrack.album.name,
        imageUrl: lastTrack.album.images[0]?.url || '',
        isPlaying: false,
        progress: 0,
        duration: lastTrack.duration_ms,
        spotifyUrl: lastTrack.external_urls.spotify,
      };
    } catch (err) {
      console.error('Error fetching recently played:', err);
      return null;
    }
  };

  const fetchCurrentTrack = useCallback(async (token?: string) => {
    try {
      const currentToken = token || accessToken || await getAccessToken();
      if (!currentToken) {
        setError('Failed to authenticate with Spotify');
        return;
      }

      if (!accessToken) setAccessToken(currentToken);

      const trackResponse = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
          'Authorization': 'Bearer ' + currentToken,
        },
      });

      if (trackResponse.status === 204 || !trackResponse.ok) {
        // No current track, fetch recently played
        const recentTrack = await fetchRecentlyPlayed(currentToken);
        setTrack(recentTrack);
        setError(null);
        return;
      }

      const data = await trackResponse.json();

      if (!data.item) {
        // No current track, fetch recently played
        const recentTrack = await fetchRecentlyPlayed(currentToken);
        setTrack(recentTrack);
        setError(null);
        return;
      }

      setTrack({
        name: data.item.name,
        artist: data.item.artists[0].name,
        album: data.item.album.name,
        imageUrl: data.item.album.images[0]?.url || '',
        isPlaying: data.is_playing,
        progress: data.progress_ms,
        duration: data.item.duration_ms,
        spotifyUrl: data.item.external_urls.spotify,
      });
      setError(null);
    } catch (err) {
      console.error('Spotify error:', err);
      setError(err instanceof Error ? err.message : 'Error loading track');
      setTrack(null);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchCurrentTrack();
    const interval = setInterval(() => fetchCurrentTrack(), 5000);
    return () => clearInterval(interval);
  }, [fetchCurrentTrack]);

  const handlePlayPause = async () => {
    if (!accessToken || !track) return;

    try {
      const endpoint = track.isPlaying 
        ? 'https://api.spotify.com/v1/me/player/pause'
        : 'https://api.spotify.com/v1/me/player/play';

      await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + accessToken,
        },
      });

      setTimeout(() => fetchCurrentTrack(accessToken), 500);
    } catch (err) {
      console.error('Error toggling playback:', err);
    }
  };

  const handleSkip = async (direction: 'next' | 'previous') => {
    if (!accessToken) return;

    try {
      const endpoint = direction === 'next'
        ? 'https://api.spotify.com/v1/me/player/next'
        : 'https://api.spotify.com/v1/me/player/previous';

      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + accessToken,
        },
      });

      setTimeout(() => fetchCurrentTrack(accessToken), 500);
    } catch (err) {
      console.error('Error skipping track:', err);
    }
  };

  const handleLike = async () => {
    if (!accessToken || !track) return;

    try {
      const trackId = track.spotifyUrl.split('/').pop();
      await fetch(`https://api.spotify.com/v1/me/tracks?ids=${trackId}`, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + accessToken,
        },
      });
    } catch (err) {
      console.error('Error liking track:', err);
    }
  };

  if (loading) {
    return (
      <PlayerShell>
        <span className="bento-eyebrow">$ spotify --now-playing</span>
        <div className="flex flex-1 animate-pulse items-center gap-3">
          <div className="h-16 w-16 shrink-0 rounded-[6px] border-2 border-foreground bg-foreground/10" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-foreground/20" />
            <div className="h-3 w-1/2 bg-foreground/20" />
            <div className="h-1 w-full bg-foreground/20" />
          </div>
        </div>
      </PlayerShell>
    );
  }

  if (error) {
    return (
      <PlayerShell>
        <span className="bento-eyebrow">$ spotify --now-playing</span>
        <div className="flex flex-1 flex-col items-center justify-center gap-1 text-center">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-foreground opacity-50">
            [ error ]
          </span>
          <span className="font-mono text-[10px] text-destructive">{error}</span>
        </div>
      </PlayerShell>
    );
  }

  if (!track) {
    return (
      <PlayerShell>
        <span className="bento-eyebrow">$ spotify --now-playing</span>
        <div className="flex flex-1 items-center justify-center gap-2">
          <Music size={14} className="text-foreground opacity-40" aria-hidden="true" />
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-foreground opacity-50">
            [ offline ]
          </span>
        </div>
      </PlayerShell>
    );
  }

  const progressPercent = (track.progress / track.duration) * 100;

  return (
    <PlayerShell>
      <span className="bento-eyebrow">
        $ spotify {track.isPlaying ? '--now-playing' : '--last-played'}
      </span>

      <div className="flex flex-1 items-center gap-3">
        {/* Album art stays desaturated until hover — full-colour artwork is the
            one thing that would break this palette's monochrome. */}
        <a
          href={track.spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="h-16 w-16 shrink-0 overflow-hidden rounded-[6px] border-2 border-foreground grayscale transition-all duration-500 hover:grayscale-0"
          aria-label={`Open ${track.name} on Spotify`}
        >
          <img
            src={track.imageUrl}
            alt={track.album}
            className="h-full w-full object-cover"
          />
        </a>

        <div className="min-w-0 flex-1">
          <p className="bento-value truncate text-base">{track.name}</p>
          <p className="mt-1 truncate font-mono text-[10px] font-bold uppercase tracking-widest text-foreground opacity-60">
            {track.artist}
          </p>

          <div className="mt-2 h-1 w-full overflow-hidden border border-foreground/40 bg-foreground/10">
            <div
              className="h-full bg-foreground transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="mt-1.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ControlButton label="Previous" onClick={() => handleSkip('previous')}>
                <SkipBack size={14} className="fill-current" />
              </ControlButton>
              <ControlButton
                label={track.isPlaying ? 'Pause' : 'Play'}
                onClick={handlePlayPause}
              >
                {track.isPlaying ? (
                  <Pause size={14} className="fill-current" />
                ) : (
                  <Play size={14} className="fill-current" />
                )}
              </ControlButton>
              <ControlButton label="Next" onClick={() => handleSkip('next')}>
                <SkipForward size={14} className="fill-current" />
              </ControlButton>
              <ControlButton label="Like" onClick={handleLike}>
                <Heart size={14} />
              </ControlButton>
            </div>

            <span className="shrink-0 font-mono text-[10px] font-bold tabular-nums text-foreground opacity-60">
              {/* Paused tracks still report a real progress_ms, and the
                  recently-played branch sets progress to 0 — so the raw value
                  is right either way, and stays in step with the bar above. */}
              {formatTime(track.progress)} / {formatTime(track.duration)}
            </span>
          </div>
        </div>
      </div>
    </PlayerShell>
  );
};

/**
 * Shared chrome for every player state, so the tile reads as a sibling of the
 * other bento tiles rather than a card with its own borders and shadow.
 */
const PlayerShell = ({ children }: { children: ReactNode }) => (
  <TerminalFrame
    title="~/spotify"
    flush
    className="bento-tile"
    contentClassName="bento-tile-content"
  >
    <div className="flex h-full flex-col">{children}</div>
  </TerminalFrame>
);

const ControlButton = ({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    title={label}
    className="text-foreground opacity-60 transition-all duration-200 hover:scale-110 hover:opacity-100"
  >
    {children}
  </button>
);

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export default SpotifyPlayer;
