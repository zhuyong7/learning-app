import { Link } from 'react-router-dom';
import { Clock3, Heart, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import type { WorkItem } from '../../types/domain';
import { Card } from '../ui/Card';
import { cn } from '../../utils/classNames';

interface WorkCardProps {
  work: WorkItem;
}

const workTypeLabels: Record<WorkItem['type'], string> = {
  reading: '阅读',
  speaking: '口语',
  story: '故事',
  vocabulary: '词汇',
};

export function WorkCard({ work }: WorkCardProps) {
  const completedDate = new Date(work.completedAt).toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.article whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
      <Link to={`/works/${work.id}`} className="block h-full rounded-card focus:outline-none focus:ring-4 focus:ring-growth-secondary/25">
        <Card className="group h-full overflow-hidden border border-white/80 p-0 transition duration-300 hover:border-growth-secondary/45 hover:shadow-[0_0_38px_rgba(96,165,250,0.35)]">
          <div className="relative h-48 overflow-hidden">
            <img
              src={work.cover}
              alt={work.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
            <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-amber-300 px-3 py-1 text-sm font-black text-amber-950 shadow-lg">
              <Trophy className="h-4 w-4" />
              {work.score}分
            </span>
            <span
              className={cn(
                'absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur',
                work.favorite ? 'bg-rose-500 text-white' : 'bg-white/80 text-slate-400',
              )}
              aria-label={work.favorite ? '已收藏' : '未收藏'}
            >
              <Heart className={cn('h-5 w-5', work.favorite && 'fill-current')} />
            </span>
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-black text-growth-secondary">
                {workTypeLabels[work.type]}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400">
                <Clock3 className="h-4 w-4" />
                {work.duration}
              </span>
            </div>
            <h3 className="mt-4 line-clamp-2 text-lg font-black leading-snug text-growth-ink">{work.title}</h3>
            <p className="mt-3 text-sm font-semibold text-slate-500">完成于 {completedDate}</p>
          </div>
        </Card>
      </Link>
    </motion.article>
  );
}
