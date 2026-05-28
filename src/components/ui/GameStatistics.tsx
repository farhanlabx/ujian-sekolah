import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Zap, Award, Target, Clock } from 'lucide-react';

interface GameStat {
  gameId: string;
  gameName: string;
  attempts: number;
  wins: number;
  totalXpEarned: number;
  bestTime: number;
  avgScore: number;
  lastPlayed: string;
}

interface StatsData {
  [gameId: string]: GameStat;
}

export const useGameStats = () => {
  const [stats, setStats] = useState<StatsData>(() => {
    const cached = localStorage.getItem('gameStats');
    return cached ? JSON.parse(cached) : {};
  });

  useEffect(() => {
    localStorage.setItem('gameStats', JSON.stringify(stats));
  }, [stats]);

  const recordGamePlay = (
    gameId: string,
    gameName: string,
    won: boolean,
    xpEarned: number,
    timeTaken: number = 0
  ) => {
    setStats(prev => {
      const current = prev[gameId] || {
        gameId,
        gameName,
        attempts: 0,
        wins: 0,
        totalXpEarned: 0,
        bestTime: Infinity,
        avgScore: 0,
        lastPlayed: new Date().toISOString(),
      };

      return {
        ...prev,
        [gameId]: {
          ...current,
          attempts: current.attempts + 1,
          wins: won ? current.wins + 1 : current.wins,
          totalXpEarned: current.totalXpEarned + xpEarned,
          bestTime: timeTaken > 0 ? Math.min(current.bestTime, timeTaken) : current.bestTime,
          avgScore: (current.totalXpEarned + xpEarned) / (current.attempts + 1),
          lastPlayed: new Date().toISOString(),
        },
      };
    });
  };

  const getGameStats = (gameId: string): GameStat | null => {
    return stats[gameId] || null;
  };

  const getAllStats = (): GameStat[] => {
    return Object.values(stats);
  };

  const getOverallStats = () => {
    const allStats = Object.values(stats);
    return {
      totalGamesPlayed: allStats.reduce((sum, s) => sum + s.attempts, 0),
      totalWins: allStats.reduce((sum, s) => sum + s.wins, 0),
      totalXp: allStats.reduce((sum, s) => sum + s.totalXpEarned, 0),
      winRate: allStats.length > 0
        ? Math.round((allStats.reduce((sum, s) => sum + s.wins, 0) / allStats.reduce((sum, s) => sum + s.attempts, 0)) * 100)
        : 0,
    };
  };

  return {
    stats,
    recordGamePlay,
    getGameStats,
    getAllStats,
    getOverallStats,
  };
};

export default function GameStatistics() {
  const { getAllStats, getOverallStats } = useGameStats();
  const allStats = getAllStats();
  const overall = getOverallStats();

  if (allStats.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center border border-white/8">
        <BarChart3 size={48} className="mx-auto mb-4 text-[#8B5CF6] opacity-50" />
        <p className="text-slate-400">Mainkan game untuk melihat statistik</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Target, label: 'Total Dimainkan', value: overall.totalGamesPlayed, color: '[#00D4FF]' },
          { icon: Award, label: 'Total Kemenangan', value: overall.totalWins, color: '[#10B981]' },
          { icon: Zap, label: 'Total XP', value: overall.totalXp, color: '[#F59E0B]' },
          { icon: TrendingUp, label: 'Win Rate', value: `${overall.winRate}%`, color: '[#8B5CF6]' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="glass-card rounded-xl p-4 border border-white/8 flex flex-col gap-2"
            >
              <Icon size={18} className={`text-${stat.color}`} />
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className={`text-xl font-bold text-${stat.color}`}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Per-Game Stats */}
      <div className="glass-card rounded-2xl p-6 border border-white/8">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <BarChart3 size={16} />
          Statistik Per Game
        </h3>

        <div className="space-y-3">
          {allStats.map((stat) => (
            <div
              key={stat.gameId}
              className="p-4 rounded-lg bg-slate-800/40 border border-white/6 hover:border-white/10 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{stat.gameName}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Dimainkan {stat.lastPlayed ? new Date(stat.lastPlayed).toLocaleDateString('id-ID') : 'Unknown'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div className="text-center p-2 rounded bg-slate-900/50">
                  <p className="text-[10px] text-slate-500">Attempts</p>
                  <p className="text-sm font-bold text-[#00D4FF]">{stat.attempts}</p>
                </div>
                <div className="text-center p-2 rounded bg-slate-900/50">
                  <p className="text-[10px] text-slate-500">Wins</p>
                  <p className="text-sm font-bold text-[#10B981]">{stat.wins}</p>
                </div>
                <div className="text-center p-2 rounded bg-slate-900/50">
                  <p className="text-[10px] text-slate-500">XP</p>
                  <p className="text-sm font-bold text-[#F59E0B]">{stat.totalXpEarned}</p>
                </div>
                <div className="text-center p-2 rounded bg-slate-900/50">
                  <p className="text-[10px] text-slate-500">Rate</p>
                  <p className="text-sm font-bold text-[#8B5CF6]">
                    {stat.attempts > 0 ? Math.round((stat.wins / stat.attempts) * 100) : 0}%
                  </p>
                </div>
              </div>

              {stat.bestTime < Infinity && (
                <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-400">
                  <Clock size={12} />
                  <span>Best Time: {stat.bestTime.toFixed(1)}s</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
