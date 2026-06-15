/**
 * WeekPlanEditor — bulk weekly task creation for parents.
 * Ported from study-plan-app's week editor concept, rebuilt for React + TailwindCSS.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { parseTaskLines, formatTaskLineParsed, formatWeekday, type ParsedTask } from "../../hooks/useWeekPlan";

interface WeekPlanEditorProps {
  weekDays: Array<{ date: string; text: string }>;
  onUpdateDay: (index: number, text: string) => void;
  onCopyCommon: (commonText: string) => void;
  onSave: () => void;
  saving: boolean;
}

export default function WeekPlanEditor({
  weekDays,
  onUpdateDay,
  onCopyCommon,
  onSave,
  saving,
}: WeekPlanEditorProps) {
  const [commonTasks, setCommonTasks] = useState("");

  return (
    <div
      className="rounded-[2rem] p-6 border-4"
      style={{
        borderColor: "rgba(47, 93, 98, 0.18)",
        background: "rgba(255, 253, 240, 0.96)",
        boxShadow: "0 18px 0 rgba(47, 93, 98, 0.08), 0 24px 42px rgba(31, 41, 55, 0.16)",
      }}
    >
      <div className="mb-5">
        <span
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-extrabold text-sm"
          style={{
            color: "#7c2d12",
            border: "2px solid rgba(251, 146, 60, 0.45)",
            background: "#fed7aa",
            boxShadow: "0 5px 0 rgba(251, 146, 60, 0.25)",
          }}
        >
          🧩 一周创建器
        </span>
        <h2 className="mt-2 text-2xl font-extrabold text-teal-700">一次安排周一到周日</h2>
      </div>

      {/* Common tasks */}
      <div
        className="mb-5 p-4 rounded-2xl"
        style={{
          border: "3px solid rgba(244, 114, 182, 0.22)",
          background: "linear-gradient(135deg, #fff7ed, #fdf2f8)",
        }}
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center gap-2 text-pink-600 font-extrabold mb-1">
              <span className="animate-bounce" style={{ animationDuration: "2.6s" }}>📋</span>
              <span>通用任务（每行一个）</span>
            </div>
            <p className="text-slate-500 text-sm font-bold">格式：任务名 或 任务名 | 金币，例如：计算小达人 | 2</p>
          </div>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onCopyCommon(commonTasks)}
            className="px-5 py-2 rounded-full text-white font-extrabold text-sm cursor-pointer border-0 whitespace-nowrap"
            style={{
              background: "linear-gradient(135deg, #22c55e, #0ea5e9)",
              boxShadow: "0 8px 0 #047857",
            }}
          >
            复制到整周
          </motion.button>
        </div>
        <textarea
          value={commonTasks}
          onChange={(e) => setCommonTasks(e.target.value)}
          rows={3}
          placeholder="语文五星学霸 | 2\n计算小达人 | 1\n英语打卡"
          className="w-full rounded-2xl p-3 font-bold outline-none resize-none border-3"
          style={{
            border: "3px solid rgba(244, 114, 182, 0.35)",
            background: "#fff",
            boxShadow: "inset 0 -4px 0 rgba(244, 114, 182, 0.08)",
          }}
        />
      </div>

      {/* 7-day editor grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
        {weekDays.map((day, i) => (
          <div key={day.date} className="p-3 rounded-2xl border-3" style={{
            borderColor: "rgba(14, 116, 144, 0.16)",
            background: "rgba(240, 249, 255, 0.8)",
          }}>
            <div className="flex items-center justify-between mb-2">
              <strong className="text-lg text-teal-700">{formatWeekday(day.date)}</strong>
              <span className="text-sm font-bold text-slate-500">{day.date.slice(5)}</span>
            </div>
            <textarea
              value={day.text}
              onChange={(e) => onUpdateDay(i, e.target.value)}
              rows={4}
              placeholder="每行一个任务，可写：任务名 | 金币"
              className="w-full rounded-xl p-3 text-sm font-bold outline-none resize-none border-3"
              style={{
                border: "3px solid rgba(244, 114, 182, 0.35)",
                background: "#fff",
                boxShadow: "inset 0 -4px 0 rgba(244, 114, 182, 0.08)",
              }}
            />
          </div>
        ))}
      </div>

      {/* Save button */}
      <motion.button
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onSave}
        disabled={saving}
        className="w-full h-[46px] rounded-2xl text-white font-extrabold text-lg cursor-pointer border-0 transition-all"
        style={{
          background: "linear-gradient(135deg, #fb7185, #f97316)",
          boxShadow: "0 8px 0 #be123c, 0 14px 24px rgba(251, 113, 133, 0.28)",
        }}
      >
        {saving ? "保存中..." : "💾 保存本周计划"}
      </motion.button>
    </div>
  );
}
