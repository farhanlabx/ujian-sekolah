import { motion } from 'framer-motion';

const planets = [
  { name: 'Neuron Dome', label: 'Neuron Builder', color: '#00D4FF', orbit: 'animate-orbit-slow', offset: 'top-[10%] left-[14%]' },
  { name: 'Data Core', label: 'Data Sorter', color: '#8B5CF6', orbit: 'animate-orbit-moderate', offset: 'top-[22%] right-[16%]' },
  { name: 'Prompt Lab', label: 'Prompt Wizard', color: '#06B6D4', orbit: 'animate-orbit-fast', offset: 'bottom-[14%] left-[18%]' },
  { name: 'Model Arena', label: 'Model Showdown', color: '#10B981', orbit: 'animate-orbit-slow', offset: 'bottom-[18%] right-[22%]' },
  { name: 'Escape Gate', label: 'Overfitting Escape', color: '#F59E0B', orbit: 'animate-orbit-moderate', offset: 'top-[40%] left-[48%]' },
  { name: 'Justice Hub', label: 'Ethical Judge', color: '#EF4444', orbit: 'animate-orbit-fast', offset: 'top-[55%] right-[42%]' }
];

export interface WorldMapProps {
  activePlanet?: string;
  onSelectPlanet: (planetId: string) => void;
}

export default function WorldMap({ activePlanet, onSelectPlanet }: WorldMapProps) {
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
            <span className="block text-[11px] uppercase tracking-[0.34em] text-slate-400">World Map Progression</span>
            <h2 className="mt-2 text-2xl font-black text-white font-display">Jelajahi Galaksi AI Arena</h2>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-slate-300">
            Setiap planet adalah game dengan tema AI spesifik. Unlock dan kunjungi satu per satu untuk membuka cerita dan skill baru.
          </p>
        </div>

        <div className="relative aspect-[2.2] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-[#070B16]/80">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.08),_transparent_45%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,_rgba(255,255,255,0.08),_transparent_20%)]" />

          <div className="absolute inset-0 grid grid-cols-6">
            <div className="border-r border-dashed border-white/5" />
            <div className="border-r border-dashed border-white/5" />
            <div className="border-r border-dashed border-white/5" />
            <div className="border-r border-dashed border-white/5" />
            <div className="border-r border-dashed border-white/5" />
            <div />
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-24 w-24 rounded-full border border-white/10 bg-white/5 shadow-[0_0_40px_rgba(255,255,255,0.08)]">
              <span className="absolute inset-0 grid place-items-center text-3xl">🚀</span>
            </div>
          </div>

          {planets.map((planet) => (
            <motion.button
              key={planet.id}
              whileHover={{ scale: 1.05 }}
              onClick={() => onSelectPlanet(planet.label)}
              className={`absolute ${planet.offset} flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/10 text-sm font-semibold text-white shadow-[0_0_18px_rgba(0,0,0,0.2)] transition-all ${activePlanet === planet.label ? 'scale-105 border-white/40 shadow-[0_0_25px_rgba(255,255,255,0.25)]' : 'hover:border-white/30'}`}
              style={{ background: `radial-gradient(circle, ${planet.color}22 0%, rgba(255,255,255,0.03) 85%)` }}
            >
              <span className="text-xs leading-tight">{planet.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
