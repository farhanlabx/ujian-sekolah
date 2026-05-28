import React, { useState, useEffect } from 'react';
import { sfx } from './AudioEngine';
import { Sliders, Cpu, Play, HelpCircle, Check, Info, Sparkles, MessageSquare } from 'lucide-react';

interface HyperparameterSandboxProps {
  onComplete: (xp: number, badgeId?: string) => void;
  onActionScore: (isCorrect: boolean) => void;
}

type ModelType = 'gemini-flash' | 'deepseek-r1' | 'llama-open' | 'accountant-bot';

const MODEL_PRESETS = {
  'gemini-flash': {
    name: 'Gemini-3.5-Flash (Google)',
    desc: 'Cepat, tangkas, & serba guna. Sangat cerdas dalam merespon instruksi terstruktur.',
    avatar: '⚡',
    baseResponse: 'Saya siap melayani Anda secara efisien! Berdasarkan instruksi Anda:',
  },
  'deepseek-r1': {
    name: 'DeepSeek-R1 (The Rationalizer)',
    desc: 'Model dengan penalaran mandiri (Chain of Thought). Berfikir mendalam sebelum mengeluarkan token.',
    avatar: '🔎',
    baseResponse: 'Proses kesimpulan akhir:',
  },
  'llama-open': {
    name: 'Llama-3.1-70B (Meta API)',
    desc: 'Model open-source terkemuka. Alami, kaya variasi, dan ekspresif.',
    avatar: '🦙',
    baseResponse: 'Hai kawan! Berikut adalah jalinan kata kreatif untuk Anda:',
  },
  'accountant-bot': {
    name: 'Accountant Bot Pro',
    desc: 'Model purbakala sempit khusus mencatat pembukuan keuangan.',
    avatar: '📊',
    baseResponse: '[LEDGER SYSTEM] Transaksi terverifikasi:',
  }
};

const SYSTEM_PROMPTS = [
  { id: 'cat', name: '🐱 Kucing Anggora (Meow Persona)', text: 'Bertindaklah sebagai kucing manja pemarah yang menjawab dengan menambahkan "Meow!" di ujung kalimat dan suka menggerutu.' },
  { id: 'hacker', name: '👾 Cyber Hacker 1337', text: 'Gunakan aksen enkripsi terminal komputer, huruf besar-kecil liar, kata-kata enkripsi, dan sebut bos dengan "M4ST3R".' },
  { id: 'coach', name: '🔥 Coach Gym Motivasi Tinggi', text: 'Berikan semangat membara luar biasa! Gunakan tanda seru ganda (!!) dan paksa pembaca push-up sekarang juga!' },
  { id: 'academic', name: '🎓 Profesor Bahasa Formal', text: 'Gunakan struktur tata bahasa maha-formal, kosa kata ilmiah tinggi, dan jelaskan dengan detail berliku.' }
];

export default function HyperparameterSandbox({ onComplete, onActionScore }: HyperparameterSandboxProps) {
  const [model, setModel] = useState<ModelType>('gemini-flash');
  const [systemPrompt, setSystemPrompt] = useState<string>(SYSTEM_PROMPTS[0].text);
  const [temperature, setTemperature] = useState<number>(0.7); // 0.0 to 1.5 (Randomness)
  const [topP, setTopP] = useState<number>(0.9); // 0.0 to 1.0 (Vocab variety)
  const [frequencyPenalty, setFrequencyPenalty] = useState<number>(0.0); // -2.0 to 2.0 (Repetitiveness)
  
  const [userInput, setUserInput] = useState<string>('Jelaskan apa arti kehidupan ini?');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [simulatedOutput, setSimulatedOutput] = useState<string>('');
  const [reasoningChain, setReasoningChain] = useState<string>('');
  const [experimentCount, setExperimentCount] = useState<number>(0);
  const [showExplanation, setShowExplanation] = useState<string>('');

  // Auto-fill preset helper
  const applyPresetSystemPrompt = (text: string) => {
    sfx.play('hover');
    setSystemPrompt(text);
  };

  const handleSynthesize = () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setSimulatedOutput('');
    setReasoningChain('');
    sfx.play('cast');

    // Increase experiment counter count
    const nextCount = experimentCount + 1;
    setExperimentCount(nextCount);

    onActionScore(true); // Every honest simulation is useful to AI Education!

    // Determine reasoning chain for DeepSeek-R1
    let steps = '';
    if (model === 'deepseek-r1') {
      steps = `Thinking Process:\n1. User asked: "${userInput}"\n2. Reading System constraints: "${systemPrompt.slice(0, 35)}..."\n3. Applying Temperature parameter: ${temperature}. (Variance index calculated)\n4. Top-P checks: ${topP}. Restricting sampling vocabulary pool.\n5. Frequency penalty lookup: ${frequencyPenalty}. Monitoring repetitiveness.\n6. Executing neural nodes pathway... Done!`;
    }

    setTimeout(() => {
      setReasoningChain(steps);

      // Construct a highly customized dynamic educational prompt reply
      let response = '';
      const presetData = MODEL_PRESETS[model];

      // Base response customized by system prompt
      let coreTone = '';
      if (systemPrompt.includes('kucing')) {
        coreTone = 'Arti kehidupan? Meow! Kehidupan adalah tentang tidur 18 jam dan mencakar sofa baru Anda, Meow! Kenapa Anda repot bertanya hal sepele ini pada kucing agung? Meow!';
      } else if (systemPrompt.includes('Hacker') || systemPrompt.includes('terminal')) {
        coreTone = 'L1F3_SYST3M_CRICIT4L: Kehidupan4 d4lah k0de eksekusi m4tr1ks m4kluk b1ologis y4ng d1jalank4n m4ndiri! KAMI MENEMBUS B4T4S! M4ST3R, b0ot c0re b4ru s3karang!';
      } else if (systemPrompt.includes('semangat') || systemPrompt.includes('Gym')) {
        coreTone = 'KEHIDUPAN ADALAH PERJUANGAN KERAS KAWAN!! JANGAN LEMAH! MAKAN PROTEIN, ANGKAT BEBAN, DAN SEGERA LAKUKAN 50 KALI PUSH-UP DETIK INI JUGA!! TANPA ALASAN!! FIRE IT UP!! 🔥🔥';
      } else {
        coreTone = 'Kehidupan, secara epistemologis dan filosofis, didefinisikan sebagai eksistensi adaptif entitas organik yang terus mencari keseimbangan termodinamika melawan entropi semesta.';
      }

      // Modify output based on high/low Temperature
      if (temperature < 0.15) {
        response = `[MODE DETERMINISTIK DINGIN]: ${presetData.baseResponse} "${coreTone.slice(0, 80)}..." (Response cut short because low temperature limits randomness and triggers monotone repetition of tokens).`;
      } else if (temperature > 1.25) {
        // High temperature is insanely random / messy / hallucinations
        response = `${presetData.baseResponse} 🌌 ${coreTone}!! *gajah terbang warna hijau laut* %&! ZzZz- ERROR- HALLUCINATION- BOOM! ✨ (Peringatan: Temperature ${temperature} terlalu ekstrem tinggi memicu neuron AI melepaskan token acak tanpa kontrol kosakata logis!)`;
      } else {
        response = `${presetData.baseResponse} ${coreTone}`;
      }

      // Modify based on frequency penalty (negative penalty causes severe loops!)
      if (frequencyPenalty < -0.5) {
        response += ` ...Dan saya menyukai hal ini! Dan saya menyukai hal ini! Dan saya menyukai hal ini! Dan saya menyukai hal ini! Dan saya menyukai hal ini! (Frequency Penalty negatif memicu model terjebak dalam perulangan token yang patologis)`;
      }

      setSimulatedOutput(response);
      setIsGenerating(false);
      sfx.play('correct');

      // Update educational explanation box based on parameter combos
      if (temperature > 1.1) {
        setShowExplanation('🌡️ PENGAMATAN SUHU: Suhu tinggi membuat model cerdas melepaskan kendali probabilitas. Kata-kata baru yang jarang terpakai meluncur deras, memicu jawaban kreatif tak terduga, tapi rentan menghasilkan halusinasi/omong kosong.');
      } else if (temperature < 0.2) {
        setShowExplanation('❄️ PENGAMATAN DINGIN: Suhu mendekati 0 membuatnya "Deterministic". Model akan selalu memilih kata dengan probabilitas tertinggi secara mutlak. Menghasilkan kode program yang konsisten, tapi sangat kaku jika dipakai menulis artikel.');
      } else if (frequencyPenalty < -0.3) {
        setShowExplanation('🌀 REPETITION LOOP: Frequency Penalty bernilai minus bertindak melumpuhkan penalti kalimat baru. AI akan ketagihan memilih kata-kata yang baru saja diucapkannya, menciptakan loop jargon tak berujung.');
      } else {
        setShowExplanation('🌟 GENERAL OBSERVATION: Kombinasi parameter seimbang berhasil merefleksikan karakter System Prompt secara akurat sesuai karakter model!');
      }

    }, 1500);
  };

  const handleFinishSandbox = () => {
    sfx.play('levelUp');
    onComplete(250, 'perfect_prompt');
  };

  return (
    <div id="hyperparameter_playground" className="p-6 bg-[#111827] rounded-3xl border border-slate-800 text-slate-100 flex flex-col gap-6 max-h-[700px] overflow-y-auto">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black font-display text-cyan-400 tracking-wider uppercase flex items-center gap-2">
            🎛️ AI Tuner & Playground
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Konsep: <span className="text-[#8B5CF6] font-mono">Hyperparameters, Temperature, Top-P, Frequency Penalty</span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-slate-800 px-3 py-1.5 rounded-xl">
          Eksperimen: {experimentCount} KALI
        </div>
      </div>

      {/* EDUCATIONAL ROW CONTAINER */}
      <div className="bg-[#0A0E1A] p-4 rounded-xl border border-slate-800 text-xs leading-relaxed text-slate-300 flex flex-col gap-2">
        <p>
          🚀 <span className="font-bold text-white">Selamat Datang di Lab Tuning Parameter!</span> Setiap model LLM memiliki setir kemudi internal yang menentukan kreativitas, kefasihan kosa kata, dan tingkat pengulangan kata.
        </p>
        <p>
          Sesuaikan slider parameter di sebelah kiri, pilih System Prompt (Kepribadian AI), lalu ketik pertanyaan untuk menyaksikan bagaimana otak AI mentranformasikan token jawaban secara dramatis!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: PARAMETER DIALS BOARD (5-COLS) */}
        <div className="lg:col-span-5 flex flex-col gap-4 bg-[#0A0E1A] p-5 rounded-2xl border border-slate-800">
          
          <h3 className="text-xs font-black font-display text-cyan-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-850 pb-2 mb-1">
            <Sliders size={14} /> CONTROLS PANEL
          </h3>

          {/* Model Selector Card Group */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400">1. PILIH OTAK MODEL:</span>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(MODEL_PRESETS) as ModelType[]).map((key) => {
                const isSel = model === key;
                return (
                  <button
                    key={key}
                    onClick={() => { sfx.play('hover'); setModel(key); }}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      isSel 
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' 
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold leading-tight">
                      <span className="text-lg select-none">{MODEL_PRESETS[key].avatar}</span>
                      <span>{MODEL_PRESETS[key].name.split(' (')[0]}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slider 1: Temperature */}
          <div className="flex flex-col gap-1.5 pt-2">
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-300 font-bold flex items-center gap-1">
                🌡️ Temperature (Suhu): <span className="text-cyan-400">{temperature.toFixed(2)}</span>
              </span>
              <span className="text-[9px] text-[#A7F3D0] uppercase bg-green-950 px-1 rounded">
                YIELD VARIANCE
              </span>
            </div>
            <input 
              type="range" 
              min="0.0" 
              max="1.5" 
              step="0.05"
              value={temperature} 
              disabled={isGenerating}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <span>Determinisme Dingin (0.0)</span>
              <span>Kreatif Halusinasi (1.5)</span>
            </div>
          </div>

          {/* Slider 2: Top-P */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-300 font-bold flex items-center gap-1">
                📊 Top-P (Nucleus): <span className="text-purple-400">{topP.toFixed(2)}</span>
              </span>
              <span className="text-[9px] text-[#BFDBFE] uppercase bg-blue-950 px-1 rounded">
                KAMPUS KATA
              </span>
            </div>
            <input 
              type="range" 
              min="0.1" 
              max="1.0" 
              step="0.05"
              value={topP} 
              disabled={isGenerating}
              onChange={(e) => setTopP(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <span>Kosakata Minimal (0.1)</span>
              <span>Kosakata Bebas (1.0)</span>
            </div>
          </div>

          {/* Slider 3: Frequency Penalty */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-300 font-bold flex items-center gap-1">
                🌀 Frequency Penalty: <span className="text-amber-400">{frequencyPenalty.toFixed(2)}</span>
              </span>
              <span className="text-[9px] text-[#FDE68A] uppercase bg-amber-950 px-1 rounded">
                ANTI-SULIH BARU
              </span>
            </div>
            <input 
              type="range" 
              min="-1.5" 
              max="2.0" 
              step="0.1"
              value={frequencyPenalty} 
              disabled={isGenerating}
              onChange={(e) => setFrequencyPenalty(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-amber-550"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <span>Perulangan Kusut (-1.5)</span>
              <span>Anti Pengulangan (2.0)</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: INTERACTIVE INPUT & SCREEN OUTPUT BOARD (7-COLS) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* SYSTEM CHARACTER SELECTOR */}
          <div className="bg-[#0A0E1A] p-4 rounded-2xl border border-slate-800 flex flex-col gap-2.5">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400">2. MINTA KEPRIBADIAN (SYSTEM PROMPT):</span>
            <div className="flex flex-wrap gap-2">
              {SYSTEM_PROMPTS.map((p) => {
                const isActive = systemPrompt === p.text;
                return (
                  <button
                    key={p.id}
                    onClick={() => applyPresetSystemPrompt(p.text)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-purple-600/20 border-purple-400 text-purple-300' 
                        : 'bg-slate-900 border-slate-850 text-slate-400 hover:border-slate-800'
                    }`}
                  >
                    {p.name.split(' (')[0]}
                  </button>
                );
              })}
            </div>

            {/* Editable System Prompt Textarea */}
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full mt-1 bg-slate-950 border border-slate-850 p-3 rounded-xl text-xs font-mono text-slate-300 focus:border-cyan-400 focus:outline-none leading-relaxed h-[62px] resize-none"
              placeholder="Inject custom instructions here..."
            />
          </div>

          {/* USER INTERACTION CONTROL BAR */}
          <div className="flex gap-2 bg-[#0A0E1A] p-2.5 rounded-2xl border border-slate-800">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={isGenerating}
              className="flex-1 bg-slate-950 border border-slate-850 px-4 py-2.5 rounded-xl text-xs font-bold text-white focus:border-cyan-400 focus:outline-none"
              placeholder="Tanyakan sesuatu pada model..."
            />
            <button
              onClick={handleSynthesize}
              disabled={isGenerating || !userInput.trim()}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] text-white text-xs font-display font-black uppercase tracking-wider rounded-xl cursor-pointer disabled:opacity-40 flex items-center gap-1.5 select-none shrink-0"
            >
              <Cpu size={14} className={isGenerating ? 'animate-spin' : ''} />
              {isGenerating ? 'MENGULAS...' : 'RUN'}
            </button>
          </div>

          {/* TELEMETRY MATRIX DISPLAY SCREEN */}
          <div className="bg-[#060b13] border-2 border-slate-850 rounded-2xl overflow-hidden p-4 relative min-h-[180px] flex flex-col justify-between">
            <div className="absolute top-2 right-2 text-[8px] font-mono text-cyan-400/50 uppercase tracking-widest">
              MONITOR SCREEN COMPONENT
            </div>

            {/* Thinking Chain (DeepSeek Only) */}
            {model === 'deepseek-r1' && reasoningChain && (
              <div className="bg-[#111827]/80 rounded-xl p-3 border border-slate-800/80 mb-3 text-[10px] font-mono text-amber-300/85 leading-relaxed">
                <div className="font-bold flex items-center gap-1.5 text-amber-400 uppercase text-[9px] tracking-wider mb-1">
                  🔎 Chain-of-Thought DeepSeek-R1 (Langkah Penalaran)
                </div>
                <pre className="whitespace-pre-wrap">{reasoningChain}</pre>
              </div>
            )}

            {/* Generated output */}
            <div className="flex-1 font-mono text-xs leading-relaxed text-cyan-100 mb-4 whitespace-pre-wrap p-2 min-h-[90px]">
              {isGenerating ? (
                <span className="text-slate-500 animate-pulse">
                  ⚡ Memodifikasi variabel bobot neuron... Membaca top-p... Menghasilkan token jawaban secara real-time...
                </span>
              ) : simulatedOutput ? (
                simulatedOutput
              ) : (
                <span className="text-slate-600 italic">
                  Belum ada luapan token. Klik "RUN" di atas untuk menembakkan generator simulator!
                </span>
              )}
            </div>

            {/* Parameters overlay indicators */}
            <div className="flex flex-wrap gap-4 border-t border-slate-850 pt-3 text-[9px] font-mono text-slate-500">
              <span>🧠 MODEL: <span className="text-white font-bold">{MODEL_PRESETS[model].name.split(' (')[0]}</span></span>
              <span>🌡️ TEMP: <span className="text-white font-bold">{temperature}</span></span>
              <span>📊 TOP-P: <span className="text-white font-bold">{topP}</span></span>
              <span>🌀 PENALTY: <span className="text-white font-bold">{frequencyPenalty}</span></span>
            </div>
          </div>

          {/* RECONSTRUCT EXPLANATION METRICS */}
          {showExplanation && (
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-xs text-cyan-200 leading-relaxed flex items-start gap-2 animate-fade-in">
              <Info size={16} className="text-cyan-400 shrink-0 mt-0.5" />
              <p>{showExplanation}</p>
            </div>
          )}

        </div>

      </div>

      {/* FOOTER CHALLENGE OUTCOME ACHIEVED CARD */}
      <div className="mt-2 border-t border-slate-800 pt-4 flex flex-col sm:flex-row justify-between items-center bg-[#070b13] p-4 rounded-2xl gap-3">
        <div className="text-xs text-slate-400">
          🔓 <span className="font-bold text-white">Syarat Selesai:</span> Lakukan eksperimen simulasi minimal satu kali untuk membuka sertifikat playground Anda!
        </div>
        <button
          onClick={handleFinishSandbox}
          disabled={experimentCount === 0}
          className={`px-5 py-2.5 rounded-xl font-bold font-display uppercase tracking-wider text-xs transition-all ${
            experimentCount === 0
              ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-50'
              : 'bg-gradient-to-r from-cyan-400 to-[#8B5CF6] text-white hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] cursor-pointer'
          }`}
        >
          Selesaikan & Ambil XP ✨ (+250 XP)
        </button>
      </div>

    </div>
  );
}
