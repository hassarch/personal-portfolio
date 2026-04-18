import { useEffect, useState } from 'react';
import { Music, Play, Pause, SkipBack, SkipForward, Heart } from 'lucide-react';

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

  const fetchCurrentTrack = async (token?: string) => {
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
        setTrack(null);
        setError(null);
        return;
      }

      const data = await trackResponse.json();

      if (!data.item) {
        setTrack(null);
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
  };

  useEffect(() => {
    fetchCurrentTrack();
    const interval = setInterval(() => fetchCurrentTrack(), 5000);
    return () => clearInterval(interval);
  }, []);

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
      <div className="w-full bg-card border-2 border-foreground overflow-hidden animate-pulse flex h-24 shadow-[4px_4px_0_0_currentColor]">
        <div className="w-24 h-full bg-foreground/20"></div>
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="h-4 bg-foreground/20 w-3/4"></div>
            <div className="h-3 bg-foreground/20 w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-card border-2 border-foreground p-4 shadow-[4px_4px_0_0_currentColor]">
        <div className="text-xs text-foreground font-mono">
          <p className="font-bold">⚠️ Spotify Error</p>
          <p className="text-red-600 text-[10px] mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="w-full bg-card border-2 border-foreground p-4 flex items-center justify-center gap-3 shadow-[4px_4px_0_0_currentColor] h-24">
        <Music size={20} className="text-foreground opacity-50" />
        <span className="text-xs font-mono font-bold text-foreground opacity-50 uppercase tracking-widest">[ Offline ]</span>
      </div>
    );
  }

  const progressPercent = (track.progress / track.duration) * 100;

  return (
    <div className="w-full bg-card border-2 border-foreground overflow-hidden hover:-translate-y-1 hover:-translate-x-1 transition-transform duration-200 flex h-24 shadow-[6px_6px_0_0_currentColor]">
      <div className="w-24 h-full flex-shrink-0 border-r-2 border-foreground overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
        <img 
          src={track.imageUrl} 
          alt={track.album}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 px-4 py-2 flex flex-col justify-between">
        <div className="min-h-0">
          <h3 className="text-sm font-bold text-foreground truncate uppercase tracking-tight">
            {track.name}
          </h3>
          <p className="text-[10px] text-foreground font-mono truncate uppercase font-bold opacity-75">
            {track.artist}
          </p>
        </div>

        <div className="my-1">
          <div className="w-full h-1 border border-foreground bg-background overflow-hidden">
            <div 
              className="h-full bg-foreground transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-foreground font-mono font-bold mt-1">
            <span>{formatTime(track.progress)}</span>
            <span>{formatTime(track.duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => handleSkip('previous')}
              className="text-foreground hover:scale-110 transition-transform"
              title="Previous"
            >
              <SkipBack size={14} className="fill-foreground" />
            </button>
            <button
              onClick={handlePlayPause}
              className="text-foreground hover:scale-110 transition-transform"
              title={track.isPlaying ? 'Pause' : 'Play'}
            >
              {track.isPlaying ? (
                <Pause size={14} className="fill-foreground" />
              ) : (
                <Play size={14} className="fill-foreground" />
              )}
            </button>
            <button
              onClick={() => handleSkip('next')}
              className="text-foreground hover:scale-110 transition-transform"
              title="Next"
            >
              <SkipForward size={14} className="fill-foreground" />
            </button>
          </div>
          <button
            onClick={handleLike}
            className="text-foreground hover:scale-110 transition-transform"
            title="Like"
          >
            <Heart size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export default SpotifyPlayer;
