import type { AbilityScore } from '../../types/domain';
import { AbilityRadarChart } from '../charts/AbilityRadarChart';
import { Card } from '../ui/Card';
import { SectionHeader } from '../ui/SectionHeader';

interface AbilityRadarCardProps {
  data: AbilityScore[];
}

export function AbilityRadarCard({ data }: AbilityRadarCardProps) {
  return (
    <Card glow className="h-full">
      <SectionHeader
        eyebrow="Ability"
        title="能力雷达"
        description="听、说、读、表达与词汇能力的当前成长画像。"
      />
      <div className="mt-4">
        <AbilityRadarChart data={data} height={300} />
      </div>
    </Card>
  );
}
