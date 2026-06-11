import { useState } from 'react';
import { GrowthAreaChart } from '../components/charts/GrowthAreaChart';
import { LearningHeatmap } from '../components/charts/LearningHeatmap';
import { LearningLineChart } from '../components/charts/LearningLineChart';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SectionHeader } from '../components/ui/SectionHeader';
import { localTrends } from '../data/localData';
import { cn } from '../utils/classNames';

type Period = 'week' | 'month' | 'year';

const periodOptions: Array<{ value: Period; label: string; helper: string }> = [
  { value: 'week', label: '周', helper: '7 天节奏' },
  { value: 'month', label: '月', helper: '30 天趋势' },
  { value: 'year', label: '年', helper: '年度成长' },
];

const periodSummary: Record<Period, { label: string; description: string }> = {
  week: {
    label: '本周',
    description: '追踪最近 7 天的学习投入与成长值波动，快速识别高光日和需要陪伴的节奏点。',
  },
  month: {
    label: '本月',
    description: '把 30 天学习节奏汇总成清晰曲线，帮助家长观察习惯稳定度和成长累积。',
  },
  year: {
    label: '全年',
    description: '以月份为单位回看长期成长轨迹，让每一次坚持都沉淀为可见的进步资产。',
  },
};

export function TrendsPage() {
  const [period, setPeriod] = useState<Period>('week');
  const trendData =
    period === 'week'
      ? localTrends.weeklyTrends
      : period === 'month'
        ? localTrends.monthlyTrends
        : localTrends.yearlyTrends;
  const activeSummary = periodSummary[period];

  const totalDuration = trendData.reduce((sum, item) => sum + item.duration, 0);
  const totalExp = trendData.reduce((sum, item) => sum + item.exp, 0);
  const averageScore = Math.round(
    trendData.reduce((sum, item) => sum + item.score, 0) / Math.max(trendData.length, 1),
  );

  return (
    <div className="space-y-8">
      <Card glow className="relative overflow-hidden border border-white/70 bg-gradient-to-br from-white via-emerald-50/80 to-sky-50/80">
        <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-growth-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-28 w-28 rounded-full bg-growth-secondary/20 blur-2xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <span className="inline-flex rounded-full bg-white/75 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-growth-secondary shadow-sm ring-1 ring-white/80">
              Growth Analytics
            </span>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-growth-ink sm:text-5xl">
              成长趋势
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              用产品级学习数据看板，把学习时长、成长值和活跃热力沉淀为可复盘的成长路径，帮助家长更轻松地发现孩子的持续进步。
            </p>
          </div>

          <div className="rounded-[28px] bg-white/80 p-4 shadow-card ring-1 ring-white/80 backdrop-blur">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-emerald-50 px-3 py-4">
                <p className="text-2xl font-black text-growth-primary">{totalDuration}</p>
                <p className="mt-1 text-xs font-bold text-slate-500">分钟</p>
              </div>
              <div className="rounded-2xl bg-sky-50 px-3 py-4">
                <p className="text-2xl font-black text-growth-secondary">{totalExp}</p>
                <p className="mt-1 text-xs font-bold text-slate-500">EXP</p>
              </div>
              <div className="rounded-2xl bg-amber-50 px-3 py-4">
                <p className="text-2xl font-black text-amber-500">{averageScore}</p>
                <p className="mt-1 text-xs font-bold text-slate-500">均分</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black text-growth-secondary">{activeSummary.label}视图</p>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{activeSummary.description}</p>
        </div>
        <div className="flex rounded-full bg-slate-100 p-1 shadow-inner">
          {periodOptions.map((option) => {
            const isActive = option.value === period;

            return (
              <Button
                key={option.value}
                variant="ghost"
                aria-pressed={isActive}
                onClick={() => setPeriod(option.value)}
                className={cn(
                  'min-w-20 flex-col gap-0 px-5 py-2.5 leading-none shadow-none ring-0 hover:translate-y-0',
                  isActive
                    ? 'bg-growth-ink text-white shadow-lg shadow-slate-300/60 hover:bg-growth-ink hover:text-white'
                    : 'text-slate-500 hover:bg-white hover:text-growth-ink',
                )}
              >
                <span className="text-base font-black">{option.label}</span>
                <span className={cn('mt-1 text-[10px] font-bold', isActive ? 'text-white/70' : 'text-slate-400')}>
                  {option.helper}
                </span>
              </Button>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="h-full">
          <SectionHeader
            eyebrow="Duration"
            title="学习时长曲线"
            description="观察不同周期内的学习投入变化，定位坚持最稳定的时间段。"
          />
          <div className="mt-5">
            <LearningLineChart data={trendData} height={320} />
          </div>
        </Card>

        <Card className="h-full">
          <SectionHeader
            eyebrow="Growth Value"
            title="成长值面积图"
            description="成长值的累计波动让每次练习反馈更直观，强化孩子的成就感。"
          />
          <div className="mt-5">
            <GrowthAreaChart data={trendData} height={320} />
          </div>
        </Card>
      </div>

      <Card>
        <SectionHeader
          eyebrow="Learning Heatmap"
          title="学习活跃热力图"
          description="用连续活跃格子记录学习习惯，让长期坚持像游戏进度一样清晰可见。"
        />
        <div className="mt-6 rounded-[24px] bg-slate-50/80 p-5 ring-1 ring-slate-100">
          <LearningHeatmap data={localTrends.heatmapDays} />
        </div>
      </Card>
    </div>
  );
}
