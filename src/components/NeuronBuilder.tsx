import React, { useState } from 'react';
import { sfx } from './AudioEngine';
import { Lightbulb, Info, CheckCircle, HelpCircle, RefreshCw } from 'lucide-react';

interface NeuronBuilderProps {
  onComplete: (xp: number, badgeId?: string) => void;
  onActionScore: (isCorrect: boolean) => void;
}

interface Node {
  id: string;
  label: string;
  type: 'input' | 'hidden' | 'output';
  x: number;
  y: number;
}

interface Connection {
  from: string;
  to: string;
}

export default function NeuronBuilder({ onComplete, onActionScore }: NeuronBuilderProps) {
  const nodes: Node[] = [
    // Inputs (Left)
    { id: 'in_pixels', label: 'Pixel Raw Kucing', type: 'input', x: 10, y: 20 },
    { id: 'in_whiskers', label: 'Detektor Kumis', type: 'input', x: 10, y: 50 },
    { id: 'in_meow', label: 'Frekuensi Meong', type: 'input', x: 10, y: 80 },
    
    // Hidden (Middle)
    { id: 'hid_edges', label: 'Ekstraktor Tepian', type: 'hidden', x: 50, y: 25 },
    { id: 'hid_patterns', label: 'Pengenal Pola', type: 'hidden', x: 50, y: 50 },
    { id: 'hid_textures', label: 'Filter Tekstur', type: 'hidden', x: 50, y: 75 },
    
    // Outputs (Right)
    { id: 'out_cat', label: 'PROBALITAS: KUCING 🐱', type: 'output', x: 90, y: 35 },
    { id: 'out_other', label: 'PROBALITAS: BUKAN KUCING 🚫', type: 'output', x: 90, y: 65 },
  ];

  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [bossChallengeActive, setBossChallengeActive] = useState(false);
  const [bossAnswered, setBossAnswered] = useState(false);
  const [selectedBossOption, setSelectedBossOption] = useState<number | null>(null);
  const [gameFinished, setGameFinished] = useState(false);

  // Calculate network strength based on the connection density
  // Max connections we expect: Input to Hidden (3 * 3 = 9) + Hidden to Output (3 * 2 = 6) = 15 total
  const idealPathConnected = connections.some(c1 => 
    c1.from.startsWith('in_') && c1.to.startsWith('hid_') && 
    connections.some(c2 => c2.from === c1.to && c2.to.startsWith('out_'))
  );

  const strengthPercentage = Math.min(
    100,
    Math.round(
      (connections.length / 8) * 50 + (idealPathConnected ? 50 : 0)
    )
  );

  const handleNodeClick = (nodeId: string) => {
    sfx.play('hover');
    if (!selectedNodeId) {
      // First node selection: must be either input or hidden
      setSelectedNodeId(nodeId);
    } else {
      // Second node selection
      if (selectedNodeId === nodeId) {
        setSelectedNodeId(null);
        return;
      }

      const sourceNode = nodes.find(n => n.id === selectedNodeId);
      const targetNode = nodes.find(n => n.id === nodeId);

      if (sourceNode && targetNode) {
        // Validations:
        // Input -> Hidden or Hidden -> Output
        const isValid = 
          (sourceNode.type === 'input' && targetNode.type === 'hidden') ||
          (sourceNode.type === 'hidden' && targetNode.type === 'output') ||
          (sourceNode.type === 'hidden' && targetNode.type === 'hidden'); // Hidden to hidden permitted

        if (isValid) {
          // Check if connection already exists
          const exists = connections.some(
            c => (c.from === sourceNode.id && c.to === targetNode.id) || 
                 (c.from === targetNode.id && c.to === sourceNode.id)
          );

          if (!exists) {
            setConnections([...connections, { from: sourceNode.id, to: targetNode.id }]);
            sfx.play('spark');
            onActionScore(true);
          } else {
            // Remove existing connection
            setConnections(connections.filter(
              c => !((c.from === sourceNode.id && c.to === targetNode.id) || 
                     (c.from === targetNode.id && c.to === sourceNode.id))
            ));
          }
        }
      }
      setSelectedNodeId(null);
    }
  };

  const handleReset = () => {
    setConnections([]);
    setSelectedNodeId(null);
    setBossChallengeActive(false);
    setBossAnswered(false);
    setSelectedBossOption(null);
    setGameFinished(false);
  };

  const startBossChallenge = () => {
    sfx.play('cast');
    setBossChallengeActive(true);
  };

  const bossOptions = [
    {
      text: 'Model mengalami Underfitting karena jaringannya terlalu dangkal (kurang hidden layer/neuron) untuk menangkap fitur rumit.',
      isCorrect: true,
      explanation: 'Tepat sekali! Jaringan saraf yang terlalu tipis/sedikit tidak akan bisa melihat korelasi kompleks, persis seperti orang belajar kalkulus tapi cuma tahu tambah-kurang!'
    },
    {
      text: 'Terjadi Overfitting karena model terlalu rajin menghafal detail latar belakang gambar.',
      isCorrect: false,
      explanation: 'Kurang tepat. Overfitting umumnya terjadi jika jaringan terlalu besar/kompleks sehingga menghafal noise data training, bukan karena arsitektur draf awal ini.'
    },
    {
      text: 'Learning Rate terlalu tinggi membuat neural network meledak kinerjanya.',
      isCorrect: false,
      explanation: 'Salah kaprah. Learning rate tinggi justru bikin proses training tidak stabil (bergoyang liar), bukannya gagal total sejak arsitektur dibuat.'
    }
  ];

  const handleBossSubmit = (index: number) => {
    if (bossAnswered) return;
    setSelectedBossOption(index);
    setBossAnswered(true);
    
    if (bossOptions[index].isCorrect) {
      sfx.play('correct');
      setGameFinished(true);
      // Give full XP + custom first neuron achievement
      onComplete(250, 'first_neuron');
    } else {
      sfx.play('wrong');
      // Give partial XP on failure
      setGameFinished(true);
      onComplete(100);
    }
  };

  return (
    <div id="neuron_builder_container" className="p-6 bg-gradient-to-b from-[#070816] to-[#0b1220] rounded-3xl border border-slate-800 text-slate-100 flex flex-col gap-6 max-h-[740px] overflow-y-auto">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black font-display text-gradient tracking-wider uppercase flex items-center gap-3">
            <span className="text-[#00D4FF]">🧠</span>
            <span className="text-white">Neuron Builder</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Konsep: <span className="text-[#8B5CF6] font-mono">Neural Networks & Deep Layer Architecture</span> — susun sambungan untuk memperkuat jaringan.
          </p>
        </div>
        <button 
          onClick={handleReset} 
          className="p-2 border border-slate-700 rounded-lg hover:border-[#00D4FF] hover:text-[#00D4FF] transition-all bg-[#071022]"
          title="Reset Network"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {!bossChallengeActive ? (
        <>
          <div className="bg-[#0A0E1A] border border-slate-800 p-4 rounded-xl flex items-start gap-3">
            <Info className="text-[#00D4FF] shrink-0 mt-0.5" size={18} />
            <div className="text-xs leading-relaxed text-slate-300">
              <span className="font-bold text-white text-sm">Misi Hubungkan Synapses:</span> Klik satu lingkaran neuron di <span className="text-sky-400 font-bold">Input (kiri)</span> lalu klik lingkaran di <span className="text-violet-400 font-bold">Hidden Layer (tengah)</span> untuk mengoneksikannya. Lakukan hal yang sama dari Hidden ke <span className="text-emerald-400 font-bold">Output (kanan)</span>!
            </div>
          </div>

          {/* Interactive SVG Diagram Board */}
          <div className="relative w-full h-[320px] bg-gradient-to-br from-[#06060a] to-[#071026] border-2 border-[#122032] rounded-2xl p-4 overflow-hidden shadow-inner flex flex-col justify-between">
            {/* Connection sparks */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {connections.map((conn, idx) => {
                const fromNode = nodes.find(n => n.id === conn.from);
                const toNode = nodes.find(n => n.id === conn.to);
                if (!fromNode || !toNode) return null;

                const startX = `${fromNode.x}%`;
                const startY = `${fromNode.y}%`;
                const endX = `${toNode.x}%`;
                const endY = `${toNode.y}%`;

                return (
                  <g key={idx}>
                    {/* Glowing background path */}
                    <line 
                      x1={startX} y1={startY} x2={endX} y2={endY} 
                      stroke="url(#sparkGradient)" 
                      strokeWidth="6" 
                      opacity="0.4"
                      strokeLinecap="round"
                      filter="url(#glow)"
                    />
                    <line 
                      className="spark-line"
                      x1={startX} y1={startY} x2={endX} y2={endY} 
                      stroke="#00D4FF" 
                      strokeWidth="3" 
                      strokeLinecap="round"
                      opacity="0.9"
                      strokeDasharray="8 6"
                    >
                      <animate attributeName="stroke-dashoffset" from="0" to="14" dur="1s" repeatCount="indefinite" />
                    </line>
                  </g>
                );
              })}
              <defs>
                <linearGradient id="sparkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00D4FF" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
            </svg>

            {/* Render Nodes relative positions */}
            <div className="absolute inset-0 w-full h-full flex justify-between p-4 px-8 items-center">
              {/* INPUT LAYER COLUMN */}
              <div className="flex flex-col gap-6 items-center">
                <span className="text-[11px] uppercase tracking-widest font-bold text-slate-400 font-mono">INPUT</span>
                {nodes.filter(n => n.type === 'input').map(n => (
                  <div key={n.id} className="flex flex-col items-center">
                    <button
                      onClick={() => handleNodeClick(n.id)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer relative group ${
                        selectedNodeId === n.id 
                          ? 'bg-gradient-to-br from-[#00D4FF]/30 to-[#8BD1FF]/20 border-2 border-[#00D4FF] shadow-[0_0_18px_rgba(0,212,255,0.9)] animate-pulse' 
                          : 'bg-[#0f1724] border-2 border-slate-700 hover:border-sky-400 hover:shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                      }`}
                    >
                      <span className="text-sm font-bold text-white">IN</span>
                    </button>
                    <div className="text-[10px] mt-1 text-slate-300 max-w-[110px] text-center">
                      {n.label.length > 20 ? `${n.label.slice(0,20)}…` : n.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* HIDDEN LAYER COLUMN */}
              <div className="flex flex-col gap-6 items-center">
                <span className="text-[11px] uppercase tracking-widest font-bold text-slate-400 font-mono">HIDDEN LAYER</span>
                {nodes.filter(n => n.type === 'hidden').map(n => (
                  <div key={n.id} className="flex flex-col items-center">
                    <button
                      onClick={() => handleNodeClick(n.id)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer relative group ${
                        selectedNodeId === n.id 
                          ? 'bg-gradient-to-br from-[#8B5CF6]/30 to-[#5B8BFD]/20 border-2 border-[#8B5CF6] shadow-[0_0_18px_rgba(139,92,246,0.9)] animate-pulse' 
                          : 'bg-[#0f1724] border-2 border-slate-700 hover:border-violet-400 hover:shadow-[0_0_12px_rgba(167,139,250,0.25)]'
                      }`}
                    >
                      <span className="text-sm font-bold text-white">H</span>
                    </button>
                    <div className="text-[10px] mt-1 text-slate-300 max-w-[110px] text-center">
                      {n.label.length > 20 ? `${n.label.slice(0,20)}…` : n.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* OUTPUT LAYER COLUMN */}
              <div className="flex flex-col gap-6 items-center">
                <span className="text-[11px] uppercase tracking-widest font-bold text-slate-400 font-mono">OUTPUT</span>
                {nodes.filter(n => n.type === 'output').map(n => (
                  <div key={n.id} className="flex flex-col items-center">
                    <button
                      onClick={() => handleNodeClick(n.id)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer relative group ${
                        selectedNodeId === n.id 
                          ? 'bg-gradient-to-br from-[#10B981]/30 to-[#34D399]/18 border-2 border-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.85)] animate-pulse' 
                          : 'bg-[#0f1724] border-2 border-slate-700 hover:border-emerald-400 hover:shadow-[0_0_12px_rgba(52,211,153,0.25)]'
                      }`}
                    >
                      <span className="text-sm font-bold text-white">OUT</span>
                    </button>
                    <div className="text-[10px] mt-1 text-slate-300 max-w-[110px] text-center">
                      {n.label.length > 20 ? `${n.label.slice(0,20)}…` : n.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Network metrics & launcher widget */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#0A0E1A] p-4 rounded-2xl border border-slate-800">
            <div className="w-full sm:w-auto flex flex-col sm:flex-row sm:items-center gap-3">
              <div>
                <div className="text-[11px] font-bold text-[#00D4FF] uppercase tracking-widest">Network Strength</div>
                <div className="flex items-center gap-3 mt-1">
                  <div className="h-2.5 w-44 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] transition-all duration-500"
                      style={{ width: `${strengthPercentage}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-mono font-bold text-white">{strengthPercentage}%</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-2">Connections: <span className="font-bold text-white">{connections.length}</span> / 15</div>
                <div className="text-[11px] text-slate-500 mt-1">Tip: hubungkan Input → Hidden, lalu Hidden → Output untuk meningkatkan kekuatan jaringan.</div>
              </div>

              <div className="flex items-center">
                <button
                  id="boss_challenge_btn"
                  onClick={startBossChallenge}
                  disabled={strengthPercentage < 60}
                  title={strengthPercentage < 60 ? 'Koneksi kurang kuat — tambah lebih banyak sambungan untuk membuka boss' : 'Mulai boss challenge'}
                  className={`px-5 py-2.5 rounded-xl font-bold font-display uppercase tracking-wider text-xs transition-all ${
                    strengthPercentage < 60
                      ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
                      : 'bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] text-white hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] cursor-pointer'
                  }`}
                >
                  Uji Coba Network (Boss Battle) 🚀
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* BOSS CHALLENGE WINDOW */
        <div className="bg-[#0A0E1A] p-5 rounded-2xl border-2 border-red-500/30">
          <div className="flex items-center gap-3 text-red-400 mb-3 font-display uppercase font-black text-sm">
            <HelpCircle size={18} />
            <span>AIKO BOSS CHALLENGE : EVALUASI MODEL</span>
          </div>

          <p className="text-sm font-semibold text-slate-200 leading-relaxed mb-4">
            "Waduh! Setelah diuji, jaringannya dapet akurasi sangat rendah saat menyaring pixel gambar kucing. Kira-kira kenapa nih jaringan kita gagal membaca fiturnya secara cerdas?"
          </p>

          <div className="space-y-3">
            {bossOptions.map((opt, idx) => (
              <button
                key={idx}
                disabled={bossAnswered}
                onClick={() => handleBossSubmit(idx)}
                className={`w-full text-left p-3.5 rounded-xl text-xs leading-relaxed transition-all border flex items-start gap-3 cursor-pointer ${
                  selectedBossOption === idx 
                    ? opt.isCorrect 
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300' 
                      : 'bg-red-500/10 border-red-500 text-red-300'
                    : 'bg-[#111827] border-slate-850 hover:bg-slate-800 hover:border-slate-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                  selectedBossOption === idx
                    ? opt.isCorrect ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300' : 'border-red-500 bg-red-500/20 text-red-300'
                    : 'border-slate-500 text-slate-400'
                }`}>
                  {idx === 0 ? 'A' : idx === 1 ? 'B' : 'C'}
                </div>
                <span>{opt.text}</span>
              </button>
            ))}
          </div>

          {/* Boss results output */}
          {bossAnswered && (
            <div className={`mt-4 p-4 rounded-xl text-xs leading-relaxed border ${
              bossOptions[selectedBossOption!].isCorrect 
                ? 'bg-[#10B981]/10 border-[#10B981]/30 text-emerald-300' 
                : 'bg-[#EF4444]/10 border-[#EF4444]/30 text-rose-300'
            }`}>
              <div className="font-bold flex items-center gap-2 mb-1">
                {bossOptions[selectedBossOption!].isCorrect ? <CheckCircle size={14} /> : '❌'}
                {bossOptions[selectedBossOption!].isCorrect ? 'KERJA BAGUS!' : 'WADUH COBA LAGI!'}
              </div>
              <p>{bossOptions[selectedBossOption!].explanation}</p>
              
              <button
                onClick={() => onComplete(bossOptions[selectedBossOption!].isCorrect ? 250 : 100)}
                className="mt-3 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg font-bold transition-all"
              >
                Selesaikan Pelajaran & Ambil XP ✨
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
