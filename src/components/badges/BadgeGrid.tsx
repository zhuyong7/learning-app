import { motion } from 'framer-motion';
import type { Badge } from '../../types/domain';
import { BadgeCard } from './BadgeCard';

interface BadgeGridProps {
  badges: Badge[];
  onPreview?: (badge: Badge) => void;
}

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };

export function BadgeGrid({ badges, onPreview }: BadgeGridProps) {
  return (
    <motion.div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3" variants={container} initial="hidden" animate="show">
      {badges.map((badge) => (
        <motion.div key={badge.id} variants={item}>
          <BadgeCard badge={badge} onPreview={onPreview} />
        </motion.div>
      ))}
    </motion.div>
  );
}
