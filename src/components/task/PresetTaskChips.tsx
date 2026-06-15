/**
 * Preset task chips — quick-select common tasks for parents.
 */
import { cn } from "../../utils/classNames";

const TASK_PRESETS = [
  "语文五星学霸",
  "默写能手",
  "计算小达人",
  "计算小超市",
  "加油站",
  "写字课的字",
  "英语打卡",
  "语文单元复习",
  "数学单元复习",
  "订正作业",
  "珠心算",
];

interface PresetTaskChipsProps {
  selectedName: string;
  onSelect: (name: string) => void;
  onCustom: () => void;
  isCustom: boolean;
}

export default function PresetTaskChips({
  selectedName,
  onSelect,
  onCustom,
  isCustom,
}: PresetTaskChipsProps) {
  return (
    <div className="flex flex-wrap gap-2.5 mb-4">
      {TASK_PRESETS.map((preset) => (
        <button
          key={preset}
          type="button"
          onClick={() => onSelect(preset)}
          className={cn(
            "px-4 py-2 rounded-full font-extrabold text-sm cursor-pointer transition-all border-2",
            selectedName === preset && !isCustom
              ? "bg-green-100 text-green-800 border-teal-700/18 -translate-y-0.5"
              : "bg-sky-50 text-sky-800 border-teal-700/18"
          )}
          style={
            selectedName === preset && !isCustom
              ? { boxShadow: "0 5px 0 rgba(14, 116, 144, 0.12)" }
              : {}
          }
        >
          {preset}
        </button>
      ))}
      <button
        type="button"
        onClick={onCustom}
        className={cn(
          "px-4 py-2 rounded-full font-extrabold text-sm cursor-pointer transition-all border-2",
          isCustom
            ? "bg-amber-100 text-amber-800 border-amber-700/20 -translate-y-0.5"
            : "bg-amber-50 text-amber-800 border-amber-700/18"
        )}
      >
        ✏️ 自定义
      </button>
    </div>
  );
}
