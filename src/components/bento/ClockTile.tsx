import TerminalFrame from '../TerminalFrame';
import { useLocalClock } from '@/hooks/useLocalClock';
import { TIMEZONE_LABEL } from '@/constants/profile';

/**
 * Bento tile showing a live clock in the profile's timezone,
 * styled as the output of `$ date`.
 */
const ClockTile = () => {
  const time = useLocalClock();

  return (
    <TerminalFrame
      title="~/time"
      flush
      className="bento-tile"
      contentClassName="bento-tile-content"
    >
      <div className="flex h-full flex-col justify-center">
        <span className="bento-eyebrow">$ date +%T</span>
        <p className="bento-value text-2xl tabular-nums">
          {time || '--:--:--'}
        </p>
        <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-widest text-foreground opacity-60">
          {TIMEZONE_LABEL} · my time
        </p>
      </div>
    </TerminalFrame>
  );
};

export default ClockTile;
