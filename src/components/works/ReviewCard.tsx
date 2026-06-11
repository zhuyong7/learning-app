import type { ReactNode } from 'react';
import { Card } from '../ui/Card';

interface ReviewCardProps {
  title: string;
  icon: ReactNode;
  body: string;
}

export function ReviewCard({ title, icon, body }: ReviewCardProps) {
  return (
    <Card className="h-full border border-white/80 bg-white/90">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-green-100 to-blue-100 text-growth-secondary shadow-sm">
          {icon}
        </div>
        <div>
          <h2 className="text-lg font-black text-growth-ink">{title}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">{body}</p>
        </div>
      </div>
    </Card>
  );
}
