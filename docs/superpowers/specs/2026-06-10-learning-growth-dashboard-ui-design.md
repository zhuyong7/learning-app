# Learning Growth Dashboard UI Design

Date: 2026-06-10
Status: Approved for implementation planning

## 1. Goal

Build the first-phase front-end product prototype for the Learning Growth Dashboard: a high-fidelity, animated, multi-page React web application for parents to view a child’s learning growth, achievements, works, trends, and mock AI suggestions.

This phase prioritizes product-grade UI, animation, and mock data. It does not include Electron packaging, FastAPI integration, SQLite persistence, authentication, or real AI capabilities.

## 2. Confirmed Decisions

- Delivery mode: Vite React web app first.
- Scope: complete high-fidelity multi-page front-end prototype.
- Visual direction: clean commercial gamification, inspired by Duolingo friendliness with light Minecraft-style reward accents.
- Data: local mock data only in phase one.
- AI assistant: mock floating assistant with scripted parent-facing suggestions.
- Electron and backend: designed for later integration, not implemented in phase one.

## 3. Product Scope

### Included Pages

1. Home Growth Center
   - Hero section with animated gradient, floating clouds, playful landscape accents.
   - User growth card with avatar, nickname, level, growth value, streak, progress bar.
   - Today learning overview with animated metric cards.
   - Ability radar for listening, speaking, reading, expression, vocabulary.
   - Highlight works carousel.
   - Badge preview.
   - Growth trend preview.
   - Floating AI parent assistant entry.

2. Growth Trends
   - Week/month/year switching UI.
   - Learning duration line chart.
   - Growth value area chart.
   - GitHub-style learning heatmap.

3. Works Library
   - Search bar.
   - Filter chips.
   - Sort control.
   - Favorite state.
   - Responsive card grid or masonry-like layout.

4. Work Detail
   - Work cover and metadata.
   - Mock audio playback UI.
   - AI comment card.
   - Teacher comment card.
   - Score analysis and skill breakdown.

5. Badge Center
   - Nine-grid badge layout.
   - Earned badges with gold border, glow, and particle-like accents.
   - Locked badges with gray treatment and lock icon.
   - Badge unlock animation pattern.

6. AI Parent Assistant
   - Right-bottom floating robot entry.
   - Idle floating, breathing, and blinking-like animation.
   - Expandable chat panel.
   - Mock responses for learning analysis, weak point discovery, learning plan, weekly report.

### Excluded From Phase One

- Electron desktop packaging.
- FastAPI backend.
- SQLite/MySQL schema implementation.
- Real login and multi-user account system.
- Real AI API integration.
- Real audio playback from uploaded files.
- Production deployment pipeline.

## 4. Technical Architecture

Use a front-end-only Vite application with clear boundaries so later backend and Electron integration are straightforward.

Recommended stack:

- React 18
- TypeScript
- Vite
- TailwindCSS
- Framer Motion
- ECharts via a React wrapper or direct component wrapper
- Lucide React or equivalent icon set
- Local mock data modules

High-level structure:

```text
src/
  app/
    App.tsx
    routes.tsx
  components/
    layout/
    dashboard/
    charts/
    works/
    badges/
    assistant/
    ui/
  data/
    mockUser.ts
    mockStats.ts
    mockWorks.ts
    mockBadges.ts
    mockTrends.ts
    mockAssistant.ts
  pages/
    HomePage.tsx
    TrendsPage.tsx
    WorksPage.tsx
    WorkDetailPage.tsx
    BadgesPage.tsx
  types/
    domain.ts
  styles/
    globals.css
```

## 5. Component Design

### Layout Components

- `AppShell`: page frame, max width, background layers, navigation.
- `TopNavigation`: brand, section shortcuts, user chip.
- `PageTransition`: Framer Motion wrapper for route transitions.
- `FloatingParticles`: lightweight decorative background particles.

### Dashboard Components

- `HeroGrowthPanel`: animated hero and user growth information.
- `MetricCard`: reusable animated statistic card.
- `TodayOverview`: learning duration, completed tasks, average score, growth value.
- `AbilityRadarCard`: ECharts radar visualization.
- `HighlightWorksCarousel`: horizontal work cards with hover effects.
- `BadgePreview`: selected badges with earned/locked states.
- `TrendPreview`: compact chart preview linking to the trend page.

### Chart Components

- `AbilityRadarChart`
- `LearningLineChart`
- `GrowthAreaChart`
- `LearningHeatmap`

Each chart receives typed data props and does not import mock data directly.

### Works Components

- `WorksToolbar`: search/filter/sort controls.
- `WorkCard`: cover, title, score, completion time, favorite state.
- `WorkDetailHeader`: work title, cover, score summary.
- `AudioPlayerMock`: styled mock playback controls.
- `ReviewCard`: AI and teacher review content.
- `ScoreBreakdown`: score bars by ability.

### Badge Components

- `BadgeGrid`
- `BadgeCard`
- `UnlockCelebration`

### Assistant Components

- `AssistantBubble`: floating robot entry.
- `AssistantPanel`: expandable chat panel.
- `SuggestionCard`: quick action suggestions.
- `MockConversation`: scripted assistant messages.

## 6. Data Flow

All data comes from local mock modules in phase one.

- Page components import mock data from `src/data`.
- Reusable components receive data via props.
- UI interaction state stays local to components unless shared across page sections.
- Search, filter, sort, tab switching, favorite toggles, chat expansion, and animation triggers are handled client-side.

Domain types should be defined once in `src/types/domain.ts`, including:

- `UserProfile`
- `StudyMetric`
- `AbilityScore`
- `WorkItem`
- `Badge`
- `TrendPoint`
- `HeatmapDay`
- `AssistantMessage`

This keeps later FastAPI integration simple: mock modules can be replaced with API calls without rewriting presentation components.

## 7. Visual System

### Color Tokens

Use PRD colors as Tailwind-oriented design tokens:

- Primary green: `#4ADE80`
- Secondary blue: `#60A5FA`
- Warning yellow: `#FBBF24`
- Danger pink: `#FB7185`
- Background: `#F8FAFC`

### Style Rules

- Main cards: large rounded corners around 24px.
- Secondary cards: rounded corners around 16px.
- Use soft shadows, gradient borders, and glassmorphism sparingly.
- 8px spacing rhythm.
- Child-friendly but parent-readable typography hierarchy.
- Minecraft accents appear as small cube motifs, experience orbs, achievement decorations, and badge effects, not as the entire layout language.

## 8. Animation Design

Use Framer Motion for UI motion:

- Page entry fade/slide.
- Cards rise in with stagger.
- Metric numbers count up visually.
- User growth card gently floats.
- Experience orbs fly toward the growth progress bar on page load or task-complete simulation.
- Highlight work cards scale to 1.05 on hover with glow.
- Earned badges shimmer or pulse lightly.
- Badge unlock celebration uses scale, radial glow, confetti-like particles, and then settles.
- AI assistant bubble floats and breathes.

Animations should feel polished and light, not distracting. Respect performance by limiting infinite animations to small decorative elements.

## 9. Error, Empty, and Loading States

Even with mock data, include product-ready states where useful:

- Empty works result after filtering/searching.
- Locked badge state.
- No trend data fallback card.
- Assistant mock typing state.
- Chart container fallback if data array is empty.

Because phase one has no network, there are no real API error states yet. Components should still be structured so future API loading/error states can be added.

## 10. Testing and Verification

Phase one verification should include:

- Install dependencies successfully.
- Start Vite dev server successfully.
- Build production bundle successfully.
- TypeScript check passes.
- Manual browser verification of all pages.
- Verify key interactions:
  - Route navigation.
  - Search/filter/sort in works library.
  - Work detail navigation.
  - Trend tabs.
  - Badge unlock animation trigger.
  - AI assistant open/close and mock conversation.
  - Responsive layout at desktop and narrow widths.

Automated tests are optional in this first prototype unless the implementation plan adds a lightweight smoke test.

## 11. Implementation Boundaries

The implementation should avoid overbuilding backend-like abstractions. It should still keep components clean and typed.

Do:

- Build the complete multi-page high-fidelity front-end.
- Use typed mock data.
- Create reusable components for cards, charts, badges, works, and assistant.
- Make the UI visually close to a commercial education product.
- Keep future Electron/FastAPI integration possible.

Do not:

- Add real backend services in phase one.
- Add real AI API calls in phase one.
- Add database code in phase one.
- Spend time on authentication.
- Create placeholder-only pages when a high-fidelity page is in scope.

## 12. Acceptance Criteria

The phase-one work is complete when:

1. The project can be installed, run, and built locally.
2. The app opens to a polished home growth dashboard.
3. The visual direction matches clean commercial gamification with light Minecraft-style reward accents.
4. All scoped pages exist and are navigable.
5. Mock data powers all visible product sections.
6. Charts render for ability analysis and growth trends.
7. Motion effects are present for hero, cards, metrics, badges, works, and assistant.
8. Works library search/filter/sort interactions work locally.
9. Work detail page shows mock recording, AI review, teacher review, and score analysis.
10. Badge center shows earned and locked badges with visual differentiation and an unlock animation.
11. AI assistant floats in the lower-right corner and opens a mock chat panel.
12. No phase-two backend, Electron, database, or real AI work is required for acceptance.
