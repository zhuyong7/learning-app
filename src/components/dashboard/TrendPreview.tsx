import { Link } from 'react-router-dom';
import type { TrendPoint } from '../../types/domain';
import { GrowthAreaChart } from '../charts/GrowthAreaChart';
import { Card } from '../ui/Card';
import { SectionHeader } from '../ui/SectionHeader';

interface TrendPreviewProps {
  data: TrendPoint[];
}

export function TrendPreview({ data }: TrendPreviewProps) {
  return (
    <Card className="h-full">
      <SectionHeader
        eyebrow="Trend"
        title="本周成长趋势"
        description="成长值走势帮助家长快速了解学习节奏。"
        action={
          <Link className="text-sm font-black text-growth-secondary hover:text-blue-600" to="/trends">
            查看趋势
          </Link>
        }
      />
      <div className="mt-4">
        <GrowthAreaChart data={data} height={260} />
      </div>
    </Card>
  );
}
