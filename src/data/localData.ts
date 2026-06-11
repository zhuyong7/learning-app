import userData from './json/user.json';
import statsData from './json/stats.json';
import worksData from './json/works.json';
import badgesData from './json/badges.json';
import trendsData from './json/trends.json';
import assistantData from './json/assistant.json';
import type {
  AbilityScore,
  AssistantMessage,
  Badge,
  HeatmapDay,
  StudyMetric,
  TrendPoint,
  UserProfile,
  WorkItem,
} from '../types/domain';

type LocalStats = {
  todayMetrics: StudyMetric[];
  abilityScores: AbilityScore[];
};

type LocalTrends = {
  weeklyTrends: TrendPoint[];
  monthlyTrends: TrendPoint[];
  yearlyTrends: TrendPoint[];
  heatmapDays: HeatmapDay[];
};

export const localUser: UserProfile = userData as UserProfile;
export const localStats: LocalStats = statsData as LocalStats;
export const localWorks: WorkItem[] = worksData as WorkItem[];
export const localBadges: Badge[] = badgesData as Badge[];
export const localTrends: LocalTrends = trendsData as LocalTrends;
export const localAssistantMessages: AssistantMessage[] = assistantData as AssistantMessage[];
