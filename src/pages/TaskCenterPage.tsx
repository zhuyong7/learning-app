/**
 * TaskCenterPage — the main task management page.
 * Parent view: create tasks, manage week plan.
 * Child view: click to check in tasks.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import TaskCard from "../components/task/TaskCard";
import PresetTaskChips from "../components/task/PresetTaskChips";
import WeekPlanEditor from "../components/task/WeekPlanEditor";
import WeekProgressSidebar from "../components/task/WeekProgressSidebar";
import CoinStepper from "../components/reward/CoinStepper";
import { useTasks } from "../hooks/useTasks";
import { useWeekPlan, parseTaskLines, formatTaskLineParsed } from "../hooks/useWeekPlan";
import { useRewards } from "../hooks/useRewards";
import { todayString } from "../utils/date";

const TASK_PRESETS = [
  "语文五星学霸", "默写能手", "计算小达人", "计算小超市", "加油站",
  "写字课的字", "英语打卡", "语文单元复习", "数学单元复习",
  "订正作业", "珠心算",
];

interface TaskCenterPageProps {
  isAdmin: boolean;
  userName: string;
}

export default function TaskCenterPage({ isAdmin, userName }: TaskCenterPageProps) {
  const today = todayString();
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTaskName, setSelectedTaskName] = useState(TASK_PRESETS[0]);
  const [customTaskMode, setCustomTaskMode] = useState(false);
  const [taskCoins, setTaskCoins] = useState(1);
  const [commonWeekTasks, setCommonWeekTasks] = useState("");

  const {
    dayPlan,
    weekPlan,
    loading,
    saving,
    addTask,
    handleToggleTask,
    handleDeleteTask,
    handleSaveWeekPlan,
  } = useTasks(selectedDate);

  const { editorDays, updateDayText, copyToAll } = useWeekPlan(weekPlan);
  const { balance, refresh: refreshRewards } = useRewards(isAdmin ? "child" : userName);

  const isTodaySelected = selectedDate === today;
  const canCheckIn = isAdmin || isTodaySelected;

  const completedCount = dayPlan.tasks.filter((t) => t.done).length;
  const completionPercent = dayPlan.tasks.length > 0
    ? Math.round((completedCount / dayPlan.tasks.length) * 100)
    : 0;

  const handleAddTask = async () => {
    const name = selectedTaskName.trim();
    if (!name) {
      alert("请先选择或输入任务内容");
      return;
    }
    try {
      await addTask(name, taskCoins);
      if (customTaskMode) setSelectedTaskName("");
      await refreshRewards();
    } catch (e) {
      alert(e instanceof Error ? e.message : "添加任务失败");
    }
  };

  const handleToggle = async (task: typeof dayPlan.tasks[number]) => {
    if (!canCheckIn) {
      alert("只能打卡今天的任务");
      return;
    }
    try {
      await handleToggleTask(task);
      await refreshRewards();
    } catch (e) {
      alert(e instanceof Error ? e.message : "打卡失败");
    }
  };

  const handleDelete = async (task: typeof dayPlan.tasks[number]) => {
    if (!window.confirm(`确定删除"${task.name}"吗？`)) return;
    try {
      await handleDeleteTask(task);
      await refreshRewards();
    } catch (e) {
      alert(e instanceof Error ? e.message : "删除失败");
    }
  };

  const handleSaveWeek = async () => {
    try {
      const days = editorDays.map((day) => ({
        date: day.date,
        tasks: parseTaskLines(day.text).map((t) => ({ name: t.name, coins: t.coins })),
      }));
      await handleSaveWeekPlan(days);
      await refreshRewards();
      alert("本周计划已保存");
    } catch (e) {
      alert(e instanceof Error ? e.message : "保存失败");
    }
  };

  const handleCopyCommon = () => {
    const parsed = parseTaskLines(commonWeekTasks);
    if (!parsed.length) {
      alert("请先输入通用任务");
      return;
    }
    const commonText = parsed.map(formatTaskLineParsed).join("\n");
    copyToAll(commonText);
    alert("已复制到整周");
  };

  return (
    <div className="page">
      {/* Sky decorations */}
      <div className="sky-decor sky-decor-cloud cloud-one">☁️</div>
      <div className="sky-decor sky-decor-cloud cloud-two">☁️</div>
      <div className="sky-decor rainbow">🌈</div>
      <div className="sky-decor sparkle sparkle-one">✨</div>
      <div className="sky-decor sparkle sparkle-two">⭐</div>
      <div className="sky-decor cube cube-one">🟫</div>
      <div className="sky-decor cube cube-two">🟩</div>

      <div className="app-shell">
        {/* Main Column */}
        <div className="main-column">
          {/* Plan Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="plan-card"
          >
            <div className="plan-card-header">
              <div className="title-block">
                <span className="title-badge">📚 本周冒险</span>
                <h1>{selectedDate} · {isTodaySelected ? "今天" : (() => {
                  const d = new Date(`${selectedDate}T00:00:00`);
                  const days = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
                  return days[d.getDay()];
                })()}</h1>
                <p>{isTodaySelected ? "今天可以打卡" : "可以查看，孩子仅当天可打卡"}</p>
              </div>

              <div className="account-badge">
                <span>{isAdmin ? "👨‍👩‍👧 家长" : "🧒 孩子"}</span>
                <strong>{userName}</strong>
                {balance !== undefined && (
                  <span className="coin-pill">🪙 {balance}</span>
                )}
              </div>

              <div className="date-bubble">
                <span>🗓️ 选择日期</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                  }}
                  className="rounded-xl px-3 py-2 font-bold outline-none border-3"
                  style={{
                    border: "3px solid rgba(59, 130, 246, 0.25)",
                    background: "#e0f2fe",
                  }}
                />
              </div>
            </div>

            {/* Parent: Task creation */}
            {isAdmin && (
              <section className="add-task-panel">
                <div className="input-label">
                  <span className="label-icon">⚡</span>
                  <span>预设任务快选</span>
                </div>
                <PresetTaskChips
                  selectedName={selectedTaskName}
                  onSelect={(name) => {
                    setSelectedTaskName(name);
                    setCustomTaskMode(false);
                  }}
                  onCustom={() => {
                    setSelectedTaskName("");
                    setCustomTaskMode(true);
                  }}
                  isCustom={customTaskMode}
                />

                <div className="input-label task-form-label">
                  <span className="label-icon">📝</span>
                  <span>任务名</span>
                </div>
                <div className="task-create-row">
                  <input
                    type="text"
                    value={selectedTaskName}
                    onChange={(e) => setSelectedTaskName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
                    placeholder="选择预设任务，或点击自定义输入任务名"
                    maxLength={60}
                    className="cartoon-input"
                  />
                  <CoinStepper value={taskCoins} onChange={setTaskCoins} hint="完成即可获得金币" />
                  <motion.button
                    whileHover={{ y: -3, rotate: -1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleAddTask}
                    disabled={saving}
                    className="add-button"
                  >
                    <span className="button-icon">➕</span> 添加任务
                  </motion.button>
                </div>
              </section>
            )}

            {/* Child: tip */}
            {!isAdmin && (
              <section className="child-tip">
                <span>🧒 孩子模式</span>
                <p>{isTodaySelected
                  ? "点击任务方块完成今天打卡。"
                  : "可以查看其他日期任务，但只能打卡今天的任务。"
                }</p>
              </section>
            )}

            {/* Empty state */}
            {!loading && dayPlan.tasks.length === 0 && (
              <div className="empty-state">
                <div className="empty-mascot">🐣</div>
                <p>{isAdmin
                  ? "可以添加单日任务，或用下方一周创建器批量安排。"
                  : "等家长安排任务后，就能开始打卡啦！"
                }</p>
              </div>
            )}

            {/* Task list */}
            {dayPlan.tasks.length > 0 && (
              <div className="tasks" style={{ display: "grid", gap: 14 }}>
                {dayPlan.tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isToday={isTodaySelected}
                    isAdmin={isAdmin}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}

            {/* Week Editor (admin only) */}
            {isAdmin && (
              <WeekPlanEditor
                weekDays={editorDays}
                onUpdateDay={(index, text) => updateDayText(editorDays[index].date, text)}
                onCopyCommon={handleCopyCommon}
                onSave={handleSaveWeek}
                saving={saving}
              />
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="side-column">
          <WeekProgressSidebar
            weekPlan={weekPlan}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </div>
      </div>
    </div>
  );
}
