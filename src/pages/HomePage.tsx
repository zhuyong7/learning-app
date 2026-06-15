import { useState, useEffect } from 'react';
import { localBadges, localStats, localTrends, localUser, localWorks } from '../data/localData';
import type { StudyMetric } from '../types/domain';
import { AbilityRadarCard } from '../components/dashboard/AbilityRadarCard';
import { BadgePreview } from '../components/dashboard/BadgePreview';
import { HeroGrowthPanel } from '../components/dashboard/HeroGrowthPanel';
import { HighlightWorksCarousel } from '../components/dashboard/HighlightWorksCarousel';
import { TodayOverview } from '../components/dashboard/TodayOverview';
import { TrendPreview } from '../components/dashboard/TrendPreview';
import { fetchStatsOverview, type StatsOverview } from '../api/stats';

export function HomePage() {
  const [taskStats, setTaskStats] = useState<StatsOverview | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetchStatsOverview()
      .then(setTaskStats)
      .catch(() => { /* API not running, use mock data */ })
      .finally(() => setStatsLoading(false));
  }, []);

  const tasksCompleted = taskStats ? taskStats.tasks_completed_today : localStats.todayMetrics[1].value;
  const totalTasks = taskStats ? taskStats.total_tasks_today : 0;

  // Build metrics — merge local mock data with task API data
  const metrics: StudyMetric[] = [
    {
      id: 'duration',
      label: '学习时长',
      value: localStats.todayMetrics[0].value,
      unit: 'min',
      delta: 12,
      icon: '⏱️',
      tone: 'blue',
    },
    {
      id: 'tasks',
      label: '完成任务',
      value: tasksCompleted,
      unit: '个',
      delta: totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 85,
      icon: '✅',
      tone: 'green',
    },
    {
      id: 'score',
      label: '综合评分',
      value: localStats.todayMetrics[2].value,
      unit: '分',
      delta: 3,
      icon: '📊',
      tone: 'yellow',
    },
    {
      id: 'exp',
      label: '成长值',
      value: localStats.todayMetrics[3].value,
      unit: 'EXP',
      delta: 8,
      icon: '⭐',
      tone: 'pink',
    },
  ];

  return (
    <div className="space-y-10">
      <HeroGrowthPanel user={localUser} />
      {statsLoading ? (
        <div className="text-center py-8 text-slate-400 font-bold">加载统计数据中...</div>
      ) : (
        <>
          <TodayOverview metrics={metrics} />
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <AbilityRadarCard data={localStats.abilityScores} />
            <TrendPreview data={localTrends.weeklyTrends} />
          </div>
          <HighlightWorksCarousel works={localWorks} />
          <BadgePreview badges={localBadges} />
        </>
      )}
    </div>
  );
}
