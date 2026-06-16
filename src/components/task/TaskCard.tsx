/**
 * TaskCard — displays a single task with check-in (child) or delete (parent) actions.
 * Animated with Framer Motion.
 */
import { motion } from "framer-motion";
import type { Task } from "../../api/tasks";

interface TaskCardProps {
  task: Task;
  isToday: boolean;
  isAdmin: boolean;
  onToggle?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

export default function TaskCard({ task, isToday, isAdmin, onToggle, onDelete }: TaskCardProps) {
  const canInteract = isToday || isAdmin;
  const isLocked = !canInteract && !isAdmin;

  const alternatingStyles: Record<number, { bg: string; border: string }> = {
    0: { bg: "linear-gradient(135deg, #dbeafe, #ecfeff)", border: "rgba(14, 116, 144, 0.18)" },
    1: { bg: "linear-gradient(135deg, #fce7f3, #fff7ed)", border: "rgba(236, 72, 153, 0.18)" },
    2: { bg: "linear-gradient(135deg, #dcfce7, #fef9c3)", border: "rgba(34, 197, 94, 0.18)" },
  };
  const style = alternatingStyles[task.id % 3];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      whileHover={!isLocked && !task.done ? { y: -4, rotate: -0.7 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={() => canInteract && !task.done && onToggle?.(task)}
      className="relative flex items-center gap-2.5 px-3 py-3 overflow-hidden rounded-[1.5rem] border-2 transition-all cursor-pointer"
      style={{
        background: task.done
          ? "linear-gradient(135deg, #bbf7d0, #fef3c7)"
          : style.bg,
        borderColor: task.done ? "rgba(34, 197, 94, 0.38)" : style.border,
        boxShadow: task.done
          ? "0 8px 0 rgba(34, 197, 94, 0.1), 0 14px 24px rgba(34, 197, 94, 0.08)"
          : "0 8px 0 rgba(14, 116, 144, 0.14), 0 14px 24px rgba(14, 116, 144, 0.12)",
      }}
    >
      {/* Shine effect for completed */}
      {task.done && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.72) 50%, transparent 70%)",
            animation: "shine 1.3s ease-out",
          }}
        />
      )}

      {/* Status icon (clickable for check-in) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (canInteract && !task.done) onToggle?.(task);
        }}
        disabled={!canInteract || task.done}
        className="flex-shrink-0 w-[50px] h-[50px] grid place-items-center rounded-xl border-2 text-2xl font-bold cursor-pointer transition-transform"
        style={{
          borderColor: task.done ? "rgba(34, 197, 94, 0.22)" : "rgba(15, 118, 110, 0.22)",
          background: "#fff",
          boxShadow: "inset 0 -5px 0 rgba(14, 116, 144, 0.1)",
          cursor: canInteract && !task.done ? "pointer" : "default",
          filter: isLocked ? "saturate(0.75)" : undefined,
        }}
      >
        {task.done ? "⭐" : isLocked ? "🔒" : "📘"}
      </button>

      {/* Task name */}
      <span className="flex-1 min-w-0 text-lg font-extrabold" style={{ color: task.done ? "#15803d" : "#1f2937" }}>
        {task.name}
      </span>

      {/* Coin reward */}
      {!task.done && (
        <span
          className="flex-shrink-0 px-2.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap"
          style={{ background: "#fef3c7", color: "#92400e" }}
        >
          +{task.coins} 金币
        </span>
      )}

      {/* Done badge */}
      {task.done && (
        <motion.span
          initial={{ y: -22, scale: 0.86, rotate: -8, opacity: 0 }}
          animate={{ y: 0, scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", delay: 0.1 }}
          className="flex-shrink-0 px-2.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap"
          style={{
            background: "#fef9c3",
            color: "#166534",
            boxShadow: "0 5px 0 rgba(234, 179, 8, 0.24)",
          }}
        >
          🟫✨ 完成
        </motion.span>
      )}

      {/* Hint text */}
      {!task.done && !isLocked && isToday && (
        <span className="flex-shrink-0 text-xs font-extrabold whitespace-nowrap" style={{ color: "#0284c7" }}>
          点击打卡
        </span>
      )}
      {!task.done && isLocked && (
        <span className="flex-shrink-0 text-xs font-extrabold whitespace-nowrap" style={{ color: "#9ca3af" }}>
          仅当天可打卡
        </span>
      )}

      {/* Delete button (admin only) */}
      {isAdmin && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => onDelete?.(task)}
          className="flex-shrink-0 relative z-10 px-3 py-1 rounded-full text-xs font-extrabold border-0 cursor-pointer text-white"
          style={{
            background: "linear-gradient(135deg, #fb7185, #f43f5e)",
            boxShadow: "0 4px 0 #be123c",
          }}
        >
          删除
        </motion.button>
      )}
    </motion.article>
  );
}
