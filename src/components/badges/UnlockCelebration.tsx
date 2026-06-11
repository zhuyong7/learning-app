import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { Badge } from '../../types/domain';

interface UnlockCelebrationProps {
  badge: Badge | null;
  onClose: () => void;
}

const confettiDots = Array.from({ length: 16 }, (_, index) => ({
  id: index,
  x: Math.cos((index / 16) * Math.PI * 2) * (90 + (index % 4) * 18),
  y: Math.sin((index / 16) * Math.PI * 2) * (80 + (index % 3) * 20),
  color: ['bg-amber-300', 'bg-orange-300', 'bg-yellow-200', 'bg-emerald-300', 'bg-sky-300'][index % 5],
}));

export function UnlockCelebration({ badge, onClose }: UnlockCelebrationProps) {
  useEffect(() => {
    if (!badge) {
      return undefined;
    }

    const timeoutId = window.setTimeout(onClose, 3000);
    return () => window.clearTimeout(timeoutId);
  }, [badge, onClose]);

  return (
    <AnimatePresence>
      {badge ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="解锁勋章"
        >
          <motion.div
            className="relative w-full max-w-md overflow-hidden rounded-[40px] border border-amber-200 bg-gradient-to-br from-white via-amber-50 to-orange-100 p-8 text-center shadow-[0_35px_120px_rgba(245,158,11,0.45)]"
            initial={{ scale: 0.75, y: 34, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.88, y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 18 }}
          >
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.55),rgba(251,191,36,0.16)_42%,transparent_72%)]" />
            {confettiDots.map((dot) => (
              <motion.span
                key={dot.id}
                className={`absolute left-1/2 top-1/2 h-3 w-3 rounded-full ${dot.color}`}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
                animate={{ x: dot.x, y: dot.y, opacity: [0, 1, 1, 0], scale: [0.4, 1.2, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.4, delay: dot.id * 0.04 }}
              />
            ))}

            <button
              type="button"
              onClick={onClose}
              className="absolute right-5 top-5 z-10 rounded-full bg-white/80 p-2 text-slate-500 shadow-sm transition hover:text-growth-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
              aria-label="关闭勋章庆祝弹窗"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            <div className="relative z-10">
              <p className="text-sm font-black uppercase tracking-[0.35em] text-amber-500">解锁勋章</p>
              <motion.div
                className="mx-auto mt-6 flex h-32 w-32 items-center justify-center rounded-[38px] bg-white text-7xl shadow-inner ring-8 ring-amber-100"
                animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.08, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 0.4 }}
              >
                {badge.icon}
              </motion.div>
              <h2 className="mt-6 text-3xl font-black tracking-tight text-growth-ink">{badge.name}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{badge.description}</p>
              <div className="mx-auto mt-6 inline-flex rounded-full bg-amber-400 px-6 py-3 text-lg font-black text-white shadow-lg shadow-amber-300/50">
                +100 EXP
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
