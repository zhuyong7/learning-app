import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { WorkItem } from '../../types/domain';
import { Card } from '../ui/Card';
import { SectionHeader } from '../ui/SectionHeader';

interface HighlightWorksCarouselProps {
  works: WorkItem[];
}

const workTypeLabels: Record<WorkItem['type'], string> = {
  reading: '阅读',
  speaking: '口语',
  story: '故事',
  vocabulary: '词汇',
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };

export function HighlightWorksCarousel({ works }: HighlightWorksCarouselProps) {
  const highlightedWorks = works.slice(0, 5);

  return (
    <section className="space-y-5">
      <SectionHeader
        eyebrow="Works"
        title="高光作品"
        description="精选最近完成的学习成果，回看每一次闪光表现。"
        action={
          <Link className="text-sm font-black text-growth-secondary hover:text-blue-600" to="/works">
            查看全部
          </Link>
        }
      />
      <motion.div className="flex gap-5 overflow-x-auto pb-4 pt-1 [scrollbar-width:thin]" variants={container} initial="hidden" animate="show">
        {highlightedWorks.map((work) => (
          <motion.div key={work.id} variants={item} whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }} className="min-w-[240px] sm:min-w-[290px]">
            <Link to={`/works/${work.id}`} className="block focus:outline-none focus:ring-4 focus:ring-growth-secondary/30">
              <Card className="overflow-hidden border border-white/80 p-0 transition-shadow duration-300 hover:shadow-[0_0_34px_rgba(96,165,250,0.32)]">
                <div className="relative h-36 overflow-hidden">
                  <img src={work.cover} alt={work.title} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full bg-white/86 px-3 py-1 text-xs font-black text-growth-ink backdrop-blur">
                    {workTypeLabels[work.type]}
                  </span>
                  <span className="absolute bottom-3 right-3 rounded-2xl bg-amber-300 px-3 py-1 text-sm font-black text-amber-950 shadow-lg">
                    {work.score}分
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-2 text-base font-black text-growth-ink">{work.title}</h3>
                  <p className="mt-2 text-sm font-semibold text-slate-500">{work.duration} · {new Date(work.completedAt).toLocaleDateString('zh-CN')}</p>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
