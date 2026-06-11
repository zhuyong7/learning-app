import { useState, type ReactNode } from 'react';
import { AssistantBubble } from '../assistant/AssistantBubble';
import { AssistantPanel } from '../assistant/AssistantPanel';
import { localUser } from '../../data/localData';
import { FloatingParticles } from './FloatingParticles';
import { TopNavigation } from './TopNavigation';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [assistantOpen, setAssistantOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-growth-background text-growth-ink">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(74,222,128,0.20),transparent_34rem),radial-gradient(circle_at_bottom_right,rgba(96,165,250,0.22),transparent_32rem)]" />
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-growth-warning/10 blur-3xl" />
      <FloatingParticles />

      <div className="relative z-10 flex min-h-screen flex-col py-4 sm:py-6">
        <TopNavigation user={localUser} />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-28 pt-8 sm:px-6 sm:pb-32 lg:px-8 lg:py-10 lg:pb-32">
          {children}
        </main>
        <AssistantPanel open={assistantOpen} onClose={() => setAssistantOpen(false)} />
        <AssistantBubble open={assistantOpen} onToggle={() => setAssistantOpen((open) => !open)} />
      </div>
    </div>
  );
}
