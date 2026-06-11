import type { HeatmapDay } from '../../types/domain';
import { EmptyState } from '../ui/EmptyState';

interface LearningHeatmapProps {
  data: HeatmapDay[];
}

const getMinuteClass = (minutes: number) => {
  if (minutes === 0) {
    return 'bg-slate-100';
  }

  if (minutes <= 20) {
    return 'bg-emerald-100';
  }

  if (minutes <= 45) {
    return 'bg-emerald-300';
  }

  if (minutes <= 70) {
    return 'bg-emerald-500';
  }

  return 'bg-emerald-700';
};

const legendItems = [
  { label: '0', className: 'bg-slate-100' },
  { label: '1-20', className: 'bg-emerald-100' },
  { label: '21-45', className: 'bg-emerald-300' },
  { label: '46-70', className: 'bg-emerald-500' },
  { label: '71+', className: 'bg-emerald-700' },
];

export function LearningHeatmap({ data }: LearningHeatmapProps) {
  if (data.length === 0) {
    return <EmptyState icon="▦" title="暂无学习热力图" description="学习记录累积后，这里会展示每日学习活跃度。" />;
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto pb-2">
        <div className="grid grid-flow-col grid-rows-7 auto-cols-[14px] gap-1">
          {data.map((day) => (
            <div
              key={day.date}
              title={`${day.date}: ${day.minutes} 分钟`}
              aria-label={`${day.date}: ${day.minutes} 分钟`}
              className={`h-3.5 w-3.5 rounded-[4px] ${getMinuteClass(day.minutes)}`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span>少</span>
        {legendItems.map((item) => (
          <div key={item.label} className="flex items-center gap-1">
            <span className={`h-3 w-3 rounded-[3px] ${item.className}`} />
            <span>{item.label}</span>
          </div>
        ))}
        <span>多</span>
      </div>
    </div>
  );
}
