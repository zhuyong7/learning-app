/**
 * Task management hook.
 * Provides day plan, week plan, and task CRUD operations.
 */
import { useState, useCallback, useEffect } from "react";
import {
  fetchDayPlan,
  fetchWeekPlan,
  createTask,
  toggleTask,
  deleteTask,
  saveWeekPlan,
  type DayPlan,
  type WeekPlan,
  type Task,
} from "../api/tasks";

export function useTasks(date: string) {
  const [dayPlan, setDayPlan] = useState<DayPlan>({ date, tasks: [] });
  const [weekPlan, setWeekPlan] = useState<WeekPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadPlan = useCallback(async () => {
    setLoading(true);
    try {
      const [day, week] = await Promise.all([
        fetchDayPlan(date),
        fetchWeekPlan(date),
      ]);
      setDayPlan(day);
      setWeekPlan(week);
    } catch (e) {
      console.error("Failed to load plan:", e);
    } finally {
      setLoading(false);
    }
  }, [date]);

  const addTask = useCallback(async (name: string, coins: number = 1): Promise<DayPlan> => {
    setSaving(true);
    try {
      const plan = await createTask(date, { name, coins });
      setDayPlan(plan);
      await loadPlan(); // refresh week
      return plan;
    } catch (e) {
      console.error("Failed to add task:", e);
      throw e;
    } finally {
      setSaving(false);
    }
  }, [date, loadPlan]);

  const handleToggleTask = useCallback(async (task: Task): Promise<DayPlan> => {
    setSaving(true);
    try {
      const plan = await toggleTask(date, task.id, !task.done);
      setDayPlan(plan);
      await loadPlan(); // refresh week + rewards
      return plan;
    } catch (e) {
      console.error("Failed to toggle task:", e);
      throw e;
    } finally {
      setSaving(false);
    }
  }, [date, loadPlan]);

  const handleDeleteTask = useCallback(async (task: Task): Promise<DayPlan> => {
    setSaving(true);
    try {
      const plan = await deleteTask(date, task.id);
      setDayPlan(plan);
      await loadPlan(); // refresh week
      return plan;
    } catch (e) {
      console.error("Failed to delete task:", e);
      throw e;
    } finally {
      setSaving(false);
    }
  }, [date, loadPlan]);

  const handleSaveWeekPlan = useCallback(async (days: { date: string; tasks: Array<{ name: string; coins?: number }> }[]): Promise<WeekPlan> => {
    setSaving(true);
    try {
      const plan = await saveWeekPlan(date, days);
      setWeekPlan(plan);
      // Update current day plan too
      const currentDay = plan.days.find(d => d.date === date);
      if (currentDay) {
        setDayPlan(currentDay);
      }
      return plan;
    } catch (e) {
      console.error("Failed to save week plan:", e);
      throw e;
    } finally {
      setSaving(false);
    }
  }, [date]);

  // Initial load
  useEffect(() => {
    loadPlan();
  }, [loadPlan]);

  return {
    dayPlan,
    weekPlan,
    loading,
    saving,
    addTask,
    handleToggleTask,
    handleDeleteTask,
    handleSaveWeekPlan,
    refresh: loadPlan,
  };
}
