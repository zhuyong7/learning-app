import type { ReactNode } from 'react';
import { cn } from '../../utils/classNames';

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export function Card({ children, className, glow = false }: CardProps) {
  return (
    <section
      className={cn(
        'rounded-card bg-white p-6 shadow-card',
        glow && 'shadow-glow',
        className,
      )}
    >
      {children}
    </section>
  );
}
