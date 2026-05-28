import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

export interface GameCardProps {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  themeColor: string;
  icon: LucideIcon | string;
  xpBadge: string;
  onClick: () => void;
}

export default function GameCard({ id, title, subtitle, description, themeColor, icon, xpBadge, onClick }: GameCardProps) {
  const Icon = typeof icon === 'string' ? null : icon;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      onClick={onClick}
      className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-5 text-left shadow-[0_25px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-all hover:border-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-blue"
      aria-label={`Mainkan ${title}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.15),_transparent_40%)] opacity-70 pointer-events-none"></div>
      <div className="relative z-10 flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-white/10" style={{ backgroundColor: `${themeColor}1A` }}>
          {Icon ? <Icon className="text-2xl" /> : <span className="text-3xl">{icon}</span>}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black uppercase tracking-[0.24em] text-white font-display">{title}</h3>
              <p className="mt-1 text-[11px] uppercase tracking-[0.26em] text-slate-400">{subtitle}</p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-slate-200">{xpBadge}</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-300">{description}</p>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-0 right-0 h-24 w-24 rounded-full opacity-20 blur-2xl" style={{ background: themeColor }} />
    </motion.button>
  );
}
