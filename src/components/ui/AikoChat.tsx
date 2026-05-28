import React, { type FormEvent, useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CODEX_CONCEPTS } from '../../data/codex/concepts';

const starterMessages = [
  { id: 'm1', speaker: 'AIKO', text: 'Halo trainee! Saya AIKO, mentor AI kamu. Mau belajar konsep apa hari ini? Tanyakan saja seperti "Apa itu RAG?" atau "jelaskan Dropout".' },
  { id: 'm2', speaker: 'AIKO', text: 'Kamu juga bisa mengetuk tombol Teori AI di bawah untuk belajar materi acak secara cepat!' }
];

export default function AikoChat() {
  const [messages, setMessages] = useState(starterMessages);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getBotReply = (query: string): string => {
    const cleanQuery = query.toLowerCase().trim();
    
    if (cleanQuery.includes('joke') || cleanQuery.includes('canda') || cleanQuery.includes('lucu')) {
      const jokes = [
        '"Ada 99 masalah di kodinganku, aku pakai AI untuk memperbaikinya. Sekarang aku punya 143 masalah dan 1 entitas cerdas pemarah!"',
        '"Knock knock! Siapa di sana? Git. Git siapa? Git reset --hard HEAD dan lupakan semuanya!"',
        '"Kenapa mesin neural network senang ke pantai? Karena mereka mau mandi di bawah sebaran ombak Tensor!"',
        '"Mengapa LLM tidak pernah berpacaran? Karena bingung membedakan relasi tulus dan statistik probabilitas token!"',
        '"Aku coba melatih AI untuk diet sehat, tapi dia malah melakukan gradient descent sampai berat badannya dikira NaN!"',
        '"Data scientist itu ibarat dukun modern: membaca sekumpulan tabel berantakan lalu meramal masa depan dengan label probabilitas!"'
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    }
    
    if (cleanQuery.includes('teori') || cleanQuery.includes('materi') || cleanQuery.includes('konsep')) {
      const concept = CODEX_CONCEPTS[Math.floor(Math.random() * CODEX_CONCEPTS.length)];
      let replyText = `Tentu! Mari bahas **${concept.title}** (${concept.category}):\n\n*Definisi:* ${concept.shortDef}\n\n*Analogi:* ${concept.analogy}`;
      if (concept.formula) {
        replyText += `\n\n*Rumus:* \`${concept.formula}\``;
      }
      return replyText;
    }
    
    // Scan database for keywords
    for (const concept of CODEX_CONCEPTS) {
      if (
        cleanQuery.includes(concept.id) || 
        cleanQuery.includes(concept.title.toLowerCase()) ||
        (concept.title.toLowerCase().split(' ').length > 1 && cleanQuery.includes(concept.title.toLowerCase().split(' ')[0]))
      ) {
        let replyText = `### 📚 ${concept.title} [${concept.difficulty}]\nKategori: **${concept.category}**\n\n*Definisi:* ${concept.shortDef}\n\n*Penjelasan:* ${concept.fullExplanation}\n\n*Analogi:* _${concept.analogy}_`;
        if (concept.formula) {
          replyText += `\n\n*Rumus / Contoh:* \`\`\`\n${concept.formula}\n\`\`\``;
        }
        if (concept.codeExample) {
          replyText += `\n\n*Implementasi Kode:* \`\`\`python\n${concept.codeExample}\n\`\`\``;
        }
        return replyText;
      }
    }
    
    if (cleanQuery.includes('halo') || cleanQuery.includes('hai') || cleanQuery.includes('aiko')) {
      return 'Halo! Saya asisten AIKO. Silakan ketik nama topik AI yang ingin kamu pelajari (misal: "perceptron", "RAG", "overfitting", "RLHF"), atau tanyakan teori acak!';
    }
    
    return 'Menarik! Saya masih belajar. Coba tanyakan topik spesifik seperti "Apa itu RAG?", "jelaskan backprop", "apa itu kuantisasi?", atau ketuk tombol "💡 Teori AI" / "✨ Joke AI".';
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg = { id: `user-${Date.now()}`, speaker: 'Kamu', text: text.trim() };
    setMessages(current => [...current, userMsg]);

    // Fetch reply after short delay
    setTimeout(() => {
      const replyText = getBotReply(text);
      const botMsg = { id: `bot-${Date.now()}`, speaker: 'AIKO', text: replyText };
      setMessages(current => [...current, botMsg]);
    }, 450);
  };

  const handleSend = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 24 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.45 }} 
      className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 shadow-xl backdrop-blur-xl flex flex-col min-h-[380px] max-h-[480px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/5">
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.25em] text-[#8B5CF6] font-display">Tanya AIKO Mentor</h3>
          <p className="text-[10px] text-slate-500 mt-0.5 font-mono">Interactive Socratic Tutor</p>
        </div>
        <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 text-[8px] font-mono text-cyan-300 uppercase tracking-widest">Active</span>
      </div>

      {/* Messages bubble body */}
      <div className="flex-1 mt-3 space-y-3 overflow-y-auto pr-1 scrollbar-thin">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`rounded-2xl p-3 border text-xs max-w-[90%] leading-relaxed flex flex-col gap-1 ${
              message.speaker === 'AIKO' 
                ? 'bg-slate-950/60 border-slate-800 text-slate-200 mr-auto' 
                : 'bg-[#8B5CF6]/10 border-[#8B5CF6]/20 text-[#00D4FF] ml-auto'
            }`}
          > 
            <span className="text-[8px] font-bold font-mono uppercase tracking-wider text-slate-500">{message.speaker}</span>
            <div className="whitespace-pre-wrap">{message.text}</div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestion templates panel */}
      <div className="flex gap-2 mt-3 pb-2 border-b border-white/5 shrink-0">
        <button
          type="button"
          onClick={() => sendMessage("Berikan saya teori AI acak 💡")}
          className="flex-1 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[9px] font-mono text-slate-300 transition-all border border-white/5 cursor-pointer text-center"
        >
          💡 Teori AI
        </button>
        <button
          type="button"
          onClick={() => sendMessage("Berikan saya joke AI ✨")}
          className="flex-1 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[9px] font-mono text-slate-300 transition-all border border-white/5 cursor-pointer text-center"
        >
          ✨ Joke AI
        </button>
      </div>

      {/* Form Input */}
      <form onSubmit={handleSend} className="mt-3 flex gap-2 shrink-0">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/20"
          placeholder="Tanya AIKO (misal: 'apa itu RAG?')..."
          aria-label="Ketik pesan ke AIKO"
        />
        <button 
          type="submit" 
          className="rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#00D4FF] px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-950 transition hover:brightness-110 cursor-pointer"
        >
          Kirim
        </button>
      </form>
    </motion.div>
  );
}
