import { motion } from 'framer-motion';

const today = new Date();
const challengeDate = today.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });

export default function DailyChallenge() {
  return (
    <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#070B16]/80 to-[#0C1324]/90 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.32em] text-slate-400">Daily Challenge</h3>
          <p className="mt-2 text-sm text-slate-300">Tantangan cepat 5 soal yang berganti setiap hari.</p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-slate-200">{challengeDate}</span>
      </div>

      <div className="mt-5 grid gap-4">
        <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-bold text-white">Speed round: Quest data hybrid</p>
            <span className="text-[11px] text-slate-400 uppercase tracking-[0.28em]">x2 XP</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">Selesaikan 5 soal dalam 120 detik, dapatkan fire streak dan exclusive badge malam ini.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-3xl bg-slate-950/80 p-4 border border-white/10">
            <h4 className="text-[11px] uppercase tracking-[0.32em] text-slate-400">Target Hari Ini</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>• 3 soal Data Sorter</li>
              <li>• 1 soal Prompt Wizard</li>
              <li>• 1 soal Ethical Judge</li>
            </ul>
          </div>
          <div className="rounded-3xl bg-slate-950/80 p-4 border border-white/10">
            <h4 className="text-[11px] uppercase tracking-[0.32em] text-slate-400">Rewards</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>• +150 XP</li>
              <li>• Badge "Streak Flame"</li>
              <li>• Unlock Codex hint</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
