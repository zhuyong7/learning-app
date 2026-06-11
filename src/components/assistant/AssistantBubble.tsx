import { Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/classNames';

interface AssistantBubbleProps {
  open: boolean;
  onToggle: () => void;
}

export function AssistantBubble({ open, onToggle }: AssistantBubbleProps) {
  return (
    <motion.button
      type="button"
      aria-label={open ? '关闭 AI 家长助手' : '打开 AI 家长助手'}
      aria-expanded={open}
      onClick={onToggle}
      className={cn(
        'fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-gradient-to-br from-growth-primary via-emerald-400 to-growth-secondary px-3 py-2 text-sm font-bold text-white shadow-2xl shadow-blue-300/40 ring-4 ring-white/80 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-growth-secondary sm:bottom-6 sm:right-6 sm:px-4 sm:py-3',
        open && 'ring-growth-secondary/40',
      )}
      initial={{ opacity: 0, scale: 0.78, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
      transition={{
        opacity: { duration: 0.25 },
        scale: { type: 'spring', stiffness: 420, damping: 24 },
        y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
      }}
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.96 }}
    >
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/22 shadow-inner sm:h-11 sm:w-11">
        <Bot className="h-6 w-6" aria-hidden="true" />
        <motion.span
          className="absolute left-[13px] top-[15px] h-1.5 w-1.5 rounded-full bg-white"
          animate={{ scaleY: [1, 0.12, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, times: [0, 0.08, 0.16], repeatDelay: 1.2 }}
        />
        <motion.span
          className="absolute right-[13px] top-[15px] h-1.5 w-1.5 rounded-full bg-white"
          animate={{ scaleY: [1, 0.12, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, times: [0, 0.08, 0.16], repeatDelay: 1.2 }}
        />
      </span>
      <span className="hidden pr-1 sm:inline">AI 家长助手</span>
      <span className="pr-1 sm:hidden">AI 助手</span>
    </motion.button>
  );
}
