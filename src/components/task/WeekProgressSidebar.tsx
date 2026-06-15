/**
 * WeekProgressSidebar — shows weekly completion overview.
 */
import { type WeekPlan } from "../../api/tasks";
import { formatWeekday } from "../../utils/date";

interface WeekProgressSidebarProps {
  weekPlan: WeekPlan | null;
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

function getPercent(tasks: { done: boolean }[]): number {
  if (tasks.length === 0) return 0;
  return Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100);
}

export default function WeekProgressSidebar({ weekPlan, selectedDate, onSelectDate }: WeekProgressSidebarProps) {
  if (!weekPlan) return null;

  const weekDays = weekPlan.days.map((day) => ({
    date: day.date,
    total: day.tasks.length,
    done: day.tasks.filter((t) => t.done).length,
    percent: getPercent(day.tasks),
  }));

  const totalDone = weekDays.reduce((s, d) => s + d.done, 0);
  const totalTasks = weekDays.reduce((s, d) => s + d.total, 0);
  const totalPercent = totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0;

  return (
    <div
      className="rounded-[2rem] p-6 text-center border-4"
      style={{
        borderColor: "rgba(47, 93, 98, 0.18)",
        background: "rgba(255, 253, 240, 0.96)",
        boxShadow: "0 18px 0 rgba(47, 93, 98, 0.08), 0 24px 42px rgba(31, 41, 55, 0.16)",
      }}
    >
      {/* Mascot */}
      <div
        className="w-[80px] h-[80px] mx-auto mb-3 grid place-items-center text-4xl rounded-[1.9rem] animate-bounce"
        style={{
          animationDuration: "3s",
          border: "4px solid rgba(251, 146, 60, 0.42)",
          background: "#ffedd5",
          boxShadow: "inset 0 -8px 0 rgba(251, 146, 60, 0.18)",
        }}
      >
        🦊
      </div>

      <span
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-extrabold text-sm"
        style={{
          color: "#7c2d12",
          border: "2px solid rgba(251, 146, 60, 0.45)",
          background: "#fed7aa",
          boxShadow: "0 5px 0 rgba(251, 146, 60, 0.25)",
        }}
      >
        📅 本周总览
      </span>

      <h2 className="mt-4 text-4xl font-extrabold text-teal-700 leading-none">
        {totalDone} / {totalTasks}
      </h2>
      <p className="text-slate-500 font-extrabold min-h-[44px] mt-2 mb-4 leading-relaxed">
        {totalPercent === 100
          ? "太棒啦！本周的任务星星全部点亮！"
          : totalPercent >= 50
          ? "已经完成一大半啦，继续加油！"
          : totalPercent > 0
          ? "开局很棒，再完成几个任务吧！"
          : "小狐狸正在等待计划。"}
      </p>

      {/* Progress bar */}
      <div
        className="h-[18px] rounded-full overflow-hidden mb-5"
        style={{
          border: "3px solid rgba(15, 118, 144, 0.18)",
          background: "#e0f2fe",
          boxShadow: "inset 0 3px 8px rgba(15, 23, 42, 0.12)",
        }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${totalPercent}%`,
            background: "linear-gradient(90deg, #22c55e, #facc15, #fb7185)",
          }}
        />
      </div>

      {/* Medals */}
      <div className="flex justify-center gap-3 mb-5">
        {[
          { threshold: 25, icon: "⭐" },
          { threshold: 50, icon: "🏅" },
          { threshold: 100, icon: "🏆" },
        ].map((m) => (
          <span
            key={m.icon}
            className="grid w-11 h-11 place-items-center rounded-xl transition-all"
            style={{
              background: totalPercent >= m.threshold ? "#fef3c7" : "#e5e7eb",
              filter: totalPercent >= m.threshold ? "grayscale(0)" : "grayscale(1)",
              opacity: totalPercent >= m.threshold ? 1 : 0.55,
              transform: totalPercent >= m.threshold ? "translateY(-3px) rotate(-4deg)" : undefined,
              boxShadow: totalPercent >= m.threshold ? "0 7px 0 rgba(234, 179, 8, 0.22)" : undefined,
            }}
          >
            {m.icon}
          </span>
        ))}
      </div>

      {/* Day cards */}
      <div className="mt-4 text-left">
        {weekDays.map((day) => (
          <button
            key={day.date}
            type="button"
            onClick={() => onSelectDate(day.date)}
            className="w-full p-2.5 rounded-2xl mb-2 text-left font-extrabold border-3 cursor-pointer transition-all"
            style={{
              borderColor: "rgba(14, 116, 144, 0.16)",
              background:
                day.date === selectedDate
                  ? "linear-gradient(135deg, #dcfce7, #fef3c7)"
                  : "linear-gradient(135deg, #eff6ff, #ecfeff)",
              boxShadow:
                day.date === selectedDate
                  ? "0 8px 0 rgba(34, 197, 94, 0.16)"
                  : "0 6px 0 rgba(14, 116, 144, 0.1)",
              transform:
                day.date === selectedDate ? "translateY(-3px) rotate(-0.5deg)" : undefined,
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-pink-600 text-sm">{formatWeekday(day.date)}</span>
              <strong className="text-teal-700 text-sm">{day.date.slice(5)}</strong>
            </div>
            <div className="text-xs text-slate-600">{day.done} / {day.total} 完成</div>
            <div
              className="h-[12px] rounded-full overflow-hidden mt-1"
              style={{
                border: "3px solid rgba(15, 118, 144, 0.18)",
                background: "#e0f2fe",
              }}
            >
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${day.percent}%`,
                  background: "linear-gradient(90deg, #22c55e, #facc15)",
                }}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
