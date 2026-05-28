import { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_neuron', title: '🧠 First Neuron', desc: 'Selesaikan level pertama Neuron Builder.', unlocked: false, hint: 'Bangun koneksi input-output pertama.' },
  { id: '100_labels', title: '📊 Clean Labeling', desc: 'Bersihkan 12 kartu di Data Sorter.', unlocked: false, hint: 'Gunakan FLAG untuk data rusak.' },
  { id: 'perfect_prompt', title: '🪄 Prompt Engineer', desc: 'Raih skor tinggi di Prompt Wizard.', unlocked: false, hint: 'Pilih blok prompt yang fokus.' },
  { id: 'model_knight', title: '🛡️ Model Knight', desc: 'Menangkan duel Model Showdown.', unlocked: false, hint: 'Pilih model sesuai use-case.' },
  { id: 'generalizer', title: '🌪️ Escape Master', desc: 'Selesaikan Overfitting Escape dengan baik.', unlocked: false, hint: 'Perhatikan gap train-val loss.' },
  { id: 'ethical_thinker', title: '⚖️ AI Ethicist', desc: 'Tuntaskan kasus di Ethical Judge.', unlocked: false, hint: 'Pelajari implikasi fairness.' }
];
