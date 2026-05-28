import { motion } from 'framer-motion';

interface LevelUpOverlayProps {
  visible: boolean;
  levelTitle: string;
  onClose: () => void;
}

export default function LevelUpOverlay({ visible, levelTitle, onClose }: LevelUpOverlayProps) {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 p-4"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="relative w-full max-w-xl rounded-[2rem] border border-white/10 bg-[#070A14]/90 p-8 text-center shadow-[0_40px_120px_rgba(0,0,0,0.4)]"
      >
        <h2 className="text-4xl font-black text-white font-display tracking-[0.12em]">LEVEL UP!</h2>
        <p className="mt-4 text-sm text-slate-300">Kamu kini naik level dan membuka kemampuan baru di AI Arena.</p>
        <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-slate-950/80 px-5 py-3 text-sm text-slate-100 border border-white/10">
          <span className="text-[#00D4FF] font-black">{levelTitle}</span>
        </div>
        <button
          onClick={onClose}
          className="mt-8 rounded-full bg-gradient-to-r from-[#00D4FF] via-[#8B5CF6] to-[#10B981] px-6 py-3 text-sm font-black uppercase tracking-[0.24em] text-slate-950 transition hover:brightness-110"
        >
          Tutup
        </button>
      </motion.div>
    </motion.div>
  );
}
