import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CODEX_CONCEPTS } from '../../data/codex/concepts';

const CATEGORIES = [
  'Semua',
  'Neural Networks',
  'Training',
  'Optimization',
  'Regularization',
  'Data Engineering',
  'Prompt Engineering',
  'ML Models',
  'Evaluation',
  'AI Ethics',
  'Fundamentals'
];

export default function Codex() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const filtered = useMemo(() => {
    return CODEX_CONCEPTS.filter((concept) => {
      const matchQuery =
        concept.title.toLowerCase().includes(query.toLowerCase()) ||
        concept.category.toLowerCase().includes(query.toLowerCase()) ||
        concept.shortDef?.toLowerCase().includes(query.toLowerCase()) ||
        concept.fullExplanation?.toLowerCase().includes(query.toLowerCase());

      const matchCategory = selectedCategory === 'Semua' || concept.category === selectedCategory;

      return matchQuery && matchCategory;
    });
  }, [query, selectedCategory]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur-xl flex flex-col gap-5"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h2 className="text-xl font-black text-white font-display uppercase tracking-wider flex items-center gap-2">
            📚 Pustaka Codex AI
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Pusat pembelajaran mandiri untuk formula, analogi, dan kode praktis AI Engineering.
          </p>
        </div>
        <div className="self-start sm:self-center px-3 py-1 text-xs font-mono font-bold rounded-lg bg-slate-950 border border-white/5 text-[#00D4FF]">
          {filtered.length} Konsep Terfilter
        </div>
      </div>

      {/* Search Input */}
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2.5">
        <input
          aria-label="Cari pustaka codex"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent text-xs text-slate-100 outline-none placeholder:text-slate-500"
          placeholder="Cari konsep (misal: RAG, perceptron, etika, dropout)..."
        />
        {query && (
          <button 
            onClick={() => setQuery('')}
            className="text-[10px] text-slate-500 hover:text-white"
          >
            Bersihkan
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1.5 pb-2 border-b border-white/5">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#8B5CF6]/20 text-[#00D4FF] border border-[#8B5CF6]/40 shadow-inner'
                  : 'bg-slate-950/40 text-slate-400 border border-white/5 hover:text-slate-200 hover:border-white/10'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Concepts Grid list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
        {filtered.map((concept) => (
          <div
            key={concept.id}
            className="rounded-2xl border border-white/6 bg-slate-950/50 p-4 transition-all hover:border-[#8B5CF6]/40 hover:bg-slate-950/80 flex flex-col gap-3"
          >
            {/* Title & Badge */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                  <span className="text-lg select-none">{concept.emoji || '📖'}</span>
                  {concept.title}
                </h3>
                <span className="text-[9px] uppercase tracking-wider font-bold font-mono text-[#8B5CF6] mt-0.5 block">
                  {concept.category}
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider font-mono border ${
                concept.difficulty === 'Pemula' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                concept.difficulty === 'Menengah' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                'bg-rose-500/10 border-rose-500/20 text-rose-450'
              }`}>
                {concept.difficulty}
              </span>
            </div>

            {/* Short & Long Definition */}
            <div className="text-xs text-slate-300 leading-relaxed font-sans">
              <p className="font-semibold text-slate-200">{concept.shortDef}</p>
              <p className="mt-1 text-slate-400 text-[11px]">{concept.fullExplanation}</p>
            </div>

            {/* Analogy */}
            <div className="rounded-xl bg-[#8B5CF6]/5 border border-[#8B5CF6]/10 p-3 text-[11px] text-purple-200 leading-relaxed italic">
              <strong>💡 Analogi:</strong> {concept.analogy}
            </div>

            {/* Formula if present */}
            {concept.formula && (
              <div className="rounded-xl bg-slate-900 border border-white/5 p-2.5 font-mono text-[10px] text-cyan-300 whitespace-pre-wrap leading-normal">
                {concept.formula}
              </div>
            )}

            {/* Code example if present */}
            {concept.codeExample && (
              <div className="rounded-xl bg-slate-900 border border-white/5 p-2.5 flex flex-col gap-1 shrink-0">
                <span className="text-[8px] uppercase tracking-wider font-bold font-mono text-slate-500">Contoh Kode Python:</span>
                <pre className="font-mono text-[9px] text-[#10B981] overflow-x-auto whitespace-pre leading-relaxed pr-1">
                  {concept.codeExample}
                </pre>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-10 text-xs text-slate-500 italic">
            Tidak menemukan konsep yang cocok dengan pencarianmu... 🔍
          </div>
        )}
      </div>
    </motion.div>
  );
}
