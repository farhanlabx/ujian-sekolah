import React, { useState, useEffect, useRef } from 'react';
import { sfx } from './AudioEngine';
import { RefreshCw, Play, ShieldAlert, Cpu, Heart } from 'lucide-react';

interface OverfittingEscapeProps {
  onComplete: (xp: number, badgeId?: string) => void;
  onActionScore: (isCorrect: boolean) => void;
}

export default function OverfittingEscape({ onComplete, onActionScore }: OverfittingEscapeProps) {
  const [complexity, setComplexity] = useState<number>(50); // 0 = Underfit, 50 = Balanced, 100 = Overfit
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [testOutcome, setTestOutcome] = useState<'idle' | 'underfit' | 'overfit' | 'success'>('idle');
  const [robotProgress, setRobotProgress] = useState(0); // 0 to 1 anim scale
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Training points (fixed)
  const trainingPoints = [
    { x: 50, y: 180 },
    { x: 120, y: 110 },
    { x: 200, y: 220 },
    { x: 270, y: 120 },
    { x: 350, y: 190 }
  ];

  // Test Points (Only visible when testing begins/is in progress to simulate split evaluation!)
  const testPoints = [
    { x: 80, y: 150 },
    { x: 160, y: 160 },
    { x: 240, y: 170 },
    { x: 310, y: 165 }
  ];

  // Live Canvas Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Grid Background
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.5;
    const gridSpacing = 20;
    for (let x = 0; x < canvas.width; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Function to calculate curve height based on complexity setting
    const getCurveY = (x: number): number => {
      // Base generalized path (Smooth cubic)
      const baseCurve = 150 + 50 * Math.sin(x / 50) + 20 * Math.cos(x / 100);
      
      if (complexity < 25) {
        // Underfitting: Degenerates to a flat straight line (linear)
        const t = complexity / 25;
        const flatLine = 160 - (x - 200) * 0.1;
        return flatLine * (1 - t) + baseCurve * t;
      } else if (complexity > 70) {
        // Overfitting: Extreme polynomial oscillation to try to hit all points
        const t = (complexity - 70) / 30;
        const extremeOscillation = baseCurve + 60 * Math.sin(x / 9) * Math.sin(x / 14);
        return baseCurve * (1 - t) + extremeOscillation * t;
      }
      
      // Balanced generalization
      return baseCurve;
    };

    // Draw Fitting Boundary Curve Line
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = complexity < 25 ? '#F59E0B' : complexity > 70 ? '#EF4444' : '#00D4FF';
    ctx.shadowBlur = 10;
    ctx.shadowColor = ctx.strokeStyle;
    
    for (let x = 0; x <= canvas.width; x++) {
      const y = getCurveY(x);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0; // reset shadow

    // Draw training sets
    trainingPoints.forEach(pt => {
      ctx.fillStyle = '#10B981'; // Green training dots
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Draw Test Nodes if Running/Evaluated or balanced
    if (isRunning || testOutcome !== 'idle' || (complexity >= 25 && complexity <= 70)) {
      testPoints.forEach(pt => {
        ctx.fillStyle = '#EF4444'; // Red test nodes
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
    }

    // Draw Robot Maskot AIKO along the trajectory curve
    const robotX = robotProgress * canvas.width;
    const robotY = getCurveY(robotX);

    ctx.fillStyle = '#8B5CF6'; // Purple mascot
    ctx.beginPath();
    ctx.arc(robotX, robotY, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#00D4FF';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Small robot visor face
    ctx.fillStyle = '#00D4FF';
    ctx.fillRect(robotX - 4, robotY - 2, 8, 3);

  }, [complexity, robotProgress, isRunning, testOutcome]);

  const handleTestRun = () => {
    if (isRunning) return;
    setIsRunning(true);
    setTestOutcome('idle');
    setRobotProgress(0);
    sfx.play('cast');

    let start: number | null = null;
    const duration = 2000; // 2 seconds run

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = (timestamp - start) / duration;

      if (progress < 1) {
        setRobotProgress(progress);
        animationFrameRef.current = requestAnimationFrame(step);
      } else {
        setRobotProgress(1);
        setIsRunning(false);

        // Grade outcome based on slider complexity
        if (complexity < 28) {
          sfx.play('wrong');
          setTestOutcome('underfit');
          onActionScore(false);
        } else if (complexity > 68) {
          sfx.play('wrong');
          setTestOutcome('overfit');
          onActionScore(false);
        } else {
          sfx.play('correct');
          setTestOutcome('success');
          onActionScore(true);
          // Reward XP and trigger special overfit generalizer badge
          onComplete(300, 'generalizer');
        }
      }
    };

    animationFrameRef.current = requestAnimationFrame(step);
  };

  const handleReset = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    setRobotProgress(0);
    setIsRunning(false);
    setTestOutcome('idle');
  };

  return (
    <div id="overfitting_escape_game" className="p-6 bg-[#111827] rounded-3xl border border-slate-800 text-slate-100 flex flex-col gap-6 max-h-[640px] overflow-y-auto">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black font-display text-amber-500 tracking-wider uppercase flex items-center gap-2">
            🚨 Overfitting Escape
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Konsep: <span className="text-[#00D4FF] font-mono">Overfitting, Underfitting, Bias-Variance Tradeoff</span>
          </p>
        </div>
        <button 
          onClick={handleReset}
          className="p-2 border border-slate-700 rounded-lg hover:border-amber-500 hover:text-amber-400 transition-all bg-[#0A0E1A]"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Narrative Board explaining Overfitting */}
      <div className="bg-[#0A0E1A] p-4 rounded-xl border border-slate-800 text-xs leading-relaxed text-slate-300 md:flex flex-col gap-2">
        <p>
          🟢 <span className="font-bold text-emerald-400">Titik Hijau</span> melambangkan <span className="font-bold">Training Data</span> (data latihan). 🔴 <span className="font-bold text-rose-450">Titik Merah</span> mewakili <span className="font-bold">Test Data</span> baru (pasien riil/kasus nyata diluar sekolah).
        </p>
        <p>
          Ubah kompleksitas modelmu dengan slider! Temukan garis yang paling seimbang, mampu melintasi area latih biasa sekaligus generalisir data ujian mandiri secara tangkas!
        </p>
      </div>

      {/* HTML Canvas Maze Board */}
      <div className="flex justify-center relative bg-[#070b13] border-2 border-slate-850 rounded-2xl overflow-hidden p-2">
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={280} 
          className="w-full max-w-[400px] h-auto rounded-lg"
        />

        {/* Legend Overlay Info */}
        <div className="absolute top-2 left-2 flex gap-3 bg-[#0A0E1A]/80 border border-slate-800 px-2 py-1 rounded text-[8px] font-mono">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#10B981]"></span> TRAINING SET</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#EF4444]"></span> TEST SET</span>
        </div>
      </div>

      {/* Model Complexity Control Panel */}
      <div className="flex flex-col gap-4 bg-[#0A0E1A] p-5 rounded-2xl border border-slate-800">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-amber-500 font-bold">Lurus (Linear / Underfit)</span>
          <span className="text-cyan-400 font-bold uppercase tracking-widest font-display text-[10px]">Model Complexity Degree</span>
          <span className="text-red-500 font-bold">Liar (High-Degree / Overfit)</span>
        </div>

        {/* Slider input */}
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={complexity} 
          disabled={isRunning}
          onChange={(e) => setComplexity(Number(e.target.value))}
          className="w-full h-2 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-[#8B5CF6] transition-all"
        />

        <div className="flex justify-between items-center gap-4 mt-2">
          {/* Legend indicator */}
          <div className="text-[11px] font-semibold text-slate-350">
            Kondisi Model: {
              complexity < 28 
                ? <span className="text-amber-500 font-bold uppercase">🚨 Underfitting (Garis Kelewat Sederhana)</span>
                : complexity > 68 
                  ? <span className="text-red-500 font-bold uppercase">🚨 Overfitting (Garis Menghafal Mati)</span>
                  : <span className="text-[#10B981] font-bold uppercase">🌟 Perfect Generalization!</span>
            }
          </div>

          <button
            onClick={handleTestRun}
            disabled={isRunning}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-[#8B5CF6] text-white rounded-xl text-xs font-display font-black uppercase tracking-wider hover:shadow-[0_0_15px_rgba(139,92,246,0.4)] flex items-center gap-1 cursor-pointer disabled:opacity-40"
          >
            <Play size={14} /> Jalankan Model (Validation Test)
          </button>
        </div>
      </div>

      {/* Real-time feedback overlay */}
      {testOutcome !== 'idle' && (
        <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
          testOutcome === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
            : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
        }`}>
          {testOutcome === 'success' ? (
            <div>
              <h4 className="font-bold flex items-center gap-1 uppercase mb-1 font-display">🎉 Pelarian Berhasil! Generalisasi Sempurna</h4>
              <p>"Mantap jiwa! Modelmu meluncur mulus melintasi sebaran test data tanpa terperangkap ke dalam hafalan buta maupun simplisitas bodoh! Angpao +300 XP siap diambil!"</p>
            </div>
          ) : testOutcome === 'underfit' ? (
            <div>
              <h4 className="font-bold flex items-center gap-1 uppercase mb-1 font-display"><ShieldAlert size={14} /> Gagal: Underfitting Detected!</h4>
              <p>"Waduh, garis lurusmu kelewat malas (underfit)! Ia tidak mampu membaca naik-turunnya pola bintang-bintang training maupun ujian."</p>
            </div>
          ) : (
            <div>
              <h4 className="font-bold flex items-center gap-1 uppercase mb-1 font-display"><ShieldAlert size={14} /> Gagal: Overfitting Detected!</h4>
              <p>"Waduh, overfitting nih! Bayangin kamu menghafal mentah-mentah kunci jawaban latihan halaman demi halaman, tapi pas ujian aslinya model soalnya diubah dikit kamu langsung error total! Sesuaikan slidernya!"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
