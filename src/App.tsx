import React, { useState, useEffect, useCallback, useRef } from 'react';
import { sfx } from './components/AudioEngine';
import NeuronBuilder from './components/games/NeuronBuilder';
import DataSorter from './components/games/DataSorter';
import PromptWizard from './components/games/PromptWizard';
import ModelShowdown from './components/games/ModelShowdown';
import OverfittingEscape from './components/games/OverfittingEscape';
import EthicalJudge from './components/games/EthicalJudge';
import HyperparameterSandbox from './components/HyperparameterSandbox';
import Codex from './components/ui/Codex';
import WorldMap from './components/ui/WorldMap';
import DailyChallenge from './components/ui/DailyChallenge';
import LevelUpOverlay from './components/ui/LevelUpOverlay';

import {
  Brain, Lightbulb, Info, Volume2, VolumeX,
  ArrowLeft, Trophy, Zap, BarChart2, X, Menu,
  ChevronRight, Star, Cpu, BookOpen, Target,
  Sparkles, Flame, Award, Play, Globe,
} from 'lucide-react';
import { Achievement, LeaderboardEntry } from './types';

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_neuron',    title: '🧠 First Neuron',       desc: 'Selesaikan Neuron Builder.',                   unlocked: false, hint: 'Mainkan Neuron Builder!' },
  { id: '100_labels',      title: '📊 Clean Labeling',      desc: 'Selesaikan Data Sorter dengan akurat.',         unlocked: false, hint: 'Mainkan Data Sorter!' },
  { id: 'perfect_prompt',  title: '🪄 Prompt Engineer',     desc: 'Susun prompt yang mengalahkan LLM 100%.',       unlocked: false, hint: 'Mainkan Prompt Wizard!' },
  { id: 'model_knight',    title: '🛡️ Model Knight',        desc: 'Menang mutlak di Model Showdown.',              unlocked: false, hint: 'Menangkan Model Showdown!' },
  { id: 'generalizer',     title: '🌪️ Escape Master',       desc: 'Taklukkan Overfitting Escape.',                 unlocked: false, hint: 'Sukses di Overfitting Escape!' },
  { id: 'ethical_thinker', title: '⚖️ AI Ethicist',         desc: 'Putuskan kasus etika AI dengan bijak.',         unlocked: false, hint: 'Selesaikan Ethical AI Judge!' },
  { id: 'ai_master',       title: '🏆 AI Graduate',         desc: 'Mainkan seluruh 6 mini-game Arena!',            unlocked: false, hint: 'Mainkan semua game!' },
  { id: 'super_scholar',   title: '👑 Scholar Elite',        desc: 'Capai level tinggi.',                           unlocked: false, hint: 'Capai Level 3+!' },
  { id: 'streak_fever',    title: '🔥 Streak Burner',        desc: 'Jawab 5 soal berturut-turut.',                  unlocked: false, hint: '5 jawaban benar beruntun!' },
  { id: 'sound_pioneer',   title: '🎵 Sound Pioneer',        desc: 'Aktifkan synthesizer suara.',                   unlocked: false, hint: 'Dengarkan suara di arena!' },
  { id: 'clean_bias',      title: '🧹 Anti-Bias',            desc: 'Sorter menolak data bias.',                     unlocked: false, hint: 'Labeli FLAG dengan benar!' },
  { id: 'super_nerd',      title: '🎓 AI Master Scholar',    desc: 'Pakar AI tertinggi arena.',                     unlocked: false, hint: 'Capai Level 6!' },
];

const GAMES = [
  {
    id: 'neuron-builder', title: 'Neuron Builder', subtitle: 'Neural Networks',
    desc: 'Bangun jaringan saraf dari nol. Sambungkan neuron & lihat AI belajar berpikir.',
    color: '#00D4FF', icon: '🧠', xp: '+250 XP', diff: 'Menantang', diffColor: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    tag: 'Populer', span: 'featured', gradient: 'from-[#00D4FF]/10 to-[#8B5CF6]/5',
  },
  {
    id: 'data-sorter', title: 'Data Sorter', subtitle: 'Data Science',
    desc: 'Pilih data bersih vs korup. Latih AI supaya adil dan tidak bias.',
    color: '#8B5CF6', icon: '📊', xp: '+200 XP', diff: 'Cepat', diffColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    span: 'normal', gradient: 'from-[#8B5CF6]/10 to-transparent',
  },
  {
    id: 'prompt-wizard', title: 'Prompt Wizard', subtitle: 'LLM Prompting',
    desc: 'Susun instruksi jelas agar AI menjawab lebih cerdas dan akurat.',
    color: '#06B6D4', icon: '🪄', xp: '+220 XP', diff: 'Sedang', diffColor: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    span: 'normal', gradient: 'from-[#06B6D4]/10 to-transparent',
  },
  {
    id: 'model-showdown', title: 'Model Showdown', subtitle: 'Model Selection',
    desc: 'Pilih model AI terbaik untuk kasus nyata. Pelajari F1, ROC, bias-variance.',
    color: '#10B981', icon: '⚔️', xp: '+230 XP', diff: 'Menantang', diffColor: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    span: 'normal', gradient: 'from-[#10B981]/10 to-transparent',
  },
  {
    id: 'overfitting-escape', title: 'Overfitting Escape', subtitle: 'Hyperparameters',
    desc: 'Atur hyperparameter live. Cegah model menghafal terlalu dalam (overfitting).',
    color: '#F59E0B', icon: '🚨', xp: '+240 XP', diff: 'Expert', diffColor: 'bg-red-500/15 text-red-400 border-red-500/30',
    span: 'wide', gradient: 'from-[#F59E0B]/10 to-[#EF4444]/5',
  },
  {
    id: 'ethical-judge', title: 'Ethical AI Judge', subtitle: 'AI Ethics',
    desc: 'Putuskan apakah sistem AI sudah adil, transparan, dan etis di dunia nyata.',
    color: '#EF4444', icon: '⚖️', xp: '+210 XP', diff: 'Sedang', diffColor: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    span: 'normal', gradient: 'from-[#EF4444]/10 to-transparent',
  },
  {
    id: 'hyperparameter-sandbox', title: 'Model Tuner', subtitle: 'Pro Sandbox',
    desc: 'Eksperimen parameter model langsung. Atur suhu, dropout, layer — lihat dampaknya.',
    color: '#06B6D4', icon: '🎛️', xp: '+250 XP', diff: 'Pro', diffColor: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    tag: 'Baru!', span: 'full', gradient: 'from-[#06B6D4]/10 via-[#8B5CF6]/5 to-transparent',
  },
] as const;

type GameId = typeof GAMES[number]['id'];

function getLevelInfo(xp: number) {
  if (xp < 150)  return { level: 1, title: 'AI Newbie',          color: '#94a3b8', req: 150,  prev: 0    };
  if (xp < 400)  return { level: 2, title: 'Data Wrangler',      color: '#60a5fa', req: 400,  prev: 150  };
  if (xp < 800)  return { level: 3, title: 'Prompt Hacker',      color: '#22d3ee', req: 805,  prev: 400  };
  if (xp < 1300) return { level: 4, title: 'Model Selector',     color: '#34d399', req: 1300, prev: 800  };
  if (xp < 2000) return { level: 5, title: 'Overfitting Hunter', color: '#fb923c', req: 2000, prev: 1300 };
  return           { level: 6, title: 'AI Ethicist',             color: '#c084fc', req: 3000, prev: 2000 };
}

const AI_TIPS = [
  '"Suhu (Temperature) LLM ibarat api panggangan. Makin tinggi, makin kreatif — tapi makin rawan halusinasi!"',
  '"Overfitting terjadi saat model terlalu haus hafalan. Cegah dengan Dropout atau regularisasi L2!"',
  '"Sigmoid mengompres angka menjadi probabilitas 0–1. Cocok untuk klasifikasi biner!"',
  '"Garbage-In, Garbage-Out (GIGO) — data kotor menghasilkan prediksi yang tidak bisa dipercaya!"',
  '"Bias jaringan saraf seperti geseran kemudi. Walau input nol, bias tetap menggerakkan aktivasi!"',
];
const AI_JOKES = [
  '"Ada 99 bug di kode, kupakai AI untuk fix-nya. Sekarang aku punya 143 bug dan 1 AI pemarah!"',
  '"Kenapa neural network senang ke pantai? Mau mandi di ombak Tensor!"',
  '"LLM tidak pernah jatuh cinta — bingung bedain relasi nyata dan statistik probabilitas token!"',
  '"Ku-train AI untuk diet, tapi dia gradient descent terus sampai berat badannya NaN!"',
];

// ─────────────────────────────────────────────
// SMALL PURE COMPONENTS
// ─────────────────────────────────────────────

function XpBar({ xp, lvl }: { xp: number; lvl: ReturnType<typeof getLevelInfo> }) {
  const pct = Math.min(100, Math.max(4, ((xp - lvl.prev) / (lvl.req - lvl.prev)) * 100));
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1 px-0.5">
        <span className="text-[10px] font-bold font-mono tracking-widest uppercase" style={{ color: lvl.color }}>
          Level {lvl.level} · {lvl.title}
        </span>
        <span className="text-[10px] font-mono text-slate-500">{xp} / {lvl.req} XP</span>
      </div>
      <div className="h-2 rounded-full bg-slate-900/80 border border-slate-800/60 overflow-hidden">
        <div className="xp-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function LevelBadge({ lvl }: { lvl: ReturnType<typeof getLevelInfo> }) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <div className="hidden sm:block text-right leading-tight">
        <div className="text-[9px] font-mono text-slate-600 uppercase tracking-wider">Rank</div>
        <div className="text-[11px] font-black font-display" style={{ color: lvl.color }}>{lvl.title}</div>
      </div>
      <div className="level-ring shrink-0" style={{ borderColor: lvl.color, color: lvl.color, boxShadow: `0 0 12px ${lvl.color}55` }}>
        {lvl.level}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// GAME CARD
// ─────────────────────────────────────────────

type GamePortal = typeof GAMES[number];

function GameCard({ g, done, onClick }: { g: GamePortal; done: boolean; onClick: () => void }) {
  const isWide     = g.span === 'wide' || g.span === 'full';
  const isFeatured = g.span === 'featured';
  const colSpan    = g.span === 'full' ? 'sm:col-span-2 lg:col-span-3' : g.span === 'wide' ? 'sm:col-span-2' : '';

  return (
    <button
      type="button"
      className={`game-card card-shine text-left p-4 sm:p-5 ${colSpan}`}
      aria-label={`Mainkan ${g.title}`}
      style={{
        background: `linear-gradient(135deg, #0d1424 0%, ${g.color}0a 100%)`,
        borderColor: `${g.color}2a`,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget;
        el.style.borderColor = `${g.color}60`;
        el.style.boxShadow   = `0 8px 40px ${g.color}18, 0 0 0 1px ${g.color}22`;
        sfx.playHoverTheme?.(g.id);
      }}
      onMouseLeave={e => {
        const el = e.currentTarget;
        el.style.borderColor = `${g.color}2a`;
        el.style.boxShadow   = '';
      }}
      onClick={onClick}
    >
      {/* Ambient orb */}
      <div className="orb" style={{ background: g.color }} />

      {/* Tag / done */}
      {done
        ? <div className="done-check">✓</div>
        : g.tag && <div className="new-pill">{g.tag}</div>
      }

      <div className={`relative z-10 flex ${isWide ? 'flex-col sm:flex-row sm:items-center sm:gap-5' : 'flex-col'} gap-4 h-full`}>
        {/* Icon */}
        <div
          className={`${isFeatured ? 'w-14 h-14 text-3xl' : 'w-11 h-11 text-2xl'} rounded-xl border flex items-center justify-center shrink-0`}
          style={{ background: `${g.color}14`, borderColor: `${g.color}35` }}
        >
          {g.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <h3 className={`font-black font-display text-white uppercase tracking-wide leading-tight ${isFeatured ? 'text-base' : 'text-[13px]'}`}>
                {g.title}
              </h3>
              <p className="text-[10px] font-mono text-slate-500 mt-0.5 tracking-wider">{g.subtitle}</p>
            </div>
            {!isFeatured && (
              <span className="text-[10px] font-bold font-mono text-slate-500 shrink-0">{g.xp}</span>
            )}
          </div>

          <p className={`text-slate-400 mt-2 leading-relaxed ${isFeatured ? 'text-[12px]' : 'text-[11px]'} ${g.span !== 'featured' ? 'line-clamp-2' : ''}`}>
            {g.desc}
          </p>

          <div className="flex items-center justify-between mt-3 pt-2.5 border-t" style={{ borderColor: `${g.color}18` }}>
            <span className={`tag ${g.diffColor}`}>{g.diff}</span>
            {isFeatured && (
              <span className="text-[11px] font-bold font-mono" style={{ color: g.color }}>{g.xp}</span>
            )}
            <div className="flex items-center gap-1 text-slate-600 group-hover:text-slate-300 transition-colors">
              <Play size={11} className="fill-current" />
              <span className="text-[10px] font-semibold">Main</span>
              <ChevronRight size={12} />
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────
// LEADERBOARD PANEL
// ─────────────────────────────────────────────

function LeaderboardPanel({ leaderboard, playerName, xp, setPlayerName, onSave }: {
  leaderboard: LeaderboardEntry[]; playerName: string; xp: number;
  setPlayerName: (n: string) => void; onSave: () => void;
}) {
  const medals = ['🥇','🥈','🥉'];
  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2 pb-3 border-b border-white/5">
        <Trophy size={14} className="text-amber-400" />
        <h4 className="text-[11px] font-black font-display text-slate-300 uppercase tracking-widest flex-1">Leaderboard</h4>
        <span className="text-[9px] font-mono text-slate-600">Top 6</span>
      </div>

      <div className="space-y-1.5">
        {leaderboard.slice(0, 6).map((e, i) => {
          const isMe = e.name.toLowerCase() === playerName.trim().toLowerCase();
          return (
            <div key={`${e.name}-${e.xp}`} className={`lb-row ${isMe ? 'me' : ''}`}>
              <div className="flex items-center gap-2.5">
                <span className="text-base w-5 text-center leading-none">{medals[i] ?? `#${i+1}`}</span>
                <div>
                  <div className={`text-[11px] font-semibold truncate max-w-[110px] ${isMe ? 'text-[#00D4FF]' : 'text-slate-200'}`}>{e.name}</div>
                  <div className="text-[9px] font-mono text-slate-600">Level {e.level}</div>
                </div>
              </div>
              <div className="text-[11px] font-bold font-mono text-slate-300">{e.xp}<span className="text-[9px] text-slate-600 ml-0.5">XP</span></div>
            </div>
          );
        })}
        {leaderboard.length === 0 && (
          <p className="text-center text-[11px] text-slate-600 py-4">Belum ada data. Mainkan game dulu!</p>
        )}
      </div>

      <div className="pt-3 border-t border-white/5 space-y-2">
        <label className="text-[9px] uppercase tracking-widest text-slate-600 font-mono block">Nama Pemainmu</label>
        <input
          value={playerName}
          onChange={e => setPlayerName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSave()}
          className="field text-sm"
          placeholder="Masukkan nama…"
          aria-label="Nama pemain"
          maxLength={20}
        />
        <button
          onClick={onSave}
          className="btn-primary w-full rounded-xl py-2.5 text-[11px] font-bold uppercase tracking-widest"
        >
          Simpan & Perbarui
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ACHIEVEMENTS PANEL
// ─────────────────────────────────────────────

function AchievementsPanel({ achievements, onSoundTest, onReset }: {
  achievements: Achievement[]; onSoundTest: () => void; onReset: () => void;
}) {
  const unlocked = achievements.filter(a => a.unlocked).length;
  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2 pb-3 border-b border-white/5">
        <Star size={14} className="text-purple-400" />
        <h4 className="text-[11px] font-black font-display text-slate-300 uppercase tracking-widest flex-1">Prestasi</h4>
        <span className="text-[10px] font-mono bg-slate-800/70 text-slate-400 px-2 py-0.5 rounded-full">
          {unlocked}/{achievements.length}
        </span>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-2">
        {achievements.map(a => (
          <div
            key={a.id}
            data-tip={`${a.title}: ${a.hint}`}
            className={`ach-badge ${a.unlocked ? 'unlocked' : 'locked'}`}
          >
            {a.title.split(' ')[0]}
          </div>
        ))}
      </div>

      {unlocked > 0 ? (
        <div className="space-y-1.5 max-h-32 overflow-y-auto">
          {achievements.filter(a => a.unlocked).slice(0, 3).map(a => (
            <div key={a.id} className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-950/50 border border-white/4 text-[10px]">
              <span className="text-base shrink-0">{a.title.split(' ')[0]}</span>
              <div className="min-w-0">
                <div className="font-semibold text-slate-200 truncate">{a.title}</div>
                <div className="text-slate-500 truncate">{a.desc}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-[10px] text-slate-600 italic py-1">
          🎯 Selesaikan game untuk buka lencana pertama!
        </p>
      )}

      <div className="pt-2 border-t border-white/5 flex justify-between">
        <button onClick={onSoundTest} className="flex items-center gap-1.5 text-[9px] font-mono text-[#00D4FF] uppercase tracking-widest hover:text-white transition-colors">
          <Volume2 size={11}/> Test Synth
        </button>
        <button onClick={onReset} className="text-[9px] font-mono text-red-500/50 uppercase tracking-widest hover:text-red-400 transition-colors">
          Reset Progress
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// AIKO COMPANION
// ─────────────────────────────────────────────

function AikoPanel({ expr, speech, onTheory, onJoke }: {
  expr: string; speech: string; onTheory: () => void; onJoke: () => void;
}) {
  return (
    <div className="aiko-card p-5">
      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl" style={{ animation: 'float 3s ease-in-out infinite' }}>{expr}</span>
          <div>
            <span className="text-[9px] bg-white/15 backdrop-blur px-2 py-0.5 rounded font-display font-black text-white tracking-widest uppercase">AIKO AI</span>
            <p className="text-[9px] text-purple-300/50 mt-0.5 font-mono">Companion Bot v2</p>
          </div>
          <Brain size={16} className="ml-auto text-purple-300/30" />
        </div>

        <div
          role="status" aria-live="polite"
          className="text-[11px] text-purple-100 leading-relaxed bg-white/8 rounded-xl p-3 border border-white/10 italic min-h-[3.5rem]"
        >
          {speech}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button onClick={onTheory} className="py-2 rounded-lg bg-white/10 hover:bg-white/18 active:scale-95 text-[10px] font-mono text-white transition-all border border-white/10">
            💡 Minta Teori
          </button>
          <button onClick={onJoke} className="py-2 rounded-lg bg-white/10 hover:bg-white/18 active:scale-95 text-[10px] font-mono text-white transition-all border border-white/10">
            ✨ Joke AI
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ONBOARDING MODAL
// ─────────────────────────────────────────────

function WelcomeModal({ onStart, onDismiss }: { onStart: () => void; onDismiss: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,.82)', backdropFilter: 'blur(8px)' }}
      onClick={onDismiss}
    >
      <div
        className="glass-elevated modal-enter w-full max-w-lg rounded-2xl p-6 sm:p-8"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
      >
        {/* Header */}
        <div className="text-center mb-7">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl"
            style={{ background: 'linear-gradient(135deg, #00D4FF22, #8B5CF622)', border: '1px solid rgba(0,212,255,.25)' }}>
            🤖
          </div>
          <h2 id="welcome-title" className="text-2xl sm:text-3xl font-black text-white leading-tight">
            Selamat Datang di<br />
            <span className="text-gradient">AI Arena! 🚀</span>
          </h2>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            Platform belajar AI Engineering paling seru — tanpa perlu latar belakang teknis!
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-3 mb-7 sm:grid-cols-3">
          {[
            { n: '1', icon: '🎮', title: 'Pilih Game', desc: 'Klik kartu game apa pun — setiap game mengajarkan konsep AI yang berbeda.' },
            { n: '2', icon: '⚡', title: 'Kumpulkan XP', desc: 'Jawab tantangan dan kumpulkan XP untuk naik level & buka badges.' },
            { n: '3', icon: '🏆', title: 'Jadi Ahli AI', desc: 'Selesaikan semua game dan raih gelar AI Master Scholar!' },
          ].map(s => (
            <div key={s.n} className="step-card text-center">
              <div className="text-2xl mb-2">{s.icon}</div>
              <h3 className="text-[11px] font-bold text-white uppercase tracking-wide mb-1">{s.title}</h3>
              <p className="text-[10px] text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={onStart}
          className="btn-primary w-full rounded-xl py-3.5 text-sm font-black uppercase tracking-widest mb-3"
        >
          Mulai Petualangan AI! 🚀
        </button>
        <button
          onClick={onDismiss}
          className="w-full text-[11px] font-semibold text-slate-600 hover:text-slate-300 transition-colors uppercase tracking-widest"
        >
          Jangan tampilkan lagi
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// TIP BANNER
// ─────────────────────────────────────────────

function TipBanner() {
  const [tip, setTip] = useState(AI_TIPS[0]);
  return (
    <div className="challenge-banner gap-3 sm:gap-4">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: 'rgba(245,158,11,.15)', border: '1px solid rgba(245,158,11,.3)' }}>
        <Lightbulb size={17} className="text-amber-400" style={{ animation: 'glow-pulse 2s ease-in-out infinite' }} />
      </div>
      <div className="flex-1 min-w-0">
        <h5 className="text-[10px] font-bold text-amber-300 uppercase tracking-widest mb-0.5">Tip Harian AI</h5>
        <p className="text-[11px] text-slate-400 leading-relaxed">{tip}</p>
      </div>
      <button
        onClick={() => setTip(AI_TIPS[Math.floor(Math.random() * AI_TIPS.length)])}
        className="shrink-0 text-[9px] font-mono text-amber-400/70 hover:text-amber-300 transition-colors uppercase tracking-wider"
      >
        Acak
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────

type Tab = 'games' | 'map' | 'codex' | 'leaderboard' | 'achievements';

export default function App() {
  /* ── state ── */
  const [xp, setXp]   = useState(() => parseInt(localStorage.getItem('cachedXpCount') || '0', 10));
  const [done, setDone] = useState<string[]>(() => JSON.parse(localStorage.getItem('cachedCompletedGames') || '[]'));
  const [achievements, setAch] = useState<Achievement[]>(() => {
    const c = localStorage.getItem('cachedAchievements');
    return c ? JSON.parse(c) : ACHIEVEMENTS;
  });
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('playerName') || 'Player');
  const [leaderboard, setLb] = useState<LeaderboardEntry[]>(() => {
    const c = localStorage.getItem('cachedLeaderboard');
    return c ? JSON.parse(c) : [{ name: 'Aiko', xp: 0, level: 1, updatedAt: new Date().toISOString() }];
  });
  const [sound, setSound] = useState(() => localStorage.getItem('soundEnabled') !== 'false');
  const [interacted, setInteracted] = useState(false);
  const [welcome, setWelcome] = useState(() => localStorage.getItem('seenOnboarding') !== 'true');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('games');
  const [streak, setStreak] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpTitle, setLevelUpTitle] = useState('');

  const [aiExpr, setAiExpr] = useState<'😊'|'🤔'|'🎉'>('😊');
  const [aiSpeech, setAiSpeech] = useState(
    '"Halo! Selamat datang di AI Arena — pilih salah satu game di bawah untuk mulai belajar AI secara seru!"'
  );

  /* ── persist ── */
  useEffect(() => { localStorage.setItem('cachedXpCount', xp.toString()); }, [xp]);
  useEffect(() => { localStorage.setItem('cachedCompletedGames', JSON.stringify(done)); }, [done]);
  useEffect(() => { localStorage.setItem('cachedAchievements', JSON.stringify(achievements)); }, [achievements]);
  useEffect(() => { localStorage.setItem('playerName', playerName); }, [playerName]);
  useEffect(() => { localStorage.setItem('cachedLeaderboard', JSON.stringify(leaderboard)); }, [leaderboard]);
  useEffect(() => { localStorage.setItem('soundEnabled', sound.toString()); sfx.setMuted(!sound); }, [sound]);

  /* ── close drawer on desktop ── */
  useEffect(() => {
    const mq = window.matchMedia('(min-width:1024px)');
    const h = (e: MediaQueryListEvent) => { if (e.matches) setDrawerOpen(false); };
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  const lvl = getLevelInfo(xp);

  const firstTouch = () => { if (!interacted) { setInteracted(true); sfx.resume?.(); } };

  /* ── leaderboard ── */
  const saveLb = useCallback((name: string, newXp: number) => {
    const n = name.trim() || 'Player';
    setLb(prev => {
      const next = [...prev];
      const idx = next.findIndex(e => e.name.toLowerCase() === n.toLowerCase());
      const entry: LeaderboardEntry = { name: n, xp: newXp, level: getLevelInfo(newXp).level, updatedAt: new Date().toISOString() };
      if (idx >= 0) next[idx] = newXp >= next[idx].xp ? entry : { ...next[idx], level: getLevelInfo(next[idx].xp).level, updatedAt: new Date().toISOString() };
      else next.push(entry);
      return next.sort((a,b) => b.xp !== a.xp ? b.xp - a.xp : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0,12);
    });
  }, []);

  /* ── achievements ── */
  const unlock = useCallback((id: string) => {
    setAch(prev => prev.map(a => {
      if (a.id === id && !a.unlocked) {
        sfx.play('levelUp');
        setAiExpr('🎉');
        setAiSpeech(`"WUHU! Kamu baru saja membuka lencana: ${a.title}! Keren banget! 🎊"`);
        return { ...a, unlocked: true };
      }
      return a;
    }));
  }, []);

  /* ── score ── */
  const onScore = useCallback((correct: boolean) => {
    if (correct) {
      setStreak(p => { const n = p+1; if (n>=5) unlock('streak_fever'); return n; });
    } else setStreak(0);
  }, [unlock]);

  /* ── game done ── */
  const onGameDone = useCallback((gameId: string, xpReward: number, badgeId?: string) => {
    sfx.play('levelUp');
    const nextXp  = xp + xpReward;
    const prevLvl = getLevelInfo(xp).level;
    const nextLvl = getLevelInfo(nextXp).level;
    setXp(nextXp);
    saveLb(playerName, nextXp);
    if (nextLvl > prevLvl) {
      setTimeout(() => sfx.play('levelUp'), 400);
      setAiExpr('🎉');
      setAiSpeech(`"LEVEL UP ke Level ${nextLvl}! Kamu makin jago dalam AI! 🚀"`);
      setLevelUpTitle(getLevelInfo(nextXp).title);
      setShowLevelUp(true);
    }
    if (!done.includes(gameId)) {
      const next = [...done, gameId];
      setDone(next);
      if (next.length >= 6) unlock('ai_master');
    }
    if (badgeId) unlock(badgeId);
    if (nextLvl >= 3) unlock('super_scholar');
    if (nextLvl >= 6) unlock('super_nerd');
    setActiveGame(null);
  }, [xp, playerName, done, saveLb, unlock]);

  /* ── aiko ── */
  const aiTheory = () => { sfx.play('hover'); setAiExpr('🤔'); setAiSpeech(AI_TIPS[Math.floor(Math.random()*AI_TIPS.length)]); };
  const aiJoke   = () => { sfx.play('hover'); setAiExpr('😊'); setAiSpeech(AI_JOKES[Math.floor(Math.random()*AI_JOKES.length)]); };

  /* ── sound test ── */
  const soundTest = () => { sfx.play('hover'); unlock('sound_pioneer'); };

  /* ── reset ── */
  const resetAll = () => {
    if (!window.confirm('Reset semua progress? Tindakan ini tidak bisa dibatalkan!')) return;
    localStorage.clear();
    setXp(0); setDone([]); setAch(ACHIEVEMENTS); setActiveGame(null); setStreak(0);
    setAiExpr('😊'); setAiSpeech('"Progress dihapus. Yuk mulai lagi dari nol! 💪"');
    sfx.play('wrong');
  };

  /* ── render game ── */
  const renderGame = () => {
    const props = { onActionScore: onScore };
    switch (activeGame) {
      case 'neuron-builder':       return <NeuronBuilder        {...props} onComplete={(x,b) => onGameDone('neuron-builder',x,b)} />;
      case 'data-sorter':          return <DataSorter           {...props} onComplete={(x,b) => onGameDone('data-sorter',x,b)} />;
      case 'prompt-wizard':        return <PromptWizard         {...props} onComplete={(x,b) => onGameDone('prompt-wizard',x,b)} />;
      case 'model-showdown':       return <ModelShowdown        {...props} onComplete={(x,b) => onGameDone('model-showdown',x,b)} />;
      case 'overfitting-escape':   return <OverfittingEscape    {...props} onComplete={(x,b) => onGameDone('overfitting-escape',x,b)} />;
      case 'ethical-judge':        return <EthicalJudge         {...props} onComplete={(x,b) => onGameDone('ethical-judge',x,b)} />;
      case 'hyperparameter-sandbox': return <HyperparameterSandbox {...props} onComplete={(x,b) => onGameDone('hyperparameter-sandbox',x,b)} />;
      default: return null;
    }
  };

  /* ── sidebar content (shared between drawer & desktop) ── */
  const Sidebar = () => (
    <div className="flex flex-col gap-4">
      <LeaderboardPanel
        leaderboard={leaderboard}
        playerName={playerName}
        xp={xp}
        setPlayerName={setPlayerName}
        onSave={() => saveLb(playerName, xp)}
      />
      <AchievementsPanel achievements={achievements} onSoundTest={soundTest} onReset={resetAll} />
      <AikoPanel expr={aiExpr} speech={aiSpeech} onTheory={aiTheory} onJoke={aiJoke} />
    </div>
  );

  /* ── bottom nav tabs ── */
  const navItems: { id: Tab; icon: React.ReactNode; label: string; action?: () => void }[] = [
    { id: 'games',        icon: <Cpu size={20}/>,       label: 'Games',   action: () => { setTab('games'); setActiveGame(null); } },
    { id: 'map',          icon: <Globe size={20}/>,     label: 'Peta',    action: () => { setTab('map');   setActiveGame(null); } },
    { id: 'codex',        icon: <BookOpen size={20}/>,  label: 'Codex',   action: () => { setTab('codex'); setActiveGame(null); } },
    { id: 'leaderboard',  icon: <Trophy size={20}/>,    label: 'Ranking', action: () => { setTab('leaderboard'); setActiveGame(null); } },
    { id: 'achievements', icon: <Star size={20}/>,      label: 'Badges',  action: () => { setTab('achievements'); setActiveGame(null); } },
  ];

  // ── JSX ──
  return (
    <div className="app-bg scanlines" onPointerDown={firstTouch}>

      {/* ── WELCOME MODAL ── */}
      {welcome && (
        <WelcomeModal
          onStart={() => { setWelcome(false); localStorage.setItem('seenOnboarding','true'); }}
          onDismiss={() => { setWelcome(false); localStorage.setItem('seenOnboarding','true'); }}
        />
      )}

      {/* ── LEVEL UP ── */}
      <LevelUpOverlay visible={showLevelUp} levelTitle={levelUpTitle} onClose={() => setShowLevelUp(false)} />

      {/* ── DRAWER OVERLAY ── */}
      <div className={`drawer-overlay ${drawerOpen ? 'open' : ''}`} onClick={() => setDrawerOpen(false)} aria-hidden />

      {/* ═══════════════════════════════════
          CONTENT
      ═══════════════════════════════════ */}
      <div className="relative z-10 flex flex-col min-h-dvh">

        {/* ── HEADER ── */}
        <header className="sticky top-0 z-50 glass border-b border-white/6">
          <div className="wrap">
            <div className="flex items-center gap-3 py-3">

              {/* Back / Logo */}
              <div className="flex items-center gap-2.5 shrink-0">
                {activeGame && (
                  <button
                    onClick={() => { sfx.play('hover'); setActiveGame(null); }}
                    className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                    aria-label="Kembali"
                  >
                    <ArrowLeft size={15} />
                  </button>
                )}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: 'linear-gradient(135deg,#00D4FF,#8B5CF6)', boxShadow: '0 0 18px rgba(0,212,255,.35)' }}
                >
                  🤖
                </div>
                <div className="hidden xs:block">
                  <h1 className="text-[13px] font-black font-display tracking-widest text-white leading-none">AI ARENA</h1>
                  <p className="text-[9px] font-mono text-slate-600 tracking-widest uppercase mt-0.5">Engineering Academy</p>
                </div>
              </div>

              {/* XP bar (desktop center) */}
              <div className="hidden md:block flex-1 max-w-sm lg:max-w-md mx-4">
                <XpBar xp={xp} lvl={lvl} />
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 ml-auto">
                {/* Mobile XP pill */}
                <div className="flex md:hidden items-center gap-1.5 bg-[#00D4FF]/10 border border-[#00D4FF]/25 rounded-full px-2.5 py-1">
                  <Zap size={11} className="text-[#00D4FF]" />
                  <span className="text-[11px] font-bold font-mono text-[#00D4FF]">{xp} XP</span>
                </div>

                <button
                  onClick={() => setSound(s => !s)}
                  className="w-9 h-9 rounded-xl border border-white/8 bg-white/4 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                  aria-label={sound ? 'Matikan suara' : 'Nyalakan suara'}
                  data-tip={sound ? 'Matikan suara' : 'Nyalakan suara'}
                >
                  {sound ? <Volume2 size={15}/> : <VolumeX size={15}/>}
                </button>

                <button
                  onClick={() => setWelcome(true)}
                  className="hidden sm:flex w-9 h-9 rounded-xl border border-white/8 bg-white/4 items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                  aria-label="Tutorial"
                  data-tip="Tutorial"
                >
                  <Info size={15}/>
                </button>

                <LevelBadge lvl={lvl} />

                {/* Sidebar toggle (mobile) */}
                <button
                  onClick={() => setDrawerOpen(p => !p)}
                  className="lg:hidden w-9 h-9 rounded-xl border border-white/8 bg-white/4 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                  aria-label="Panel Info"
                >
                  <Menu size={15}/>
                </button>
              </div>
            </div>

            {/* XP bar row — mobile only */}
            <div className="md:hidden pb-3 -mt-1">
              <XpBar xp={xp} lvl={lvl} />
            </div>
          </div>
        </header>

        {/* ── HERO BANNER (dashboard only) ── */}
        {!activeGame && (
          <div className="wrap pt-5 pb-1">
            <div className="glass-card rounded-2xl p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="hero-chip mb-3">
                    <span className="dot" />
                    Akademi AI Engineering
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-[1.15]">
                    Belajar AI sambil<br className="hidden sm:block"/>
                    <span className="text-gradient"> bermain game.</span> 🎯
                  </h2>
                  <p className="mt-3 text-sm text-slate-400 leading-relaxed max-w-md">
                    7 game interaktif untuk belajar konsep AI dari nol.
                    Kumpulkan XP, naik level, dan buka badges — tanpa perlu pengalaman sebelumnya!
                  </p>
                </div>

                {/* Steps */}
                <div className="flex sm:flex-col gap-2 sm:gap-2 shrink-0">
                  {[
                    { n:'1', label:'Pilih game', color:'#00D4FF' },
                    { n:'2', label:'Kerjakan soal', color:'#8B5CF6' },
                    { n:'3', label:'Dapat XP & Badges', color:'#10B981' },
                  ].map(s => (
                    <div key={s.n} className="flex items-center gap-2.5 rounded-xl px-3 py-2 bg-white/4 border border-white/6 flex-1 sm:flex-none sm:w-44">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black font-display shrink-0"
                        style={{ background: `${s.color}22`, color: s.color, border: `1px solid ${s.color}40` }}>
                        {s.n}
                      </div>
                      <span className="text-[11px] font-semibold text-slate-300">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-5 pt-5 border-t border-white/5">
                {[
                  { icon: <Zap size={15} className="text-[#00D4FF]"/>, val: `${xp}`, unit:'XP', label:'Total XP' },
                  { icon: <Target size={15} className="text-purple-400"/>, val:`${done.length}`, unit:'/7', label:'Game Selesai' },
                  { icon: <Award size={15} className="text-amber-400"/>, val:`${achievements.filter(a=>a.unlocked).length}`, unit:'/12', label:'Badges' },
                ].map(s => (
                  <div key={s.label} className="stat-card">
                    <div className="flex justify-center mb-1">{s.icon}</div>
                    <div className="text-base font-black font-mono text-white">
                      {s.val}<span className="text-slate-500 text-xs">{s.unit}</span>
                    </div>
                    <div className="text-[9px] text-slate-600 uppercase tracking-wider mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── MAIN ── */}
        <main className="flex-1 wrap py-5 main-pad">
          <div className="flex gap-6 items-start">

            {/* ── CENTER COLUMN ── */}
            <div className="flex-1 min-w-0 flex flex-col gap-5">

              {/* Desktop tab bar */}
              {!activeGame && (
                <div className="hidden lg:block">
                  <div className="tab-bar w-fit">
                    {([
                      { id:'games', icon:<Cpu size={13}/>, label:'🎮 Arena Game' },
                      { id:'map',   icon:<Globe size={13}/>, label:'🌐 Peta Galaksi' },
                      { id:'codex', icon:<BookOpen size={13}/>, label:'📚 Codex Materi' },
                    ] as { id: Tab; icon: React.ReactNode; label: string }[]).map(t => (
                      <button key={t.id} className={`tab-btn ${tab===t.id?'active':''}`} onClick={() => setTab(t.id)}>
                        {t.icon} {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Mobile tab bar */}
              {!activeGame && (
                <div className="lg:hidden tab-bar">
                  {([
                    { id:'games',        icon:<Cpu size={12}/>,      label:'Games' },
                    { id:'map',          icon:<Globe size={12}/>,    label:'Peta' },
                    { id:'codex',        icon:<BookOpen size={12}/>, label:'Codex' },
                    { id:'leaderboard',  icon:<Trophy size={12}/>,   label:'Ranking' },
                    { id:'achievements', icon:<Star size={12}/>,     label:'Badges' },
                  ] as { id: Tab; icon: React.ReactNode; label: string }[]).map(t => (
                    <button key={t.id} className={`tab-btn ${tab===t.id?'active':''}`} onClick={() => setTab(t.id)}>
                      {t.icon} <span className="hidden xs:inline">{t.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* ── GAME ARENA ── */}
              {activeGame ? (
                <div style={{ animation: 'fade-in .3s ease-out' }}>
                  {renderGame()}
                </div>
              ) : (
                <>
                  {/* GAMES TAB */}
                  <div className={tab === 'games' ? 'block' : 'hidden'}>
                    {/* Daily challenge */}
                    <div className="mb-5">
                      <DailyChallenge />
                    </div>

                    {/* Section title */}
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[11px] font-black font-display text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Sparkles size={12} className="text-[#00D4FF]" />
                        Pilih Game Arena
                      </h3>
                      <span className="text-[10px] font-mono text-slate-600">{done.length} / {GAMES.length} selesai</span>
                    </div>

                    {/* Game grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {GAMES.map(g => (
                        <GameCard
                          key={g.id}
                          g={g as any}
                          done={done.includes(g.id)}
                          onClick={() => { sfx.play('hover'); setActiveGame(g.id); }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* MAP TAB */}
                  <div className={tab === 'map' ? 'block' : 'hidden'}>
                    <WorldMap
                      activePlanet={activeGame ?? undefined}
                      onSelectPlanet={id => { sfx.play('hover'); setActiveGame(id); }}
                      completedGames={done}
                    />
                  </div>

                  {/* CODEX TAB */}
                  <div className={tab === 'codex' ? 'block' : 'hidden'}>
                    <Codex />
                  </div>

                  {/* LEADERBOARD TAB (mobile) */}
                  <div className={`lg:hidden ${tab === 'leaderboard' ? 'block' : 'hidden'}`}>
                    <LeaderboardPanel
                      leaderboard={leaderboard}
                      playerName={playerName}
                      xp={xp}
                      setPlayerName={setPlayerName}
                      onSave={() => saveLb(playerName, xp)}
                    />
                  </div>

                  {/* ACHIEVEMENTS TAB (mobile) */}
                  <div className={`lg:hidden ${tab === 'achievements' ? 'block' : 'hidden'}`}>
                    <AchievementsPanel achievements={achievements} onSoundTest={soundTest} onReset={resetAll} />
                    <div className="mt-4">
                      <AikoPanel expr={aiExpr} speech={aiSpeech} onTheory={aiTheory} onJoke={aiJoke} />
                    </div>
                  </div>
                </>
              )}

              {/* Tip banner (always visible) */}
              <TipBanner />
            </div>

            {/* ── DESKTOP SIDEBAR ── */}
            <aside className="hidden lg:flex flex-col gap-4 w-[17rem] xl:w-[19rem] shrink-0">
              <Sidebar />
            </aside>
          </div>
        </main>

        {/* ── FOOTER ── */}
        <footer className="wrap pb-24 lg:pb-5 pt-4 border-t border-white/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-mono text-slate-700">
            <div className="flex gap-5 flex-wrap justify-center">
              <span>PORTAL: <span className="text-[#00D4FF] font-bold">ONLINE</span></span>
              <span>LATENCY: <span className="text-emerald-400 font-bold">14ms</span></span>
              <span>VERSION: <span className="text-purple-400 font-bold">V.2.7</span></span>
            </div>
            <div className="flex gap-4">
              <button className="hover:text-slate-400 transition-colors" onClick={() => alert('AI Academy Team — for educational purposes.')}>
                TEAMS
              </button>
              <button
                className="text-[#00D4FF] font-black hover:text-white transition-colors"
                onClick={() => alert(`Rank: ${lvl.title} — ${xp} XP total!`)}
              >
                Klaim Sertifikat ↗
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* ── MOBILE DRAWER ── */}
      <div className={`drawer ${drawerOpen ? 'open' : ''}`} role="dialog" aria-label="Panel Info" aria-modal="true">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[13px] font-black font-display text-white uppercase tracking-widest">Panel Info</h2>
          <button
            onClick={() => setDrawerOpen(false)}
            className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all"
            aria-label="Tutup"
          >
            <X size={15}/>
          </button>
        </div>
        <Sidebar />
      </div>

      {/* ── BOTTOM NAV ── */}
      <nav className="bottom-nav" aria-label="Navigasi utama">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={item.action}
            className={`bnav-btn ${(tab === item.id && !activeGame) ? 'active' : ''}`}
            aria-label={item.label}
            aria-current={tab === item.id && !activeGame ? 'page' : undefined}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
