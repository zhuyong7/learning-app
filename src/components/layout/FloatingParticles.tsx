import { motion } from 'framer-motion';
import { cn } from '../../utils/classNames';

const particles = Array.from({ length: 12 }, (_, index) => ({
  id: index,
  left: `${8 + ((index * 17) % 84)}%`,
  top: `${10 + ((index * 23) % 78)}%`,
  size: 6 + (index % 4) * 3,
  delay: index * 0.35,
  duration: 5 + (index % 5),
  cube: index % 3 === 0,
}));

export function FloatingParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className={cn(
            'absolute bg-gradient-to-br from-growth-primary/40 to-growth-secondary/40 shadow-sm',
            particle.cube ? 'rounded-[4px]' : 'rounded-full',
          )}
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -18, 0],
            x: [0, particle.id % 2 === 0 ? 8 : -8, 0],
            rotate: particle.cube ? [0, 18, 0] : 0,
            opacity: [0.3, 0.75, 0.3],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
