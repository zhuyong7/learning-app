/**
 * Task API endpoints.
 */
import { request } from "./client";

export interface Task {
  id: number;
  name: string;
  done: boolean;
  coins: number;
  rewardClaimedBy: string[];
}

export interface DayPlan {
  date: string;
  tasks: Task[];
}

export interface WeekPlan {
  startDate: string;
  endDate: string;
  days: DayPlan[];
}

export interface TaskCreate {
  name: string;
  coins?: number;
}

/** Fetch a single day's plan. */
export async function fetchDayPlan(date: string): Promise<DayPlan> {
  return request<DayPlan>(`/api/plans/${date}`);
}

/** Create a task for a specific date. */
export async function createTask(date: string, task: TaskCreate): Promise<DayPlan> {
  return request<DayPlan>(`/api/plans/${date}/tasks`, {
    method: "POST",
    body: JSON.stringify({ name: task.name, coins: task.coins ?? 1 }),
  });
}

/** Toggle task done state (check-in / check-out). */
export async function toggleTask(date: string, taskId: number, done: boolean): Promise<DayPlan> {
  return request<DayPlan>(`/api/plans/${date}/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify({ done }),
  });
}

/** Delete a task. */
export async function deleteTask(date: string, taskId: number): Promise<DayPlan> {
  return request<DayPlan>(`/api/plans/${date}/tasks/${taskId}`, {
    method: "DELETE",
  });
}

/** Fetch the week plan. */
export async function fetchWeekPlan(date: string): Promise<WeekPlan> {
  return request<WeekPlan>(`/api/week/${date}`);
}

/** Save the entire week plan (admin only). */
export async function saveWeekPlan(date: string, days: Array<{ date: string; tasks: Array<{ name: string; coins?: number }> }>): Promise<WeekPlan> {
  return request<WeekPlan>(`/api/week/${date}`, {
    method: "PUT",
    body: JSON.stringify({ days }),
  });
}
