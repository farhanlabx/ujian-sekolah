import { type FormEvent, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

const starterMessages = [
  { id: 'm1', speaker: 'AIKO', text: 'Halo trainee! Saya AIKO, mentor AI kamu. Mau mulai dengan game mana hari ini?' },
  { id: 'm2', speaker: 'AIKO', text: 'Coba kunjungi Neuron Dome dulu kalau kamu ingin belajar neural network secara visual.' }
];

export default function AikoChat() {
  const [messages, setMessages] = useState(starterMessages);
  const [input, setInput] = useState('');

  const reply = useMemo(() => {
    if (input.length === 0) return 'Tanya aku tentang konsep AI, game, atau rekomendasi latihan.';
    if (input.toLowerCase().includes('overfitting')) return 'Overfitting terjadi ketika model terlalu hafal data training dan gagal generalisasi ke data baru.';
    if (input.toLowerCase().includes('prompt')) return 'Prompt Wizard membantu kamu merancang instruksi yang jelas dan mencegah hasil AI yang melenceng.';
    return 'Saya siap bantu. Coba minta ringkasannya, atau tanyakan “apa itu gradient descent?”.';
  }, [input]);

  const handleSend = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) return;
    setMessages((current) => [...current, { id: `u-${current.length}`, speaker: 'Kamu', text: input.trim() }]);
    setInput('');
    setTimeout(() => {
      setMessages((current) => [...current, { id: `a-${current.length}`, speaker: 'AIKO', text: reply }]);
    }, 400);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-[0_35px_100px_rgba(0,0,0,0.2)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.32em] text-slate-400">AIKO Mentor</h3>
          <p className="mt-2 text-sm text-slate-300">Tutor percakapan yang siap bantu fokus belajar dan review progress.</p>
        </div>
        <div className="rounded-full border border-white/10 bg-[#0A0E1A]/80 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-slate-200">Socratic Mode</div>
      </div>

      <div className="mt-5 max-h-[280px] space-y-3 overflow-y-auto pr-1">
        {messages.map((message) => (
          <div key={message.id} className={`rounded-3xl p-4 ${message.speaker === 'AIKO' ? 'bg-cyan-950/30 text-slate-100 self-start' : 'bg-slate-950/50 text-slate-200 self-end'} border border-white/10`}> 
            <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400 mb-2">{message.speaker}</p>
            <p className="text-sm leading-relaxed">{message.text}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="mt-4 flex gap-3">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="min-w-0 flex-1 rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
          placeholder="Tanya AIKO tentang konsep AI..."
          aria-label="Ketik pesan ke AIKO"
        />
        <button type="submit" className="rounded-3xl bg-gradient-to-r from-cyan-400 to-sky-500 px-5 py-3 text-xs font-black uppercase tracking-[0.3em] text-slate-950 transition hover:brightness-105">
          Kirim
        </button>
      </form>
    </motion.div>
  );
}
