import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

export interface CodexConcept {
  id: string;
  title: string;
  category: string;
  summary: string;
  example: string;
}

const CONCEPTS: CodexConcept[] = [
  { id: 'perceptron', title: 'Perceptron', category: 'Neural Network', summary: 'Unit dasar jaringan saraf linear. Input diberi bobot, dijumlahkan, lalu diproses fungsi aktivasi.', example: 'y = activation(w1x1 + w2x2 + b)' },
  { id: 'backprop', title: 'Backpropagation', category: 'Training', summary: 'Algoritme penyesuaian bobot dengan memperkecil error melalui turunan loss terhadap weight.', example: 'dw = lr * dL/dw' },
  { id: 'gradient', title: 'Gradient Descent', category: 'Optimization', summary: 'Metode iteratif untuk menemukan minimum loss dengan langkah terarah menurun.', example: 'w ← w - α ∇L' },
  { id: 'dropout', title: 'Dropout', category: 'Regularization', summary: 'Menonaktifkan neuron acak selama training untuk mencegah overfitting.', example: 'dropout(p=0.5)' },
  { id: 'batchnorm', title: 'Batch Normalization', category: 'Training', summary: 'Menyamakan distribusi output layer agar training lebih stabil dan cepat.', example: 'x̂ = (x - μ) / √(σ² + ε)' },
  { id: 'augmentation', title: 'Data Augmentation', category: 'Data', summary: 'Membuat variasi data sintetik untuk memperluas dataset dan mengurangi bias.', example: 'rotate(image), flip(image)' },
  { id: 'roc', title: 'ROC-AUC', category: 'Evaluation', summary: 'Kurva yang mengukur tradeoff true positive rate dan false positive rate.', example: 'AUC = area under ROC curve' },
  { id: 'fairness', title: 'Fairness Metrics', category: 'Ethics', summary: 'Metode menilai keadilan model seperti demographic parity dan equalized odds.', example: 'P(pred|groupA) ≈ P(pred|groupB)' },
  { id: 'tokenization', title: 'Tokenization', category: 'Prompt', summary: 'Proses memecah teks menjadi unit yang dipahami model bahasa.', example: '"saya suka AI" → ["saya", "suka", "AI"]' },
  { id: 'rag', title: 'RAG', category: 'Prompt', summary: 'Retrieval-augmented generation menggabungkan dokumen eksternal dengan LLM.', example: 'query -> retrieve -> generate' }
];

export default function Codex() {
  const [query, setQuery] = useState('');
  const filtered = useMemo(
    () => CONCEPTS.filter((concept) =>
      concept.title.toLowerCase().includes(query.toLowerCase()) ||
      concept.category.toLowerCase().includes(query.toLowerCase()) ||
      concept.summary.toLowerCase().includes(query.toLowerCase())
    ),
    [query]
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.2)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.32em] text-slate-400">AI Knowledge Codex</h3>
          <p className="mt-2 text-sm text-slate-300">Cari konsep, rumus, dan contoh kode singkat dari dunia AI Engineering.</p>
        </div>
        <div className="rounded-3xl bg-slate-950/80 p-3 text-[11px] uppercase tracking-[0.28em] text-slate-200">{filtered.length} konsep</div>
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-3xl border border-white/10 bg-slate-950/60 px-4 py-3">
        <input
          aria-label="Cari codex AI"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent text-slate-100 outline-none placeholder:text-slate-500"
          placeholder="Cari: perceptron, prompt, ethics..."
        />
      </div>

      <div className="mt-5 grid gap-3">
        {filtered.map((concept) => (
          <div key={concept.id} className="rounded-3xl border border-white/10 bg-slate-950/80 p-4 transition hover:border-white/20">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-black text-white">{concept.title}</h4>
                <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">{concept.category}</p>
              </div>
              <span className="text-[11px] font-semibold text-slate-300">{concept.example}</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">{concept.summary}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
