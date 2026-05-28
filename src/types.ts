// ─── CORE SYSTEM ──────────────────────────────────────────────────────────────

export interface Achievement {
  id: string;
  title: string;
  emoji: string;
  desc: string;
  unlocked: boolean;
  hint: string;
  unlockedAt?: string;
}

export interface LeaderboardEntry {
  name: string;
  xp: number;
  level: number;
  updatedAt: string;
}

export interface UserStats {
  level: number;
  xp: number;
  nextLevelXp: number;
  streak: number;
  completedGamesList: string[];
  totalAnswers: number;
  correctAnswers: number;
  dailyStreak: number;
  lastPlayedDate: string;
}

export interface DailyChallenge {
  date: string;
  completed: boolean;
  score: number;
  bonusXp: number;
}

// ─── GAME 1: NEURON BUILDER ───────────────────────────────────────────────────

export interface NeuronNode {
  id: string;
  label: string;
  type: 'input' | 'hidden' | 'output';
  x: number;
  y: number;
  activationFn?: 'relu' | 'sigmoid' | 'tanh' | 'softmax' | 'linear';
  value?: number;
}

export interface NeuronConnection {
  fromId: string;
  toId: string;
  weight?: number;
}

export interface NeuronLevel {
  id: number;
  title: string;
  description: string;
  concept: string;
  targetInputs: number;
  targetHidden: number[];
  targetOutputs: number;
  requiredActivation?: string;
  xpReward: number;
  hint: string;
}

// ─── GAME 2: DATA SORTER ──────────────────────────────────────────────────────

export interface SorterItem {
  id: string;
  emoji: string;
  name: string;
  value?: string | number;
  correctAction: 'ACCEPT' | 'REJECT' | 'FLAG';
  isNoisy: boolean;
  isOutlier?: boolean;
  isMissing?: boolean;
  category: string;
  tip: string;
  explanation: string;
}

export interface SorterRound {
  id: number;
  title: string;
  concept: string;
  description: string;
  items: SorterItem[];
  xpReward: number;
}

// ─── GAME 3: PROMPT WIZARD ────────────────────────────────────────────────────

export type BlockType = 'ROLE' | 'TASK' | 'FORMAT' | 'CONSTRAINT' | 'EXAMPLE' | 'CHAIN_OF_THOUGHT' | 'CONTEXT';

export interface PromptBlock {
  id: string;
  type: BlockType;
  text: string;
  placeholder: string;
  score: number;
  color: string;
}

export interface WizardQuest {
  id: number;
  mission: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  concept: string;
  description: string;
  requiredBlocks: BlockType[];
  optionalBlocks: BlockType[];
  badExample: string;
  goodExample: string;
  explanation: string;
  xpReward: number;
}

// ─── GAME 4: MODEL SHOWDOWN ───────────────────────────────────────────────────

export type ModelType =
  | 'Linear Regression'
  | 'Logistic Regression'
  | 'Decision Tree'
  | 'Random Forest'
  | 'SVM'
  | 'KNN'
  | 'Naive Bayes'
  | 'XGBoost'
  | 'K-Means'
  | 'Neural Network'
  | 'LSTM'
  | 'Transformer';

export interface ShowdownOption {
  type: ModelType;
  name: string;
  description: string;
  isCorrect: boolean;
  explanation: string;
  pros: string[];
  cons: string[];
}

export interface ShowdownQuest {
  id: number;
  caseTitle: string;
  caseDescription: string;
  category: 'Classification' | 'Regression' | 'Clustering' | 'NLP' | 'Computer Vision';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  datasetInfo: {
    size: string;
    features: string;
    target: string;
  };
  options: ShowdownOption[];
  xpReward: number;
}

// ─── GAME 5: OVERFITTING ESCAPE ───────────────────────────────────────────────

export interface HyperparameterConfig {
  name: string;
  label: string;
  min: number;
  max: number;
  step: number;
  default: number;
  description: string;
}

export interface OverfittingLevel {
  id: number;
  title: string;
  concept: string;
  description: string;
  scenario: string;
  parameters: HyperparameterConfig[];
  targetTrainAcc: [number, number];
  targetValAcc: [number, number];
  maxGap: number;
  hint: string;
  xpReward: number;
}

// ─── GAME 6: ETHICAL JUDGE ────────────────────────────────────────────────────

export type EthicalVerdict = 'ADIL' | 'PERLU_PERBAIKAN' | 'BIAS' | 'TIDAK_ETIS';

export interface EthicalOption {
  text: string;
  verdict: EthicalVerdict;
  xpReward: number;
  explanation: string;
  consequences: string[];
}

export interface JudgeDilemma {
  id: string;
  title: string;
  category: 'Rekrutmen' | 'Kesehatan' | 'Keuangan' | 'Hukum' | 'Privasi' | 'Deepfake' | 'Pekerjaan';
  scenario: string;
  actor: string;
  imageEmoji: string;
  stakeholders: string[];
  dataFacts: string[];
  options: EthicalOption[];
  educationalNote: string;
}

// ─── KNOWLEDGE CODEX ─────────────────────────────────────────────────────────

export interface CodexEntry {
  id: string;
  title: string;
  category: 'Neural Networks' | 'Data Engineering' | 'Prompt Engineering' | 'ML Models' | 'Regularization' | 'AI Ethics' | 'Fundamentals';
  emoji: string;
  shortDef: string;
  fullExplanation: string;
  analogy: string;
  formula?: string;
  codeExample?: string;
  relatedConcepts: string[];
  difficulty: 'Pemula' | 'Menengah' | 'Lanjut';
  unlocked: boolean;
  xpCost: number;
}

// ─── TOAST / NOTIFICATION ────────────────────────────────────────────────────

export type ToastType = 'achievement' | 'levelup' | 'xp' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  emoji?: string;
  duration?: number;
}