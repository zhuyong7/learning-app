import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { StudyMetric } from '../../types/domain';
import { cn } from '../../utils/classNames';
import { formatPercent } from '../../utils/format';

interface MetricCardProps {
  metric: StudyMetric;
}

const toneGradients: Record<StudyMetric['tone'], string> = {
  green: 'from-emerald-400 to-lime-300',
  blue: 'from-sky-400 to-blue-500',
  yellow: 'from-amber-300 to-yellow-500',
  pink: 'from-rose-300 to-pink-500',
};

export function MetricCard({ metric }: MetricCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    const totalFrames = 34;
    const timer = window.setInterval(() => {
      frame += 1;
      const progress = Math.min(1, frame / totalFrames);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(metric.value * eased));

      if (progress >= 1) {
        window.clearInterval(timer);
      }
    }, 24);

    return () => window.clearInterval(timer);
  }, [metric.value]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.28 }}
      className="relative overflow-hidden rounded-card bg-white p-5 shadow-card"
    >
      <div className={cn('absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r', toneGradients[metric.tone])} />
      <div className="flex items-start justify-between gap-4">
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl shadow-lg', toneGradients[metric.tone])}>
          {metric.icon}
        </div>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-600">
          {formatPercent(metric.delta)}
        </span>
      </div>
      <p className="mt-5 text-sm font-bold text-slate-500">{metric.label}</p>
      <p className="mt-2 flex items-end gap-1 text-growth-ink">
        <span className="text-3xl font-black leading-none sm:text-4xl">{displayValue}</span>
        <span className="pb-1 text-sm font-bold text-slate-500">{metric.unit}</span>
      </p>
    </motion.article>
  );
}
