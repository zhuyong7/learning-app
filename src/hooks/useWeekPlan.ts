/**
 * Week plan editor hook.
 * Provides week editor state with parsing/formatting of tasks.
 */
import { useState, useEffect, useCallback } from "react";
import type { WeekPlan, Task } from "../api/tasks";

export interface WeekEditorDay {
  date: string;
  text: string;
}

export interface ParsedTask {
  name: string;
  coins: number;
}

export function useWeekPlan(initialPlan: WeekPlan | null) {
  const [editorDays, setEditorDays] = useState<WeekEditorDay[]>([]);

  // Sync editor from week plan
  const syncFromPlan = useCallback((plan: WeekPlan | null) => {
    if (!plan) {
      // Generate empty week
      setEditorDays([]);
      return;
    }
    setEditorDays(
      plan.days.map((day) => ({
        date: day.date,
        text: day.tasks.map(formatTaskLine).join("\n"),
      }))
    );
  }, []);

  useEffect(() => {
    syncFromPlan(initialPlan);
  }, [initialPlan, syncFromPlan]);

  // Update a single day's text
  const updateDayText = useCallback((date: string, text: string) => {
    setEditorDays((prev) =>
      prev.map((d) => (d.date === date ? { ...d, text } : d))
    );
  }, []);

  // Copy common tasks to all days
  const copyToAll = useCallback((commonText: string) => {
    if (!commonText.trim()) return;
    setEditorDays((prev) =>
      prev.map((d) => ({ ...d, text: commonText }))
    );
  }, []);

  return {
    editorDays,
    setEditorDays,
    syncFromPlan,
    updateDayText,
    copyToAll,
  };
}

// ── Helpers ───────────────────────────────────────────────────────

export function parseTaskLine(line: string): ParsedTask | null {
  const [rawName, rawCoins] = line.split("|");
  const name = rawName.trim();
  if (!name) return null;
  const parsed = parseInt((rawCoins || "1").trim(), 10);
  return {
    name,
    coins: (Number.isFinite(parsed) && parsed >= 0 ? parsed : 0),
  };
}

export function parseTaskLines(text: string): ParsedTask[] {
  return text
    .split("\n")
    .map((line) => parseTaskLine(line))
    .filter((t): t is ParsedTask => Boolean(t));
}

export function formatTaskLine(task: Task): string {
  return `${task.name} | ${task.coins}`;
}

export function formatTaskLineParsed(task: ParsedTask): string {
  return `${task.name} | ${task.coins}`;
}

export const WEEKDAY_LABELS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

export function formatWeekday(date: string): string {
  const parsed = new Date(`${date}T00:00:00`);
  return WEEKDAY_LABELS[parsed.getDay()];
}

export function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
