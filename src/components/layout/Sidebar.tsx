import { User, Settings, LogOut, TrendingUp, Award, Zap, Target } from 'lucide-react';

interface SidebarProps {
  playerName?: string;
  level?: number;
  xp?: number;
  achievements?: number;
  completedGames?: number;
}

export default function Sidebar({
  playerName = 'Player',
  level = 1,
  xp = 0,
  achievements = 0,
  completedGames = 0,
}: SidebarProps) {
  return (
    <aside className="flex flex-col gap-4 max-w-full md:max-w-none md:w-72 lg:w-80">
      {/* Player Profile Card */}
      <div className="glass-card rounded-2xl p-5 flex flex-col gap-4 border border-white/8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-gradient-to-br from-[#00D4FF]/20 to-[#8B5CF6]/20 border border-[#00D4FF]/30">
            👤
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-white truncate">{playerName}</h3>
            <p className="text-xs text-slate-400">Level {level}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/5">
          <button className="py-2 px-3 rounded-lg text-[10px] font-bold uppercase text-slate-300 bg-slate-800/50 hover:bg-slate-700/50 transition-colors flex items-center justify-center gap-1">
            <Settings size={12} /> Edit
          </button>
          <button className="py-2 px-3 rounded-lg text-[10px] font-bold uppercase text-slate-300 bg-slate-800/50 hover:bg-slate-700/50 transition-colors flex items-center justify-center gap-1">
            <LogOut size={12} /> Logout
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="glass-card rounded-2xl p-5 flex flex-col gap-4 border border-white/8">
        <div className="flex items-center gap-2 pb-3 border-b border-white/5">
          <TrendingUp size={14} className="text-[#00D4FF]" />
          <h3 className="text-xs font-bold font-display text-white uppercase tracking-wider">
            Statistik
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: '⚡', label: 'Total XP', value: xp, color: '[#00D4FF]' },
            { icon: '🏆', label: 'Level', value: level, color: '[#F59E0B]' },
            { icon: '🎮', label: 'Games', value: completedGames, suffix: '/7', color: '[#8B5CF6]' },
            { icon: '⭐', label: 'Badges', value: achievements, suffix: '/12', color: '[#10B981]' },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 p-3 rounded-xl bg-slate-800/50 border border-white/5 hover:border-white/10 transition-colors"
            >
              <span className="text-lg">{stat.icon}</span>
              <p className="text-[9px] text-slate-400 uppercase tracking-wide">{stat.label}</p>
              <p className={`text-sm font-bold text-${stat.color}`}>
                {stat.value}{stat.suffix || ''}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="glass-card rounded-2xl p-5 flex flex-col gap-3 border border-white/8">
        <div className="flex items-center gap-2 pb-3 border-b border-white/5">
          <Award size={14} className="text-[#8B5CF6]" />
          <h3 className="text-xs font-bold font-display text-white uppercase tracking-wider">
            Menu Cepat
          </h3>
        </div>
        <div className="flex flex-col gap-2">
          {[
            { icon: '🎓', label: 'Leaderboard', highlight: true },
            { icon: '📚', label: 'Learning Path' },
            { icon: '🏅', label: 'Achievements' },
            { icon: '⚙️', label: 'Settings' },
            { icon: '❓', label: 'Help & FAQ' },
          ].map((link, i) => (
            <button
              key={i}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                link.highlight
                  ? 'bg-[#00D4FF]/15 text-[#00D4FF] border border-[#00D4FF]/30 hover:bg-[#00D4FF]/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <span className="text-sm">{link.icon}</span>
              <span>{link.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Achievement Alert */}
      <div className="glass-card rounded-2xl p-4 flex flex-col gap-2 border border-emerald-500/20 bg-emerald-500/5">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎉</span>
          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
            Near next badge!
          </p>
        </div>
        <p className="text-[9px] text-slate-400">
          {50 - (xp % 50)} XP to unlock next achievement
        </p>
        <div className="w-full h-1.5 bg-slate-800/50 rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
            style={{ width: `${((xp % 50) / 50) * 100}%` }}
          />
        </div>
      </div>

      {/* Mobile-only collapsible info */}
      <div className="md:hidden glass-card rounded-2xl p-4 flex flex-col gap-2 border border-white/8 text-center">
        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Pro Tip</p>
        <p className="text-xs text-slate-300">
          Mainkan lebih banyak game untuk naik level dan unlock achievement eksklusif!
        </p>
      </div>
    </aside>
  );
}
