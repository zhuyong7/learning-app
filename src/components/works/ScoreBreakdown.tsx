import { motion } from 'framer-motion';
import type { WorkItem } from '../../types/domain';
import { Card } from '../ui/Card';
import { SectionHeader } from '../ui/SectionHeader';

interface ScoreBreakdownProps {
  work: WorkItem;
}

export function ScoreBreakdown({ work }: ScoreBreakdownProps) {
  return (
    <Card className="border border-white/80 bg-white/90">
      <SectionHeader
        eyebrow="Skill Breakdown"
        title="能力得分拆解"
        description="把作品表现拆成关键能力条，方便快速定位亮点和下一步练习方向。"
      />

      <div className="mt-6 space-y-5">
        {work.skills.map((skill, index) => {
          const percentage = Math.round((skill.value / skill.max) * 100);

          return (
            <div key={skill.key}>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-black text-growth-ink">{skill.label}</span>
                <span className="text-sm font-black text-growth-secondary">{skill.value}/{skill.max}</span>
              </div>
              <div className="mt-2 h-4 overflow-hidden rounded-full bg-slate-100 shadow-inner">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-growth-primary via-growth-secondary to-amber-300"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${percentage}%` }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.65, delay: index * 0.08, ease: 'easeOut' }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
