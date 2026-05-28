export interface CodexEntry {
  id: string;
  title: string;
  category: string;
  formula: string;
  analogy: string;
  example: string;
}

export const CODEX_CONCEPTS: CodexEntry[] = [
  { id: 'perceptron', title: 'Perceptron', category: 'Neural Network', formula: 'y = activation(∑ w_i x_i + b)', analogy: 'Layaknya sakelar listrik yang hanya menyala bila muatan mencapai ambang.', example: 'Wajib paham untuk memahami neuron vs layer.' },
  { id: 'activation', title: 'Activation Function', category: 'Neural Network', formula: 'σ(x)=1/(1+e^{-x})', analogy: 'Seperti sensor pintu otomatis yang memutuskan apakah gerbang terbuka.', example: 'ReLU, Sigmoid, Softmax.' },
  { id: 'backprop', title: 'Backpropagation', category: 'Training', formula: '∂L/∂w = ∂L/∂y * ∂y/∂z * ∂z/∂w', analogy: 'Belajar dari kesalahan seperti memperbaiki nilai setelah mengerjakan ujian.', example: 'Adjust weight using gradient signals.' },
  { id: 'gradient', title: 'Gradient Descent', category: 'Optimization', formula: 'w ← w - α ∇L', analogy: 'Turun dari bukit menuju lembah terendah.', example: 'Pilih learning rate agar tidak overshoot.' },
  { id: 'dropout', title: 'Dropout', category: 'Regularization', formula: 'x_i = 0 with p', analogy: 'Seperti mematikan beberapa pemain tim agar permainan tidak bergantung pada satu orang.', example: 'Dropout 0.5 di hidden layer.' },
  { id: 'batchnorm', title: 'Batch Normalization', category: 'Training', formula: 'x̂ = (x - μ) / √(σ² + ε)', analogy: 'Meratakan kelas sebelum lomba agar adil.', example: 'Stabilkan training dengan batch norm.' },
  { id: 'augmentation', title: 'Data Augmentation', category: 'Data', formula: 'x′ = transform(x)', analogy: 'Menggandakan latihan dengan variasi situasi.', example: 'Rotate, crop, flip image.' },
  { id: 'tokenization', title: 'Tokenization', category: 'Prompt', formula: '"saya suka AI" → ["saya", "suka", "AI"]', analogy: 'Memotong kata menjadi potongan lego.', example: 'Tokens menentukan panjang prompt.' },
  { id: 'rag', title: 'RAG', category: 'Prompt', formula: 'retrieve + generate', analogy: 'Bertanya pada jurnal lalu menjawab dengan ringkasan.', example: 'Gunakan dokumen eksternal sebagai konteks.' },
  { id: 'fairness', title: 'Fairness Metrics', category: 'Ethics', formula: 'P(ŷ=1|A) ≈ P(ŷ=1|B)', analogy: 'Memberi nilai adil tanpa memandang asal.', example: 'Demographic parity, equalized odds.' }
];
