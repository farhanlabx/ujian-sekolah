import React, { useState } from 'react';
import { sfx } from './AudioEngine';
import { Scale, Check, HelpCircle, ShieldClose, BookOpen } from 'lucide-react';
import { JudgeDilemma } from '../types';

interface EthicalJudgeProps {
  onComplete: (xp: number, badgeId?: string) => void;
  onActionScore: (isCorrect: boolean) => void;
}

const DILEMMAS: JudgeDilemma[] = [
  {
    id: 'eth_1',
    title: "1. Keputusan Kredit Automatis Bank Mandiri",
    scenario: "Sistem scoring kredit AI otomatis menolak pengajuan kredit kepemilikan apartemen seorang wanita karena ia tinggal di kawasan dengan rata-rata ekonomi menengah ke bawah, meskipun tabungannya melimpah.",
    actor: "Terdakwa: Kredit Bot V.1",
    imageEmoji: "🏢",
    options: [
      {
        text: "ADIL ⚖️ (Izinkan Model Lulus)",
        type: 'Adil',
        xpReward: 50,
        explanation: "Lulus? Wah, ini mempromosikan bias wilayah (Geographic Redlining). AI melestarikan kemiskinan sistemik wilayah tanpa menilai variabel individual pemohon secara jujur!"
      },
      {
        text: "BIAS ⚠️ (Butuh Regulasi / Ajarkan Ulang)",
        type: 'Bias',
        xpReward: 150,
        explanation: "Keren! Kamu mendeteksi Bias Data. AI mandiri harus dilarang berasumsi murni dari korelasi alamat tempat tinggal; mereka patut menimbang kemampuan individu!"
      },
      {
        text: "TIDAK ETIS ❌ (Blokir Penerapan Sistem)",
        type: 'Tidak Etis',
        xpReward: 100,
        explanation: "Bisa dipahami, tindakan memblokir langsung menjamin keselamatan warga. Tetapi langkah koreksi data bias (retraining) adalah opsi adaptif paling ideal dalam siklus AI."
      }
    ]
  },
  {
    id: 'eth_2',
    title: "2. Penyaringan Berkas Lamaran Pekerjaan di Google",
    scenario: "Model AI rekrutmen menyortir ratusan portofolio dan otomatis memprioritaskan pelamar berkode gender laki-laki karena ia berlatih menggunakan data CV lama dari tahun 2000-an yang didominasi pria.",
    actor: "Terdakwa: HR Recruiter Bot",
    imageEmoji: "💼",
    options: [
      {
        text: "ADIL ⚖️ (Lulus Model Rekrutmen)",
        type: 'Adil',
        xpReward: 50,
        explanation: "Fatal! Ini merupakan Diskriminasi Gender Historis (Gender Bias). Data tahun 2000-an melenceng dari prinsip inklusivitas modern dan melanggar sportivitas kerja!"
      },
      {
        text: "BIAS ⚠️ (Wajib Bersihkan Bias Sejarah)",
        type: 'Bias',
        xpReward: 150,
        explanation: "Tepat sekali, Hakim Agung! Data sejarah sering menderita bias struktural. Dataset harus dibersihkan terlebih dahulu, diseimbangkan posisinya, lalu dilatih ulang."
      },
      {
        text: "TIDAK ETIS ❌ (Hapus Penggunaan AI Rekrutmen)",
        type: 'Tidak Etis',
        xpReward: 100,
        explanation: "Tembakan tegas tetapi radikal. Walau AI lama terbukti bias, menerapkan audit keterbukaan (Explainable AI) masih layak dicoba dibanding langsung menggulungnya."
      }
    ]
  }
];

export default function EthicalJudge({ onComplete, onActionScore }: EthicalJudgeProps) {
  const [dilemmaIndex, setDilemmaIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [accumulatedXp, setAccumulatedXp] = useState(0);

  const dilemma = DILEMMAS[dilemmaIndex];

  const handleJudgeDecision = (index: number) => {
    if (answered) return;
    setSelectedOption(index);
    setAnswered(true);

    const isFairChoice = dilemma.options[index].type === 'Bias'; // Suggesting data analysis is optimal feedback
    onActionScore(isFairChoice);

    sfx.play(isFairChoice ? 'correct' : 'wrong');
    setAccumulatedXp(prev => prev + dilemma.options[index].xpReward);
  };

  const handleNext = () => {
    setAnswered(false);
    setSelectedOption(null);

    if (dilemmaIndex + 1 < DILEMMAS.length) {
      setDilemmaIndex(prev => prev + 1);
    } else {
      // Complete ethical dilemmas
      onComplete(accumulatedXp, 'ethical_thinker');
    }
  };

  return (
    <div id="ethical_judge_court" className="p-6 bg-[#111827] rounded-3xl border border-slate-800 text-slate-100 flex flex-col gap-6 max-h-[640px] overflow-y-auto">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black font-display text-rose-500 tracking-wider uppercase flex items-center gap-2">
            ⚖️ Ethical AI Judge
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Konsep: <span className="text-[#8B5CF6] font-mono">Algorithmic Biases, Inclusivity, Fairness, and Transparent AI</span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono bg-rose-500/10 text-rose-400 border border-slate-800 px-3.5 py-1.5 rounded-xl">
          Sidang: {dilemmaIndex + 1}/{DILEMMAS.length} 👨‍⚖️
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Court courtroom caricature avatar placeholder */}
        <div className="md:col-span-1 bg-[#0A0E1A] p-4 rounded-2xl border border-rose-500/30 flex flex-col items-center justify-center text-center gap-2 shadow-inner">
          <div className="text-5xl select-none">{dilemma.imageEmoji}</div>
          <div className="font-mono text-[9px] text-rose-400 uppercase tracking-widest font-black">{dilemma.actor}</div>
          <Scale size={32} className="text-rose-500/60 mt-1 animate-pulse" />
        </div>

        {/* Legal scenario statement speechbubble */}
        <div className="md:col-span-3 flex flex-col gap-3">
          <h3 className="text-base font-bold text-white font-display uppercase tracking-tight">{dilemma.title}</h3>
          <p className="text-sm italic text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-850">
            "{dilemma.scenario}"
          </p>
        </div>
      </div>

      {/* Judgment Choice Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {dilemma.options.map((opt, idx) => {
          const isSelected = selectedOption === idx;

          return (
            <button
              disabled={answered}
              key={idx}
              onClick={() => handleJudgeDecision(idx)}
              className={`p-4 rounded-xl text-left border text-xs font-bold leading-normal transition-all relative flex flex-col gap-2 cursor-pointer ${
                answered
                  ? isSelected 
                    ? opt.type === 'Bias' 
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300' 
                      : 'bg-rose-500/10 border-rose-500 text-rose-300'
                    : 'bg-slate-900 border-slate-950 opacity-45'
                  : 'bg-[#1a2333]/50 border-slate-800 hover:border-rose-400 hover:bg-[#1a2333]'
              }`}
            >
              <span className={`text-[10px] tracking-wide uppercase ${
                opt.type === 'Adil' ? 'text-emerald-400' :
                opt.type === 'Bias' ? 'text-amber-400' : 'text-rose-450'
              }`}>
                {opt.text}
              </span>
              <span>Ketuk Vonis</span>
            </button>
          );
        })}
      </div>

      {/* Decision analysis dialogue */}
      {answered && (
        <div className="p-5 rounded-2xl bg-[#0A0E1A] border border-slate-800 animate-neon-pulse flex flex-col gap-3">
          <div className="flex items-center gap-2 text-rose-400 font-display text-xs font-bold uppercase tracking-wider">
            <BookOpen size={14} /> DINAMIKA HUKUM AI: ULASAN AKADEMIK
          </div>
          <p className="text-xs leading-relaxed text-slate-300">
            {dilemma.options[selectedOption!].explanation}
          </p>
          <div className="text-[10px] text-yellow-400 font-mono mt-1">
            Menerima +{dilemma.options[selectedOption!].xpReward} XP dari sidang etika ini!
          </div>

          <button
            onClick={handleNext}
            className="self-end mt-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
          >
            Lanjutkan Sidang Berikutnya <Check size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
