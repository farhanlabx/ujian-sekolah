import { motion } from 'framer-motion';

const planets = [
  { id: 'neuron-builder', name: 'Neuron Dome', label: 'Neuron Builder', color: '#00D4FF', orbit: 'animate-orbit-slow', offset: 'top-[10%] left-[14%]' },
  { id: 'data-sorter', name: 'Data Core', label: 'Data Sorter', color: '#8B5CF6', orbit: 'animate-orbit-moderate', offset: 'top-[22%] right-[16%]' },
  { id: 'prompt-wizard', name: 'Prompt Lab', label: 'Prompt Wizard', color: '#06B6D4', orbit: 'animate-orbit-fast', offset: 'bottom-[14%] left-[18%]' },
  { id: 'model-showdown', name: 'Model Arena', label: 'Model Showdown', color: '#10B981', orbit: 'animate-orbit-slow', offset: 'bottom-[18%] right-[22%]' },
  { id: 'overfitting-escape', name: 'Escape Gate', label: 'Overfitting Escape', color: '#F59E0B', orbit: 'animate-orbit-moderate', offset: 'top-[40%] left-[48%]' },
  { id: 'ethical-judge', name: 'Justice Hub', label: 'Ethical Judge', color: '#EF4444', orbit: 'animate-orbit-fast', offset: 'top-[55%] right-[42%]' },
  { id: 'hyperparameter-sandbox', name: 'Pro Sandbox', label: 'Model Tuner', color: '#06B6D4', orbit: 'animate-orbit-fast', offset: 'bottom-[40%] right-[48%]' }
];

export interface WorldMapProps {
  activePlanet?: string;
  onSelectPlanet: (planetId: string) => void;
  completedGames?: string[];
}

export default function WorldMap({ activePlanet, onSelectPlanet, completedGames = [] }: WorldMapProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_35px_100px_rgba(0,0,0,0.25)] backdrop-blur-xl"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.06),_transparent_28%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,_rgba(255,255,255,0.03),_transparent_60%)] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col gap-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="block text-[10px] uppercase tracking-[0.34em] text-slate-500 font-mono">Peta Progresi Arena</span>
            <h2 className="mt-2 text-2xl font-black text-white font-display">Jelajahi Galaksi AI Arena</h2>
          </div>
          <p className="max-w-xl text-xs leading-relaxed text-slate-400">
            Setiap planet mewakili game AI yang menantang. Ketuk planet untuk meluncurkan modul belajar! Planet berlist hijau menandakan misi selesai.
          </p>
        </div>

        <div className="relative aspect-[2.1] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-[#070B16]/80 min-h-[300px]">
          {/* Starfield simulation */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.08),_transparent_45%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,_rgba(255,255,255,0.08),_transparent_20%)]" />

          {/* Grid lines */}
          <div className="absolute inset-0 grid grid-cols-6">
            <div className="border-r border-dashed border-white/5" />
            <div className="border-r border-dashed border-white/5" />
            <div className="border-r border-dashed border-white/5" />
            <div className="border-r border-dashed border-white/5" />
            <div className="border-r border-dashed border-white/5" />
            <div />
          </div>

          {/* Sun / Core spaceship */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-20 w-20 rounded-full border border-white/10 bg-white/5 shadow-[0_0_40px_rgba(0,212,255,0.15)] flex items-center justify-center">
              <span className="text-3xl animate-pulse select-none">🚀</span>
            </div>
          </div>

          {/* Render Planets */}
          {planets.map((planet) => {
            const isCompleted = completedGames.includes(planet.id);
            const isActive = activePlanet === planet.id;

            return (
              <motion.button
                key={planet.id}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectPlanet(planet.id)}
                className={`absolute ${planet.offset} flex h-16 w-16 flex-col items-center justify-center rounded-full border-2 text-white shadow-[0_0_15px_rgba(0,0,0,0.3)] transition-all cursor-pointer ${
                  isActive 
                    ? 'scale-110 border-cyan-400 shadow-[0_0_20px_rgba(0,212,255,0.4)]' 
                    : isCompleted
                      ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : 'border-white/10 hover:border-white/30'
                }`}
                style={{ 
                  background: `radial-gradient(circle, ${planet.color}22 0%, rgba(7,11,22,0.85) 90%)` 
                }}
              >
                <div className="text-[10px] font-bold text-center leading-tight truncate px-1" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                  {planet.label}
                </div>
                {isCompleted && (
                  <span className="absolute -bottom-1 -right-1 text-[8px] bg-emerald-500 text-slate-950 font-bold px-1 rounded-full border border-slate-950">✓</span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
