import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Star, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import Starfield from '@/components/Starfield';
import TerminalFrame from '@/components/TerminalFrame';
import { useAniList, AnimeEntry } from '@/hooks/useAniList';
import { ANILIST_USERNAME } from '@/constants/profile';

const STATUS_LABELS = {
  CURRENT: 'Watching',
  COMPLETED: 'Completed',
  PLANNING: 'Plan to Watch',
  PAUSED: 'Paused',
  DROPPED: 'Dropped',
};

const STATUS_COLORS = {
  CURRENT: 'text-[#02a9ff]',
  COMPLETED: 'text-[#4caf50]',
  PLANNING: 'text-[#ffa726]',
  PAUSED: 'text-[#ff9800]',
  DROPPED: 'text-[#f44336]',
};

const AnimePage = () => {
  const { watching, loading, error } = useAniList(ANILIST_USERNAME);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-wrapper">
      {/* Space backdrop */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <Starfield />
        <div className="absolute inset-0 bg-grid-pattern" />
      </div>

      <div className="main-container">
        <Navbar />
        
        <main className="pt-16 sm:pt-24 pb-12 sm:pb-16">
          {/* Back button + Header */}
          <div className="max-w-7xl mx-auto px-2 sm:px-6 mb-6 sm:mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-mono text-sm text-foreground opacity-60 hover:opacity-100 transition-opacity mb-4 sm:mb-6 min-h-[44px]"
            >
              <ArrowLeft size={16} />
              <span>$ cd ..</span>
            </Link>

            <TerminalFrame
              title="~/anime"
              flush
              className="mb-6 sm:mb-8"
              contentClassName="p-4 sm:p-8"
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h1 className="font-mono text-2xl sm:text-3xl font-bold text-foreground mb-2">
                    $ anime --list
                  </h1>
                  <p className="font-mono text-xs sm:text-sm text-foreground opacity-60">
                    My anime collection from{' '}
                    <a
                      href={`https://anilist.co/user/${ANILIST_USERNAME}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#02a9ff] hover:underline"
                    >
                      AniList
                    </a>
                  </p>
                </div>

                {!loading && !error && (
                  <div className="flex gap-4 font-mono text-xs">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">{watching.length}</div>
                      <div className="text-foreground opacity-40">watching</div>
                    </div>
                  </div>
                )}
              </div>
            </TerminalFrame>
          </div>

          {/* Anime Grid */}
          <div className="max-w-7xl mx-auto px-2 sm:px-6">
            {error ? (
              <TerminalFrame title="~/error" contentClassName="p-6 sm:p-12">
                <div className="text-center">
                  <span className="font-mono text-sm text-foreground opacity-50">
                    [ failed to load anime list ]
                  </span>
                </div>
              </TerminalFrame>
            ) : loading ? (
              <TerminalFrame title="~/loading" contentClassName="p-6 sm:p-12">
                <div className="flex justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full opacity-40"
                  />
                </div>
              </TerminalFrame>
            ) : (
              <>
                {/* Currently Watching */}
                {watching.length > 0 && (
                  <TerminalFrame
                    title="~/watching"
                    flush
                    className="mb-8"
                    contentClassName="p-3.5 sm:p-6"
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4"
                    >
                      {watching.map((anime, index) => (
                        <AnimeCard key={anime.id} anime={anime} index={index} />
                      ))}
                    </motion.div>
                  </TerminalFrame>
                )}

                {watching.length === 0 && (
                  <TerminalFrame title="~/empty" contentClassName="p-12">
                    <div className="text-center">
                      <span className="font-mono text-sm text-foreground opacity-40">
                        no anime in your list
                      </span>
                    </div>
                  </TerminalFrame>
                )}
              </>
            )}
          </div>
        </main>

        <Footer />
      </div>

      <BackToTop />
    </div>
  );
};

interface AnimeCardProps {
  anime: AnimeEntry;
  index: number;
}

const AnimeCard = ({ anime, index }: AnimeCardProps) => {
  return (
    <motion.a
      href={`https://anilist.co/anime/${anime.id}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative"
    >
      {/* Cover Image */}
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-foreground/10 shadow-lg">
        <img
          src={anime.coverImage}
          alt={anime.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

        {/* Info overlay on hover */}
        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-3 flex flex-col justify-between">
          <div>
            <h3 className="font-mono text-xs font-bold text-white line-clamp-3 mb-2">
              {anime.title}
            </h3>
          </div>

          <div className="space-y-2">
            {/* Progress */}
            {anime.totalEpisodes && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-white/80">
                  <span>ep {anime.progress}/{anime.totalEpisodes}</span>
                  <span>{Math.round((anime.progress / anime.totalEpisodes) * 100)}%</span>
                </div>
                <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{
                      width: `${(anime.progress / anime.totalEpisodes) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Score */}
            {anime.score > 0 && (
              <div className="flex items-center gap-1 text-[10px] font-mono text-white/80">
                <Star size={10} className="text-yellow-500" fill="currentColor" />
                <span>{anime.score}/10</span>
              </div>
            )}
          </div>
        </div>

        {/* Status badge */}
        <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm ${STATUS_COLORS[anime.status]}`}>
          <span className="font-mono text-[9px] font-bold">
            {STATUS_LABELS[anime.status]}
          </span>
        </div>
      </div>

      {/* Title below (always visible) */}
      <div className="mt-2">
        <p className="font-mono text-[10px] text-foreground opacity-60 line-clamp-2">
          {anime.title}
        </p>
      </div>
    </motion.a>
  );
};

export default AnimePage;
