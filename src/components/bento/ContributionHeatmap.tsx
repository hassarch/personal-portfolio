import { useState } from 'react';
import { motion } from 'motion/react';
import type { ContributionWeek, ContributionDay } from '@/hooks/useGithubContributions';

interface ContributionHeatmapProps {
  contributions: ContributionWeek[];
  loading: boolean;
  error: boolean;
  totalContributions: number;
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

const LEVEL_COLOR: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: 'bg-[#2d2d2d]',
  1: 'bg-[#0e4429]',
  2: 'bg-[#006d32]',
  3: 'bg-[#26a641]',
  4: 'bg-[#39d353]',
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const getMonthLabelPositions = (weeks: ContributionWeek[]): Array<{ label: string; colIndex: number }> => {
  const positions: Array<{ label: string; colIndex: number }> = [];
  let lastMonth = -1;

  weeks.forEach((week, colIndex) => {
    const firstDay = week.days[0];
    if (!firstDay) return;
    const month = new Date(firstDay.date).getMonth();
    if (month !== lastMonth) {
      positions.push({ label: MONTH_LABELS[month], colIndex });
      lastMonth = month;
    }
  });

  return positions;
};

const ContributionHeatmap = ({
  contributions,
  loading,
  error,
  totalContributions,
}: ContributionHeatmapProps) => {
  const [hovered, setHovered] = useState<{ day: ContributionDay; col: number; row: number } | null>(null);

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        <div className="font-mono text-[10px] text-foreground opacity-40">
          loading contributions…
        </div>
        <div className="relative overflow-x-auto pb-2 scrollbar-thin">
          <div className="flex gap-[3px] min-w-max animate-pulse">
            {Array.from({ length: 52 }).map((_, col) => (
              <div key={col} className="flex flex-col gap-[3px]">
                {Array.from({ length: 7 }).map((_, row) => (
                  <div
                    key={`${col}-${row}`}
                    className="w-[8px] h-[8px] rounded-full bg-[#0e4429]/40"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !contributions || contributions.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-foreground opacity-40">
          [ no contrib data ]
        </span>
      </div>
    );
  }

  const monthPositions = getMonthLabelPositions(contributions);

  return (
    <div className="flex flex-col gap-3 select-none">
      <div className="flex items-center justify-between font-mono text-[10px] text-foreground opacity-50">
        <span>
          {totalContributions.toLocaleString()} contributions in the last year
        </span>
      </div>

      <div className="relative overflow-x-auto pb-2 scrollbar-thin">
        <div className="flex gap-[3px] min-w-max">
          <div className="relative flex gap-[3px]">
            {/* Month labels */}
            <div className="flex gap-[3px] absolute -top-[18px] left-0 pointer-events-none">
              {monthPositions.map((pos, idx) => (
                <div
                  key={idx}
                  className="font-mono text-[10px] lowercase tracking-wide text-foreground opacity-50"
                  style={{
                    position: 'absolute',
                    left: `${pos.colIndex * 11}px`,
                  }}
                >
                  {pos.label.toLowerCase()}
                </div>
              ))}
            </div>

            {contributions.map((week, colIndex) => (
              <div key={colIndex} className="flex flex-col gap-[3px] relative">
                {week.days.map((day, rowIndex) => (
                  <div
                    key={`${colIndex}-${rowIndex}`}
                    onMouseEnter={() => setHovered({ day, col: colIndex, row: rowIndex })}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => setHovered(prev => (prev?.col === colIndex && prev?.row === rowIndex ? null : { day, col: colIndex, row: rowIndex }))}
                    className={`w-[8px] h-[8px] rounded-full transition-transform duration-150 cursor-pointer ${LEVEL_COLOR[day.level]} ${
                      hovered?.col === colIndex && hovered?.row === rowIndex
                        ? 'scale-[1.5] z-10 ring-2 ring-white ring-opacity-50'
                        : day.level > 0 ? 'hover:scale-125' : ''
                    }`}
                    role="img"
                    aria-label={`${formatDate(day.date)}: ${day.count} contributions`}
                  />
                ))}
              </div>
            ))}

            {hovered && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute pointer-events-none z-20"
                style={{
                  left: `${hovered.col * 11}px`,
                  bottom: `${(7 - hovered.row) * 11 + 12}px`,
                  transform: 'translateX(-50%)',
                }}
              >
                <div className="bg-[#1a1a1a] border border-[#eceae4]/20 px-2.5 py-1.5 rounded-md whitespace-nowrap shadow-xl">
                  <div className="font-mono text-[10px] text-[#eceae4]">
                    <span className="font-bold">{hovered.day.count}</span>{' '}
                    <span className="opacity-60">
                      {hovered.day.count === 1 ? 'contribution' : 'contributions'}
                    </span>
                  </div>
                  <div className="font-mono text-[9px] text-[#eceae4] opacity-50">
                    {formatDate(hovered.day.date)}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributionHeatmap;
