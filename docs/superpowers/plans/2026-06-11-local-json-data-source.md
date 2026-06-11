# Local JSON Data Source Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace TypeScript mock data modules with project-local JSON files loaded through a typed data adapter.

**Architecture:** Store read-only app data in `src/data/json/*.json`, expose typed constants from `src/data/localData.ts`, and update pages/components to consume the adapter. Add a verification script that prevents regressions to `mock*.ts` data imports.

**Tech Stack:** Vite JSON imports, React 18, TypeScript strict mode, Node verification scripts.

---

## Source Specification

Design source: `docs/superpowers/specs/2026-06-11-local-json-data-source-design.md`

This project directory is not a git repository. Do not run `git init`, create commits, or change version-control state.

## File Structure

Create:

```text
src/data/json/user.json
src/data/json/stats.json
src/data/json/works.json
src/data/json/badges.json
src/data/json/trends.json
src/data/json/assistant.json
src/data/localData.ts
scripts/verify-local-json-data.mjs
```

Modify:

```text
package.json
src/pages/HomePage.tsx
src/pages/TrendsPage.tsx
src/pages/WorksPage.tsx
src/pages/WorkDetailPage.tsx
src/pages/BadgesPage.tsx
src/components/layout/AppShell.tsx
src/components/assistant/AssistantPanel.tsx
```

Remove after migration:

```text
src/data/mockUser.ts
src/data/mockStats.ts
src/data/mockWorks.ts
src/data/mockBadges.ts
src/data/mockTrends.ts
src/data/mockAssistant.ts
```

Boundaries:

- `src/data/json/*` owns raw JSON only.
- `src/data/localData.ts` owns JSON imports and type assertions.
- Pages and the two approved app-level components consume `localData.ts` exports.
- No component should import from `src/data/mock*.ts` after migration.
- No backend, Electron, database, auth, real AI, or file-writing API is introduced.

---

### Task 1: Add Regression Verification for Local JSON Data

**Files:**
- Create: `scripts/verify-local-json-data.mjs`
- Modify: `package.json`

- [ ] **Step 1: Create failing verification script**

Create `scripts/verify-local-json-data.mjs`:

```js
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const jsonDir = join(root, 'src', 'data', 'json');

const requiredJsonFiles = [
  'user.json',
  'stats.json',
  'works.json',
  'badges.json',
  'trends.json',
  'assistant.json',
];

function readJson(fileName) {
  const filePath = join(jsonDir, fileName);
  if (!existsSync(filePath)) {
    throw new Error(`Missing JSON data file: ${relative(root, filePath)}`);
  }

  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`Invalid JSON in ${relative(root, filePath)}: ${error.message}`);
  }
}

function assertArray(value, label) {
  if (!Array.isArray(value)) {
    throw new Error(`${label} must be an array.`);
  }
}

function walkFiles(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const fullPath = join(dir, entry);
    if (entry === 'node_modules' || entry === 'dist' || entry === '.superpowers') return [];
    if (statSync(fullPath).isDirectory()) return walkFiles(fullPath);
    return fullPath;
  });
}

const user = readJson('user.json');
if (typeof user !== 'object' || user === null || Array.isArray(user)) {
  throw new Error('user.json must contain one user object.');
}

const stats = readJson('stats.json');
assertArray(stats.todayMetrics, 'stats.todayMetrics');
assertArray(stats.abilityScores, 'stats.abilityScores');

const works = readJson('works.json');
assertArray(works, 'works.json');

const badges = readJson('badges.json');
assertArray(badges, 'badges.json');

const trends = readJson('trends.json');
assertArray(trends.weeklyTrends, 'trends.weeklyTrends');
assertArray(trends.monthlyTrends, 'trends.monthlyTrends');
assertArray(trends.yearlyTrends, 'trends.yearlyTrends');
assertArray(trends.heatmapDays, 'trends.heatmapDays');

const assistant = readJson('assistant.json');
assertArray(assistant, 'assistant.json');

const sourceFiles = walkFiles(join(root, 'src')).filter((file) => /\.(ts|tsx)$/.test(file));
const forbiddenPatterns = [
  /from ['\"]\.\.\/data\/mock[A-Za-z]+['\"]/,
  /from ['\"]\.\.\/\.\.\/data\/mock[A-Za-z]+['\"]/,
  /from ['\"].*\/mock[A-Za-z]+['\"]/, 
  /\bmockUser\b/,
  /\bmockWorks\b/,
  /\bmockBadges\b/,
  /\bmockAssistantMessages\b/,
  /\btodayMetrics\b(?!\s*:)/,
  /\babilityScores\b(?!\s*:)/,
  /\bweeklyTrends\b/,
  /\bmonthlyTrends\b/,
  /\byearlyTrends\b/,
  /\bheatmapDays\b/,
];

const violations = [];
for (const file of sourceFiles) {
  if (file.endsWith(join('src', 'data', 'localData.ts'))) continue;
  const content = readFileSync(file, 'utf8');
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(content)) {
      violations.push(`${relative(root, file)} matches ${pattern}`);
    }
  }
}

if (violations.length > 0) {
  throw new Error(`Found old mock-data references:\n${violations.join('\n')}`);
}

for (const fileName of requiredJsonFiles) {
  const path = join(jsonDir, fileName);
  if (!existsSync(path)) throw new Error(`Missing required JSON file ${fileName}`);
}

console.log('Local JSON data verification passed.');
```

- [ ] **Step 2: Add package script**

Modify `package.json` scripts from:

```json
"verify:boundaries": "node scripts/verify-component-boundaries.mjs"
```

to:

```json
"verify:boundaries": "node scripts/verify-component-boundaries.mjs",
"verify:data": "node scripts/verify-local-json-data.mjs"
```

- [ ] **Step 3: Run verification and confirm it fails for the expected reason**

Run:

```bash
npm run verify:data
```

Expected: FAIL because `src/data/json/user.json` and the other required JSON files do not exist yet.

---

### Task 2: Create Local JSON Files and Typed Adapter

**Files:**
- Create: `src/data/json/user.json`
- Create: `src/data/json/stats.json`
- Create: `src/data/json/works.json`
- Create: `src/data/json/badges.json`
- Create: `src/data/json/trends.json`
- Create: `src/data/json/assistant.json`
- Create: `src/data/localData.ts`

- [ ] **Step 1: Create `src/data/json/user.json`**

```json
{
  "id": 1,
  "name": "小明",
  "avatar": "🧒",
  "level": 15,
  "exp": 4580,
  "nextLevelExp": 5000,
  "streakDays": 32,
  "title": "森林探险学习家"
}
```

- [ ] **Step 2: Create `src/data/json/stats.json`**

```json
{
  "todayMetrics": [
    { "id": "duration", "label": "累计学习时长", "value": 420, "unit": "分钟", "delta": 15, "icon": "⏱️", "tone": "green" },
    { "id": "tasks", "label": "完成学习任务", "value": 18, "unit": "个", "delta": 22, "icon": "✅", "tone": "blue" },
    { "id": "score", "label": "平均作品评分", "value": 92, "unit": "分", "delta": 8, "icon": "⭐", "tone": "yellow" },
    { "id": "exp", "label": "今日成长值", "value": 120, "unit": "EXP", "delta": 12, "icon": "💎", "tone": "pink" }
  ],
  "abilityScores": [
    { "key": "listening", "label": "听力", "value": 86, "max": 100 },
    { "key": "speaking", "label": "口语", "value": 92, "max": 100 },
    { "key": "reading", "label": "阅读", "value": 78, "max": 100 },
    { "key": "expression", "label": "表达", "value": 88, "max": 100 },
    { "key": "vocabulary", "label": "词汇", "value": 94, "max": 100 }
  ]
}
```

- [ ] **Step 3: Create `src/data/json/works.json`**

Use the eight works from the current `src/data/mockWorks.ts`. Expand the shared skill set into each work as a JSON `skills` array. Each work must keep its existing `id`, `title`, `type`, `cover`, `score`, `duration`, ISO-like `completedAt`, `favorite`, `audioUrl`, `aiComment`, `teacherComment`, and five `skills` entries.

- [ ] **Step 4: Create `src/data/json/badges.json`**

Use the nine badges from the current `src/data/mockBadges.ts`. Preserve six earned badges, three locked badges, icons, `earnedTime` on earned badges, and `rarity`.

- [ ] **Step 5: Create `src/data/json/trends.json`**

Create object:

```json
{
  "weeklyTrends": [
    { "date": "2026-06-03", "duration": 35, "exp": 60, "score": 88 },
    { "date": "2026-06-04", "duration": 48, "exp": 80, "score": 90 },
    { "date": "2026-06-05", "duration": 42, "exp": 75, "score": 91 },
    { "date": "2026-06-06", "duration": 60, "exp": 110, "score": 93 },
    { "date": "2026-06-07", "duration": 55, "exp": 95, "score": 92 },
    { "date": "2026-06-08", "duration": 72, "exp": 140, "score": 96 },
    { "date": "2026-06-09", "duration": 68, "exp": 130, "score": 95 }
  ],
  "monthlyTrends": [30 generated daily objects from 2026-05-11 to 2026-06-09 using duration = 25 + ((index * 11) % 55), exp = 40 + ((index * 17) % 120), score = 82 + ((index * 7) % 16)],
  "yearlyTrends": [12 generated month-start objects from 2025-07-01 to 2026-06-01 using duration = 600 + ((index * 137) % 520), exp = 900 + ((index * 251) % 1100), score = 84 + ((index * 5) % 13)],
  "heatmapDays": [84 generated daily objects from 2026-03-18 to 2026-06-09 using minutes = (index * 19) % 90]
}
```

Implementation note: generate the full JSON with a short Node script or careful manual expansion; the committed file must contain real arrays, not formulas or comments.

- [ ] **Step 6: Create `src/data/json/assistant.json`**

Use the four assistant messages from `src/data/mockAssistant.ts`, preserving `id`, `role`, `quickAction`, and `content`.

- [ ] **Step 7: Create `src/data/localData.ts`**

```ts
import user from './json/user.json';
import stats from './json/stats.json';
import works from './json/works.json';
import badges from './json/badges.json';
import trends from './json/trends.json';
import assistant from './json/assistant.json';
import type {
  AbilityScore,
  AssistantMessage,
  Badge,
  HeatmapDay,
  StudyMetric,
  TrendPoint,
  UserProfile,
  WorkItem,
} from '../types/domain';

export const localUser = user as UserProfile;

export const localStats = stats as {
  todayMetrics: StudyMetric[];
  abilityScores: AbilityScore[];
};

export const localWorks = works as WorkItem[];
export const localBadges = badges as Badge[];

export const localTrends = trends as {
  weeklyTrends: TrendPoint[];
  monthlyTrends: TrendPoint[];
  yearlyTrends: TrendPoint[];
  heatmapDays: HeatmapDay[];
};

export const localAssistantMessages = assistant as AssistantMessage[];
```

- [ ] **Step 8: Run verification and confirm partial progress**

Run:

```bash
npm run verify:data
```

Expected: still FAIL because source files still reference old mock exports. JSON shape errors must be fixed before continuing.

---

### Task 3: Migrate App Imports to `localData.ts`

**Files:**
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/pages/TrendsPage.tsx`
- Modify: `src/pages/WorksPage.tsx`
- Modify: `src/pages/WorkDetailPage.tsx`
- Modify: `src/pages/BadgesPage.tsx`
- Modify: `src/components/layout/AppShell.tsx`
- Modify: `src/components/assistant/AssistantPanel.tsx`

- [ ] **Step 1: Update `HomePage.tsx` imports and usage**

Replace old imports with:

```ts
import { localBadges, localStats, localTrends, localUser, localWorks } from '../data/localData';
```

Use:

```tsx
<HeroGrowthPanel user={localUser} />
<TodayOverview metrics={localStats.todayMetrics} />
<AbilityRadarCard data={localStats.abilityScores} />
<TrendPreview data={localTrends.weeklyTrends} />
<HighlightWorksCarousel works={localWorks} />
<BadgePreview badges={localBadges} />
```

- [ ] **Step 2: Update `TrendsPage.tsx` imports and usage**

Replace old trend imports with:

```ts
import { localTrends } from '../data/localData';
```

Use:

```ts
const trendData =
  period === 'week'
    ? localTrends.weeklyTrends
    : period === 'month'
      ? localTrends.monthlyTrends
      : localTrends.yearlyTrends;
```

Pass `localTrends.heatmapDays` to `LearningHeatmap`.

- [ ] **Step 3: Update `WorksPage.tsx` imports and usage**

Replace `mockWorks` import with:

```ts
import { localWorks } from '../data/localData';
```

Replace all `mockWorks` references with `localWorks`.

- [ ] **Step 4: Update `WorkDetailPage.tsx` imports and usage**

Replace `mockWorks` import with:

```ts
import { localWorks } from '../data/localData';
```

Find work with `localWorks.find(...)`.

- [ ] **Step 5: Update `BadgesPage.tsx` imports and usage**

Replace `mockBadges` import with:

```ts
import { localBadges } from '../data/localData';
```

Replace all `mockBadges` references with `localBadges`.

- [ ] **Step 6: Update `AppShell.tsx` imports and usage**

Replace `mockUser` import with:

```ts
import { localUser } from '../../data/localData';
```

Render:

```tsx
<TopNavigation user={localUser} />
```

- [ ] **Step 7: Update `AssistantPanel.tsx` imports and usage**

Replace assistant import with:

```ts
import { localAssistantMessages } from '../../data/localData';
```

Update quick action type:

```ts
 type QuickAction = NonNullable<(typeof localAssistantMessages)[number]['quickAction']>;
```

Replace `mockAssistantMessages.find(...)` with `localAssistantMessages.find(...)` and render from `localAssistantMessages`.

- [ ] **Step 8: Run typecheck**

Run:

```bash
npm run typecheck
```

Expected: PASS.

---

### Task 4: Remove Old Mock Modules and Verify Data Boundary

**Files:**
- Delete: `src/data/mockUser.ts`
- Delete: `src/data/mockStats.ts`
- Delete: `src/data/mockWorks.ts`
- Delete: `src/data/mockBadges.ts`
- Delete: `src/data/mockTrends.ts`
- Delete: `src/data/mockAssistant.ts`

- [ ] **Step 1: Delete old mock modules**

Remove the six files listed above. Keep `src/types/domain.ts` unchanged.

- [ ] **Step 2: Run local JSON data verification**

Run:

```bash
npm run verify:data
```

Expected: PASS with `Local JSON data verification passed.`

- [ ] **Step 3: Run existing boundary verification**

Run:

```bash
npm run verify:boundaries
```

Expected: PASS with `Component boundary check passed: TopNavigation receives user data via props.`

---

### Task 5: Final Verification

**Files:**
- Modify only files needed to fix verification failures.

- [ ] **Step 1: Run CSS verification**

Run:

```bash
npm run verify:css
```

Expected: PASS and built CSS contains required Tailwind utilities.

- [ ] **Step 2: Run TypeScript verification**

Run:

```bash
npm run typecheck
```

Expected: PASS.

- [ ] **Step 3: Run production build**

Run:

```bash
npm run build
```

Expected: PASS and `dist/` is produced. A Vite chunk-size warning is acceptable.

- [ ] **Step 4: Run dev server startup check**

Run:

```bash
timeout 6s npm run dev -- --host 127.0.0.1
```

Expected: Vite prints a local URL such as `http://127.0.0.1:5173/`. Exit code 124 is acceptable because `timeout` intentionally stops the server.

- [ ] **Step 5: Final source check**

Run:

```bash
npm run verify:data && npm run verify:boundaries && npm run verify:css && npm run typecheck && npm run build
```

Expected: all commands complete successfully. Report any non-blocking warnings exactly.

---

## Self-Review Results

### Spec Coverage

- JSON file structure: Tasks 2 and 4.
- Typed adapter: Task 2.
- Import migration: Task 3.
- Old mock removal: Task 4.
- Verification script: Task 1.
- Existing verification commands: Task 5.
- Phase-one exclusions: stated in the architecture and checked by final review.

### Placeholder Scan

No unresolved `TBD` or missing implementation decisions remain. The only generated-data instruction is explicit about formulas and requires the final JSON file to contain concrete arrays.

### Type Consistency

All adapter exports match the approved design: `localUser`, `localStats`, `localWorks`, `localBadges`, `localTrends`, and `localAssistantMessages`. Domain types remain in `src/types/domain.ts`.
