import React, { useState } from 'react';
import { sfx } from './AudioEngine';
import { Sparkles, Wand2, RefreshCw, Star, ArrowRight, ShieldCheck } from 'lucide-react';
import { PromptBlock, WizardQuest, BlockType } from '../types';

interface PromptWizardProps {
  onComplete: (xp: number, badgeId?: string) => void;
  onActionScore: (isCorrect: boolean) => void;
}

const WIZARD_QUESTS: WizardQuest[] = [
  {
    mission: "Misi: Tulis resep kreasi mi instan sehat untuk mahasiswa kosan.",
    requiredBlocks: [
      { type: 'ROLE', placeholder: 'Pilih Peran Ahli' },
      { type: 'TASK', placeholder: 'Pilih Tugas Utama' },
      { type: 'FORMAT', placeholder: 'Pilih Format Output' },
      { type: 'CONSTRAINT', placeholder: 'Pilih Larangan/Batasan' }
    ],
    idealCombination: ['b_role_1', 'b_task_1', 'b_format_1', 'b_const_1'],
    badExample: "Buat kreasi mi instan kosan sehat. \n\nOutput AI: Ini resep mi instan sehat: Rebus mie instan dengan bayam, wortel, dan telur. Jangan pakai bumbu mi instan. Selesai.",
    goodExample: "Kamu adalah Ahli Gizi Kuliner Bintang Lima. Tulis resep mi instan sehat untuk mahasiswa kosan dalam format 3 langkah poin-poin terurut dengan ikon emoji, batasi maksimal budget bahan Rp 15 Ribu.\n\nOutput AI:\n🍜 Langkah 1: Rebus mi instan, saring airnya, ganti dengan kuah kaldu jamur buatan sendiri.\n🥚 Langkah 2: Tambahkan sawi hijau iris dan sebutir telur rebus setengah matang.\n💵 Langkah 3: Sajikan selagi panas dengan irisan bawang putih (total budget bahan cuma Rp 11.500!)"
  }
];

const BLOCKS_POOL: PromptBlock[] = [
  { id: 'b_role_1', type: 'ROLE', text: 'Bertindaklah sebagai Ahli Gizi Kuliner Bintang Lima.', score: 25 },
  { id: 'b_role_2', type: 'ROLE', text: 'Kamu adalah penjual mi gerobak pinggir jalan.', score: 15 },
  { id: 'b_task_1', type: 'TASK', text: 'Tulis resep kreasi mi instan sehat pendorong stamina anak kosan.', score: 25 },
  { id: 'b_task_2', type: 'TASK', text: 'Ceritakan sejarah mi instan di seluruh dunia.', score: 10 },
  { id: 'b_format_1', type: 'FORMAT', text: 'Sajikan dalam format 3 langkah poin-poin terurut dengan ikon emoji.', score: 25 },
  { id: 'b_format_2', type: 'FORMAT', text: 'Tulis dalam bentuk paragraf panjang tanpa paragraf baru.', score: 10 },
  { id: 'b_const_1', type: 'CONSTRAINT', text: 'Terapkan batasan anggaran maksimal budget bahan Rp 15 Ribu.', score: 25 },
  { id: 'b_const_2', type: 'CONSTRAINT', text: 'Jangan pakai bumbu bungkusan sama sekali.', score: 20 }
];

export default function PromptWizard({ onComplete, onActionScore }: PromptWizardProps) {
  const [quest, setQuest] = useState<WizardQuest>(WIZARD_QUESTS[0]);
  const [selectedBlocks, setSelectedBlocks] = useState<Record<BlockType, PromptBlock | null>>({
    ROLE: null,
    TASK: null,
    FORMAT: null,
    CONSTRAINT: null
  });

  const [spellCast, setSpellCast] = useState(false);
  const [spellScore, setSpellScore] = useState(0);

  const handleSelectBlock = (block: PromptBlock) => {
    sfx.play('hover');
    setSelectedBlocks(prev => ({
      ...prev,
      [block.type]: block
    }));
  };

  const handleClearBlock = (type: BlockType) => {
    sfx.play('hover');
    setSelectedBlocks(prev => ({
      ...prev,
      [type]: null
    }));
  };

  const calculateScore = () => {
    let total = 0;
    (Object.keys(selectedBlocks) as BlockType[]).forEach(k => {
      const b = selectedBlocks[k];
      if (b) total += b.score;
    });
    return Math.min(100, total);
  };

  const handleCastSpell = () => {
    const score = calculateScore();
    setSpellScore(score);
    setSpellCast(true);
    sfx.play('cast');

    const isPerfect = score >= 90;
    onActionScore(isPerfect);

    if (isPerfect) {
      // Trigger magic correct sounds
      setTimeout(() => sfx.play('correct'), 300);
    } else {
      setTimeout(() => sfx.play('wrong'), 300);
    }
  };

  const handleRetry = () => {
    setSelectedBlocks({
      ROLE: null,
      TASK: null,
      FORMAT: null,
      CONSTRAINT: null
    });
    setSpellCast(false);
    setSpellScore(0);
  };

  const handleFinish = () => {
    const score = calculateScore();
    const isPerfect = score >= 90;
    onComplete(Math.round(score * 2.5), isPerfect ? 'perfect_prompt' : undefined);
  };

  const readyToCast = selectedBlocks.ROLE && selectedBlocks.TASK && selectedBlocks.FORMAT && selectedBlocks.CONSTRAINT;

  return (
    <div id="prompt_wizard_game" className="p-6 bg-[#111827] rounded-3xl border border-slate-800 text-slate-100 flex flex-col gap-6 max-h-[640px] overflow-y-auto">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black font-display text-cyan-400 tracking-wider uppercase flex items-center gap-2">
            🪄 Prompt Wizard
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Konsep: <span className="text-[#8B5CF6] font-mono">Elements of Prompt Architecture</span>
          </p>
        </div>
        <button 
          onClick={handleRetry} 
          className="p-2 border border-slate-700 rounded-lg hover:border-cyan-400 hover:text-cyan-400 transition-all bg-[#0A0E1A]"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      <div className="bg-[#0A0E1A] p-4 rounded-xl border border-slate-800 flex items-start gap-3">
        <Sparkles className="text-cyan-400 shrink-0 mt-0.5" size={18} />
        <div className="text-xs text-slate-300 leading-relaxed">
          <p className="font-bold text-white mb-1">{quest.mission}</p>
          Formulasi prompt terbaik biasanya mengandung 4 dimensi: <span className="text-rose-400 font-bold">Role</span>, <span className="text-amber-400 font-bold">Task</span>, <span className="text-green-400 font-bold">Format</span>, dan <span className="text-cyan-400 font-bold">Constraint</span>. Susun ramuan mantramu!
        </div>
      </div>

      {!spellCast ? (
        <div className="flex flex-col gap-6">
          {/* Active Wizard Slate */}
          <div className="bg-[#0c1220] border-2 border-dashed border-cyan-400/40 p-5 rounded-2xl flex flex-col gap-3 relative shadow-inner">
            <div className="text-[10px] font-bold text-cyan-400 font-mono tracking-widest uppercase mb-1">PROMPT MATRAMU (SPELL MATRIX)</div>
            
            {/* ROLE SLOT */}
            <div 
              onClick={() => selectedBlocks.ROLE && handleClearBlock('ROLE')}
              className={`p-3 rounded-xl text-xs flex justify-between items-center cursor-pointer transition-all ${
                selectedBlocks.ROLE 
                  ? 'bg-rose-500/10 border border-rose-500/40 text-rose-300 hover:bg-rose-500/20' 
                  : 'bg-slate-900/40 border border-dashed border-slate-800 text-slate-500'
              }`}
            >
              <div>
                <span className="font-bold uppercase tracking-wider text-[9px] mr-2 text-rose-400">ROLE:</span>
                {selectedBlocks.ROLE ? selectedBlocks.ROLE.text : '[Pilih Peran Ahli]'}
              </div>
              {selectedBlocks.ROLE && <span className="text-[10px] text-rose-400 font-bold">CLEAR ×</span>}
            </div>

            {/* TASK SLOT */}
            <div 
              onClick={() => selectedBlocks.TASK && handleClearBlock('TASK')}
              className={`p-3 rounded-xl text-xs flex justify-between items-center cursor-pointer transition-all ${
                selectedBlocks.TASK 
                  ? 'bg-amber-500/10 border border-amber-500/40 text-amber-300 hover:bg-amber-500/20' 
                  : 'bg-slate-900/40 border border-dashed border-slate-800 text-slate-500'
              }`}
            >
              <div>
                <span className="font-bold uppercase tracking-wider text-[9px] mr-2 text-amber-400">TASK:</span>
                {selectedBlocks.TASK ? selectedBlocks.TASK.text : '[Pilih Tugas Utama]'}
              </div>
              {selectedBlocks.TASK && <span className="text-[10px] text-amber-400 font-bold">CLEAR ×</span>}
            </div>

            {/* FORMAT SLOT */}
            <div 
              onClick={() => selectedBlocks.FORMAT && handleClearBlock('FORMAT')}
              className={`p-3 rounded-xl text-xs flex justify-between items-center cursor-pointer transition-all ${
                selectedBlocks.FORMAT 
                  ? 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20' 
                  : 'bg-slate-900/40 border border-dashed border-slate-800 text-slate-500'
              }`}
            >
              <div>
                <span className="font-bold uppercase tracking-wider text-[9px] mr-2 text-emerald-400">FORMAT:</span>
                {selectedBlocks.FORMAT ? selectedBlocks.FORMAT.text : '[Pilih Format Output]'}
              </div>
              {selectedBlocks.FORMAT && <span className="text-[10px] text-emerald-400 font-bold">CLEAR ×</span>}
            </div>

            {/* CONSTRAINT SLOT */}
            <div 
              onClick={() => selectedBlocks.CONSTRAINT && handleClearBlock('CONSTRAINT')}
              className={`p-3 rounded-xl text-xs flex justify-between items-center cursor-pointer transition-all ${
                selectedBlocks.CONSTRAINT 
                  ? 'bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20' 
                  : 'bg-slate-900/40 border border-dashed border-slate-800 text-slate-500'
              }`}
            >
              <div>
                <span className="font-bold uppercase tracking-wider text-[9px] mr-2 text-cyan-400">CONSTRAINT:</span>
                {selectedBlocks.CONSTRAINT ? selectedBlocks.CONSTRAINT.text : '[Pilih Larangan / Batasan]'}
              </div>
              {selectedBlocks.CONSTRAINT && <span className="text-[10px] text-cyan-400 font-bold">CLEAR ×</span>}
            </div>

            {/* Cast Wand Action */}
            <button
              onClick={handleCastSpell}
              disabled={!readyToCast}
              className={`mt-4 py-3 bg-gradient-to-r from-cyan-400 via-[#8B5CF6] to-cyan-400 text-white font-display font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 ${
                readyToCast 
                  ? 'hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] cursor-pointer text-shadow brightness-110' 
                  : 'opacity-40 cursor-not-allowed'
              }`}
            >
              <Wand2 size={16} /> Cast spell "PRECISE PROMPT" ✨
            </button>
          </div>

          {/* Spell blocks pool selector */}
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-widest mb-3">TUKANG SIHIR GRAHA: PERPUSTAKAAN SELEKTOR</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {BLOCKS_POOL.map((block) => (
                <button
                  key={block.id}
                  onClick={() => handleSelectBlock(block)}
                  className={`text-left p-3 rounded-xl text-xs transition-all border flex items-start gap-2 cursor-pointer ${
                    block.type === 'ROLE' ? 'bg-rose-950/20 border-rose-900/60 hover:border-rose-400' :
                    block.type === 'TASK' ? 'bg-amber-950/20 border-amber-900/60 hover:border-amber-400' :
                    block.type === 'FORMAT' ? 'bg-emerald-950/20 border-emerald-900/60 hover:border-emerald-400' :
                    'bg-cyan-950/20 border-cyan-900/60 hover:border-cyan-400'
                  }`}
                >
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                    block.type === 'ROLE' ? 'bg-rose-500/20 text-rose-300' :
                    block.type === 'TASK' ? 'bg-amber-500/20 text-amber-300' :
                    block.type === 'FORMAT' ? 'bg-emerald-500/20 text-emerald-300' :
                    'bg-cyan-500/20 text-cyan-300'
                  }`}>{block.type}</span>
                  <span className="text-slate-300 leading-tight">{block.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* SPELL OUTCOME COMPARISON BOARD */
        <div className="flex flex-col gap-6">
          {/* Spell quality score badge */}
          <div className="bg-[#0A0E1A] p-5 rounded-2xl text-center border-2 border-cyan-400 flex flex-col items-center">
            <div className="flex gap-1 text-[#F59E0B]">
              {[...Array(5)].map((_, idx) => (
                <Star 
                  key={idx} 
                  size={idx < Math.ceil(spellScore / 20) ? 20 : 16}
                  fill={idx < Math.ceil(spellScore / 20) ? '#F59E0B' : 'none'}
                  className={idx < Math.ceil(spellScore / 20) ? 'animate-bounce' : 'text-slate-700'}
                  style={{ animationDelay: `${idx * 100}ms` }}
                />
              ))}
            </div>
            <h3 className="text-xl font-bold font-display uppercase mt-3">SIHIR PROMPT SUCCESS LEVEL: {spellScore}%</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              {spellScore >= 90 
                ? "Dahsyat! Formulasimu sangat spesifik sehingga LLM mengerti persis konteks dan limitasi output yang kamu butuhkan!" 
                : "Masih lumayan. Tapi jika prompt-mu kurang spesifik (misal tidak ada Format khas atau peran khusus), output AI bisa sangat hambar dan berputar-putar."}
            </p>
          </div>

          {/* Case Side-by-side comparative panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-rose-950/10 border border-rose-500/30">
              <div className="text-[10px] font-bold text-rose-400 tracking-wider font-mono uppercase mb-2">Prompt Biasa / Sederhana (Hambar 🥱)</div>
              <p className="font-mono text-[11px] text-rose-300 leading-relaxed whitespace-pre-line">
                {quest.badExample}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-950/10 border border-emerald-500/30">
              <div className="text-[10px] font-bold text-emerald-400 tracking-wider font-mono uppercase mb-2 flex items-center gap-1">
                <ShieldCheck size={12} /> Prompt Formulatip Wizardmu (Premium ⭐)
              </div>
              <p className="font-mono text-[11px] text-emerald-300 leading-relaxed whitespace-pre-line">
                {quest.goodExample}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mt-2 pt-4 border-t border-slate-800">
            <div className="text-xs font-mono text-slate-400">
              Reward Diperoleh: <span className="text-[#00D4FF] font-bold">+{Math.round(spellScore * 2.5)} XP</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-slate-850 hover:bg-slate-800 border border-slate-750 text-slate-200 rounded-lg text-xs font-bold transition-all"
              >
                Atur Ulang Kombinator ♻
              </button>
              <button
                onClick={handleFinish}
                className="px-6 py-2 bg-[#00D4FF] hover:bg-cyan-500 text-slate-950 font-black rounded-lg text-xs uppercase transition-all"
              >
                Ambil Sihir & Lanjut <ArrowRight size={12} className="inline ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
