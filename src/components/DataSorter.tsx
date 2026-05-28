import React, { useState, useEffect, useRef } from 'react';
import { sfx } from './AudioEngine';
import { AlertTriangle, Database, Check, EyeOff } from 'lucide-react';
import { SorterItem } from '../types';

interface DataSorterProps {
  onComplete: (xp: number, badgeId?: string) => void;
  onActionScore: (isCorrect: boolean) => void;
}

const ALL_ITEMS: SorterItem[] = [
  { id: 'ds_1', emoji: '🐱', name: 'Kucing Lucu', correctLabel: 'Hewan', isNoisy: false, tip: 'Data bersih standar.' },
  { id: 'ds_2', emoji: '🚗', name: 'Sedan Biru', correctLabel: 'Kendaraan', isNoisy: false, tip: 'Mudah dipahami model AI.' },
  { id: 'ds_3', emoji: '📱', name: 'Smartphone Pro', correctLabel: 'Gadget', isNoisy: false, tip: 'Label elektronik klasik.' },
  { id: 'ds_4', emoji: '🐶', name: 'Anjing Shiba', correctLabel: 'Hewan', isNoisy: false, tip: 'Mudah diidentifikasi.' },
  { id: 'ds_5', emoji: '🚚', name: 'Truk Logistik', correctLabel: 'Kendaraan', isNoisy: false, tip: 'Roda 6, kelas kendaraan berat.' },
  { id: 'ds_6', emoji: '💻', name: 'Macbook Air', correctLabel: 'Gadget', isNoisy: false, tip: 'Kategori komputer jinjing.' },
  { id: 'ds_7', emoji: '🦁', name: 'Singa Jantan', correctLabel: 'Hewan', isNoisy: false, tip: 'Hewan buas karnivora.' },
  { id: 'ds_8', emoji: '🚲', name: 'Sepeda Gunung', correctLabel: 'Kendaraan', isNoisy: false, tip: 'Kendaraan non-motor.' },
  { id: 'ds_9', emoji: '🌀', name: '[GLITCH/CORRUPT] Piksel Blur', correctLabel: 'FLAG', isNoisy: true, tip: 'Data kotor! Wajib skip agar model tidak bingung.' },
  { id: 'ds_10', emoji: '🎧', name: 'Wireless Headset', correctLabel: 'Gadget', isNoisy: false, tip: 'Kelompok aksesoris audio.' },
  { id: 'ds_11', emoji: '🍕', name: 'Pizza Keju (Bukan Kategori)', correctLabel: 'FLAG', isNoisy: true, tip: 'Bias diluar kelompok label (Out-of-Distribution).' },
  { id: 'ds_12', emoji: '🤖', name: 'Monster Robot Kucing', correctLabel: 'FLAG', isNoisy: true, tip: 'Ambigu & Mengandung bias biner.' },
  { id: 'ds_13', emoji: '🐼', name: 'Panda Gemoy', correctLabel: 'Hewan', isNoisy: false, tip: 'Berwarna hitam putih.' },
  { id: 'ds_14', emoji: '🚄', name: 'Kereta Cepat Shinkansen', correctLabel: 'Kendaraan', isNoisy: false, tip: 'Mobilitas rel super cepat.' },
  { id: 'ds_15', emoji: '🩻', name: '[CORRUPT] Noise Sinyal', correctLabel: 'FLAG', isNoisy: true, tip: 'Data rusak akibat korupsi berkas.' }
];

export default function DataSorter({ onComplete, onActionScore }: DataSorterProps) {
  const [items, setItems] = useState<SorterItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalLabeled, setTotalLabeled] = useState(0);
  const [timeLeft, setTimeLeft] = useState(100); // Percentage
  const [gameEnded, setGameEnded] = useState(false);
  const [learnedFact, setLearnedFact] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize randomly shuffled items
  useEffect(() => {
    const shuffled = [...ALL_ITEMS].sort(() => Math.random() - 0.5);
    setItems(shuffled);
  }, []);

  // Time Limit Countdown Bar
  useEffect(() => {
    if (gameEnded || items.length === 0 || learnedFact) return;

    setTimeLeft(100);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 8)); // speed of countdown
    }, 200);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, items, gameEnded, learnedFact]);

  // Handle Timeout transition side effect cleanly when timeLeft reaches 0
  useEffect(() => {
    if (timeLeft <= 0 && !gameEnded && items.length > 0 && !learnedFact) {
      handleAnswer('FLAG');
    }
  }, [timeLeft, gameEnded, items, learnedFact]);

  const handleAnswer = (selectedLabel: 'Hewan' | 'Kendaraan' | 'Gadget' | 'FLAG') => {
    if (gameEnded) return;

    const currentItem = items[currentIndex];
    const isCorrect = currentItem.correctLabel === selectedLabel;

    onActionScore(isCorrect);
    
    // Save label metrics in local storage
    const storedLabels = parseInt(localStorage.getItem('cachedLabelsCount') || '0', 10);
    localStorage.setItem('cachedLabelsCount', (storedLabels + 1).toString());

    if (isCorrect) {
      sfx.play('correct');
      setCorrectCount(prev => prev + 1);
      setStreak(prev => {
        const nextStreak = prev + 1;
        if (nextStreak === 10) {
          // Trigger special badge sound
          sfx.play('levelUp');
        }
        return nextStreak;
      });
    } else {
      sfx.play('wrong');
      setStreak(0);
    }

    setTotalLabeled(prev => prev + 1);

    // Dynamic educational prompt triggers
    if (currentItem.isNoisy) {
      setLearnedFact(
        isCorrect 
          ? `Keren! Kamu mendeteksi "${currentItem.name}". Menyingkirkan data kotor/glitch menghentikan "garbage-in garbage-out"!`
          : `Oops! "${currentItem.name}" sebenarnya data kotor yang bisa merusak efisiensi bias model. Kita harus memfilter data sejenis.`
      );
    } else {
      // Proceed directly
      advanceIndex();
    }
  };

  const advanceIndex = () => {
    setLearnedFact(null);
    if (currentIndex + 1 >= items.length || totalLabeled >= 12) {
      // Finish Game session
      setGameEnded(true);
      if (timerRef.current) clearInterval(timerRef.current);
      
      // Calculate final reward based on labeling accuracy
      const scoreRatio = correctCount / (totalLabeled || 1);
      const earnedXp = Math.round(scoreRatio * 200 + 50);

      const hasFlagBadge = ALL_ITEMS.some(item => item.isNoisy); 
      onComplete(earnedXp, '100_labels'); 
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  if (items.length === 0) return null;

  const currentItem = items[currentIndex];

  return (
    <div id="data_sorter_game" className="p-6 bg-[#111827] rounded-3xl border border-slate-800 text-slate-100 flex flex-col gap-6 max-h-[640px] overflow-y-auto">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black font-display text-[#8B5CF6] tracking-wider uppercase flex items-center gap-2">
            📊 Data Sorter
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Konsep: <span className="text-[#00D4FF] font-mono">Training Data, Multi-label bias, Noise Cleaning</span>
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs bg-[#0A0E1A] px-3 py-1.5 rounded-lg border border-slate-800">
          <Database size={14} className="text-[#8B5CF6]" />
          <span>Label: {currentIndex + 1}/12</span>
        </div>
      </div>

      {!gameEnded ? (
        <div className="flex flex-col items-center gap-6">
          {/* Progress Timer Bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-200 ${
                timeLeft < 30 ? 'bg-rose-500' : timeLeft < 60 ? 'bg-amber-500' : 'bg-[#10B981]'
              }`}
              style={{ width: `${timeLeft}%` }}
            ></div>
          </div>

          {/* Educational Concept Banner */}
          <div className="w-full text-center text-xs text-slate-300 italic min-h-[32px]">
            {timeLeft < 30 && <span className="text-[#EF4444] font-bold">Waktu kritis! Klik label yang sesuai! ⚡</span>}
            {timeLeft >= 30 && <span>Labeling data yang bias atau rusak dengan tombol FLAG / SKIP!</span>}
          </div>

          {/* Dynamic Factor Panel if showing dialog */}
          {learnedFact ? (
            <div className="bg-[#0A0E1A] p-6 rounded-2xl border-2 border-[#8B5CF6]/30 text-center flex flex-col items-center gap-4 animate-neon-pulse">
              <AlertTriangle className="text-[#F59E0B]" size={36} />
              <p className="text-sm font-semibold leading-relaxed text-slate-200 max-w-md">
                {learnedFact}
              </p>
              <button
                onClick={advanceIndex}
                className="px-6 py-2 bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white font-bold rounded-xl transition-all text-xs uppercase cursor-pointer"
              >
                Lanjutkan Data Berikutnya <Check size={12} className="inline ml-1" />
              </button>
            </div>
          ) : (
            /* Polaroid Data Card */
            <div className="bg-slate-50 text-slate-900 p-5 rounded-xl shadow-[0_12px_24px_rgba(0,0,0,0.6)] w-56 transform rotate-1 flex flex-col items-center gap-4 border border-white">
              <div className="bg-slate-200 w-full h-40 rounded-lg flex items-center justify-center text-7xl select-none">
                {currentItem.emoji}
              </div>
              <div className="text-center w-full">
                <div className="font-mono text-[10px] text-slate-500 uppercase tracking-widest leading-none">DATA NODE ID: #{currentItem.id}</div>
                <div className="font-bold text-base text-slate-800 leading-tight mt-1">{currentItem.name}</div>
              </div>
            </div>
          )}

          {/* Interactive Button Sorter Group */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
            <button
              onClick={() => handleAnswer('Hewan')}
              disabled={!!learnedFact}
              className="py-3 bg-sky-950/40 hover:bg-[#00D4FF]/20 border border-sky-800/60 hover:border-[#00D4FF] rounded-xl font-bold text-xs text-sky-300 transition-all cursor-pointer disabled:opacity-30 flex items-center justify-center gap-2"
            >
              🐾 HEWAN
            </button>
            <button
              onClick={() => handleAnswer('Kendaraan')}
              disabled={!!learnedFact}
              className="py-3 bg-violet-950/40 hover:bg-[#8B5CF6]/20 border border-violet-850 hover:border-[#8B5CF6] rounded-xl font-bold text-xs text-violet-300 transition-all cursor-pointer disabled:opacity-30 flex items-center justify-center gap-2"
            >
              🚀 VEHICLE
            </button>
            <button
              onClick={() => handleAnswer('Gadget')}
              disabled={!!learnedFact}
              className="py-3 bg-emerald-950/40 hover:bg-[#10B981]/20 border border-emerald-850 hover:border-[#10B981] rounded-xl font-bold text-xs text-emerald-300 transition-all cursor-pointer disabled:opacity-30 flex items-center justify-center gap-2"
            >
              💻 GADGET
            </button>
            <button
              onClick={() => handleAnswer('FLAG')}
              disabled={!!learnedFact}
              className="py-3 bg-amber-950/40 hover:bg-[#F59E0B]/20 border border-amber-850 hover:border-[#F59E0B] rounded-xl font-bold text-xs text-amber-300 transition-all cursor-pointer disabled:opacity-30 flex items-center justify-center gap-2"
            >
              ⚠️ FLAG / SKIP
            </button>
          </div>

          {/* Stats Bar */}
          <div className="flex gap-6 text-[10px] text-slate-400 font-mono border-t border-slate-800/80 pt-4 w-full justify-around">
            <div>Streak: <span className="text-amber-400 font-bold">{streak}</span></div>
            <div>Akurasi Sesi: <span className="text-[#00D4FF] font-bold">{totalLabeled > 0 ? Math.round((correctCount / totalLabeled) * 100) : 0}%</span></div>
          </div>
        </div>
      ) : (
        /* GAME SESSION END SCREEN */
        <div className="bg-[#0A0E1A] p-6 rounded-2xl text-center flex flex-col items-center gap-4">
          <Database className="text-[#8B5CF6]" size={48} />
          <h3 className="text-xl font-bold font-display uppercase text-white">DATABASE SELESAI DIBUAT</h3>
          <p className="text-sm text-slate-300 max-w-md">
            Hebat! Kamu berhasil melabeli data training untuk model kita. Akurasi input yang kamu pelihara mencapai <span className="text-[#10B981] font-bold">{Math.round((correctCount / totalLabeled) * 100)}%</span>!
          </p>
          <div className="px-4 py-2 bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[#8B5CF6] rounded-xl text-xs font-mono">
            Sesi: +{Math.round((correctCount / (totalLabeled || 1)) * 200 + 50)} XP
          </div>
          <button
            onClick={() => onComplete(Math.round((correctCount / (totalLabeled || 1)) * 200 + 50))}
            className="px-6 py-2 bg-gradient-to-r from-[#8B5CF6] to-[#00D4FF] text-slate-950 font-black rounded-xl transition-all cursor-pointer text-xs uppercase"
          >
            Selesaikan Labeling & Klaim Reward ✨
          </button>
        </div>
      )}
    </div>
  );
}
