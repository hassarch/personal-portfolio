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
      <div className="w-96 bg-card border-2 border-foreground overflow-hidden animate-pulse flex">
        <div className="w-24 h-24 bg-muted"></div>
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-96 bg-card border-2 border-foreground p-4">
        <div className="text-xs text-foreground font-mono">
          <p className="font-bold">⚠️ Spotify Error</p>
          <p className="text-red-600 text-xs">{error}</p>
        </div>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="w-96 bg-card border-2 border-foreground p-4 flex items-center gap-3">
        <Music size={16} className="text-foreground" />
        <span className="text-xs font-mono text-foreground">Not playing</span>
      </div>
    );
  }

  const progressPercent = (track.progress / track.duration) * 100;

  return (
    <div className="w-72 sm:w-80 md:w-96 bg-card border-2 border-foreground overflow-hidden hover:shadow-lg hover:translate-x-1 hover:translate-y-1 transition-all duration-200 flex">
      {/* Album Art - Left */}
      <div className="w-20 sm:w-24 h-20 sm:h-24 flex-shrink-0 border-r-2 border-foreground overflow-hidden">
        <img 
          src={track.imageUrl} 
          alt={track.album}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content - Right */}
      <div className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 flex flex-col justify-between">
        {/* Track Info */}
        <div className="min-h-0">
          <h3 className="text-xs sm:text-sm font-bold text-foreground truncate leading-tight">
            {track.name}
          </h3>
          <p className="text-xs text-foreground font-mono truncate leading-tight">
            {track.artist}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="my-0.5 sm:my-1">
          <div className="w-full h-0.5 border border-foreground bg-background overflow-hidden">
            <div 
              className="h-full bg-foreground transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-foreground font-mono mt-0.5">
            <span>{formatTime(track.progress)}</span>
            <span>{formatTime(track.duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex gap-0.5 sm:gap-1">
            <button
              onClick={() => handleSkip('previous')}
              className="p-0.5 hover:bg-foreground hover:text-background transition-all duration-200 cursor-pointer"
              title="Previous"
            >
              <SkipBack size={12} className="text-foreground" />
            </button>
            <button
              onClick={handlePlayPause}
              className="p-0.5 hover:bg-foreground hover:text-background transition-all duration-200 cursor-pointer"
              title={track.isPlaying ? 'Pause' : 'Play'}
            >
              {track.isPlaying ? (
                <Pause size={12} className="text-foreground" />
              ) : (
                <Play size={12} className="text-foreground fill-foreground" />
              )}
            </button>
            <button
              onClick={() => handleSkip('next')}
              className="p-0.5 hover:bg-foreground hover:text-background transition-all duration-200 cursor-pointer"
              title="Next"
            >
              <SkipForward size={12} className="text-foreground" />
            </button>
          </div>
          <button
            onClick={handleLike}
            className="p-0.5 hover:bg-foreground hover:text-background transition-all duration-200 cursor-pointer"
            title="Like"
          >
            <Heart size={12} className="text-foreground" />
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
