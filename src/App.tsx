import React, { useState, useEffect } from 'react';
import { sfx } from './components/AudioEngine';
import NeuronBuilder from './components/games/NeuronBuilder';
import DataSorter from './components/games/DataSorter';
import PromptWizard from './components/games/PromptWizard';
import ModelShowdown from './components/games/ModelShowdown';
import OverfittingEscape from './components/games/OverfittingEscape';
import EthicalJudge from './components/games/EthicalJudge';
import HyperparameterSandbox from './components/HyperparameterSandbox';

import GameCard from './components/ui/GameCard';
import WorldMap from './components/ui/WorldMap';
import Codex from './components/ui/Codex';
import DailyChallenge from './components/ui/DailyChallenge';
import AikoChat from './components/ui/AikoChat';
import XpBar from './components/ui/XpBar';

import { 
  Brain, 
  Lightbulb, 
  Info,
  Volume2,
  RotateCcw,
  ArrowLeft
} from 'lucide-react';
import { Achievement, LeaderboardEntry, UserStats } from './types';

// Standard 12 Achievement list
const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_neuron', title: '🧠 First Neuron', desc: 'Selesaikan hub korelasi sinapsis jaring syaraf.', unlocked: false, hint: 'Mainkan Game Neuron Builder!' },
  { id: '100_labels', title: '📊 Clean Labeling', desc: 'Selesaikan data labeling di Sorter secara akurat.', unlocked: false, hint: 'Mainkan Game Data Sorter!' },
  { id: 'perfect_prompt', title: '🪄 Prompt Engineer', desc: 'Susun mantramu sendiri menguji LLM hingga 100%.', unlocked: false, hint: 'Mainkan Game Prompt Wizard!' },
  { id: 'model_knight', title: '🛡️ Model Knight', desc: 'Raih kemenangan mutlak di kancah Model Showdown.', unlocked: false, hint: 'Menangkan Model Showdown!' },
  { id: 'generalizer', title: '🌪️ Escape Master', desc: 'Membelah curve labirin Overfitting Escape dengan luwes.', unlocked: false, hint: 'Sukses di Overfitting Escape!' },
  { id: 'ethical_thinker', title: '⚖️ AI Ethicist', desc: 'Menimbang rasa kemanusiaan di Sidang Hakim Etik.', unlocked: false, hint: 'Selesaikan Ethical AI Judge!' },
  { id: 'ai_master', title: '🏆 AI Academy Graduate', desc: 'Berhasil menguji seluruh 6 mini-game AI Arena!', unlocked: false, hint: 'Mainkan keenam game di arena!' },
  { id: 'super_scholar', title: '👑 Scholar Elite', desc: 'Mengumpulkan pencapaian beasiswa level tinggi.', unlocked: false, hint: 'Capai Level 3 ke atas!' },
  { id: 'streak_fever', title: '🔥 Streak Burner', desc: 'Berhasil menjawab benar berturut-turut.', unlocked: false, hint: 'Dapatkan 5 jawaban benar beruntun!' },
  { id: 'sound_pioneer', title: '🎵 Oscillator Sound', desc: 'Menghidupkan chip sound synthesizer oscillator.', unlocked: false, hint: 'Aktif mendengarkan suara di arena!' },
  { id: 'clean_bias', title: '🧹 Anti-Bias Cleaner', desc: 'Menolak bias data rusak di tumpukan Sorter.', unlocked: false, hint: 'Labeli item FLAG dengan benar!' },
  { id: 'super_nerd', title: '🎓 AI Master Scholar', desc: 'Menjadi pakar etika AI tertinggi di arena.', unlocked: false, hint: 'Capai Level 6 dengan XP melimpah!' }
];

const GAME_PORTALS = [
  { id: 'neuron-builder', title: 'Neuron Builder', subtitle: 'Neural Network Dome', description: 'Bangun jaringan saraf, pelajari perceptron, backprop, dan dropout.', themeColor: '#00D4FF', icon: '🧠', xpBadge: '+250 XP' },
  { id: 'data-sorter', title: 'Data Sorter', subtitle: 'Data Core', description: 'Swipe data bersih vs korup. Pahami class imbalance dan data leakage.', themeColor: '#8B5CF6', icon: '📊', xpBadge: '+200 XP' },
  { id: 'prompt-wizard', title: 'Prompt Wizard', subtitle: 'Prompt Lab', description: 'Rangkai prompt cerdas dengan role, task, format, dan constraint.', themeColor: '#06B6D4', icon: '🪄', xpBadge: '+220 XP' },
  { id: 'model-showdown', title: 'Model Showdown', subtitle: 'Model Arena', description: 'Pilih model terbaik untuk kasus nyata dan pelajari ROC, F1, bias-variance.', themeColor: '#10B981', icon: '⚔️', xpBadge: '+230 XP' },
  { id: 'overfitting-escape', title: 'Overfitting Escape', subtitle: 'Escape Gate', description: 'Atur hyperparameter live dan tangani overfitting vs underfitting.', themeColor: '#F59E0B', icon: '🚨', xpBadge: '+240 XP' },
  { id: 'ethical-judge', title: 'Ethical Judge', subtitle: 'Justice Hub', description: 'Nilai kasus AI etis berdasarkan fairness, privacy, dan explainability.', themeColor: '#EF4444', icon: '⚖️', xpBadge: '+210 XP' }
];

function getLevelDetails(xp: number) {
  if (xp < 150) return { level: 1, title: "Lv.1 AI Newbie", req: 150, prev: 0 };
  if (xp < 400) return { level: 2, title: "Lv.2 Data Wrangler", req: 400, prev: 150 };
  if (xp < 800) return { level: 3, title: "Lv.3 Prompt Hacker", req: 805, prev: 400 };
  if (xp < 1300) return { level: 4, title: "Lv.4 Model Selector", req: 1300, prev: 800 };
  if (xp < 2000) return { level: 5, title: "Lv.5 Overfitting Hunter", req: 2000, prev: 1300 };
  return { level: 6, title: "Lv.6 AI Ethicist", req: 3000, prev: 2000 };
}

export default function App() {
  const [xp, setXp] = useState<number>(() => {
    return parseInt(localStorage.getItem('cachedXpCount') || '0', 10);
  });
  const [completedGames, setCompletedGames] = useState<string[]>(() => {
    const list = localStorage.getItem('cachedCompletedGames');
    return list ? JSON.parse(list) : [];
  });
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const cached = localStorage.getItem('cachedAchievements');
    if (cached) {
      return JSON.parse(cached);
    }
    return INITIAL_ACHIEVEMENTS;
  });

  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<string>('Neuron Builder');
  const [playerName, setPlayerName] = useState<string>(() => {
    const stored = localStorage.getItem('playerName');
    return stored && stored.trim().length > 0 ? stored : 'Player';
  });
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    const cached = localStorage.getItem('cachedLeaderboard');
    if (cached) {
      return JSON.parse(cached);
    }
    return [
      { name: 'Aiko', xp: 0, level: 1, updatedAt: new Date().toISOString() }
    ];
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('soundEnabled');
    return saved === null ? true : saved === 'true';
  });
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('seenOnboarding') === 'true' ? false : true;
  });

  // Mascot state
  const [aikoExpression, setAikoExpression] = useState<'😊' | '🤔' | '🎉'>('😊');
  const [aikoSpeech, setAikoSpeech] = useState<string>(
    "\"Selamat datang di Akademi AI Arena, kawan! Pilih salah satu dari 6 mini-game keren di bawah untuk belajar AI Engineering secara seru!\""
  );

  const [streakCount, setStreakCount] = useState(0);

  const handleFirstGesture = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      sfx.resume();
    }
  };

  const toggleSound = () => {
    const nextSoundState = !soundEnabled;
    setSoundEnabled(nextSoundState);
    if (nextSoundState) {
      sfx.resume();
    }
  };

  const closeOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('seenOnboarding', 'true');
  };

  // Auto-sync state storage
  useEffect(() => {
    localStorage.setItem('cachedXpCount', xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('cachedCompletedGames', JSON.stringify(completedGames));
  }, [completedGames]);

  useEffect(() => {
    localStorage.setItem('cachedAchievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('playerName', playerName);
  }, [playerName]);

  useEffect(() => {
    localStorage.setItem('cachedLeaderboard', JSON.stringify(leaderboard));
  }, [leaderboard]);

  useEffect(() => {
    localStorage.setItem('soundEnabled', soundEnabled.toString());
    sfx.setMuted(!soundEnabled);
  }, [soundEnabled]);

  // Level Up check notifications
  const levelDetails = getLevelDetails(xp);

  const handleActionScore = (isCorrect: boolean) => {
    if (isCorrect) {
      setStreakCount(prev => {
        const next = prev + 1;
        if (next >= 5) {
          triggerUnlockAchievement('streak_fever');
        }
        return next;
      });
    } else {
      setStreakCount(0);
    }
  };

  const updateLeaderboard = (name: string, newXp: number) => {
    const normalized = name.trim().length > 0 ? name.trim() : 'Player';
    setLeaderboard(prev => {
      const next = [...prev];
      const index = next.findIndex(entry => entry.name.toLowerCase() === normalized.toLowerCase());
      const nextEntry: LeaderboardEntry = {
        name: normalized,
        xp: newXp,
        level: getLevelDetails(newXp).level,
        updatedAt: new Date().toISOString()
      };

      if (index >= 0) {
        if (newXp >= next[index].xp) {
          next[index] = nextEntry;
        } else {
          next[index] = {
            ...next[index],
            level: getLevelDetails(next[index].xp).level,
            updatedAt: new Date().toISOString()
          };
        }
      } else {
        next.push(nextEntry);
      }

      next.sort((a, b) => {
        if (b.xp !== a.xp) return b.xp - a.xp;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
      return next.slice(0, 12);
    });
  };

  const triggerUnlockAchievement = (id: string) => {
    setAchievements(prev => {
      const updated = prev.map(ach => {
        if (ach.id === id && !ach.unlocked) {
          sfx.play('levelUp');
          setAikoExpression('🎉');
          setAikoSpeech(`"WUHU! Kamu baru saja membongkar pencapaian rahasia: ${ach.title}! Keren banget dedikasimu!"`);
          return { ...ach, unlocked: true };
        }
        return ach;
      });
      return updated;
    });
  };

  const handleGameCompletion = (gameId: string, xpReward: number, extraBadgeId?: string) => {
    sfx.play('levelUp');
    const nextXp = xp + xpReward;
    const prevLvl = getLevelDetails(xp).level;
    const nextLvl = getLevelDetails(nextXp).level;

    setXp(nextXp);
    updateLeaderboard(playerName, nextXp);

    if (nextLvl > prevLvl) {
      // Trigger Level-up synth celebration!
      setTimeout(() => sfx.play('levelUp'), 400);
      setAikoExpression('🎉');
      setAikoSpeech(`"ALAMAK NAIK LEVEL! Levelmu sekarang bertambah ke ${nextLvl}! Kamu patut dinobatkan sebagai pendorong AI handal!"`);
    }

    if (!completedGames.includes(gameId)) {
      const nextList = [...completedGames, gameId];
      setCompletedGames(nextList);
      if (nextList.length === 6) {
        triggerUnlockAchievement('ai_master');
      }
    }

    if (extraBadgeId) {
      triggerUnlockAchievement(extraBadgeId);
    }

    // Trigger basic checks based on thresholds
    const currentLvl = getLevelDetails(xp + xpReward).level;
    if (nextLvl >= 3) {
      triggerUnlockAchievement('super_scholar');
    }
    if (nextLvl >= 6) {
      triggerUnlockAchievement('super_nerd');
    }

    // Return to dashboard but show success prompt
    setActiveGameId(null);
    setAikoExpression('😊');
  };

  // Sound tester trigger
  const handleSoundTest = () => {
    sfx.play('hover');
    triggerUnlockAchievement('sound_pioneer');
  };

  const handleAppReset = () => {
    if (window.confirm("Apakah kamu yakin ingin mengulang seluruh progress akademimu dari awal?")) {
      localStorage.clear();
      setXp(0);
      setCompletedGames([]);
      setAchievements(INITIAL_ACHIEVEMENTS);
      setActiveGameId(null);
      setAikoExpression('😊');
      setAikoSpeech('"Seluruh data latihan telah dihapus! Mari kita bangun kecerdasan buatan dari nol kembali!"');
      sfx.play('wrong');
    }
  };

  // Render proper Active Game View
  const renderGameArena = () => {
    switch (activeGameId) {
      case 'neuron-builder':
        return (
          <NeuronBuilder 
            onActionScore={handleActionScore}
            onComplete={(xpReward, badge) => handleGameCompletion('neuron-builder', xpReward, badge)} 
          />
        );
      case 'data-sorter':
        return (
          <DataSorter 
            onActionScore={handleActionScore}
            onComplete={(xpReward, badge) => handleGameCompletion('data-sorter', xpReward, badge)} 
          />
        );
      case 'prompt-wizard':
        return (
          <PromptWizard 
            onActionScore={handleActionScore}
            onComplete={(xpReward, badge) => handleGameCompletion('prompt-wizard', xpReward, badge)} 
          />
        );
      case 'model-showdown':
        return (
          <ModelShowdown 
            onActionScore={handleActionScore}
            onComplete={(xpReward, badge) => handleGameCompletion('model-showdown', xpReward, badge)} 
          />
        );
      case 'overfitting-escape':
        return (
          <OverfittingEscape 
            onActionScore={handleActionScore}
            onComplete={(xpReward, badge) => handleGameCompletion('overfitting-escape', xpReward, badge)} 
          />
        );
      case 'ethical-judge':
        return (
          <EthicalJudge 
            onActionScore={handleActionScore}
            onComplete={(xpReward, badge) => handleGameCompletion('ethical-judge', xpReward, badge)} 
          />
        );
      case 'hyperparameter-sandbox':
        return (
          <HyperparameterSandbox 
            onActionScore={handleActionScore}
            onComplete={(xpReward, badge) => handleGameCompletion('hyperparameter-sandbox', xpReward, badge)} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div onPointerDown={handleFirstGesture} className="min-h-screen bg-bg-dark text-slate-100 font-sans flex flex-col p-4 md:p-6 scanlines">
      
      {/* HEADER BAR */}
      <header className="flex flex-col lg:flex-row items-center justify-between mb-6 bg-bg-card rounded-2xl border border-slate-800 p-4 shadow-xl gap-4">
        <div className="flex items-center gap-4">
          {activeGameId && (
            <button
              onClick={() => { sfx.play('hover'); setActiveGameId(null); }}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-transparent border border-slate-700 text-slate-300 hover:bg-slate-900/60 hover:border-slate-600 hover:text-white transition-colors mr-1"
              aria-label="Kembali ke Hub"
              title="Kembali ke Hub"
            >
              <ArrowLeft size={16} />
            </button>
          )}
          <div className="w-12 h-12 bg-gradient-to-br from-[#00D4FF] to-[#8B5CF6] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(0,212,255,0.4)]">
            <span className="text-2xl select-none">🤖</span>
          </div>
          <div>
            <h1 className="text-xl font-black font-display tracking-tight text-white leading-none">AI ARENA</h1>
            <p className="text-[9px] text-[#94A3B8] font-mono tracking-widest uppercase">Educational AI Engineering Portal</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="flex flex-wrap gap-2 justify-end">
            <button
              type="button"
              onClick={toggleSound}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] font-semibold text-slate-200 hover:bg-slate-900 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-blue"
              aria-pressed={!soundEnabled}
              aria-label={soundEnabled ? 'Matikan efek suara' : 'Nyalakan efek suara'}
            >
              <Volume2 size={14} />
              {soundEnabled ? 'Suara Aktif' : 'Mute'}
            </button>
            <button
              type="button"
              onClick={() => setShowOnboarding(true)}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-[11px] font-semibold text-slate-200 hover:bg-slate-900 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-blue"
            >
              <Info size={14} />
              Tutorial
            </button>
          </div>
          <div className="flex-1 w-full lg:mx-12">
          <div className="flex justify-between items-end mb-1 px-1">
            <span className="text-[10px] font-bold text-[#00D4FF] font-mono">PROGRESS XP</span>
            <span className="text-[10px] font-mono text-slate-400">{xp} / {levelDetails.req} XP</span>
          </div>
          <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-[#00D4FF] via-[#8B5CF6] to-[#00D4FF] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(0,212,255,0.5)]"
              style={{ width: `${Math.min(100, Math.max(8, (xp / levelDetails.req) * 100))}%` }}
            ></div>
          </div>
        </div>
      </div>

        {/* BADGE RANK CARD */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[9px] text-[#94A3B8] uppercase font-mono">Academy Rank</div>
            <div className="text-xs font-black text-neon-orange font-display">{levelDetails.title}</div>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-neon-orange flex items-center justify-center bg-neon-orange/10 font-bold font-display text-neon-orange">
            {levelDetails.level}
          </div>
        </div>
      </header>

      <section className="bg-bg-card rounded-3xl border border-slate-800 p-6 shadow-xl mb-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.35em] text-[#63b3ed]">Beranda AI Arena</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-white">Belajar AI sambil bermain, cocok untuk pemula.</h2>
            <p className="mt-3 text-sm text-slate-300 leading-relaxed">Pilih satu game di bawah, ikuti panduan singkat di setiap kartu, dan kumpulkan XP untuk naik level. Tidak perlu pengalaman sebelumnya.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full sm:w-auto">
            <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-3 text-center">
              <div className="text-2xl">1️⃣</div>
              <p className="mt-2 text-[10px] uppercase text-slate-400 tracking-wide">Pilih game</p>
            </div>
            <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-3 text-center">
              <div className="text-2xl">2️⃣</div>
              <p className="mt-2 text-[10px] uppercase text-slate-400 tracking-wide">Kerjakan tantangan</p>
            </div>
            <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-3 text-center">
              <div className="text-2xl">3️⃣</div>
              <p className="mt-2 text-[10px] uppercase text-slate-400 tracking-wide">Dapatkan XP</p>
            </div>
          </div>
        </div>
      </section>

      {showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-700 bg-slate-900/95 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white">Selamat datang di AI Arena!</h2>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">Mulai perjalanan belajarmu dengan teka-teki AI, eksperimen model, dan misi etika. Gunakan tombol di bawah atau kartumu untuk memasuki setiap mini-game.</p>
              </div>
              <button
                type="button"
                onClick={closeOnboarding}
                className="rounded-full border border-slate-700 bg-slate-950/80 p-2 text-slate-200 hover:bg-slate-900 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-blue"
                aria-label="Tutup tutorial"
              >
                ✕
              </button>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">1. Pilih game</h3>
                <p className="text-xs text-slate-400 mt-2">Klik kartu atau gunakan keyboard untuk memilih mode Neuron Builder, Data Sorter, atau mini-game lain.</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">2. Suara & kontrol</h3>
                <p className="text-xs text-slate-400 mt-2">Gunakan tombol Sound di header untuk mute/aktifkan audio. Audio otomatis siap saat kamu pertama kali berinteraksi.</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">3. Upgrade & pencapaian</h3>
                <p className="text-xs text-slate-400 mt-2">Kumpulkan XP dan buka badge untuk mendapatkan level baru. Aiko akan memberi pesan ketika kamu berhasil.</p>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={closeOnboarding}
                className="inline-flex items-center justify-center rounded-2xl bg-neon-blue px-5 py-3 text-xs font-bold uppercase tracking-widest text-slate-950 shadow-lg shadow-neon-blue/25 transition hover:bg-[#00b1e1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-blue"
              >
                Mulai Petualangan
              </button>
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem('seenOnboarding', 'true');
                  setShowOnboarding(false);
                }}
                className="text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-white transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-blue"
              >
                Jangan tampilkan lagi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CORE WORKSPACE */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* LEFT / CENTER: BENTO HUB & THE CARDS */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Active game stage view */}
          {activeGameId ? (
            <div className="relative">
              {renderGameArena()}
            </div>
          ) : (
            /* BENTO GAME LAYOUT CARDS */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Game 1: Neuron Builder */}
              <button
                type="button"
                onClick={() => { sfx.play('hover'); setActiveGameId('neuron-builder'); }}
                onMouseEnter={() => sfx.playHoverTheme('neuron-builder')}
                aria-label="Buka game Neuron Builder"
                className="md:row-span-2 bg-[#111827] rounded-3xl border-2 border-[#00D4FF]/25 p-5 flex flex-col justify-between relative overflow-hidden group hover:border-[#00D4FF] transition-all duration-350 cursor-pointer shadow-lg hover:shadow-[#00D4FF]/10 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-blue"
              >
                <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#00D4FF]/5 rounded-full blur-2xl"></div>
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#00D4FF]/10 border border-[#00D4FF]/40 flex items-center justify-center text-2xl mb-4 select-none">🧠</div>
                  <h3 className="text-lg font-black font-display text-white mb-2 tracking-wide uppercase">Neuron Builder</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans mt-1">
                    Bangun jaringan saraf sederhana dengan menyambungkan neuron. Pelajari bagaimana AI memproses input dan membuat prediksi.
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-[#00D4FF]/10 text-[#00D4FF] text-[9px] font-bold rounded uppercase border border-[#00D4FF]/20">Level 1 - Hard</span>
                  <span className="text-[10px] text-slate-400 italic font-mono">+250 XP</span>
                </div>
              </button>

              {/* Game 2: Data Sorter */}
              <button
                type="button"
                onClick={() => { sfx.play('hover'); setActiveGameId('data-sorter'); }}
                onMouseEnter={() => sfx.playHoverTheme('data-sorter')}
                aria-label="Buka game Data Sorter"
                className="md:col-span-2 bg-[#111827] rounded-3xl border-2 border-neon-purple/25 p-5 flex flex-col justify-between hover:border-neon-purple transition-all duration-350 cursor-pointer shadow-lg hover:shadow-neon-purple/10 hover:-translate-y-1 relative focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-blue"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="w-16 h-16 bg-neon-purple/10 border border-neon-purple/40 rounded-2xl flex items-center justify-center text-4xl shrink-0 select-none">📊</div>
                  <div>
                    <h3 className="text-lg font-black font-display text-white mb-1 uppercase tracking-wide">Data Sorter</h3>
                    <p className="text-xs text-slate-400">
                      Pilih dan rapikan data yang benar. Latih AI agar belajar dari contoh yang bersih dan hindari bias pada hasil prediksi.
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-800/80">
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 bg-neon-purple/10 text-neon-purple text-[9px] font-bold rounded uppercase border border-neon-purple/20">Level 2 - Fast</span>
                    <span className="text-[9px] font-mono text-slate-500 self-center">Clean Bias Training</span>
                  </div>
                  <span className="text-[10px] text-slate-400 italic font-mono">+200 XP</span>
                </div>
              </button>

              {/* Game 3: Prompt Wizard */}
              <button
                type="button"
                onClick={() => { sfx.play('hover'); setActiveGameId('prompt-wizard'); }}
                onMouseEnter={() => sfx.playHoverTheme('prompt-wizard')}
                aria-label="Buka game Prompt Wizard"
                className="bg-[#111827] rounded-3xl border-2 border-cyan-500/25 p-4 flex flex-col items-center text-center justify-center hover:border-cyan-400 transition-all duration-350 cursor-pointer shadow-lg hover:shadow-cyan-400/10 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-blue"
              >
                <div className="text-3xl mb-2 select-none">🪄</div>
                <h4 className="font-bold font-display text-white text-sm uppercase">Prompt Wizard</h4>
                <p className="text-[10px] text-slate-400 mt-1">Susun instruksi jelas untuk memandu AI menjawab lebih akurat.</p>
              </button>

              {/* Game 4: Model Showdown */}
              <button
                type="button"
                onClick={() => { sfx.play('hover'); setActiveGameId('model-showdown'); }}
                onMouseEnter={() => sfx.playHoverTheme('model-showdown')}
                aria-label="Buka game Model Showdown"
                className="bg-[#111827] rounded-3xl border-2 border-neon-green/25 p-4 flex flex-col items-center text-center justify-center hover:border-neon-green transition-all duration-350 cursor-pointer shadow-lg hover:shadow-neon-green/10 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-blue"
              >
                <div className="text-3xl mb-2 select-none">⚔️</div>
                <h4 className="font-bold font-display text-white text-sm uppercase">Model Showdown</h4>
                <p className="text-[10px] text-slate-400 mt-1">Pilih model terbaik dalam pertandingan dan lihat siapa yang menang.</p>
              </button>

              {/* Game 5: Overfitting Escape */}
              <button
                type="button"
                onClick={() => { sfx.play('hover'); setActiveGameId('overfitting-escape'); }}
                onMouseEnter={() => sfx.playHoverTheme('overfitting-escape')}
                aria-label="Buka game Overfitting Escape"
                className="md:col-span-2 bg-[#111827] rounded-3xl border-2 border-neon-orange/25 p-5 flex flex-col md:flex-row items-center justify-between hover:border-neon-orange transition-all duration-350 cursor-pointer shadow-lg hover:shadow-neon-orange/10 hover:-translate-y-1 relative overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-blue"
              >
                <div className="z-10">
                  <h3 className="text-lg font-black font-display text-white mb-1 uppercase tracking-wide">Overfitting Escape</h3>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Jaga agar model tidak terlalu banyak menghafal. Sesuaikan tingkat kompleksitas supaya tetap akurat pada data baru.
                  </p>
                </div>
                <div className="text-5xl opacity-80 z-10 select-none">🚨</div>
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-neon-orange/5 to-transparent"></div>
              </button>

              {/* Game 6: Ethical AI Judge */}
              <button
                type="button"
                onClick={() => { sfx.play('hover'); setActiveGameId('ethical-judge'); }}
                onMouseEnter={() => sfx.playHoverTheme('ethical-judge')}
                aria-label="Buka game Ethical AI Judge"
                className="bg-[#111827] rounded-3xl border-2 border-neon-red/25 p-4 flex flex-col items-center text-center justify-center hover:border-neon-red transition-all duration-350 cursor-pointer shadow-lg hover:shadow-neon-red/10 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-blue"
              >
                <div className="text-3xl mb-2 select-none">⚖️</div>
                <h4 className="font-bold font-display text-white text-sm uppercase">Ethical AI Judge</h4>
                <p className="text-[10px] text-slate-400 mt-1">Putuskan apakah AI sudah bekerja adil dan etis di dunia nyata.</p>
              </button>

              {/* Game 7: Model Tuner & Playground */}
              <button
                type="button"
                onClick={() => { sfx.play('hover'); setActiveGameId('hyperparameter-sandbox'); }}
                onMouseEnter={() => sfx.playHoverTheme('hyperparameter-sandbox')}
                aria-label="Buka game Model Tuner & Playground"
                className="md:col-span-3 bg-gradient-to-r from-[#111827] via-cyan-950/15 to-[#111827] rounded-3xl border-2 border-cyan-500/25 p-5 flex flex-col md:flex-row items-center justify-between hover:border-cyan-400 transition-all duration-350 cursor-pointer shadow-lg hover:shadow-cyan-400/10 hover:-translate-y-1 relative overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-blue"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-450/5 rounded-full blur-3xl"></div>
                <div className="flex flex-col md:flex-row items-center gap-4 z-10">
                  <div className="w-14 h-14 bg-cyan-500/10 border-2 border-cyan-400/30 rounded-2xl flex items-center justify-center text-3xl select-none shrink-0">🎛️</div>
                  <div className="text-left">
                    <h3 className="text-lg font-black font-display text-white mb-1 uppercase tracking-wide flex items-center gap-1.5">
                      Model Tuner & Playground <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded font-mono font-bold tracking-widest uppercase">Baru!</span>
                    </h3>
                    <p className="text-xs text-slate-450 max-w-xl">
                      Uji parameter model secara langsung. Atur suhu, peluang, dan lihat bagaimana perubahan memberi efek pada hasil AI.
                    </p>
                  </div>
                </div>
                <div className="flex flex-row md:flex-col justify-between items-end mt-4 md:mt-0 shrink-0 gap-1.5 font-mono text-right">
                  <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-[9px] font-bold rounded uppercase border border-cyan-500/20">Pro Sandbox</span>
                  <span className="text-[10px] text-slate-450 italic font-mono">+250 XP</span>
                </div>
              </button>

            </div>
          )}

          {/* EDUCATIONAL TIP PANEL */}
          <section className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 flex items-start gap-4">
            <Lightbulb className="text-neon-orange shrink-0 mt-1 animate-pulse" size={20} />
            <div>
              <h5 className="text-xs font-bold font-display text-white uppercase tracking-tight">AI Education Tip Harian</h5>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                "AI Engineering bukan sekadar mengetik baris kode bahasa program, melainkan kepiawaian merancang struktur arsitektur data, menjaga keadilan etis (Ethics Fairness), mengoptimalkan parameter, serta mendesain instruksi prompt yang presisi secara sitematis!"
              </p>
            </div>
          </section>
        </div>

        {/* RIGHT SIDEBAR: LEVEL, PROGRESS, LEADERBOARD, & UNLOCKED BADGES */}
        <aside className="lg:col-span-1 flex flex-col gap-4">

          {/* LEADERBOARD CARD */}
          <div className="bg-bg-card rounded-3xl border border-slate-850 p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-xs font-black font-display text-slate-450 uppercase tracking-widest">Leaderboard Arena</h4>
                <p className="text-[10px] text-slate-500 mt-1">Peringkat pemain terbaik berdasarkan XP.</p>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400">Rank</div>
                <div className="text-[10px] text-slate-400">XP</div>
              </div>
            </div>

            <div className="space-y-2">
              {leaderboard.slice(0, 6).map((entry, index) => (
                <div key={`${entry.name}-${entry.xp}`} className={`flex items-center justify-between rounded-2xl px-3 py-2 ${entry.name.toLowerCase() === playerName.trim().toLowerCase() ? 'bg-[#0d172a] border border-neon-blue/20 shadow-[0_0_10px_rgba(0,212,255,0.15)]' : 'bg-slate-950 border border-slate-800'}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-neon-blue">#{index + 1}</span>
                    <div className="text-[11px] leading-tight">
                      <div className="font-semibold text-slate-100 truncate max-w-[110px]">{entry.name}</div>
                      <div className="text-[9px] text-slate-500">Lv.{entry.level}</div>
                    </div>
                  </div>
                  <div className="text-[11px] font-bold text-slate-100">{entry.xp}</div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800">
              <label className="text-[10px] uppercase tracking-widest text-slate-500">Nama Pemain</label>
              <input
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20"
                placeholder="Masukkan namamu"
                aria-label="Nama pemain leaderboard"
              />
              <button
                type="button"
                onClick={() => updateLeaderboard(playerName, xp)}
                className="mt-3 w-full rounded-2xl bg-neon-blue px-3 py-2 text-[11px] font-semibold uppercase tracking-widest text-slate-950 shadow-lg shadow-neon-blue/20 transition hover:bg-[#00b1e1]"
              >
                Simpan Nama & Perbarui
              </button>
            </div>
          </div>

          {/* STATS & RECENT ACHIEVEMENTS CARD */}
          <div className="bg-bg-card rounded-3xl border border-slate-850 p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-xs font-black font-display text-slate-450 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-[#00D4FF] rounded-full"></span> PRESTASI BADGES
              </h4>
              <span className="text-[10px] font-mono text-slate-400">
                {achievements.filter(a => a.unlocked).length} / 12
              </span>
            </div>

            {/* Scrolling Badge Grid */}
            <div className="grid grid-cols-4 gap-2 max-h-[140px] overflow-y-auto pr-1">
              {achievements.map((ach) => (
                <div 
                  key={ach.id}
                  title={`${ach.title}: ${ach.desc}`}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg border cursor-help transition-all transform hover:scale-105 ${
                    ach.unlocked 
                      ? 'bg-gradient-to-br from-slate-900 to-[#111827] border-neon-purple shadow-[0_0_8px_rgba(139,92,246,0.3)] saturate-100' 
                      : 'bg-slate-950 border-slate-850 opacity-25 grayscale'
                  }`}
                >
                  <span className="select-none">{ach.title.split(' ')[0]}</span>
                </div>
              ))}
            </div>

            {/* Achievement detail list (scrollable) */}
            <div className="flex-1 flex flex-col gap-2 max-h-[160px] overflow-y-auto font-sans pr-1">
              {achievements.filter(a => a.unlocked).length === 0 ? (
                <p className="text-[10px] text-slate-500 italic text-center p-4">Selesaikan tantangan di game untuk membuka lencana pertamamu!</p>
              ) : (
                achievements.filter(ach => ach.unlocked).slice(0, 3).map((ach) => (
                  <div key={ach.id} className="flex items-center gap-2 p-2 bg-[#0A0E1A] rounded-xl border border-slate-800 text-[10px]">
                    <span className="text-base select-none">{ach.title.split(' ')[0]}</span>
                    <div>
                      <div className="font-bold text-slate-200">{ach.title}</div>
                      <div className="text-[9px] text-slate-400">{ach.desc}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-slate-800 pt-3 flex justify-between items-center">
              <button 
                onClick={handleSoundTest}
                className="text-[9px] font-mono text-neon-blue uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Volume2 size={12} /> Test Synthesizer
              </button>
              <button 
                onClick={handleAppReset}
                className="text-[9px] font-mono text-neon-red/70 uppercase tracking-widest hover:text-neon-red transition-colors cursor-pointer"
              >
                Hapus Progress
              </button>
            </div>
          </div>

          {/* AIKO ROBOT GUIDANCE CHAT CARD */}
          <div className="bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] rounded-3xl p-5 relative overflow-hidden shadow-xl">
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Brain size={120} className="text-white" />
            </div>
            <div className="relative z-10 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl animate-bounce select-none">{aikoExpression}</span>
                  <span className="font-black italic tracking-wider text-[10px] bg-white/20 px-2 py-0.5 rounded font-display text-white">AIKO COMPANION</span>
                </div>
              </div>
              <div role="status" aria-live="polite" aria-atomic="true" className="text-[11px] text-slate-100 leading-relaxed">
                {aikoSpeech}
              </div>
              <p className="text-xs font-semibold leading-relaxed text-white">
                {aikoSpeech}
              </p>
              <div className="mt-1 flex gap-2">
                <button 
                  onClick={() => {
                    sfx.play('hover');
                    const theories = [
                      '"Suhu (Temperature) LLM ibarat api panggangan. Makin tinggi suhunya, makin kreatif rotasi kalimatnya, tapi makin gampang gosong/halusinasi!"',
                      '"Bias jaring saraf ibarat geseran kemudi mobil. Walau inputmu nihil, bias menggeser fungsi aktivasi ke kiri-kanan agar garis klasifikasi pas!"',
                      '"Overfitting terjadi jika model terlalu haus hafalan detail sebar training set. Kita cegah dengan teknik Dropout atau regularisasi L2!"',
                      '"Sigmoid mengompres angka ekstrem minus atau plus menjadi skala probabilitas ketat antara 0 sampai 1. Cocok untuk tebakan biner!"',
                      '"Garbage-In, Garbage-Out kependekan dari GIGO. Sorter data kotor seperti bias rasis/glitch wajib kita bersihkan di awal!"'
                    ];
                    const randomTheory = theories[Math.floor(Math.random() * theories.length)];
                    setAikoExpression('🤔');
                    setAikoSpeech(randomTheory);
                  }}
                  className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-[9px] font-mono text-white transition-colors cursor-pointer"
                >
                  💡 Minta Teori
                </button>
                <button 
                  onClick={() => {
                    sfx.play('hover');
                    const jokes = [
                      '"Ada 99 masalah di kodinganku, aku pakai AI untuk memperbaikinya. Sekarang aku punya 143 masalah dan 1 entitas cerdas pemarah!"',
                      '"Knock knock! Siapa di sana? Git. Git siapa? Git reset --hard HEAD dan lupakan semuanya!"',
                      '"Kenapa mesin neural network senang berkunjung ke pantai? Karena mereka mau mandi di bawah sebaran ombak Tensor!"',
                      '"Mengapa LLM tidak pernah berpacaran? Karena mereka bingung membedakan antara relasi tulus dan statistik probabilitas token berikutnya!"',
                      '"Aku mencoba melatih AI untuk diet sehat, tapi dia malah melakukan gradient descent berkelanjutan sampai berat badannya NaN!"'
                    ];
                    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
                    setAikoExpression('😊');
                    setAikoSpeech(randomJoke);
                  }}
                  className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-[9px] font-mono text-white transition-colors cursor-pointer"
                >
                  ✨ Joke AI
                </button>
              </div>
            </div>
          </div>

        </aside>
      </div>

      {/* FOOTER */}
      <footer className="mt-6 flex flex-col sm:flex-row items-center justify-between text-[10px] text-[#94A3B8] font-mono border-t border-slate-800 pt-4 gap-2">
        <div className="flex flex-wrap gap-4 justify-center">
          <span>PORTAL ACADEMY: <span className="text-[#00D4FF] font-bold">ONLINE</span></span>
          <span>LATENCY SWEEPS: <span className="text-emerald-400 font-bold">14ms</span></span>
          <span>CURRICULUM: <span className="text-[#8B5CF6] font-bold">V.2.6</span></span>
        </div>
        <div className="flex gap-4">
          <span className="hover:text-white transition-colors cursor-pointer" onClick={() => alert("Dibuat oleh AI Academy Team - 15+ years gaming design standard.")}>TEAMS</span>
          <span className="text-[#00D4FF] font-black cursor-pointer hover:text-white transition-colors uppercase" onClick={() => alert(`Selamat! Rank Akademimu saat ini: ${levelDetails.title} dengan total ${xp} XP!`)}>Klaim Sertifikat ↗</span>
        </div>
      </footer>
    </div>
  );
}
