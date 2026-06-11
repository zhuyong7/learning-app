import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Badge } from '../../types/domain';
import { cn } from '../../utils/classNames';
import { Card } from '../ui/Card';
import { SectionHeader } from '../ui/SectionHeader';

interface BadgePreviewProps {
  badges: Badge[];
}

const rarityRing: Record<Badge['rarity'], string> = {
  common: 'ring-slate-200',
  rare: 'ring-sky-200',
  epic: 'ring-purple-200',
  legendary: 'ring-amber-200',
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };

export function BadgePreview({ badges }: BadgePreviewProps) {
  return (
    <section className="space-y-5">
      <SectionHeader
        eyebrow="Badges"
        title="勋章预览"
        description="展示已获得与即将解锁的阶段奖励。"
        action={
          <Link className="text-sm font-black text-growth-secondary hover:text-blue-600" to="/badges">
            勋章中心
          </Link>
        }
      />
      <Card>
        <motion.div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6" variants={container} initial="hidden" animate="show">
          {badges.slice(0, 6).map((badge) => (
            <motion.div key={badge.id} variants={item}>
              <Link
                to="/badges"
                className={cn(
                  'group block rounded-3xl border p-4 text-center transition duration-300 hover:-translate-y-1 hover:shadow-glow focus:outline-none focus:ring-4 focus:ring-growth-primary/25',
                  badge.earned
                    ? 'border-emerald-100 bg-gradient-to-b from-white to-emerald-50'
                    : 'border-slate-200 bg-slate-100/80 opacity-70 grayscale',
                )}
              >
                <div className={cn('mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-4xl shadow-inner ring-4 transition group-hover:scale-110', rarityRing[badge.rarity])}>
                  {badge.icon}
                </div>
                <h3 className="mt-3 text-sm font-black text-growth-ink">{badge.name}</h3>
                <p className="mt-1 text-xs font-bold text-slate-500">{badge.earned ? '已获得' : '待解锁'}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </Card>
    </section>
  );
}
