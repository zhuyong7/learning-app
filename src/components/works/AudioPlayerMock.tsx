import { useMemo, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import type { WorkItem } from '../../types/domain';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface AudioPlayerMockProps {
  work: WorkItem;
}

export function AudioPlayerMock({ work }: AudioPlayerMockProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const bars = useMemo(
    () => Array.from({ length: 42 }, (_, index) => 18 + ((index * 17 + work.id * 11) % 46)),
    [work.id],
  );

  return (
    <Card className="border border-white/80 bg-white/90">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <Button
          aria-label={isPlaying ? '暂停播放' : '播放音频'}
          onClick={() => setIsPlaying((value) => !value)}
          className="h-14 w-14 shrink-0 rounded-full p-0"
        >
          {isPlaying ? <Pause className="h-6 w-6 fill-current" /> : <Play className="h-6 w-6 fill-current" />}
        </Button>

        <div className="min-w-0 flex-1">
          <div className="flex h-16 items-center gap-1.5 rounded-[22px] bg-slate-50 px-4 ring-1 ring-slate-100">
            {bars.map((height, index) => (
              <span
                key={index}
                className="flex-1 rounded-full bg-gradient-to-t from-growth-primary to-growth-secondary opacity-80"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100 shadow-inner">
            <div className="h-full w-[34%] rounded-full bg-gradient-to-r from-growth-primary via-growth-secondary to-amber-300" />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs font-black text-slate-400">
            <span>00:42</span>
            <span>{work.duration}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
