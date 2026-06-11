import { motion } from 'framer-motion';
import type { UserProfile } from '../../types/domain';

interface HeroGrowthPanelProps {
  user: UserProfile;
}

export function HeroGrowthPanel({ user }: HeroGrowthPanelProps) {
  const progress = Math.min(100, Math.round((user.exp / user.nextLevelExp) * 100));

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="relative h-[320px] overflow-hidden rounded-card bg-gradient-to-br from-emerald-300 via-sky-300 to-amber-200 p-6 shadow-card sm:p-8"
    >
      <motion.div
        className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.0),rgba(255,255,255,0.42),rgba(255,255,255,0.0))]"
        animate={{ x: ['-120%', '120%'] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute left-8 top-8 h-10 w-24 rounded-full bg-white/70 blur-[1px]"
        animate={{ y: [0, -8, 0], x: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-16 top-14 h-8 w-20 rounded-full bg-white/65 blur-[1px]"
        animate={{ y: [0, 7, 0], x: [0, -8, 0] }}
        transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-44 top-28 h-6 w-16 rounded-full bg-white/55 blur-[1px]"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="absolute bottom-0 left-0 h-28 w-44 bg-emerald-700/22 [clip-path:polygon(0_100%,42%_20%,72%_62%,100%_8%,100%_100%)]" />
      <div className="absolute bottom-0 right-0 h-32 w-60 bg-slate-700/18 [clip-path:polygon(0_100%,18%_50%,34%_62%,52%_18%,70%_58%,86%_32%,100%_100%)]" />
      <div className="absolute bottom-8 right-10 grid grid-cols-3 gap-1 opacity-80">
        {Array.from({ length: 9 }).map((_, index) => (
          <span
            key={index}
            className="h-4 w-4 rounded-[4px] border border-white/25 bg-amber-600/35 shadow-sm"
          />
        ))}
      </div>

      {[
        { left: '58%', top: '54%', delay: 0.15 },
        { left: '66%', top: '46%', delay: 0.32 },
        { left: '74%', top: '58%', delay: 0.5 },
      ].map((orb, index) => (
        <motion.span
          key={index}
          className="absolute z-20 h-4 w-4 rounded-full border-2 border-white/80 bg-gradient-to-br from-yellow-200 to-amber-400 shadow-[0_0_18px_rgba(251,191,36,0.85)]"
          style={{ left: orb.left, top: orb.top }}
          initial={{ opacity: 0, scale: 0.4, y: -36 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.4, 1.1, 0.8, 0.3], x: [-8, -46, -96], y: [-36, 4, 52] }}
          transition={{ duration: 1.55, delay: orb.delay, ease: 'easeInOut' }}
        />
      ))}

      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0.8, rotate: -8 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 14 }}
              className="flex h-20 w-20 items-center justify-center rounded-[28px] border-4 border-white/80 bg-white/85 text-5xl shadow-glow"
            >
              {user.avatar}
            </motion.div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-950/60">Home Quest</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-white drop-shadow-sm sm:text-5xl">
                Lv.{user.level} {user.name}
              </h1>
              <p className="mt-2 inline-flex rounded-full bg-white/70 px-3 py-1 text-sm font-bold text-emerald-950 shadow-sm">
                {user.title}
              </p>
            </div>
          </div>
          <div className="hidden rounded-2xl border border-white/50 bg-white/45 px-4 py-3 text-right backdrop-blur sm:block">
            <p className="text-xs font-bold text-emerald-950/60">STREAK</p>
            <p className="text-xl font-black text-emerald-950">🔥 {user.streakDays}天</p>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/55 bg-white/72 p-4 shadow-lg backdrop-blur-md sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3 text-sm font-bold text-slate-700">
            <span>成长值：{user.exp} / {user.nextLevelExp}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-5 overflow-hidden rounded-full bg-slate-200/80 p-1 shadow-inner">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-lime-300 to-amber-300 shadow-[0_0_18px_rgba(74,222,128,0.65)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.1, delay: 0.35, ease: 'easeOut' }}
            />
          </div>
          <p className="mt-3 text-sm font-black text-orange-600">🔥 连续学习{user.streakDays}天</p>
        </div>
      </div>
    </motion.section>
  );
}
