import { motion } from 'motion/react';
import TerminalFrame from '../TerminalFrame';
import { useGithubContributions } from '@/hooks/useGithubContributions';
import { GITHUB_URL } from '@/constants/profile';
import ContributionHeatmap from './ContributionHeatmap';

/**
 * Bento tile showing GitHub contribution heatmap
 */
const GithubStatsTile = () => {
  const { contributions, totalContributions, loading: contribLoading, error: contribError } = useGithubContributions();

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
          $ gh activity --heatmap
        </a>

        <div className="flex flex-1 flex-col justify-center">
          <ContributionHeatmap
            contributions={contributions}
            loading={contribLoading}
            error={contribError}
            totalContributions={totalContributions}
          />
        </div>
      </div>
    </TerminalFrame>
  );
};

export default GithubStatsTile;
