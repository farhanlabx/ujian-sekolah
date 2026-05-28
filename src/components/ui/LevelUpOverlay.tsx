import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  visible: boolean;
  levelTitle: string;
  onClose: () => void;
}

export default function LevelUpOverlay({ visible, levelTitle, onClose }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: .25 } }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,.88)', backdropFilter: 'blur(10px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: .8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0, transition: { duration: .5, ease: [.16,1,.3,1] } }}
            exit={{ scale: .9, opacity: 0 }}
            className="relative w-full max-w-sm rounded-3xl text-center overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,.6)]"
            style={{
              background: 'linear-gradient(160deg, #0d1a2e, #111827)',
              border: '1px solid rgba(0,212,255,.25)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Glow ring */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,212,255,.18), transparent 60%)' }} />

            {/* Animated ring */}
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [.4, .15, .4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{ border: '2px solid rgba(0,212,255,.3)' }}
            />

            <div className="relative z-10 p-8">
              {/* Trophy emoji */}
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0, transition: { delay: .15, type: 'spring', stiffness: 200 } }}
                className="text-6xl mb-4 select-none"
              >
                🏆
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { delay: .25 } }}
                className="text-3xl font-black font-display tracking-widest text-white mb-1"
              >
                LEVEL UP!
              </motion.h2>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: .35 } }}
                className="mt-4 inline-flex items-center gap-3 rounded-full px-5 py-2.5 mb-6"
                style={{
                  background: 'rgba(0,212,255,.1)',
                  border: '1px solid rgba(0,212,255,.3)',
                  boxShadow: '0 0 20px rgba(0,212,255,.15)',
                }}
              >
                <span className="text-[#00D4FF] font-black font-display text-sm tracking-wide">{levelTitle}</span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: .4 } }}
                className="text-sm text-slate-400 mb-7 leading-relaxed"
              >
                Kamu semakin mahir dalam AI Engineering!<br/>Terus bermain dan kumpulkan semua badges. 🎯
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0, transition: { delay: .5 } }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: .97 }}
                onClick={onClose}
                className="w-full rounded-2xl py-3 text-sm font-black uppercase tracking-widest text-[#030712]"
                style={{ background: 'linear-gradient(135deg, #00D4FF, #8B5CF6)', boxShadow: '0 6px 24px rgba(0,212,255,.35)' }}
              >
                Lanjutkan Petualangan 🚀
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
