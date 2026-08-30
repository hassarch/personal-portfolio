import { Star, Book, GitPullRequest, Users } from 'lucide-react';
import { motion } from 'motion/react';
import TerminalFrame from '../TerminalFrame';
import { useGithubStats } from '@/hooks/useGithubStats';
import { useGithubContributions } from '@/hooks/useGithubContributions';
import { useCountUp } from '@/hooks/useCountUp';
import { GITHUB_URL } from '@/constants/profile';
import ContributionHeatmap from './ContributionHeatmap';

interface StatDef {
  label: string;
  icon: React.ReactNode;
  value: number | null;
}

/**
 * Bento tile showing live public GitHub stats with count-up numbers.
 * Monochrome by design — the reference site uses colored dot glyphs, which
 * would break this palette, so lucide icons at low opacity stand in.
 */
const GithubStatsTile = () => {
  const { stats, loading, error } = useGithubStats();
  const { contributions, totalContributions, loading: contribLoading, error: contribError } = useGithubContributions();

  const items: StatDef[] = [
    { label: 'stars', icon: <Star size={14} />, value: stats?.stars ?? null },
    { label: 'repos', icon: <Book size={14} />, value: stats?.repos ?? null },
    { label: 'PRs', icon: <GitPullRequest size={14} />, value: stats?.pullRequests ?? null },
    { label: 'squad', icon: <Users size={14} />, value: stats?.followers ?? null },
  ];

  return (
    <TerminalFrame
      title="~/github"
      flush
      className="bento-tile"
      contentClassName="bento-tile-content"
    >
      <div className="flex h-full flex-col">
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="bento-eyebrow hover:underline"
        >
          $ gh stats --user
        </a>

        {error ? (
          <div className="flex flex-1 items-center justify-center">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-foreground opacity-50">
              [ offline ]
            </span>
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-4 justify-center">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {items.map((item) => (
                <Stat key={item.label} {...item} loading={loading} />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="border-t border-foreground border-opacity-10 pt-3"
            >
              <div className="mb-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-foreground opacity-40">
                  $ gh activity --heatmap
                </span>
              </div>
              <ContributionHeatmap
                contributions={contributions}
                loading={contribLoading}
                error={contribError}
                totalContributions={totalContributions}
              />
            </motion.div>
          </div>
        )}
      </div>
    </TerminalFrame>
  );
};

const Stat = ({
  label,
  icon,
  value,
  loading,
}: StatDef & { loading: boolean }) => {
  const displayed = useCountUp({ target: value });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-2"
    >
      <span className="text-foreground opacity-40" aria-hidden="true">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="bento-value text-xl">
          {loading ? (
            <span className="opacity-30">--</span>
          ) : (
            displayed
          )}
        </p>
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-foreground opacity-60">
          {label}
        </p>
      </div>
    </motion.div>
  );
};

export default GithubStatsTile;
