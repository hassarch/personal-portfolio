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
  0: 'bg-[#161b22]',
  1: 'bg-[#0e4429]',
  2: 'bg-[#006d32]',
  3: 'bg-[#26a641]',
  4: 'bg-[#39d353]',
};
const LEVEL_COLOR_BORDER: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: 'ring-[#30363d]',
  1: 'ring-[#0e4429]',
  2: 'ring-[#006d32]',
  3: 'ring-[#26a641]',
  4: 'ring-[#39d353]',
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
      <div className="flex flex-col gap-2">
        <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-foreground opacity-40">
          loading contributions…
        </div>
        <div className="flex gap-[2px]">
          {Array.from({ length: 52 }).map((_, col) => (
            <div key={col} className="flex flex-col gap-[2px]">
              {Array.from({ length: 7 }).map((_, row) => (
                <motion.div
                  key={`${col}-${row}`}
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: (col + row) * 0.01,
                  }}
                  className="w-[3px] h-[3px] rounded-[1px] bg-[#0e4429]"
                />
              ))}
            </div>
          ))}
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
    <div className="flex flex-col gap-2 select-none">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-foreground opacity-50">
          {totalContributions.toLocaleString()} contributions
        </span>
        <div className="flex items-center gap-1">
          <span className="font-mono text-[9px] uppercase tracking-wider text-foreground opacity-35">less</span>
          {[0, 1, 2, 3, 4].map((lvl) => (
            <div
              key={lvl}
              className={`w-[3px] h-[3px] rounded-[1px] ring-1 ring-white ring-opacity-10 ${LEVEL_COLOR[lvl as 0 | 1 | 2 | 3 | 4]}`}
            />
          ))}
          <span className="font-mono text-[9px] uppercase tracking-wider text-foreground opacity-35">more</span>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div className="flex gap-[3px]">
          <div className="flex flex-col gap-[2px] pt-[12px] pr-1">
            {DAY_LABELS.map((label, idx) => (
              <div
                key={idx}
                className="h-[3px] flex items-center justify-end"
                style={{ fontSize: '7px', lineHeight: '3px' }}
              >
                <span className="font-mono text-foreground opacity-25 leading-none">{label}</span>
              </div>
            ))}
          </div>

          <div className="relative flex gap-[2px]">
            <div className="flex gap-[2px] absolute -top-[12px] left-0 pointer-events-none">
              {monthPositions.map((pos, idx) => (
                <div
                  key={idx}
                  className="font-mono text-[7px] leading-none uppercase tracking-wider text-foreground opacity-25"
                  style={{
                    position: 'absolute',
                    left: `${pos.colIndex * 5}px`,
                  }}
                >
                  {pos.label}
                </div>
              ))}
            </div>

            {contributions.map((week, colIndex) => (
              <div key={colIndex} className="flex flex-col gap-[2px] relative">
                {week.days.map((day, rowIndex) => (
                  <motion.div
                    key={`${colIndex}-${rowIndex}`}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.25,
                      delay: (colIndex * 0.004) + (rowIndex * 0.002),
                      ease: 'easeOut',
                    }}
                    onMouseEnter={() => day.count > 0 && setHovered({ day, col: colIndex, row: rowIndex })}
                    onMouseLeave={() => setHovered(null)}
                    className={`w-[3px] h-[3px] rounded-[1px] transition-all duration-150 ring-1 ring-white ring-opacity-10 ${LEVEL_COLOR[day.level]} ${
                      hovered?.col === colIndex && hovered?.row === rowIndex
                        ? `ring-1 ${LEVEL_COLOR_BORDER[day.level]} ring-opacity-100 scale-150 z-10`
                        : ''
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
                  left: `${hovered.col * 5}px`,
                  bottom: `${(7 - hovered.row) * 5 + 6}px`,
                  transform: 'translateX(-50%)',
                }}
              >
                <div className="bg-background border border-foreground border-opacity-30 px-2 py-1 rounded whitespace-nowrap shadow-lg">
                  <div className="font-mono text-[10px] text-foreground">
                    <span className="font-bold">{hovered.day.count}</span>{' '}
                    <span className="opacity-60">
                      {hovered.day.count === 1 ? 'contribution' : 'contributions'}
                    </span>
                  </div>
                  <div className="font-mono text-[8px] uppercase tracking-wider text-foreground opacity-45">
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
