import { localBadges, localStats, localTrends, localUser, localWorks } from '../data/localData';
import { AbilityRadarCard } from '../components/dashboard/AbilityRadarCard';
import { BadgePreview } from '../components/dashboard/BadgePreview';
import { HeroGrowthPanel } from '../components/dashboard/HeroGrowthPanel';
import { HighlightWorksCarousel } from '../components/dashboard/HighlightWorksCarousel';
import { TodayOverview } from '../components/dashboard/TodayOverview';
import { TrendPreview } from '../components/dashboard/TrendPreview';

export function HomePage() {
  return (
    <div className="space-y-10">
      <HeroGrowthPanel user={localUser} />
      <TodayOverview metrics={localStats.todayMetrics} />
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <AbilityRadarCard data={localStats.abilityScores} />
        <TrendPreview data={localTrends.weeklyTrends} />
      </div>
      <HighlightWorksCarousel works={localWorks} />
      <BadgePreview badges={localBadges} />
    </div>
  );
}
