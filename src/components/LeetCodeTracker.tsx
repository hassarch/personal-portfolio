import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Code2, Trophy, Flame, Target } from 'lucide-react';

interface LeetCodeStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking: number;
  acceptanceRate: number;
  recentSubmissions?: number;
}

interface LeetCodeTrackerProps {
  username?: string;
}

const LeetCodeTracker = ({ username = 'has_san' }: LeetCodeTrackerProps) => {
  const [stats, setStats] = useState<LeetCodeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchLeetCodeStats = async () => {
      try {
        setLoading(true);
        setError(false);
        
        // Using LeetCode GraphQL API through a proxy or direct fetch
        const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
        
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        
        setStats({
          totalSolved: data.totalSolved || 0,
          easySolved: data.easySolved || 0,
          mediumSolved: data.mediumSolved || 0,
          hardSolved: data.hardSolved || 0,
          ranking: data.ranking || 0,
          acceptanceRate: data.acceptanceRate || 0,
          recentSubmissions: data.recentSubmissions || 0,
        });
      } catch (err) {
        console.error('Error fetching LeetCode stats:', err);
        setError(true);
        // Fallback to mock data for display
        setStats({
          totalSolved: 150,
          easySolved: 80,
          mediumSolved: 55,
          hardSolved: 15,
          ranking: 125000,
          acceptanceRate: 65.5,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLeetCodeStats();
  }, [username]);

  if (loading) {
    return (
      <div className="rounded-lg border border-[#eceae4]/20 bg-[#161616]/50 p-4">
        <div className="flex items-center gap-2 text-sm text-[#eceae4]/60">
          <Code2 size={16} className="animate-pulse" />
          <span className="font-mono">loading leetcode stats...</span>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return null;
  }

  const difficulties = [
    { label: 'Easy', count: stats.easySolved, color: '#00b8a3', icon: '○' },
    { label: 'Medium', count: stats.mediumSolved, color: '#ffc01e', icon: '◐' },
    { label: 'Hard', count: stats.hardSolved, color: '#ef4743', icon: '●' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, type: 'spring', stiffness: 300, damping: 24 }}
      className="rounded-lg border border-[#eceae4]/20 bg-[#161616]/50 p-4 backdrop-blur-sm"
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 size={16} className="text-[#ffa116]" />
          <span className="font-mono text-xs font-bold text-[#eceae4]">
            LEETCODE
          </span>
        </div>
        <a
          href={`https://leetcode.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-[#eceae4]/60 transition-colors hover:text-[#ffa116]"
        >
          @{username} →
        </a>
      </div>

      {/* Total Solved - Large Display */}
      <div className="mb-4 flex items-end gap-2">
        <div className="flex items-baseline gap-1">
          <span className="font-mono text-3xl font-bold text-[#ffa116]">
            {stats.totalSolved}
          </span>
          <span className="font-mono text-sm text-[#eceae4]/60">problems</span>
        </div>
        {stats.recentSubmissions !== undefined && stats.recentSubmissions > 0 && (
          <div className="mb-1 flex items-center gap-1 text-xs text-[#00b8a3]">
            <Flame size={12} />
            <span className="font-mono">{stats.recentSubmissions} this week</span>
          </div>
        )}
      </div>

      {/* Difficulty Breakdown */}
      <div className="mb-3 space-y-2">
        {difficulties.map((diff) => (
          <div key={diff.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg" style={{ color: diff.color }}>
                {diff.icon}
              </span>
              <span className="font-mono text-xs text-[#eceae4]/60">
                {diff.label}
              </span>
            </div>
            <span className="font-mono text-sm font-bold" style={{ color: diff.color }}>
              {diff.count}
            </span>
          </div>
        ))}
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between border-t border-[#eceae4]/10 pt-3">
        <div className="flex items-center gap-1.5">
          <Trophy size={12} className="text-[#ffa116]" />
          <span className="font-mono text-xs text-[#eceae4]/60">
            Rank: <span className="text-[#eceae4]">{stats.ranking.toLocaleString()}</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Target size={12} className="text-[#00b8a3]" />
          <span className="font-mono text-xs text-[#eceae4]/60">
            {stats.acceptanceRate.toFixed(1)}%
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default LeetCodeTracker;
