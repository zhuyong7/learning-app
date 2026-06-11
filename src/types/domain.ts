export type AbilityKey = 'listening' | 'speaking' | 'reading' | 'expression' | 'vocabulary';

export interface UserProfile {
  id: number;
  name: string;
  avatar: string;
  level: number;
  exp: number;
  nextLevelExp: number;
  streakDays: number;
  title: string;
}

export interface StudyMetric {
  id: string;
  label: string;
  value: number;
  unit: string;
  delta: number;
  icon: string;
  tone: 'green' | 'blue' | 'yellow' | 'pink';
}

export interface AbilityScore {
  key: AbilityKey;
  label: string;
  value: number;
  max: number;
}

export interface WorkItem {
  id: number;
  title: string;
  type: 'reading' | 'speaking' | 'story' | 'vocabulary';
  cover: string;
  score: number;
  duration: string;
  completedAt: string;
  favorite: boolean;
  audioUrl: string;
  aiComment: string;
  teacherComment: string;
  skills: AbilityScore[];
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedTime?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface TrendPoint {
  date: string;
  duration: number;
  exp: number;
  score: number;
}

export interface HeatmapDay {
  date: string;
  minutes: number;
}

export interface AssistantMessage {
  id: number;
  role: 'assistant' | 'parent';
  content: string;
  quickAction?: 'analysis' | 'plan' | 'weakness' | 'weekly';
}
