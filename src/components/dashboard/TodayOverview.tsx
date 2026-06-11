import { motion } from 'framer-motion';
import type { StudyMetric } from '../../types/domain';
import { SectionHeader } from '../ui/SectionHeader';
import { MetricCard } from './MetricCard';

interface TodayOverviewProps {
  metrics: StudyMetric[];
}

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };

export function TodayOverview({ metrics }: TodayOverviewProps) {
  return (
    <section className="space-y-5">
      <SectionHeader
        eyebrow="Today"
        title="今日学习总览"
        description="快速查看学习投入、任务完成、作品评分和成长值变化。"
      />
      <motion.div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" variants={container} initial="hidden" animate="show">
        {metrics.map((metric) => (
          <motion.div key={metric.id} variants={item}>
            <MetricCard metric={metric} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
