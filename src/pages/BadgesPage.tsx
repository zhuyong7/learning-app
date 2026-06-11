import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Lock, Sparkles, Trophy } from 'lucide-react';
import { BadgeGrid } from '../components/badges/BadgeGrid';
import { UnlockCelebration } from '../components/badges/UnlockCelebration';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SectionHeader } from '../components/ui/SectionHeader';
import { localBadges } from '../data/localData';
import type { Badge } from '../types/domain';

export function BadgesPage() {
  const [celebrationBadge, setCelebrationBadge] = useState<Badge | null>(null);
  const [lockedBadge, setLockedBadge] = useState<Badge | null>(null);

  const earnedCount = localBadges.filter((badge) => badge.earned).length;
  const totalCount = localBadges.length;
  const completionRate = Math.round((earnedCount / totalCount) * 100);

  const handlePreview = useCallback((badge: Badge) => {
    if (badge.earned) {
      setLockedBadge(null);
      setCelebrationBadge(badge);
      return;
    }

    setLockedBadge(badge);
  }, []);

  return (
    <div className="space-y-8">
      <Card glow className="relative overflow-hidden border border-white/70 bg-gradient-to-br from-white via-amber-50/80 to-emerald-50/80">
        <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-amber-300/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/4 h-40 w-40 rounded-full bg-growth-primary/20 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/75 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-amber-500 shadow-sm ring-1 ring-white/80">
              <Trophy className="h-4 w-4" aria-hidden="true" />
              Badge Center
            </span>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-growth-ink sm:text-5xl">勋章中心</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              把每一次坚持、突破和高光表现收藏成可展示的成长资产。点击已获得勋章，重温解锁瞬间与奖励反馈。
            </p>
          </div>

          <div className="rounded-[30px] bg-white/85 p-4 shadow-card ring-1 ring-white/80 backdrop-blur sm:p-5">
            <div className="grid gap-3 text-center min-[390px]:grid-cols-3">
              <div className="rounded-3xl bg-amber-50 px-3 py-5">
                <p className="text-3xl font-black text-amber-500">{earnedCount}</p>
                <p className="mt-1 text-xs font-bold text-slate-500">已获得</p>
              </div>
              <div className="rounded-3xl bg-slate-50 px-3 py-5">
                <p className="text-3xl font-black text-growth-ink">{totalCount}</p>
                <p className="mt-1 text-xs font-bold text-slate-500">总勋章</p>
              </div>
              <div className="rounded-3xl bg-emerald-50 px-3 py-5">
                <p className="text-3xl font-black text-growth-primary">{completionRate}%</p>
                <p className="mt-1 text-xs font-bold text-slate-500">收集率</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="border border-white/70 bg-white/90">
        <SectionHeader
          eyebrow="Achievement Gallery"
          title="全部 9 枚成长勋章"
          description="金色卡片代表已获得奖励，灰色卡片代表待解锁挑战。稀有度标签会提示每枚勋章的收藏等级。"
          action={
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-black text-amber-600 ring-1 ring-amber-100">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {earnedCount}/{totalCount}
            </div>
          }
        />

        <AnimatePresence>
          {lockedBadge ? (
            <motion.div
              className="mt-6 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
            >
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-200 text-slate-500">
                  <Lock className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-black text-growth-ink">{lockedBadge.name} 还未解锁</p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">{lockedBadge.description}</p>
                </div>
              </div>
              <Button variant="secondary" onClick={() => setLockedBadge(null)} className="self-start sm:self-center">
                知道了
              </Button>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="mt-6">
          <BadgeGrid badges={localBadges} onPreview={handlePreview} />
        </div>
      </Card>

      <UnlockCelebration badge={celebrationBadge} onClose={() => setCelebrationBadge(null)} />
    </div>
  );
}
