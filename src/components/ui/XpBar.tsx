import { motion } from 'framer-motion';

interface XpBarProps {
  xp: number;
  nextLevelXp: number;
  levelTitle: string;
}

export default function XpBar({ xp, nextLevelXp, levelTitle }: XpBarProps) {
  const normalized = Math.min(100, Math.max(6, Math.round((xp / nextLevelXp) * 100)));

  return (
    <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-4 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.32em] text-slate-400">Progress XP</p>
          <h4 className="mt-2 text-lg font-black text-white font-display">{levelTitle}</h4>
        </div>
        <div className="text-right text-sm font-semibold text-slate-200">{xp} / {nextLevelXp} XP</div>
      </div>

      <div className="mt-5 rounded-full bg-white/5 p-[3px]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${normalized}%` }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="h-3 rounded-full bg-gradient-to-r from-[#00D4FF] via-[#8B5CF6] to-[#00D4FF] shadow-[0_0_20px_rgba(0,212,255,0.3)]"
        />
      </div>
    </div>
  );
}
