import { useState } from 'react';
import { Menu, X, Zap, Star, Trophy } from 'lucide-react';

interface HeaderProps {
  xp?: number;
  level?: number;
  playerName?: string;
  achievements?: number;
}

export default function Header({
  xp = 0,
  level = 1,
  playerName = 'Player',
  achievements = 0,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-slate-950/95 via-slate-900/95 to-slate-950/95 backdrop-blur-lg border-b border-white/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main header row */}
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Branding */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-lg sm:text-xl flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #00D4FF, #8B5CF6)',
                boxShadow: '0 0 12px rgba(0,212,255,0.4)',
              }}
            >
              🤖
            </div>
            <div className="hidden xs:block">
              <h1 className="text-xs sm:text-sm font-black font-display tracking-wider text-white leading-tight">
                AI ARENA
              </h1>
              <p className="text-[8px] sm:text-[9px] text-slate-500 font-mono tracking-widest uppercase">
                Academy
              </p>
            </div>
          </div>

          {/* Desktop Navigation & Stats */}
          <div className="hidden md:flex items-center gap-6 flex-1 justify-end ml-6">
            {/* Stats Group */}
            <div className="flex items-center gap-4 px-4 py-2 rounded-lg bg-slate-800/40 border border-white/6">
              <div className="flex items-center gap-1.5">
                <Zap size={14} className="text-[#00D4FF]" />
                <span className="text-xs sm:text-sm font-bold font-mono text-[#00D4FF]">{xp}</span>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-1.5">
                <Trophy size={14} className="text-[#F59E0B]" />
                <span className="text-xs sm:text-sm font-bold font-mono text-[#F59E0B]">Lv.{level}</span>
              </div>
            </div>

            {/* Player Badge */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-[#00D4FF]/30 bg-[#00D4FF]/10">
              <Star size={14} className="text-[#00D4FF]" />
              <span className="text-xs font-semibold text-[#00D4FF] truncate max-w-[120px]">
                {playerName}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">{achievements} badges</span>
            </div>
          </div>

          {/* Mobile Stats */}
          <div className="flex md:hidden items-center gap-3 flex-1 justify-end ml-3">
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/40">
              <Zap size={12} className="text-[#00D4FF]" />
              <span className="text-xs font-bold font-mono text-[#00D4FF]">{xp}</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/40">
              <Trophy size={12} className="text-[#F59E0B]" />
              <span className="text-xs font-bold font-mono text-[#F59E0B]">L{level}</span>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden w-9 h-9 ml-3 rounded-lg border border-white/8 bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile Expanded Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/8 bg-slate-900/50 py-4 px-4 space-y-3">
            <div className="space-y-2">
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">
                Player Info
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/40 border border-white/6">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{playerName}</p>
                  <p className="text-[9px] text-slate-400">Level {level}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-[#00D4FF]">{xp} XP</p>
                  <p className="text-[9px] text-slate-400">{achievements} badges</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button className="flex-1 py-2 px-3 rounded-lg text-[10px] font-bold uppercase text-white bg-slate-800/60 hover:bg-slate-700/60 transition-colors">
                Profile
              </button>
              <button className="flex-1 py-2 px-3 rounded-lg text-[10px] font-bold uppercase text-white bg-slate-800/60 hover:bg-slate-700/60 transition-colors">
                Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
