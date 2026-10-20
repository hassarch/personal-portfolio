import { motion } from 'motion/react';
import TerminalFrame from '../TerminalFrame';
import { LEETCODE_USERNAME } from '@/constants/profile';
import LeetCodeHeatmap from './LeetCodeHeatmap';

const LeetCodeStatsTile = () => {
  return (
    <TerminalFrame
      title="~/leetcode"
      flush
      className="bento-tile"
      contentClassName="bento-tile-content"
    >
      <div className="flex h-full flex-col">
        <a
          href={`https://leetcode.com/${LEETCODE_USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bento-eyebrow hover:underline text-[#ffa116]"
        >
          $ leetcode activity --heatmap
        </a>

        <div className="flex flex-1 flex-col justify-center">
          <LeetCodeHeatmap username={LEETCODE_USERNAME} />
        </div>
      </div>
    </TerminalFrame>
  );
};

export default LeetCodeStatsTile;
