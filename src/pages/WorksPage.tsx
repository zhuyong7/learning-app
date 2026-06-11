import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FolderSearch, LibraryBig, Sparkles, Trophy } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';
import { Card } from '../components/ui/Card';
import { SectionHeader } from '../components/ui/SectionHeader';
import { WorkCard } from '../components/works/WorkCard';
import { WorksToolbar, type WorksToolbarProps } from '../components/works/WorksToolbar';
import { localWorks } from '../data/localData';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };

export function WorksPage() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<WorksToolbarProps['type']>('all');
  const [sort, setSort] = useState<WorksToolbarProps['sort']>('newest');

  const filteredWorks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return [...localWorks]
      .filter((work) => {
        const matchesQuery = normalizedQuery.length === 0 || work.title.toLowerCase().includes(normalizedQuery);
        const matchesType = type === 'all' || work.type === type;
        return matchesQuery && matchesType;
      })
      .sort((left, right) => {
        if (sort === 'score') return right.score - left.score;
        return new Date(right.completedAt).getTime() - new Date(left.completedAt).getTime();
      });
  }, [query, type, sort]);

  const favoriteCount = localWorks.filter((work) => work.favorite).length;
  const bestScore = Math.max(...localWorks.map((work) => work.score));

  return (
    <div className="space-y-8">
      <Card glow className="relative overflow-hidden border border-white/70 bg-gradient-to-br from-white via-emerald-50/80 to-sky-50/80">
        <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-growth-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 h-28 w-28 rounded-full bg-growth-secondary/20 blur-2xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <SectionHeader
            eyebrow="Works Library"
            title="成果库"
            description="集中收藏孩子的朗读、口语、故事和词汇练习成果，用清晰筛选与得分反馈回看每一次闪光表现。"
          />

          <div className="grid gap-3 rounded-[28px] bg-white/80 p-4 text-center shadow-card ring-1 ring-white/80 backdrop-blur min-[390px]:grid-cols-3">
            <div className="rounded-2xl bg-emerald-50 px-3 py-4">
              <LibraryBig className="mx-auto h-5 w-5 text-growth-primary" />
              <p className="mt-2 text-2xl font-black text-growth-primary">{localWorks.length}</p>
              <p className="mt-1 text-xs font-bold text-slate-500">作品</p>
            </div>
            <div className="rounded-2xl bg-sky-50 px-3 py-4">
              <Sparkles className="mx-auto h-5 w-5 text-growth-secondary" />
              <p className="mt-2 text-2xl font-black text-growth-secondary">{favoriteCount}</p>
              <p className="mt-1 text-xs font-bold text-slate-500">收藏</p>
            </div>
            <div className="rounded-2xl bg-amber-50 px-3 py-4">
              <Trophy className="mx-auto h-5 w-5 text-amber-500" />
              <p className="mt-2 text-2xl font-black text-amber-500">{bestScore}</p>
              <p className="mt-1 text-xs font-bold text-slate-500">最高分</p>
            </div>
          </div>
        </div>
      </Card>

      <WorksToolbar
        query={query}
        type={type}
        sort={sort}
        onQueryChange={setQuery}
        onTypeChange={setType}
        onSortChange={setSort}
      />

      {filteredWorks.length > 0 ? (
        <motion.div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3" variants={container} initial="hidden" animate="show">
          {filteredWorks.map((work) => (
            <motion.div key={work.id} variants={item}>
              <WorkCard work={work} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <EmptyState
          icon={<FolderSearch />}
          title="没有找到匹配作品"
          description="试试切换作品类型、调整排序，或用更短的标题关键词重新搜索。"
        />
      )}
    </div>
  );
}
