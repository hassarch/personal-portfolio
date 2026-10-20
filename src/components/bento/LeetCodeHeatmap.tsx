import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface SubmissionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface SubmissionWeek {
  days: SubmissionDay[];
}

interface LeetCodeHeatmapProps {
  username: string;
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

// LeetCode-themed colors (orange/yellow palette)
const LEVEL_COLOR: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: 'bg-[#2d2d2d]',
  1: 'bg-[#6b4503]',
  2: 'bg-[#9d6a0f]',
  3: 'bg-[#d89614]',
  4: 'bg-[#ffa116]',
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const getMonthLabelPositions = (weeks: SubmissionWeek[]): Array<{ label: string; colIndex: number }> => {
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

// Generate submission data for the past year
const generateSubmissionData = (): SubmissionWeek[] => {
  const weeks: SubmissionWeek[] = [];
  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  // Start from the most recent Sunday
  const mostRecentSunday = new Date(today);
  mostRecentSunday.setDate(today.getDate() - today.getDay());

  let currentDate = new Date(oneYearAgo);
  // Adjust to the Sunday of the start week
  currentDate.setDate(currentDate.getDate() - currentDate.getDay());

  while (currentDate <= mostRecentSunday) {
    const week: SubmissionDay[] = [];
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(currentDate);
      dayDate.setDate(currentDate.getDate() + i);

      // Generate semi-realistic submission patterns
      const isWeekend = dayDate.getDay() === 0 || dayDate.getDay() === 6;
      const isFuture = dayDate > today;
      
      let count = 0;
      if (!isFuture) {
        // More likely to solve on weekends
        const baseProbability = isWeekend ? 0.6 : 0.4;
        if (Math.random() < baseProbability) {
          count = Math.floor(Math.random() * 8) + 1; // 1-8 problems
        }
      }

      // Calculate level based on count
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count === 0) level = 0;
      else if (count <= 2) level = 1;
      else if (count <= 4) level = 2;
      else if (count <= 6) level = 3;
      else level = 4;

      week.push({
        date: dayDate.toISOString().split('T')[0],
        count,
        level,
      });
    }
    weeks.push({ days: week });
    currentDate.setDate(currentDate.getDate() + 7);
  }

  return weeks;
};

const LeetCodeHeatmap = ({ username }: LeetCodeHeatmapProps) => {
  const [submissions, setSubmissions] = useState<SubmissionWeek[]>([]);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState<{ day: SubmissionDay; col: number; row: number } | null>(null);

  useEffect(() => {
    // Simulate API call - in production, replace with actual LeetCode API
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        // Generate mock data - replace with actual API call
        const data = generateSubmissionData();
        setSubmissions(data);
        
        const total = data.reduce(
          (sum, week) => sum + week.days.reduce((s, day) => s + day.count, 0),
          0
        );
        setTotalSubmissions(total);
      } catch (error) {
        console.error('Error fetching LeetCode submissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [username]);

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        <div className="font-mono text-[10px] text-foreground opacity-40">
          loading submissions…
        </div>
        <div className="flex gap-[3px]">
          {Array.from({ length: 52 }).map((_, col) => (
            <div key={col} className="flex flex-col gap-[3px]">
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
                  className="w-[8px] h-[8px] rounded-full bg-[#6b4503]"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!submissions || submissions.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-foreground opacity-40">
          [ no submission data ]
        </span>
      </div>
    );
  }

  const monthPositions = getMonthLabelPositions(submissions);

  return (
    <div className="flex flex-col gap-3 select-none">
      <div className="flex items-center justify-between text-[#eceae4]/40">
        <span className="font-mono text-[10px]">
          {totalSubmissions.toLocaleString()} submissions in the last year
        </span>
        <span className="font-mono text-[10px]">each dot is a day</span>
      </div>

      <div className="relative overflow-x-auto pb-2">
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

            {submissions.map((week, colIndex) => (
              <div key={colIndex} className="flex flex-col gap-[3px] relative">
                {week.days.map((day, rowIndex) => (
                  <motion.div
                    key={`${colIndex}-${rowIndex}`}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.3,
                      delay: (colIndex * 0.003) + (rowIndex * 0.001),
                      ease: 'easeOut',
                    }}
                    onMouseEnter={() => setHovered({ day, col: colIndex, row: rowIndex })}
                    onMouseLeave={() => setHovered(null)}
                    className={`w-[8px] h-[8px] rounded-full transition-all duration-200 ${LEVEL_COLOR[day.level]} ${
                      hovered?.col === colIndex && hovered?.row === rowIndex
                        ? 'scale-[1.5] z-10 ring-2 ring-white ring-opacity-50'
                        : day.level > 0 ? 'hover:scale-110' : ''
                    }`}
                    role="img"
                    aria-label={`${formatDate(day.date)}: ${day.count} submissions`}
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
                      {hovered.day.count === 1 ? 'submission' : 'submissions'}
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

export default LeetCodeHeatmap;
