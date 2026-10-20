import { type ReactNode } from 'react';
import { Music, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import TerminalFrame from './TerminalFrame';
import { useSpotifyNowPlaying } from '@/hooks/useSpotifyNowPlaying';

const SpotifyPlayer = () => {
  const { track, loading, error } = useSpotifyNowPlaying();

  if (loading) {
    return (
      <PlayerShell>
        <div className="flex h-full items-center gap-4 p-1">
          <div className="w-24 h-24 shrink-0 rounded-md border-2 border-foreground bg-foreground/10 animate-pulse" />
          <div className="flex-1 space-y-3">
            <div className="h-4 w-3/4 bg-foreground/20 rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-foreground/20 rounded animate-pulse" />
          </div>
        </div>
      </PlayerShell>
    );
  }

  if (error || !track) {
    return (
      <PlayerShell>
        <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
          <Music size={32} className="text-foreground opacity-30" aria-hidden="true" />
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-foreground opacity-40">
            {error ? '[ error ]' : '[ offline ]'}
          </span>
        </div>
      </PlayerShell>
    );
  }

  return (
    <PlayerShell>
      <span className="bento-eyebrow">
        $ spotify {track.isPlaying ? '--now-playing' : '--last-played'}
      </span>

      <div className="flex h-full items-center gap-4">
        {/* Album artwork - compact but prominent */}
        <a
          href={track.spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-24 h-24 shrink-0 overflow-hidden rounded-md border-2 border-foreground grayscale transition-all duration-500 hover:grayscale-0 hover:scale-[1.02] group"
          aria-label={`Open ${track.name} on Spotify`}
        >
          <img
            src={track.imageUrl}
            alt={track.album}
            className="h-full w-full object-cover"
          />
          {track.isPlaying && (
            <motion.div 
              className="absolute bottom-1 right-1 bg-foreground/90 rounded-sm p-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Activity size={12} className="text-background" />
            </motion.div>
          )}
        </a>

        {/* Song details */}
        <div className="min-w-0 flex-1 flex flex-col justify-center gap-2">
          <a
            href={track.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm font-bold text-foreground hover:underline line-clamp-2 leading-tight"
          >
            {track.name}
          </a>
          <p className="font-mono text-xs text-foreground opacity-60 line-clamp-1">
            {track.artist}
          </p>
          
          {/* Progress bar - subtle */}
          <div className="w-full h-0.5 bg-foreground/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-foreground/60"
              initial={{ width: 0 }}
              animate={{ 
                width: `${track.duration > 0 ? (track.progress / track.duration) * 100 : 0}%` 
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>
    </PlayerShell>
  );
};

/**
 * Shared chrome for every player state
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

export default SpotifyPlayer;
