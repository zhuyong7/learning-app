import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Sparkles, X } from 'lucide-react';
import { localAssistantMessages } from '../../data/localData';
import { cn } from '../../utils/classNames';

type QuickAction = NonNullable<(typeof localAssistantMessages)[number]['quickAction']>;

type ChatMessage = {
  id: string;
  role: 'assistant' | 'parent';
  content: string;
};

interface AssistantPanelProps {
  open: boolean;
  onClose: () => void;
}

const suggestionCards: Array<{ action: QuickAction; label: string; hint: string; tone: string }> = [
  { action: 'analysis', label: '学习分析', hint: '查看本周表现', tone: 'from-emerald-400 to-green-500' },
  { action: 'plan', label: '制定计划', hint: '安排下周节奏', tone: 'from-sky-400 to-blue-500' },
  { action: 'weakness', label: '发现弱项', hint: '定位提升方向', tone: 'from-amber-300 to-orange-400' },
  { action: 'weekly', label: '生成周报', hint: '总结成长亮点', tone: 'from-fuchsia-400 to-pink-500' },
];

const parentPrompts: Record<QuickAction, string> = {
  analysis: '请帮我分析孩子最近的学习情况。',
  plan: '请帮孩子制定一个下周学习计划。',
  weakness: '孩子现在最需要加强哪里？',
  weekly: '请生成一份本周学习周报。',
};

const welcomeMessage: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: '你好，我是 AI 家长助手。可以帮你快速解读学习数据、制定计划、发现弱项并生成周报。',
};

export function AssistantPanel({ open, onClose }: AssistantPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [typingAction, setTypingAction] = useState<QuickAction | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSuggestionClick = (action: QuickAction) => {
    const scriptedResponse = localAssistantMessages.find((message) => message.quickAction === action);

    if (!scriptedResponse || typingAction) {
      return;
    }

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: `parent-${action}-${Date.now()}`,
        role: 'parent',
        content: parentPrompts[action],
      },
    ]);
    setTypingAction(action);

    timeoutRef.current = window.setTimeout(() => {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: `assistant-${scriptedResponse.id}-${Date.now()}`,
          role: 'assistant',
          content: scriptedResponse.content,
        },
      ]);
      setTypingAction(null);
      timeoutRef.current = null;
    }, 650);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          aria-label="AI 家长助手聊天面板"
          className="fixed bottom-20 left-3 right-3 z-40 max-h-[62vh] overflow-hidden rounded-[2rem] border border-white/75 bg-white/92 shadow-2xl shadow-slate-300/50 backdrop-blur-2xl sm:bottom-28 sm:left-auto sm:right-6 sm:max-h-[76vh] sm:w-[390px]"
          initial={{ opacity: 0, y: 28, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 360, damping: 30 }}
        >
          <div className="flex items-center justify-between bg-gradient-to-r from-growth-primary to-growth-secondary px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 shadow-inner">
                <Bot className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-base font-black">AI 家长助手</h2>
                <p className="text-xs text-white/80">基于模拟数据的智能建议</p>
              </div>
            </div>
            <button
              type="button"
              aria-label="关闭 AI 家长助手"
              onClick={onClose}
              className="rounded-full p-2 text-white/85 transition hover:bg-white/15 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="flex max-h-[calc(62vh-76px)] flex-col sm:max-h-[calc(76vh-76px)]">
            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={cn('flex', message.role === 'parent' ? 'justify-end' : 'justify-start')}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className={cn(
                      'max-w-[84%] rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm',
                      message.role === 'parent'
                        ? 'bg-growth-secondary text-white'
                        : 'bg-slate-50 text-slate-700 ring-1 ring-slate-100',
                    )}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}

              {typingAction && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-1 rounded-3xl bg-slate-50 px-4 py-3 shadow-sm ring-1 ring-slate-100">
                    {[0, 1, 2].map((dot) => (
                      <motion.span
                        key={dot}
                        className="h-2 w-2 rounded-full bg-growth-secondary"
                        animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: dot * 0.12 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="border-t border-slate-100 bg-white/85 p-3">
              <div className="mb-2 flex items-center gap-2 px-1 text-xs font-semibold text-slate-500">
                <Sparkles className="h-4 w-4 text-growth-warning" aria-hidden="true" />
                快捷建议
              </div>
              <div className="grid gap-2 min-[390px]:grid-cols-2">
                {suggestionCards.map((suggestion) => (
                  <button
                    key={suggestion.action}
                    type="button"
                    disabled={Boolean(typingAction)}
                    onClick={() => handleSuggestionClick(suggestion.action)}
                    className="group rounded-2xl bg-slate-50 p-3 text-left ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-growth-secondary disabled:pointer-events-none disabled:opacity-60"
                  >
                    <span
                      className={cn(
                        'mb-2 block h-1.5 w-10 rounded-full bg-gradient-to-r',
                        suggestion.tone,
                      )}
                    />
                    <span className="block text-sm font-bold text-growth-ink">{suggestion.label}</span>
                    <span className="mt-0.5 block text-xs text-slate-500">{suggestion.hint}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
