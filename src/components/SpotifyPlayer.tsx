import { type ReactNode } from 'react';
import { Music, Play, Pause, SkipBack, SkipForward, Heart } from 'lucide-react';
import TerminalFrame from './TerminalFrame';
import { useSpotifyNowPlaying } from '@/hooks/useSpotifyNowPlaying';

const SpotifyPlayer = () => {
  const { track, loading, error } = useSpotifyNowPlaying();

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
          <span className="font-mono text-[10px] text-destructive">
            Could not reach Spotify
          </span>
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

  // Guard the divide: a malformed payload shouldn't render width: NaN%.
  const progressPercent = track.duration > 0 ? (track.progress / track.duration) * 100 : 0;

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
          <a
            href={track.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bento-value block truncate text-base hover:underline"
          >
            {track.name}
          </a>
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
            {/* Decorative transport. The page is public and these would act on
                a real account, so they display state rather than drive it —
                the play/pause glyph still reflects actual playback. */}
            <div className="flex items-center gap-2" aria-hidden="true">
              <ControlGlyph>
                <SkipBack size={14} className="fill-current" />
              </ControlGlyph>
              <ControlGlyph>
                {track.isPlaying ? (
                  <Pause size={14} className="fill-current" />
                ) : (
                  <Play size={14} className="fill-current" />
                )}
              </ControlGlyph>
              <ControlGlyph>
                <SkipForward size={14} className="fill-current" />
              </ControlGlyph>
              <ControlGlyph>
                <Heart size={14} />
              </ControlGlyph>
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

/**
 * Non-interactive by design — a <button> here would be announced as a control
 * and offer a hover affordance for something that does nothing. The wrapping
 * row carries aria-hidden, so this stays out of the accessibility tree.
 */
const ControlGlyph = ({ children }: { children: ReactNode }) => (
  <span className="text-foreground opacity-60">{children}</span>
);

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export default SpotifyPlayer;
