import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Film } from 'lucide-react';
import TerminalFrame from '../TerminalFrame';
import { useAniList } from '@/hooks/useAniList';
import { ANILIST_USERNAME } from '@/constants/profile';

const AniListTile = () => {
  const { watching, loading } = useAniList(ANILIST_USERNAME);

  if (loading) {
    return (
      <Link to="/anime" className="block h-full">
        <TerminalFrame
          title="~/anime"
          flush
          className="bento-tile transition-transform hover:translate-y-[-2px]"
          contentClassName="bento-tile-content"
        >
          <div className="flex h-full flex-col">
            <div className="flex h-full items-center gap-4 p-1">
              <div className="w-24 h-24 shrink-0 rounded-md border-2 border-foreground bg-foreground/10 animate-pulse" />
              <div className="flex-1 space-y-3">
                <div className="h-4 w-3/4 bg-foreground/20 rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-foreground/20 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </TerminalFrame>
      </Link>
    );
  }

  return (
    <Link to="/anime" className="block h-full">
      <TerminalFrame
        title="~/anime"
        flush
        className="bento-tile transition-transform hover:translate-y-[-2px]"
        contentClassName="bento-tile-content"
      >
        <div className="flex h-full flex-col">
          <span className="bento-eyebrow">$ anime --watching</span>

          <div className="flex h-full items-center gap-4">
            {/* Anime GIF - matching Spotify size */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative w-24 h-24 shrink-0 overflow-hidden rounded-md border-2 border-foreground group"
            >
              <img
                src="/4204-one-piece.gif"
                alt="Anime watching"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Anime details */}
            <div className="min-w-0 flex-1 flex flex-col justify-center gap-2">
              <div className="font-mono text-sm font-bold text-foreground">
                <span className="text-2xl">{watching.length}</span>
                <span className="text-xs opacity-60 ml-2">watching</span>
              </div>
              
              <div className="inline-flex items-center gap-1.5 font-mono text-xs text-foreground opacity-60 group-hover:opacity-100 transition-opacity">
                <span>view collection</span>
                <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </TerminalFrame>
    </Link>
  );
};

export default AniListTile;
