# Local JSON Data Source Design

Date: 2026-06-11
Status: Approved for implementation planning

## 1. Goal

Replace the current TypeScript mock data modules with local JSON files stored inside the project, while keeping the phase-one React web app front-end-only and preserving the current UI behavior.

The app will no longer use `mockUser`, `mockWorks`, `mockBadges`, `mockTrends`, `mockStats`, or `mockAssistant` as TypeScript data modules. Instead, it will load the same data from project-local `.json` files through a typed data adapter.

## 2. Confirmed Decision

Use project-local JSON files as a read-only data source for the current Vite React web prototype.

This means:

- Data lives in the project as JSON files.
- The browser reads bundled JSON data through Vite JSON imports.
- UI interactions such as filtering, sorting, opening assistant messages, and playing mock audio remain client-side state.
- Browser interactions do not write back to the JSON files.
- No backend, Electron main process, file-writing API, database, or real AI API is introduced for this change.

## 3. Data File Structure

Create this directory:

```text
src/data/json/
```

Create these JSON files:

```text
src/data/json/user.json
src/data/json/stats.json
src/data/json/works.json
src/data/json/badges.json
src/data/json/trends.json
src/data/json/assistant.json
```

Each file stores one clear data domain:

- `user.json`: one `UserProfile` object.
- `stats.json`: an object containing `todayMetrics` and `abilityScores`.
- `works.json`: an array of `WorkItem` objects.
- `badges.json`: an array of `Badge` objects.
- `trends.json`: an object containing `weeklyTrends`, `monthlyTrends`, `yearlyTrends`, and `heatmapDays`.
- `assistant.json`: an array of `AssistantMessage` objects.

## 4. Typed Data Adapter

Create a single TypeScript adapter:

```text
src/data/localData.ts
```

Its job is to import JSON files and expose typed constants to the rest of the app.

Expected exports:

```ts
export const localUser: UserProfile;
export const localStats: {
  todayMetrics: StudyMetric[];
  abilityScores: AbilityScore[];
};
export const localWorks: WorkItem[];
export const localBadges: Badge[];
export const localTrends: {
  weeklyTrends: TrendPoint[];
  monthlyTrends: TrendPoint[];
  yearlyTrends: TrendPoint[];
  heatmapDays: HeatmapDay[];
};
export const localAssistantMessages: AssistantMessage[];
```

This keeps JSON paths isolated from pages and components. If a later phase replaces JSON with API calls, only the data adapter and page data-loading layer should need to change.

## 5. Import Migration

Replace current mock imports with `localData.ts` exports.

Files to update:

- `src/pages/HomePage.tsx`
- `src/pages/TrendsPage.tsx`
- `src/pages/WorksPage.tsx`
- `src/pages/WorkDetailPage.tsx`
- `src/pages/BadgesPage.tsx`
- `src/components/layout/AppShell.tsx`
- `src/components/assistant/AssistantPanel.tsx`

Mapping:

| Current | New |
| --- | --- |
| `mockUser` | `localUser` |
| `todayMetrics` | `localStats.todayMetrics` |
| `abilityScores` | `localStats.abilityScores` |
| `mockWorks` | `localWorks` |
| `mockBadges` | `localBadges` |
| `weeklyTrends` | `localTrends.weeklyTrends` |
| `monthlyTrends` | `localTrends.monthlyTrends` |
| `yearlyTrends` | `localTrends.yearlyTrends` |
| `heatmapDays` | `localTrends.heatmapDays` |
| `mockAssistantMessages` | `localAssistantMessages` |

## 6. Old Mock Module Handling

Remove the old TypeScript mock data modules after their data has been moved to JSON:

```text
src/data/mockUser.ts
src/data/mockStats.ts
src/data/mockWorks.ts
src/data/mockBadges.ts
src/data/mockTrends.ts
src/data/mockAssistant.ts
```

The domain types stay in:

```text
src/types/domain.ts
```

## 7. Verification Script

Create:

```text
scripts/verify-local-json-data.mjs
```

The script should verify:

1. All required JSON files exist.
2. Each JSON file parses successfully.
3. Required top-level shapes are present:
   - `stats.todayMetrics` and `stats.abilityScores` are arrays.
   - `trends.weeklyTrends`, `trends.monthlyTrends`, `trends.yearlyTrends`, and `trends.heatmapDays` are arrays.
   - `works`, `badges`, and `assistant` are arrays.
4. No source file imports from `src/data/mock*.ts`.
5. No source file references old mock export names such as `mockUser` or `mockWorks`.

Add package script:

```json
"verify:data": "node scripts/verify-local-json-data.mjs"
```

## 8. Error and Edge Behavior

Because JSON imports are bundled at build time, malformed JSON should fail during verification or build rather than at runtime.

The UI should keep its existing empty states and fallback behavior:

- Works page still handles no matching results.
- Work detail still handles invalid IDs.
- Charts still handle empty arrays.
- Assistant still opens even if only initial scripted messages are available.

## 9. Testing and Verification

Run these commands after implementation:

```bash
npm run verify:data
npm run verify:boundaries
npm run verify:css
npm run typecheck
npm run build
```

Expected results:

- All commands exit with code 0.
- UI build output remains styled with Tailwind utilities.
- No `mock*.ts` data modules are imported by source files.
- Data visible in the app is supplied by local JSON files through `localData.ts`.

## 10. Out of Scope

This change does not implement writable JSON persistence.

Not included:

- Writing browser changes back to project JSON files.
- Local Node API server.
- FastAPI integration.
- Electron file-system write integration.
- SQLite or other database storage.
- Authentication.
- Real AI assistant calls.

Writable persistence can be added later as a separate backend/Electron task.

## 11. Acceptance Criteria

The change is complete when:

1. The six JSON files exist under `src/data/json/`.
2. `src/data/localData.ts` exposes typed local data exports.
3. Pages and assistant/layout components use `localData.ts` instead of old mock modules.
4. Old `src/data/mock*.ts` modules are removed.
5. `npm run verify:data` passes.
6. Existing verification commands still pass: `verify:css`, `verify:boundaries`, `typecheck`, and `build`.
7. No backend, database, Electron, auth, or real AI functionality is introduced.
