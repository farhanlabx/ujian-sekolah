import React, { useState } from 'react';
import { sfx } from './AudioEngine';
import { Swords, Star, AlertCircle, ArrowRight, ShieldAlert, Award } from 'lucide-react';
import { ShowdownQuest } from '../types';

interface ModelShowdownProps {
  onComplete: (xp: number, badgeId?: string) => void;
  onActionScore: (isCorrect: boolean) => void;
}

const SHOWER_QUESTS: ShowdownQuest[] = [
  {
    caseTitle: "Skenario 1. Jasa Keuangan Bank BCA",
    caseDescription: "Bank ingin memprediksi perkiraan harga rumah nasabah berdasarkan luas tanah, jumlah kamar, dan usia bangunan untuk persetujuan jaminan kredit.",
    options: [
      {
        type: 'Regression',
        name: 'REGRESSION 📏',
        description: 'Memprediksi nilai angka numerik kontinu (harga, suhu, estimasi waktu).',
        isCorrect: true,
        explanation: 'Benar sekali! Karena targetnya adalah memprediksi "harga" (angka riil/kontinu), Regression merangkak mencari garis korelasi matematis terbaik!'
      },
      {
        type: 'Classification',
        name: 'CLASSIFICATION 🍎',
        description: 'Memprediksi kategori label diskrit (Spam vs Inbox, Kucing vs Mobil).',
        isCorrect: false,
        explanation: 'Kurang tepat! Kategori diskrit dipakai jika targetnya memilih kelas biner atau multi-kelas (misal: Rumah Mewah vs Rumah Sederhana), bukan harga nominal pastinya.'
      },
      {
        type: 'Clustering',
        name: 'CLUSTERING 📂',
        description: 'Mengelompokkan data tanpa label berdasarkan kemiripan pola tersembunyi.',
        isCorrect: false,
        explanation: 'Salah! Clustering dipakai jika kita tidak punya harga pembanding dan hanya ingin membagi tipe-tipe klaster perumahan tanpa target nominal yang jelas.'
      }
    ]
  },
  {
    caseTitle: "Skenario 2. Aplikasi Belanja Tokopedia",
    caseDescription: "Tim marketing berniat memetakan jutaan pelanggan pasif ke dalam beberapa klaster kelompok belanja (misal: pemburu kupon, kolektor gadget) tanpa label kategori dasar.",
    options: [
      {
        type: 'Clustering',
        name: 'CLUSTERING 📂',
        description: 'Mengelompokkan data tanpa label berdasarkan kemiripan pola tersembunyi.',
        isCorrect: true,
        explanation: 'Tepat sekali! Mengelompokkan jutaan data pelanggan yang "tidak berlabel" berdasarkan kedekatan fitur jarak Euclidean adalah tugas murni Unsupervised Clustering!'
      },
      {
        type: 'Classification',
        name: 'CLASSIFICATION 🍎',
        description: 'Memprediksi kategori label diskrit.',
        isCorrect: false,
        explanation: 'Kurang pas. Classification memerlukan "labeled training data" di awal sebagai supervisi (Supervised Learning), sedangkan kita murni mengelompokkan pelanggan mentah.'
      },
      {
        type: 'Regression',
        name: 'REGRESSION 📏',
        description: 'Memprediksi nilai angka kontinu.',
        isCorrect: false,
        explanation: 'Salah kaprah. Kasus ini mencari segmentasi atau partisi pengguna, bukan angka kontinu seperti nominal omset penjualan belanja!'
      }
    ]
  },
  {
    caseTitle: "Skenario 3. Saringan Spam Gmail Google",
    caseDescription: "Membatasi masuknya email bermasalah dengan cara mendeteksi secara instan apakah email masuk termasuk kategori Spam 🚫 atau Inbox Bersih ✉️.",
    options: [
      {
        type: 'Classification',
        name: 'CLASSIFICATION 🍎',
        description: 'Memprediksi kategori label diskrit.',
        isCorrect: true,
        explanation: 'Luar biasa tepat! Menyortir email ke dalam dua wadah diskrit terpisah (Spam vs Bukan Spam) adalah contoh klasik dari Binary Classification!'
      },
      {
        type: 'Regression',
        name: 'REGRESSION 📏',
        description: 'Memprediksi nilai angka numerik kontinu.',
        isCorrect: false,
        explanation: 'Kurang tepat. Di sini kita tidak menaksir angka perkiraan melainkan biner pilihan status.'
      },
      {
        type: 'Clustering',
        name: 'CLUSTERING 📂',
        description: 'Mengelompokkan tanpa label berdasarkan jarak fitur.',
        isCorrect: false,
        explanation: 'Salah! Di sini email harus langsung dikirim ke folder terstruktur, bukan sekadar di-cluster tanpa label kelulusan.'
      }
    ]
  }
];

export default function ModelShowdown({ onComplete, onActionScore }: ModelShowdownProps) {
  const [questIndex, setQuestIndex] = useState(0);
  const [selectedSubtype, setSelectedSubtype] = useState<'Classification' | 'Regression' | 'Clustering' | null>(null);
  const [answered, setAnswered] = useState(false);
  const [battleResults, setBattleResults] = useState<{ isCorrect: boolean; explanation: string } | null>(null);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [earnedXpAccumulator, setEarnedXpAccumulator] = useState(0);

  const quest = SHOWER_QUESTS[questIndex];

  const handleSelectCard = (option: typeof SHOWER_QUESTS[0]['options'][0]) => {
    if (answered) return;
    setSelectedSubtype(option.type);
    setAnswered(true);

    const isCorrect = option.isCorrect;
    onActionScore(isCorrect);

    if (isCorrect) {
      sfx.play('correct');
      setCorrectStreak(prev => prev + 1);
      setEarnedXpAccumulator(prev => prev + 100);
      setBattleResults({
        isCorrect: true,
        explanation: option.explanation
      });
    } else {
      sfx.play('wrong');
      setCorrectStreak(0);
      setBattleResults({
        isCorrect: false,
        explanation: option.explanation
      });
    }
  };

  const handleNext = () => {
    setAnswered(false);
    setSelectedSubtype(null);
    setBattleResults(null);

    if (questIndex + 1 < SHOWER_QUESTS.length) {
      setQuestIndex(prev => prev + 1);
    } else {
      // Finished all cases
      const finalXp = earnedXpAccumulator + (correctStreak >= 3 ? 150 : 50);
      // If 3 consecutive correct answers without single error, give special Model Knight badge
      onComplete(finalXp, correctStreak >= 3 ? 'model_knight' : undefined);
    }
  };

  return (
    <div id="model_showdown_arena" className="p-6 bg-[#111827] rounded-3xl border border-slate-800 text-slate-100 flex flex-col gap-6 max-h-[640px] overflow-y-auto">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black font-display text-emerald-400 tracking-wider uppercase flex items-center gap-2">
            ⚔️ Model Showdown
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Konsep: <span className="text-[#8B5CF6] font-mono">Classification, Regression, and Unsupervised Clustering</span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-550 px-3 py-1 rounded-full">
          Streak: {correctStreak} 🔥
        </div>
      </div>

      {/* Skenario Duel Deskripsi */}
      <div className="bg-[#0A0E1A] p-5 rounded-2xl border-l-4 border-emerald-400 flex flex-col gap-2 relative overflow-hidden">
        <div className="absolute top-2 right-2 opacity-5">
          <Swords size={96} />
        </div>
        <span className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-widest">{quest.caseTitle}</span>
        <p className="text-sm font-semibold text-slate-200 leading-relaxed z-10">
          "{quest.caseDescription}"
        </p>
        <p className="text-[11px] text-slate-400 mt-1">
          💡 <span className="italic">Pilih dari 3 tipe kartu model AI di bawah ini yang melambangkan algoritma penyelesaian paling akurat!</span>
        </p>
      </div>

      {/* Display Grid Trading Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quest.options.map((opt, idx) => {
          const isSelected = selectedSubtype === opt.type;
          const isSelectedAndCorrect = isSelected && opt.isCorrect;
          const isSelectedAndWrong = isSelected && !opt.isCorrect;

          return (
            <button
              disabled={answered}
              key={idx}
              onClick={() => handleSelectCard(opt)}
              className={`text-left p-5 rounded-2xl border-2 bg-gradient-to-b from-slate-900 to-[#111827] flex flex-col justify-between min-h-[170px] relative transition-all duration-300 transform ${
                answered 
                  ? opt.isCorrect 
                    ? 'border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] saturate-100' 
                    : 'border-slate-800 opacity-40 grayscale saturate-50'
                  : 'border-slate-800 hover:border-emerald-400 hover:scale-[1.02] cursor-pointer'
              }`}
            >
              <div>
                <div className={`text-xs font-black font-display uppercase tracking-wider mb-2 ${
                  opt.type === 'Classification' ? 'text-rose-400' :
                  opt.type === 'Regression' ? 'text-sky-400' : 'text-violet-400'
                }`}>
                  {opt.name}
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">{opt.description}</p>
              </div>

              {answered && opt.isCorrect && (
                <div className="absolute bottom-3 right-3 text-emerald-400 font-bold text-xs flex items-center gap-1 font-mono uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <Award size={11} /> Correct
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Battle Evaluation Display popup */}
      {battleResults && (
        <div className={`p-5 rounded-2xl border flex flex-col gap-2 ${
          battleResults.isCorrect 
            ? 'bg-emerald-500/10 border-emerald-500/30' 
            : 'bg-rose-500/10 border-rose-500/30'
        }`}>
          <div className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wider">
            {battleResults.isCorrect ? (
              <span className="text-emerald-400 flex items-center gap-1">⚔️ COMBAT WIN! BENAR!</span>
            ) : (
              <span className="text-rose-400 flex items-center gap-1"><ShieldAlert size={14} /> COMBAT FAIL! SALAH PILIH!</span>
            )}
          </div>
          <p className="text-xs leading-relaxed text-slate-300">
            {battleResults.explanation}
          </p>
          <button
            onClick={handleNext}
            className="self-end mt-2 px-5 py-2.5 bg-[#111827] border border-slate-700 hover:border-emerald-400 hover:text-emerald-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
          >
            Lanjut / Tarungkan Berikutnya <ArrowRight size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
