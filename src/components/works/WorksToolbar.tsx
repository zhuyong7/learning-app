import { Search } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { cn } from '../../utils/classNames';

export interface WorksToolbarProps {
  query: string;
  type: 'all' | 'reading' | 'speaking' | 'story' | 'vocabulary';
  sort: 'newest' | 'score';
  onQueryChange: (value: string) => void;
  onTypeChange: (value: WorksToolbarProps['type']) => void;
  onSortChange: (value: WorksToolbarProps['sort']) => void;
}

const typeOptions: Array<{ value: WorksToolbarProps['type']; label: string }> = [
  { value: 'all', label: '全部' },
  { value: 'reading', label: '阅读' },
  { value: 'speaking', label: '口语' },
  { value: 'story', label: '故事' },
  { value: 'vocabulary', label: '词汇' },
];

export function WorksToolbar({
  query,
  type,
  sort,
  onQueryChange,
  onTypeChange,
  onSortChange,
}: WorksToolbarProps) {
  return (
    <Card className="flex flex-col gap-5 border border-white/80 bg-white/90 p-4 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
      <label className="relative min-w-0 flex-1">
        <span className="sr-only">搜索作品</span>
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="搜索作品标题..."
          className="h-12 w-full rounded-full border border-slate-200 bg-slate-50/80 pl-12 pr-4 text-sm font-semibold text-growth-ink outline-none transition focus:border-growth-secondary focus:bg-white focus:ring-4 focus:ring-growth-secondary/15"
        />
      </label>

      <div className="flex flex-wrap items-center gap-2">
        {typeOptions.map((option) => {
          const isActive = option.value === type;

          return (
            <Button
              key={option.value}
              variant="ghost"
              aria-pressed={isActive}
              onClick={() => onTypeChange(option.value)}
              className={cn(
                'px-4 py-2 text-xs shadow-none ring-0 hover:translate-y-0',
                isActive
                  ? 'bg-growth-ink text-white shadow-lg shadow-slate-300/60 hover:bg-growth-ink hover:text-white'
                  : 'bg-slate-100 text-slate-500 hover:bg-white hover:text-growth-ink',
              )}
            >
              {option.label}
            </Button>
          );
        })}
      </div>

      <label className="flex items-center gap-2 text-sm font-bold text-slate-500">
        排序
        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value as WorksToolbarProps['sort'])}
          className="h-11 rounded-full border border-slate-200 bg-white px-4 text-sm font-black text-growth-ink outline-none transition focus:border-growth-secondary focus:ring-4 focus:ring-growth-secondary/15"
        >
          <option value="newest">最新完成</option>
          <option value="score">最高得分</option>
        </select>
      </label>
    </Card>
  );
}
