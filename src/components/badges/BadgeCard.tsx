import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Badge } from '../../types/domain';
import { cn } from '../../utils/classNames';

interface BadgeCardProps {
  badge: Badge;
  onPreview?: (badge: Badge) => void;
}

const rarityLabel: Record<Badge['rarity'], string> = {
  common: '普通',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说',
};

const rarityClasses: Record<Badge['rarity'], string> = {
  common: 'bg-slate-100 text-slate-500 ring-slate-200',
  rare: 'bg-sky-100 text-sky-600 ring-sky-200',
  epic: 'bg-purple-100 text-purple-600 ring-purple-200',
  legendary: 'bg-amber-100 text-amber-600 ring-amber-200',
};

const particlePositions = [
  'left-[14%] top-[18%]',
  'right-[18%] top-[22%]',
  'left-[22%] bottom-[28%]',
  'right-[24%] bottom-[20%]',
  'left-1/2 top-[12%]',
  'right-[12%] top-1/2',
];

export function BadgeCard({ badge, onPreview }: BadgeCardProps) {
  const isInteractive = Boolean(onPreview);

  return (
    <motion.button
      type="button"
      whileHover={{ y: badge.earned ? -6 : -2, scale: badge.earned ? 1.02 : 1 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onPreview?.(badge)}
      className={cn(
        'group relative min-h-[260px] overflow-hidden rounded-[32px] border p-5 text-left transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-growth-secondary',
        badge.earned
          ? 'border-amber-300 bg-gradient-to-br from-amber-50 via-white to-orange-100 shadow-[0_22px_55px_rgba(245,158,11,0.24)] hover:shadow-[0_28px_70px_rgba(245,158,11,0.32)]'
          : 'border-slate-200 bg-gradient-to-br from-slate-100 via-white to-slate-200 text-slate-400 grayscale hover:grayscale-[0.7]',
        !isInteractive && 'cursor-default',
      )}
      aria-label={`${badge.name}${badge.earned ? '，已获得' : '，待解锁'}`}
    >
      {badge.earned ? (
        <>
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-300/35 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-12 left-8 h-24 w-24 rounded-full bg-orange-300/30 blur-2xl" />
          {particlePositions.map((position, index) => (
            <motion.span
              key={position}
              className={cn('pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.9)]', position)}
              animate={{ opacity: [0.25, 1, 0.25], scale: [0.8, 1.35, 0.8] }}
              transition={{ duration: 2.1, repeat: Infinity, delay: index * 0.16 }}
            />
          ))}
        </>
      ) : (
        <div className="pointer-events-none absolute inset-0 bg-white/35" />
      )}

      <div className="relative z-10 flex items-start justify-between gap-3">
        <span className={cn('rounded-full px-3 py-1 text-xs font-black ring-1', rarityClasses[badge.rarity])}>
          {rarityLabel[badge.rarity]}
        </span>
        <span className={cn('rounded-full px-3 py-1 text-xs font-black', badge.earned ? 'bg-white/85 text-amber-600 shadow-sm' : 'bg-slate-200 text-slate-500')}>
          {badge.earned ? '已获得' : '未解锁'}
        </span>
      </div>

      <div className="relative z-10 mt-7 flex flex-col items-center text-center">
        <div
          className={cn(
            'relative flex h-24 w-24 items-center justify-center rounded-[30px] bg-white text-6xl shadow-inner ring-8 transition duration-300 group-hover:scale-105',
            badge.earned ? 'ring-amber-100' : 'ring-slate-200',
          )}
        >
          <span className={cn(!badge.earned && 'opacity-45')}>{badge.icon}</span>
          {!badge.earned ? (
            <span className="absolute inset-0 flex items-center justify-center rounded-[30px] bg-slate-900/28 text-white backdrop-blur-[1px]">
              <Lock className="h-8 w-8" aria-hidden="true" />
            </span>
          ) : null}
        </div>

        <h3 className={cn('mt-5 text-xl font-black tracking-tight', badge.earned ? 'text-growth-ink' : 'text-slate-500')}>
          {badge.name}
        </h3>
        <p className={cn('mt-2 min-h-12 text-sm leading-6', badge.earned ? 'text-slate-600' : 'text-slate-400')}>
          {badge.description}
        </p>
        <p className={cn('mt-4 text-xs font-black', badge.earned ? 'text-amber-600' : 'text-slate-400')}>
          {badge.earnedTime ? `获得时间 ${badge.earnedTime}` : '完成目标后点亮勋章'}
        </p>
      </div>
    </motion.button>
  );
}
