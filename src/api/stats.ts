/**
 * Stats API endpoints for dashboard integration.
 */
import { request } from "./client";

export interface StatsOverview {
  total_tasks_completed: number;
  total_tasks_today: number;
  tasks_completed_today: number;
  streak_days: number;
  total_coins_earned: number;
  total_coins_spent: number;
  weekly_completion_rate: number;
}

export interface CompletionHistoryDay {
  date: string;
  total: number;
  done: number;
}

/** Fetch growth overview stats. */
export async function fetchStatsOverview(): Promise<StatsOverview> {
  return request<StatsOverview>("/api/stats/overview");
}

/** Fetch daily completion history for charts. */
export async function fetchCompletionHistory(): Promise<CompletionHistoryDay[]> {
  return request<CompletionHistoryDay[]>("/api/stats/completion-history");
}
