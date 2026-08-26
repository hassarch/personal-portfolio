import { MapPin } from 'lucide-react';
import TerminalFrame from '../TerminalFrame';
import { LOCATION, TIMEZONE } from '@/constants/profile';

/**
 * Bento tile showing where I am, styled as the output of `$ locale`.
 */
const LocationTile = () => (
  <TerminalFrame
    title="~/loc"
    flush
    className="bento-tile"
    contentClassName="bento-tile-content"
  >
    <div className="flex h-full flex-col justify-center">
      <span className="bento-eyebrow">$ locale</span>
      <p className="bento-value flex items-center gap-1.5 text-2xl">
        <MapPin size={18} className="opacity-40" aria-hidden="true" />
        {LOCATION}
      </p>
      <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-widest text-foreground opacity-60">
        {TIMEZONE}
      </p>
    </div>
  </TerminalFrame>
);

export default LocationTile;
