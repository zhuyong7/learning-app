# Learning Growth Dashboard UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the phase-one high-fidelity, animated, mock-data React web prototype for the Learning Growth Dashboard.

**Architecture:** Create a front-end-only Vite React application with typed mock data, reusable presentational components, route-level pages, ECharts chart wrappers, and Framer Motion animation primitives. Keep all data behind local modules so a later FastAPI integration can replace mocks without rewriting UI components.

**Tech Stack:** React 18, TypeScript, Vite, TailwindCSS, Framer Motion, ECharts, React Router, Lucide React.

---

## Source Specification

Design source: `docs/superpowers/specs/2026-06-10-learning-growth-dashboard-ui-design.md`

Phase-one exclusions are intentional: no Electron packaging, no FastAPI, no SQLite, no real AI API, no authentication.

## Repository State Constraint

`f:\vs-project\learning-app` is not currently a git repository. Do not run `git init`, create commits, or change version control state unless the user explicitly asks. Use verification checkpoints instead of commit checkpoints.

## File Structure

Create this front-end project structure:

```text
learning-app/
  index.html
  package.json
  package-lock.json
  postcss.config.js
  tailwind.config.js
  tsconfig.json
  tsconfig.node.json
  vite.config.ts
  src/
    main.tsx
    vite-env.d.ts
    app/
      App.tsx
      routes.tsx
    components/
      assistant/
        AssistantBubble.tsx
        AssistantPanel.tsx
      badges/
        BadgeCard.tsx
        BadgeGrid.tsx
        UnlockCelebration.tsx
      charts/
        AbilityRadarChart.tsx
        GrowthAreaChart.tsx
        LearningHeatmap.tsx
        LearningLineChart.tsx
      dashboard/
        AbilityRadarCard.tsx
        BadgePreview.tsx
        HeroGrowthPanel.tsx
        HighlightWorksCarousel.tsx
        MetricCard.tsx
        TodayOverview.tsx
        TrendPreview.tsx
      layout/
        AppShell.tsx
        FloatingParticles.tsx
        PageTransition.tsx
        TopNavigation.tsx
      ui/
        Button.tsx
        Card.tsx
        EmptyState.tsx
        SectionHeader.tsx
      works/
        AudioPlayerMock.tsx
        ReviewCard.tsx
        ScoreBreakdown.tsx
        WorkCard.tsx
        WorkDetailHeader.tsx
        WorksToolbar.tsx
    data/
      mockAssistant.ts
      mockBadges.ts
      mockStats.ts
      mockTrends.ts
      mockUser.ts
      mockWorks.ts
    pages/
      BadgesPage.tsx
      HomePage.tsx
      TrendsPage.tsx
      WorkDetailPage.tsx
      WorksPage.tsx
    styles/
      globals.css
    types/
      domain.ts
    utils/
      classNames.ts
      format.ts
```

Boundaries:

- `src/types/domain.ts` owns all domain types.
- `src/data/*` owns static mock data only.
- `src/components/charts/*` owns chart rendering and receives data via props.
- `src/pages/*` imports mock data and composes components.
- `src/components/*` must not import from `src/data` except page components.
- `src/app/routes.tsx` owns route definitions.
- `src/styles/globals.css` owns Tailwind layers and custom animation helpers.

---

### Task 1: Scaffold Vite React TypeScript Project

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `postcss.config.js`
- Create: `tailwind.config.js`
- Create: `src/main.tsx`
- Create: `src/vite-env.d.ts`
- Create: `src/app/App.tsx`
- Create: `src/styles/globals.css`

- [ ] **Step 1: Create `package.json` with scripts and dependencies**

Use this content:

```json
{
  "name": "learning-growth-dashboard",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "typecheck": "tsc -b"
  },
  "dependencies": {
    "@vitejs/plugin-react": "latest",
    "echarts": "latest",
    "framer-motion": "latest",
    "lucide-react": "latest",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "latest"
  },
  "devDependencies": {
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "autoprefixer": "latest",
    "postcss": "latest",
    "tailwindcss": "latest",
    "typescript": "latest",
    "vite": "latest"
  }
}
```

- [ ] **Step 2: Create build configuration files**

`index.html`:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="家长端学习成长中心高保真原型" />
    <title>Learning Growth Dashboard</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

`vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
});
```

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

`tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

`postcss.config.js`:

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

`tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        growth: {
          primary: '#4ADE80',
          secondary: '#60A5FA',
          warning: '#FBBF24',
          danger: '#FB7185',
          background: '#F8FAFC',
          ink: '#0F172A',
        },
      },
      borderRadius: {
        card: '24px',
        soft: '16px',
      },
      boxShadow: {
        glow: '0 0 32px rgba(74, 222, 128, 0.35)',
        card: '0 24px 60px rgba(15, 23, 42, 0.12)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 3: Create React entry files**

`src/main.tsx`:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './app/App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
```

`src/vite-env.d.ts`:

```ts
/// <reference types="vite/client" />
```

`src/app/App.tsx`:

```tsx
export function App() {
  return (
    <main className="min-h-screen bg-growth-background text-slate-950">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 text-center">
        <div className="rounded-card bg-white p-10 shadow-card">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-growth-secondary">Learning Growth</p>
          <h1 className="mt-4 text-4xl font-black">家长端学习成长中心</h1>
          <p className="mt-4 text-slate-600">项目脚手架已就绪，后续任务会接入完整页面、Mock 数据、图表和动画。</p>
        </div>
      </div>
    </main>
  );
}
```

`src/styles/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: light;
  background: #f8fafc;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

* {
  box-sizing: border-box;
}

@layer utilities {
  .glass-card {
    background: rgba(255, 255, 255, 0.76);
    border: 1px solid rgba(255, 255, 255, 0.72);
    box-shadow: 0 24px 60px rgba(15, 23, 42, 0.12);
    backdrop-filter: blur(18px);
  }

  .pixel-corner {
    box-shadow: 6px 6px 0 rgba(15, 23, 42, 0.12);
  }
}
```

- [ ] **Step 4: Install dependencies**

Run:

```bash
npm install
```

Expected: `package-lock.json` is created and npm exits with code 0.

- [ ] **Step 5: Verify scaffold builds**

Run:

```bash
npm run build
```

Expected: TypeScript and Vite complete successfully and `dist/` is produced.

---

### Task 2: Add Domain Types, Utilities, and Mock Data

**Files:**
- Create: `src/types/domain.ts`
- Create: `src/utils/classNames.ts`
- Create: `src/utils/format.ts`
- Create: `src/data/mockUser.ts`
- Create: `src/data/mockStats.ts`
- Create: `src/data/mockWorks.ts`
- Create: `src/data/mockBadges.ts`
- Create: `src/data/mockTrends.ts`
- Create: `src/data/mockAssistant.ts`

- [ ] **Step 1: Define domain types**

`src/types/domain.ts`:

```ts
export type AbilityKey = 'listening' | 'speaking' | 'reading' | 'expression' | 'vocabulary';

export interface UserProfile {
  id: number;
  name: string;
  avatar: string;
  level: number;
  exp: number;
  nextLevelExp: number;
  streakDays: number;
  title: string;
}

export interface StudyMetric {
  id: string;
  label: string;
  value: number;
  unit: string;
  delta: number;
  icon: string;
  tone: 'green' | 'blue' | 'yellow' | 'pink';
}

export interface AbilityScore {
  key: AbilityKey;
  label: string;
  value: number;
  max: number;
}

export interface WorkItem {
  id: number;
  title: string;
  type: 'reading' | 'speaking' | 'story' | 'vocabulary';
  cover: string;
  score: number;
  duration: string;
  completedAt: string;
  favorite: boolean;
  audioUrl: string;
  aiComment: string;
  teacherComment: string;
  skills: AbilityScore[];
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedTime?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface TrendPoint {
  date: string;
  duration: number;
  exp: number;
  score: number;
}

export interface HeatmapDay {
  date: string;
  minutes: number;
}

export interface AssistantMessage {
  id: number;
  role: 'assistant' | 'parent';
  content: string;
  quickAction?: 'analysis' | 'plan' | 'weakness' | 'weekly';
}
```

- [ ] **Step 2: Add utilities**

`src/utils/classNames.ts`:

```ts
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}
```

`src/utils/format.ts`:

```ts
export function formatPercent(value: number) {
  return `${value > 0 ? '+' : ''}${value}%`;
}

export function formatScore(value: number) {
  return `${Math.round(value)}分`;
}

export function formatMinutes(value: number) {
  if (value < 60) return `${value}分钟`;
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return minutes === 0 ? `${hours}小时` : `${hours}小时${minutes}分钟`;
}
```

- [ ] **Step 3: Create user and stats mocks**

`src/data/mockUser.ts`:

```ts
import type { UserProfile } from '../types/domain';

export const mockUser: UserProfile = {
  id: 1,
  name: '小明',
  avatar: '🧒',
  level: 15,
  exp: 4580,
  nextLevelExp: 5000,
  streakDays: 32,
  title: '森林探险学习家',
};
```

`src/data/mockStats.ts`:

```ts
import type { AbilityScore, StudyMetric } from '../types/domain';

export const todayMetrics: StudyMetric[] = [
  { id: 'duration', label: '累计学习时长', value: 420, unit: '分钟', delta: 15, icon: '⏱️', tone: 'green' },
  { id: 'tasks', label: '完成学习任务', value: 18, unit: '个', delta: 22, icon: '✅', tone: 'blue' },
  { id: 'score', label: '平均作品评分', value: 92, unit: '分', delta: 8, icon: '⭐', tone: 'yellow' },
  { id: 'exp', label: '今日成长值', value: 120, unit: 'EXP', delta: 12, icon: '💎', tone: 'pink' },
];

export const abilityScores: AbilityScore[] = [
  { key: 'listening', label: '听力', value: 86, max: 100 },
  { key: 'speaking', label: '口语', value: 92, max: 100 },
  { key: 'reading', label: '阅读', value: 78, max: 100 },
  { key: 'expression', label: '表达', value: 88, max: 100 },
  { key: 'vocabulary', label: '词汇', value: 94, max: 100 },
];
```

- [ ] **Step 4: Create works mock data**

`src/data/mockWorks.ts` must export at least 8 works using this shape:

```ts
import type { WorkItem } from '../types/domain';

const skillSet = [
  { key: 'listening', label: '听力', value: 86, max: 100 },
  { key: 'speaking', label: '口语', value: 92, max: 100 },
  { key: 'reading', label: '阅读', value: 88, max: 100 },
  { key: 'expression', label: '表达', value: 90, max: 100 },
  { key: 'vocabulary', label: '词汇', value: 95, max: 100 },
] as const;

export const mockWorks: WorkItem[] = [
  {
    id: 1,
    title: '森林里的彩虹桥朗读',
    type: 'reading',
    cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    score: 96,
    duration: '3分20秒',
    completedAt: '2026-06-09 19:40',
    favorite: true,
    audioUrl: '/mock/audio/rainbow-bridge.mp3',
    aiComment: '语速稳定，重音处理自然，建议继续练习长句停顿。',
    teacherComment: '本次朗读情绪表达很好，结尾部分可以再放慢一点。',
    skills: [...skillSet],
  },
  {
    id: 2,
    title: '我的太空旅行故事',
    type: 'story',
    cover: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=900&q=80',
    score: 93,
    duration: '4分10秒',
    completedAt: '2026-06-08 20:12',
    favorite: false,
    audioUrl: '/mock/audio/space-story.mp3',
    aiComment: '想象力丰富，故事结构完整，可以补充更多连接词。',
    teacherComment: '开头很吸引人，下一次可以尝试加入对话。',
    skills: [...skillSet],
  },
  {
    id: 3,
    title: '动物朋友单词挑战',
    type: 'vocabulary',
    cover: 'https://images.unsplash.com/photo-1503919005314-30d93d07d823?auto=format&fit=crop&w=900&q=80',
    score: 91,
    duration: '2分45秒',
    completedAt: '2026-06-07 18:25',
    favorite: true,
    audioUrl: '/mock/audio/animal-words.mp3',
    aiComment: '词汇掌握较好，容易混淆的发音已经明显改善。',
    teacherComment: '注意 lion 与 line 的发音区别。',
    skills: [...skillSet],
  },
  {
    id: 4,
    title: '购物场景口语对话',
    type: 'speaking',
    cover: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=900&q=80',
    score: 89,
    duration: '5分05秒',
    completedAt: '2026-06-06 19:02',
    favorite: false,
    audioUrl: '/mock/audio/shopping-dialog.mp3',
    aiComment: '对话反应速度不错，疑问句语调可继续练习。',
    teacherComment: '表达很自然，建议增加礼貌用语。',
    skills: [...skillSet],
  },
  {
    id: 5,
    title: '海底冒险绘本复述',
    type: 'reading',
    cover: 'https://images.unsplash.com/photo-1439405326854-014607f694d7?auto=format&fit=crop&w=900&q=80',
    score: 95,
    duration: '3分58秒',
    completedAt: '2026-06-05 20:18',
    favorite: true,
    audioUrl: '/mock/audio/ocean-retell.mp3',
    aiComment: '复述顺序清晰，细节记忆准确。',
    teacherComment: '可以尝试用自己的话总结结尾。',
    skills: [...skillSet],
  },
  {
    id: 6,
    title: '天气播报小主播',
    type: 'speaking',
    cover: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
    score: 90,
    duration: '2分50秒',
    completedAt: '2026-06-04 18:45',
    favorite: false,
    audioUrl: '/mock/audio/weather-report.mp3',
    aiComment: '播报节奏清楚，天气词汇使用准确。',
    teacherComment: '可以增加语气变化，让播报更有感染力。',
    skills: [...skillSet],
  },
  {
    id: 7,
    title: '魔法花园看图说话',
    type: 'story',
    cover: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=80',
    score: 94,
    duration: '4分30秒',
    completedAt: '2026-06-03 19:30',
    favorite: true,
    audioUrl: '/mock/audio/magic-garden.mp3',
    aiComment: '画面描述生动，表达层次越来越清晰。',
    teacherComment: '非常棒，可以继续练习因果关系表达。',
    skills: [...skillSet],
  },
  {
    id: 8,
    title: '早餐菜单词汇练习',
    type: 'vocabulary',
    cover: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&w=900&q=80',
    score: 87,
    duration: '2分35秒',
    completedAt: '2026-06-02 08:20',
    favorite: false,
    audioUrl: '/mock/audio/breakfast-words.mp3',
    aiComment: '基础词汇掌握扎实，建议复习 cereal 与 pancake。',
    teacherComment: '发音准确度稳定提升，继续保持。',
    skills: [...skillSet],
  },
];
```

- [ ] **Step 5: Create badge, trend, and assistant mocks**

`src/data/mockBadges.ts` should export 9 badges: 6 earned and 3 locked. Use icons: `🏆`, `🔥`, `📚`, `🎤`, `💎`, `🌟`, `🔒`, `🧭`, `🚀`.

`src/data/mockTrends.ts` should export:

```ts
import type { HeatmapDay, TrendPoint } from '../types/domain';

export const weeklyTrends: TrendPoint[] = [
  { date: '周一', duration: 35, exp: 60, score: 88 },
  { date: '周二', duration: 48, exp: 80, score: 90 },
  { date: '周三', duration: 42, exp: 75, score: 91 },
  { date: '周四', duration: 60, exp: 110, score: 93 },
  { date: '周五', duration: 55, exp: 95, score: 92 },
  { date: '周六', duration: 72, exp: 140, score: 96 },
  { date: '周日', duration: 68, exp: 130, score: 95 },
];

export const monthlyTrends: TrendPoint[] = Array.from({ length: 30 }, (_, index) => ({
  date: `${index + 1}日`,
  duration: 25 + ((index * 11) % 55),
  exp: 40 + ((index * 17) % 120),
  score: 82 + ((index * 7) % 16),
}));

export const yearlyTrends: TrendPoint[] = Array.from({ length: 12 }, (_, index) => ({
  date: `${index + 1}月`,
  duration: 600 + ((index * 137) % 520),
  exp: 900 + ((index * 251) % 1100),
  score: 84 + ((index * 5) % 13),
}));

export const heatmapDays: HeatmapDay[] = Array.from({ length: 84 }, (_, index) => ({
  date: `第${index + 1}天`,
  minutes: (index * 19) % 90,
}));
```

`src/data/mockAssistant.ts` should export 4 messages covering learning analysis, weak point discovery, plan generation, and weekly report.

- [ ] **Step 6: Verify TypeScript compiles**

Run:

```bash
npm run typecheck
```

Expected: command exits with code 0.

---

### Task 3: Build Shared UI Primitives and Layout Shell

**Files:**
- Create: `src/components/ui/Card.tsx`
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/SectionHeader.tsx`
- Create: `src/components/ui/EmptyState.tsx`
- Create: `src/components/layout/FloatingParticles.tsx`
- Create: `src/components/layout/PageTransition.tsx`
- Create: `src/components/layout/TopNavigation.tsx`
- Create: `src/components/layout/AppShell.tsx`
- Modify: `src/app/App.tsx`
- Create: `src/app/routes.tsx`

- [ ] **Step 1: Create UI primitives**

`Card.tsx` exports a rounded, glass-capable wrapper:

```tsx
import type { ReactNode } from 'react';
import { cn } from '../../utils/classNames';

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export function Card({ children, className, glow = false }: CardProps) {
  return <section className={cn('rounded-card bg-white p-6 shadow-card', glow && 'shadow-glow', className)}>{children}</section>;
}
```

`Button.tsx` exports a green primary button and white secondary button. `SectionHeader.tsx` renders eyebrow, title, and action slot. `EmptyState.tsx` renders icon, title, and description for no-results states.

- [ ] **Step 2: Create decorative and transition layout components**

`FloatingParticles.tsx` must render 12 small absolute-positioned animated dots/cubes using Framer Motion. `PageTransition.tsx` must wrap `children` with a fade and y-axis slide.

- [ ] **Step 3: Create top navigation**

`TopNavigation.tsx` should use `NavLink` entries:

```ts
const navItems = [
  { to: '/', label: '成长中心' },
  { to: '/trends', label: '成长趋势' },
  { to: '/works', label: '成果库' },
  { to: '/badges', label: '勋章中心' },
];
```

Active state: green/blue gradient background, white text, soft shadow. Inactive state: slate text with hover background.

- [ ] **Step 4: Create route definitions with temporary page components**

`src/app/routes.tsx`:

```tsx
import { Navigate, RouteObject } from 'react-router-dom';

function TemporaryPage({ title }: { title: string }) {
  return (
    <div className="rounded-card bg-white p-8 shadow-card">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-growth-secondary">Phase One</p>
      <h1 className="mt-3 text-3xl font-black text-slate-950">{title}</h1>
      <p className="mt-3 text-slate-600">后续任务会替换为高保真页面。</p>
    </div>
  );
}

export const routes: RouteObject[] = [
  { path: '/', element: <TemporaryPage title="首页成长中心" /> },
  { path: '/trends', element: <TemporaryPage title="成长趋势" /> },
  { path: '/works', element: <TemporaryPage title="学习成果库" /> },
  { path: '/works/:workId', element: <TemporaryPage title="作品详情" /> },
  { path: '/badges', element: <TemporaryPage title="勋章中心" /> },
  { path: '*', element: <Navigate to="/" replace /> },
];
```

- [ ] **Step 5: Replace `App.tsx` with shell + routes**

`App.tsx` must use `useRoutes(routes)`, render `AppShell`, and include the route element inside `PageTransition`.

- [ ] **Step 6: Verify navigation shell**

Run:

```bash
npm run build
```

Expected: build exits with code 0. Manual check with `npm run dev`: all top nav items change route without page reload.

---

### Task 4: Build Chart Components

**Files:**
- Create: `src/components/charts/AbilityRadarChart.tsx`
- Create: `src/components/charts/LearningLineChart.tsx`
- Create: `src/components/charts/GrowthAreaChart.tsx`
- Create: `src/components/charts/LearningHeatmap.tsx`

- [ ] **Step 1: Create a local ECharts hook pattern inside each chart file**

Each ECharts component should:

1. Use `useRef<HTMLDivElement>(null)` for the container.
2. Use `useEffect` to call `echarts.init(ref.current)`.
3. Call `chart.setOption(option)`.
4. Add a window resize listener that calls `chart.resize()`.
5. Dispose the chart in cleanup.
6. Render an empty state if the input array is empty.

- [ ] **Step 2: Implement `AbilityRadarChart`**

Props:

```ts
import type { AbilityScore } from '../../types/domain';

interface AbilityRadarChartProps {
  data: AbilityScore[];
  height?: number;
}
```

Options must use radar indicators from `label` and `max`, series value from `value`, area fill `rgba(74,222,128,.4)`, line color `#4ADE80`, and point glow effect.

- [ ] **Step 3: Implement line and area charts**

`LearningLineChart` receives `TrendPoint[]` and renders `duration` by `date` with smooth blue line.

`GrowthAreaChart` receives `TrendPoint[]` and renders `exp` by `date` with green gradient area fill.

- [ ] **Step 4: Implement `LearningHeatmap` without ECharts**

Render `HeatmapDay[]` as a CSS grid with 7 rows and auto columns. Map minutes to classes:

- `0`: `bg-slate-100`
- `1-20`: `bg-emerald-100`
- `21-45`: `bg-emerald-300`
- `46-70`: `bg-emerald-500`
- `71+`: `bg-emerald-700`

Include a legend from light to dark.

- [ ] **Step 5: Verify chart components compile**

Run:

```bash
npm run typecheck
```

Expected: no TypeScript errors.

---

### Task 5: Build Home Dashboard Components and Page

**Files:**
- Create: `src/components/dashboard/HeroGrowthPanel.tsx`
- Create: `src/components/dashboard/MetricCard.tsx`
- Create: `src/components/dashboard/TodayOverview.tsx`
- Create: `src/components/dashboard/AbilityRadarCard.tsx`
- Create: `src/components/dashboard/HighlightWorksCarousel.tsx`
- Create: `src/components/dashboard/BadgePreview.tsx`
- Create: `src/components/dashboard/TrendPreview.tsx`
- Create: `src/pages/HomePage.tsx`
- Modify: `src/app/routes.tsx`

- [ ] **Step 1: Build hero panel**

`HeroGrowthPanel` props:

```ts
import type { UserProfile } from '../../types/domain';

interface HeroGrowthPanelProps {
  user: UserProfile;
}
```

Render a 320px hero card with animated gradient background, floating cloud shapes, cartoon mountain blocks, avatar, `Lv.{level} {name}`, title, `成长值：{exp} / {nextLevelExp}`, progress bar, and streak `🔥 连续学习{streakDays}天`. Add three small experience orb elements that animate toward the progress bar on entry.

- [ ] **Step 2: Build metric card and today overview**

`MetricCard` receives a `StudyMetric` and animates number from 0 to target using Framer Motion's `animate` or local interval. Display icon, label, value+unit, and delta. Tone colors:

```ts
const toneClasses = {
  green: 'from-emerald-400 to-lime-300',
  blue: 'from-sky-400 to-blue-500',
  yellow: 'from-amber-300 to-yellow-500',
  pink: 'from-rose-300 to-pink-500',
};
```

`TodayOverview` lays four metric cards in a responsive grid.

- [ ] **Step 3: Build ability, works, badge, and trend preview cards**

`AbilityRadarCard` wraps `AbilityRadarChart` in a `Card` with a section header.

`HighlightWorksCarousel` renders first 5 works horizontally scrollable. Cards scale to 1.05 on hover, glow border, show cover, title, score, type, and link to `/works/{id}`.

`BadgePreview` renders first 6 badges with earned/locked styles and a link to `/badges`.

`TrendPreview` renders a compact `GrowthAreaChart` with weekly data and a link to `/trends`.

- [ ] **Step 4: Compose `HomePage`**

`HomePage` imports `mockUser`, `todayMetrics`, `abilityScores`, `mockWorks`, `mockBadges`, `weeklyTrends`. Compose all dashboard sections in the order from the PRD:

1. Hero growth information
2. Today learning overview
3. Ability distribution and trend preview in a two-column desktop grid
4. Highlight works
5. Badge preview

- [ ] **Step 5: Update routes**

Replace the temporary `/` element with `<HomePage />`.

- [ ] **Step 6: Verify home page**

Run:

```bash
npm run build
```

Expected: build passes. Manual check: home page shows all PRD homepage modules, cards animate in, chart renders, work cards link to detail route placeholder.

---

### Task 6: Build Growth Trends Page

**Files:**
- Create: `src/pages/TrendsPage.tsx`
- Modify: `src/app/routes.tsx`

- [ ] **Step 1: Create trend period state**

`TrendsPage` should use local state:

```ts
type Period = 'week' | 'month' | 'year';
const [period, setPeriod] = useState<Period>('week');
```

Data mapping:

```ts
const trendData = period === 'week' ? weeklyTrends : period === 'month' ? monthlyTrends : yearlyTrends;
```

- [ ] **Step 2: Render trend controls and charts**

Render a title block, three pill buttons for 周/月/年, two chart cards for learning duration and growth value, and a heatmap card using `heatmapDays`.

- [ ] **Step 3: Update route**

Replace `/trends` temporary element with `<TrendsPage />`.

- [ ] **Step 4: Verify trend interactions**

Run:

```bash
npm run build
```

Expected: build passes. Manual check: clicking 周/月/年 changes both charts; heatmap remains visible.

---

### Task 7: Build Works Library and Work Detail Pages

**Files:**
- Create: `src/components/works/WorksToolbar.tsx`
- Create: `src/components/works/WorkCard.tsx`
- Create: `src/components/works/WorkDetailHeader.tsx`
- Create: `src/components/works/AudioPlayerMock.tsx`
- Create: `src/components/works/ReviewCard.tsx`
- Create: `src/components/works/ScoreBreakdown.tsx`
- Create: `src/pages/WorksPage.tsx`
- Create: `src/pages/WorkDetailPage.tsx`
- Modify: `src/app/routes.tsx`

- [ ] **Step 1: Build toolbar component**

`WorksToolbar` props:

```ts
interface WorksToolbarProps {
  query: string;
  type: 'all' | 'reading' | 'speaking' | 'story' | 'vocabulary';
  sort: 'newest' | 'score';
  onQueryChange: (value: string) => void;
  onTypeChange: (value: WorksToolbarProps['type']) => void;
  onSortChange: (value: WorksToolbarProps['sort']) => void;
}
```

Render search input, five filter chips, and a select for newest/score.

- [ ] **Step 2: Build work card component**

`WorkCard` receives `work: WorkItem`, renders cover image, score pill, favorite icon, title, type, duration, completedAt, and links to `/works/{work.id}`. Hover effect: scale 1.03 and glow border.

- [ ] **Step 3: Build works library page**

`WorksPage` local state: `query`, `type`, `sort`. Filter by title and type. Sort by completed date or score. Render `EmptyState` when no work matches. Render responsive grid for matches.

- [ ] **Step 4: Build detail components**

`WorkDetailHeader` renders cover, title, score, type, duration, completion time.

`AudioPlayerMock` renders play button, fake waveform bars, current time `00:42`, duration from work, and a gradient progress bar. Play button toggles icon state only.

`ReviewCard` renders title, icon, body. Use two instances: AI 点评 and 老师点评.

`ScoreBreakdown` renders skill labels and animated progress bars from `work.skills`.

- [ ] **Step 5: Build `WorkDetailPage`**

Use `useParams` to parse `workId`. Find the work in `mockWorks`. If not found, render `EmptyState` with a button-like link to `/works`. If found, render detail header, audio mock, review cards, and score breakdown.

- [ ] **Step 6: Update routes**

Replace `/works` and `/works/:workId` temporary elements with `<WorksPage />` and `<WorkDetailPage />`.

- [ ] **Step 7: Verify works flow**

Run:

```bash
npm run build
```

Expected: build passes. Manual check: search narrows results, filters work, sorting changes order, clicking a work opens detail, invalid `/works/999` shows empty state.

---

### Task 8: Build Badge Center

**Files:**
- Create: `src/components/badges/BadgeCard.tsx`
- Create: `src/components/badges/BadgeGrid.tsx`
- Create: `src/components/badges/UnlockCelebration.tsx`
- Create: `src/pages/BadgesPage.tsx`
- Modify: `src/app/routes.tsx`

- [ ] **Step 1: Build badge card**

`BadgeCard` receives `badge: Badge` and `onPreview?: (badge: Badge) => void`. Earned style: gold border, warm gradient, glow, small particle dots. Locked style: grayscale, lock overlay, muted text. Rarity controls small label color.

- [ ] **Step 2: Build unlock celebration**

`UnlockCelebration` props:

```ts
interface UnlockCelebrationProps {
  badge: Badge | null;
  onClose: () => void;
}
```

When `badge` is non-null, render fixed overlay with radial gold glow, large badge icon, `解锁勋章`, badge name, `+100 EXP`, and 16 animated confetti dots. Auto-close after 3000ms with `useEffect`.

- [ ] **Step 3: Build badge grid and page**

`BadgeGrid` renders all 9 badges in a responsive grid. `BadgesPage` renders page title, earned count, total count, grid, and celebration overlay. Clicking an earned badge opens celebration; clicking a locked badge shows a smaller locked explanation card or no-op visual press.

- [ ] **Step 4: Update route**

Replace `/badges` temporary element with `<BadgesPage />`.

- [ ] **Step 5: Verify badge page**

Run:

```bash
npm run build
```

Expected: build passes. Manual check: earned badges glow, locked badges are gray, clicking earned badge shows 3-second celebration.

---

### Task 9: Build Floating AI Parent Assistant

**Files:**
- Create: `src/components/assistant/AssistantBubble.tsx`
- Create: `src/components/assistant/AssistantPanel.tsx`
- Modify: `src/components/layout/AppShell.tsx`

- [ ] **Step 1: Build assistant bubble**

`AssistantBubble` receives `open: boolean` and `onToggle: () => void`. Render fixed lower-right robot button with floating animation, green/blue gradient, blinking eyes using CSS or Framer Motion, and label `AI 家长助手`.

- [ ] **Step 2: Build assistant panel**

`AssistantPanel` receives `open: boolean` and `onClose: () => void`. Use `mockAssistantMessages`. Render mock chat, typing dots, and four suggestion cards:

- 学习分析
- 制定计划
- 发现弱项
- 生成周报

Clicking a suggestion appends or reveals a scripted assistant response from `mockAssistantMessages`.

- [ ] **Step 3: Mount assistant in shell**

Add assistant open state in `AppShell`. Render `AssistantPanel` and `AssistantBubble` after the page content so it appears on every route.

- [ ] **Step 4: Verify assistant**

Run:

```bash
npm run build
```

Expected: build passes. Manual check: assistant floats on every route, opens and closes, suggestion clicks reveal mock responses.

---

### Task 10: Polish Responsive Behavior, Motion, and Visual Fidelity

**Files:**
- Modify: `src/styles/globals.css`
- Modify: dashboard, works, badges, assistant, and page components created in previous tasks

- [ ] **Step 1: Add global scroll and selection polish**

Extend `globals.css` with custom scrollbar, text selection color, and reduced motion safety:

```css
::selection {
  background: rgba(74, 222, 128, 0.35);
}

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #4ade80, #60a5fa);
  border-radius: 999px;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Check responsive breakpoints**

For each page, verify these layouts:

- 1280px width: max-width centered dashboard, multi-column cards.
- 768px width: two-column grids collapse cleanly where needed.
- 390px width: navigation scrolls or wraps, cards are single column, assistant does not cover primary controls.

- [ ] **Step 3: Add consistent motion variants**

Use these variants in list-heavy components:

```ts
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};
```

- [ ] **Step 4: Verify product polish manually**

Run:

```bash
npm run dev
```

Expected: Vite dev server URL prints. Open it and check home, trends, works, work detail, badges, and assistant. Visual quality should match clean commercial gamification with light Minecraft accents.

---

### Task 11: Final Build Verification and Acceptance Pass

**Files:**
- Modify only files needed to fix verification failures

- [ ] **Step 1: Run typecheck**

Run:

```bash
npm run typecheck
```

Expected: command exits with code 0.

- [ ] **Step 2: Run production build**

Run:

```bash
npm run build
```

Expected: command exits with code 0 and `dist/` is produced.

- [ ] **Step 3: Run local app for manual verification**

Run:

```bash
npm run dev
```

Expected: Vite prints a local URL such as `http://127.0.0.1:5173/`.

- [ ] **Step 4: Manual acceptance checklist**

Verify all of these in the browser:

- Home opens to a polished growth dashboard.
- Visual direction is clean commercial gamification with small Minecraft-style reward accents.
- All scoped pages are navigable from the top nav.
- Mock data powers every visible product section.
- Ability radar and growth trend charts render.
- Cards, metrics, badges, works, and assistant have visible motion effects.
- Works library search, filter, and sort work locally.
- Work detail page shows mock recording UI, AI review, teacher review, and score analysis.
- Badge center shows earned and locked badges, and earned badge click shows unlock celebration.
- AI assistant floats in the lower-right corner and opens a mock chat panel.
- No Electron, backend, database, auth, or real AI integration appears in the implementation.

- [ ] **Step 5: Record verification results in final response**

Report exact commands run and whether they passed. If a command fails, include the failure output and the file changed to fix it.

---

## Self-Review Results

### Spec Coverage

- Home Growth Center: covered by Task 5.
- Growth Trends: covered by Task 6.
- Works Library: covered by Task 7.
- Work Detail: covered by Task 7.
- Badge Center: covered by Task 8.
- AI Parent Assistant: covered by Task 9.
- Mock data: covered by Task 2.
- ECharts radar, line, area, heatmap: covered by Task 4 and Task 6.
- Framer Motion animation and polish: covered by Tasks 3, 5, 8, 9, and 10.
- Verification: covered by Task 11.
- Phase-one exclusions: stated in architecture and checked in Task 11.

### Placeholder Scan

No unresolved placeholders, no ambiguous future-only steps, and no references to undefined domain types remain in this plan.

### Type Consistency

Types referenced by components match `src/types/domain.ts`: `UserProfile`, `StudyMetric`, `AbilityScore`, `WorkItem`, `Badge`, `TrendPoint`, `HeatmapDay`, and `AssistantMessage`. Route paths are consistent across navigation, route definitions, work cards, and detail lookup.
