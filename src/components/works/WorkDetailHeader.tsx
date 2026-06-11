import { CalendarCheck2, Clock3, Sparkles } from 'lucide-react';
import type { WorkItem } from '../../types/domain';
import { Card } from '../ui/Card';

interface WorkDetailHeaderProps {
  work: WorkItem;
}

const workTypeLabels: Record<WorkItem['type'], string> = {
  reading: '阅读',
  speaking: '口语',
  story: '故事',
  vocabulary: '词汇',
};

export function WorkDetailHeader({ work }: WorkDetailHeaderProps) {
  const completedTime = new Date(work.completedAt).toLocaleString('zh-CN', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card glow className="relative overflow-hidden border border-white/70 bg-gradient-to-br from-white via-emerald-50/80 to-sky-50/80 p-0">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-growth-primary/20 blur-3xl" />
      <div className="grid gap-0 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="relative min-h-[280px] overflow-hidden lg:min-h-[360px]">
          <img src={work.cover} alt={work.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 to-transparent" />
          <div className="absolute bottom-5 left-5 rounded-3xl bg-white/88 px-5 py-3 shadow-card backdrop-blur">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-growth-secondary">Work Score</p>
            <p className="mt-1 text-4xl font-black text-amber-500">{work.score}<span className="text-lg text-amber-500/75">分</span></p>
          </div>
        </div>

        <div className="relative flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/78 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-growth-secondary shadow-sm ring-1 ring-white/80">
            <Sparkles className="h-4 w-4" />
            Works Detail
          </span>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-growth-ink sm:text-5xl">{work.title}</h1>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full bg-growth-ink px-4 py-2 text-sm font-black text-white">{workTypeLabels[work.type]}</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-slate-600 shadow-sm">
              <Clock3 className="h-4 w-4 text-growth-primary" />
              {work.duration}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-slate-600 shadow-sm">
              <CalendarCheck2 className="h-4 w-4 text-growth-secondary" />
              {completedTime}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
