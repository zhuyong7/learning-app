# 技术方案：将 study-plan-app 家长端任务创建 / 孩子端完成任务功能整合到 learning-app

## 一、背景与目标

| 项目 | 路径 | 现状 |
|------|------|------|
| **learning-app** | `F:\vs-project\learning-app` | React 18 + TypeScript + TailwindCSS 前端原型。已有成长中心（Hero/EXP/等级/Streak）、作品库、徽章中心、数据图表、AI 助手面板。无后端、无数据库、无认证。所有数据来自 `src/data/json/` 的 Mock JSON。 |
| **study-plan-app** | `F:\vs-project\study-plan-app` | Vue 3 + Element Plus + Electron + FastAPI。完整实现了：家长端创建任务（单日 / 一周批量）、孩子端点击打卡、金币系统、金币市场（兑换奖励）、成就徽章。数据存储为 JSON 文件。 |

**目标**：将 study-plan-app 的核心业务逻辑（家长创建任务 → 孩子执行任务 → 金币 / 成就反馈）整合到 learning-app 中，使 learning-app 成为一个完整的、有后端支持的儿童学习成长仪表盘。

---

## 二、两个项目的架构对比

| 维度 | learning-app | study-plan-app |
|------|-------------|----------------|
| 前端框架 | React 18 + JSX + TypeScript | Vue 3 + SFC + JavaScript |
| UI 库 | TailwindCSS 手写组件 | Element Plus |
| 路由 | React Router DOM（5 页） | 单页 SPA，无路由 |
| 状态管理 | 无（直接 import JSON） | 无（ref() 在 App.vue 中） |
| 后端 | **无** | FastAPI + JSON 文件存储 |
| 桌面端 | **无** | Electron |
| 认证 | **无** | X-User-Name header，admin/child 角色 |
| 数据持久化 | `src/data/json/*.json` (Mock) | `backend/data/{plans,rewards}.json` |
| 动画 | Framer Motion | CSS 动画 |
| 图表 | Apache ECharts | 无 |

---

## 三、整合策略

### 3.1 整体方向

```
learning-app (目标形态)
┌──────────────────────────────────────────────────────────┐
│  React 18 + TypeScript + TailwindCSS + Framer Motion     │
│  + React Router (新增 /tasks 路由)                        │
│  + 后端：FastAPI + SQLAlchemy + SQLite (从 JSON 文件升级)  │
│  + 桌面端：Electron (从 study-plan-app 迁移)               │
└──────────────────────────────────────────────────────────┘
```

**核心原则**：
1. **保留 learning-app 作为主工程** — 它的 React + Tailwind 架构更现代、组件化更好
2. **复用 study-plan-app 的业务逻辑** — 后端 API 设计、数据模型、任务创建/打卡流程
3. **不照搬代码** — study-plan-app 是 Vue 代码，learning-app 是 React 代码，需重构为 React 组件
4. **后端从 JSON 文件升级** 到 SQLAlchemy + SQLite（符合 learning-app 的 PRD 规划）
5. **视觉风格对齐** — learning-app 已有游戏化视觉（Minecraft/Duolingo 风格），任务卡片等 UI 用 TailwindCSS 实现，不引入 Element Plus

### 3.2 功能范围

| 功能模块 | 来源 | 在 learning-app 中的体现 |
|---------|------|---------------------|
| 家长登录（admin 角色） | study-plan-app | 新增登录页，区分 admin / child |
| 孩子登录（child 角色） | study-plan-app | 新增登录页 |
| 家长创建单日任务 | study-plan-app | 新增 `/tasks` 页面家长视图 |
| 家长创建一周批量任务 | study-plan-app | 新增一周创建器组件 |
| 孩子打卡完成任务 | study-plan-app | 新增 `/tasks` 页面孩子视图 |
| 金币系统（赚 / 花） | study-plan-app | 集成到已有 HeroGrowthPanel（EXP 旁增加金币显示） |
| 金币市场（兑换奖励） | study-plan-app | 新增 `/rewards` 页面（可融入现有 Works/Badges 路由） |
| 成就系统 | 学习-plan-app + learning-app 融合 | 已有 Badge 系统 + 打卡徽章合并 |
| 周/月进度图表 | 已有 | 打卡数据接入已有 ECharts 图表 |

---

## 四、详细实施方案

### Phase 1：后端基础设施（1-2 周）

#### 4.1.1 项目结构

```
learning-app/
├── backend/                          # 新建
│   ├── main.py                       # FastAPI 入口
│   ├── requirements.txt              # fastapi, uvicorn, sqlalchemy, aiosqlite
│   ├── database.py                   # SQLAlchemy engine/session
│   ├── models/                       # ORM 模型
│   │   ├── __init__.py
│   │   ├── user.py                   # User 模型
│   │   ├── task.py                   # Task / DayPlan 模型
│   │   ├── reward.py                 # Reward / Redemption 模型
│   │   └── achievement.py            # Achievement 模型
│   ├── schemas/                      # Pydantic 请求/响应模型
│   │   ├── __init__.py
│   │   ├── auth.py                   # Login 请求/响应
│   │   ├── task.py                   # Task 创建/更新/响应
│   │   ├── reward.py                 # Reward/Redemption 响应
│   │   └── common.py                 # 通用响应结构
│   ├── api/                          # 路由
│   │   ├── __init__.py
│   │   ├── auth.py                   # POST /api/auth/login
│   │   ├── tasks.py                  # 任务 CRUD + 打卡
│   │   ├── rewards.py                # 市场 + 兑换
│   │   └── stats.py                  # 统计数据（供图表使用）
│   ├── services/                     # 业务逻辑
│   │   ├── __init__.py
│   │   ├── task_service.py           # 任务创建/打卡逻辑
│   │   └── reward_service.py         # 金币增减/兑换逻辑
│   └── data/                         # 迁移用初始数据
│       └── seed.py                   # 种子数据初始化
```

#### 4.1.2 核心数据模型

```python
# models/user.py
class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(unique=True, index=True)  # "admin", "child", "xiaoming"
    role: Mapped[str] = mapped_column()  # "parent" | "child"
    child_name: Mapped[str] = mapped_column(nullable=True)  # 孩子昵称
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())

# models/task.py
class DayPlan(Base):
    __tablename__ = "day_plans"
    id: Mapped[int] = mapped_column(primary_key=True)
    date: Mapped[str] = mapped_column(unique=True, index=True)  # "2026-06-15"
    tasks: Mapped[list] = mapped_column(JSON)  # JSON array of Task objects

class Task(Base):
    # 嵌入在 DayPlan.tasks JSON 中，也可独立表
    id: int
    name: str
    done: bool
    coins: int
    reward_claimed_by: list[str]  # JSON array

# models/reward.py
class RewardStore(Base):
    __tablename__ = "reward_store"
    id: Mapped[int] = mapped_column(primary_key=True)
    balances: Mapped[dict] = mapped_column(JSON)  # {username: coin_count}
    market: Mapped[list] = mapped_column(JSON)  # MarketReward array
    redemptions: Mapped[list] = mapped_column(JSON)  # Redemption array

class MarketReward(Base):
    id: int
    name: str
    cost: int
    built_in: bool

class Redemption(Base):
    id: int
    user_name: str
    reward_name: str
    cost: int
    redeemed_at: datetime
```

**设计决策**：初期沿用 study-plan-app 的 JSON 字段存储方式（`tasks` 和 `market/redemptions` 存为 JSON 列），降低迁移成本。后续可按需将 Task 拆分为独立表。

#### 4.1.3 核心 API 设计

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| `POST` | `/api/auth/login` | 用户名登录，返回 `{ token, username, role }` | 公开 |
| `GET` | `/api/plans/{date}` | 获取某日任务 | 登录 |
| `POST` | `/api/plans/{date}/tasks` | 创建任务 | admin/parent |
| `PATCH` | `/api/plans/{date}/tasks/{id}` | 打卡（done toggle） | 登录（仅当天可打卡） |
| `DELETE` | `/api/plans/{date}/tasks/{id}` | 删除任务 | admin/parent |
| `PUT` | `/api/week/{date}` | 批量更新一周 | admin/parent |
| `GET` | `/api/week/{date}` | 获取一周计划 | 登录 |
| `GET` | `/api/rewards/{username}` | 获取金币信息和市场 | 登录 |
| `POST` | `/api/rewards/redeem` | 兑换奖励 | child |
| `POST` | `/api/rewards/market` | 添加自定义奖励 | admin/parent |
| `DELETE` | `/api/rewards/market/{id}` | 删除自定义奖励 | admin/parent |
| `GET` | `/api/stats/overview` | 成长统计数据（集成到 Dashboard） | 登录 |

#### 4.1.4 Electron 集成

从 study-plan-app 的 `electron/main.js` 复制并修改：
- 同时启动 Vite 开发服务器（`http://localhost:5173`）和 FastAPI 服务器（`http://localhost:8000`）
- 修改端口配置以匹配 learning-app

---

### Phase 2：前端新增模块（1-2 周）

#### 4.2.1 新增路由

在 `src/app/routes.tsx` 中新增：

```
/tasks          → TaskCenterPage（家长视图 / 孩子视图 自动切换）
/rewards        → RewardMarketPage（金币市场）
/login          → LoginPage（登录/切换用户）
```

#### 4.2.2 新增目录结构

```
learning-app/src/
├── api/                          # 新建 — API 客户端
│   ├── client.ts                 # fetch wrapper + auth header
│   ├── auth.ts                   # login/logout
│   ├── tasks.ts                  # task CRUD + checkin
│   ├── rewards.ts                # market + redeem
│   └── stats.ts                  # stats fetch
├── hooks/                        # 新建 — 自定义 hooks
│   ├── useAuth.ts                # 用户认证状态
│   ├── useTasks.ts               # 任务数据获取 + 操作
│   ├── useRewards.ts             # 金币 + 市场数据
│   └── useWeekPlan.ts            # 一周计划操作
├── pages/
│   ├── LoginPage.tsx              # 新建 — 登录页
│   ├── TaskCenterPage.tsx         # 新建 — 任务中心
│   └── RewardMarketPage.tsx       # 新建 — 金币市场
└── components/
    ├── task/                      # 新建 — 任务相关组件
    │   ├── TaskCard.tsx           # 任务卡片（家长/孩子不同交互）
    │   ├── TaskCreateForm.tsx     # 家长任务创建表单
    │   ├── PresetTaskChips.tsx    # 预设任务快选按钮组
    │   ├── WeekPlanEditor.tsx     # 一周创建器（7 日编辑）
    │   └── WeekProgressSidebar.tsx # 周进度侧边栏
    ├── reward/                    # 新建 — 奖励相关组件
    │   ├── CoinBadge.tsx          # 金币计数徽章
    │   ├── CoinStepper.tsx        # 金币选择器（从 study-plan-app 移植）
    │   ├── RewardTicket.tsx       # 奖励兑换券卡片
    │   └── RedemptionHistory.tsx  # 兑换记录
    └── auth/                      # 新建 — 认证相关
        ├── RoleSelector.tsx       # 角色切换按钮
        └── PermissionGate.tsx     # 基于角色的权限控制组件
```

#### 4.2.3 关键组件设计

##### LoginPage.tsx

```tsx
// 风格：卡通天空背景（复用 learning-app 的渐变风格）
// 功能：输入用户名 + 选择角色（家长/孩子）→ 登录
// 登录成功后跳转到 /tasks（家长）或 /tasks（孩子，自动切换视图）
// 登录后用户名存入 localStorage + API client 自动携带 token
```

##### TaskCenterPage.tsx

```tsx
// 根据 useAuth() 返回的用户角色自动切换视图：
//
// 家长视图 (admin):
//   - 顶部：日期选择器
//   - 预设任务快选区（PresetTaskChips，11 个预设）
//   - 自定义任务输入区 + 金币选择器
//   - 任务列表（带删除按钮）
//   - 一周创建器（WeekPlanEditor）
//
// 孩子视图 (child):
//   - 顶部：日期选择器 + 今日标识
//   - 任务卡片列表（点击打卡，非今日显示锁定）
//   - 打卡动画（Framer Motion 弹跳/闪光）
//   - 侧边栏：周进度 + 成就徽章
//   - 金币徽章（点击跳转 /rewards）
```

##### TaskCard.tsx

```tsx
// 基于 learning-app 已有的游戏化风格
// 家长模式：显示删除按钮，hover 效果
// 孩子模式：
//   - 今日：点击 → 打卡动画 → 金币 +N 弹出
//   - 非今日：灰色锁定图标 + "仅当天可打卡" 提示
//   - 已完成：绿色渐变 + "🟫✨ 完成" + shine 动画
// 动画：Framer Motion spring 弹跳
```

##### WeekPlanEditor.tsx

```tsx
// 从 study-plan-app 的"一周创建器"移植
// 通用任务 textarea → "复制到整周"按钮 → 7 天独立 textarea 网格
// 支持 "任务名 | 金币" 格式解析
// TailwindCSS grid 布局，卡通风格
```

---

### Phase 3：与现有成长中心融合（1 周）

#### 4.3.1 数据融合

| 现有数据 | 新增数据 | 融合方式 |
|---------|---------|---------|
| `UserProfile` (EXP/等级/Streak) | 打卡记录 | Streak 基于连续打卡天数自动计算 |
| `StudyMetric` (今日 4 个指标) | 新增"已打卡任务数" | `tasks_completed` 接入打卡 API |
| `Badge` (徽章) | 打卡成就徽章 | 将 study-plan-app 的 ⭐/🏅/🏆 徽章合并到现有 9 徽章系统 |
| `WorkItem` (作品) | 无直接关联 | 可选：任务完成后自动关联一个"作品"记录 |
| `TrendPoint` (趋势图) | 打卡时间序列 | 趋势图接入真实打卡数据 |

#### 4.3.2 HeroGrowthPanel 改造

在当前的 EXP/等级/连续打卡旁增加：
```
[🪙 25 金币] [🔥 32 天连续] [⭐ Lv.15]
```
点击金币数字跳转到 `/rewards`。

#### 4.3.3 TodayOverview 改造

4 个指标卡新增/改造：
1. **今日学习时长** — 保持（从学习记录获取）
2. **完成任务数** — 新增（从 `/api/plans/{today}` 获取）
3. **获得金币** — 新增（从今日打卡累计）
4. **综合评分** — 保持（从 stats 获取）

#### 4.3.4 图表数据对接

- `GrowthAreaChart` — EXP 趋势从后端 `/api/stats/exp-trend` 获取真实打卡数据
- `LearningHeatmap` — 打卡热力图从 `/api/stats/heatmap` 获取
- `AbilityRadarChart` — 能力雷达图可基于不同类型任务的完成质量计算

---

### Phase 4：桌面端打包（0.5-1 周）

从 study-plan-app 迁移 Electron 配置：
- 修改 `package.json` scripts 启动后端 + Vite
- 修改 `electron/main.js` 指向正确端口
- 添加生产构建脚本

---

## 五、数据迁移策略

### 5.1 从 study-plan-app JSON 到 SQLite

```python
# backend/data/seed.py
def migrate_from_json():
    """从 study-plan-app 的 plans.json 和 rewards.json 迁移数据"""
    plans = load_plans_json()   # {date: DayPlan}
    rewards = load_rewards_json()  # RewardStore
    
    for date, day_plan in plans.items():
        upsert_day_plan(date, day_plan.tasks)
    
    upsert_reward_store(rewards)
```

### 5.2 从 learning-app Mock JSON 到真实数据

```python
def migrate_mock_data():
    """从 learning-app 的 src/data/json/ 导入初始 Mock 数据"""
    import user.json, stats.json, works.json, badges.json
    
    # 创建默认 child 账户
    create_default_user(child_name="南南")
    
    # 导入初始作品、徽章、统计数据
    seed_initial_works()
    seed_initial_badges()
```

---

## 六、技术决策总结

| 决策 | 选择 | 理由 |
|------|------|------|
| 前端框架 | **保留 React** (learning-app) | 组件化更好、TypeScript 支持更成熟、与学习成长 Dashboard 现有架构一致 |
| UI 库 | **保留 TailwindCSS** | 已有 40+ 手写组件，风格统一（游戏化/Minecraft），不引入 Element Plus |
| 动画库 | **保留 Framer Motion** | 已有完整动画体系（页面过渡、粒子、徽章解锁），比 CSS 动画更灵活 |
| 后端框架 | **FastAPI** (从 study-plan-app 迁移) | 已有完整 API 设计，Python 开发快，与 PRD 规划一致 |
| 数据库 | **SQLAlchemy + SQLite** | PRD 规划、轻量、无需运维，桌面端场景合适 |
| 认证方式 | **JWT Token** (从 header 用户名升级) | 更安全，支持多设备、密码登录未来扩展 |
| 桌面端 | **Electron** (从 study-plan-app 迁移) | 已有实现，可直接移植 |
| 状态管理 | **React Query (TanStack Query)** | 替代直接 import JSON，自动处理缓存/同步/重试 |
| 图表 | **保留 ECharts** | 已有完整图表组件库 |

---

## 七、实施顺序与里程碑

```
Week 1-2:  Phase 1 — 后端基础设施
           ├── FastAPI + SQLAlchemy + SQLite 搭建
           ├── 数据模型 + ORM
           ├── API 路由（任务 CRUD + 打卡 + 市场）
           └── 数据迁移脚本

Week 3-4:  Phase 2 — 前端任务模块
           ├── API 客户端 + React Query hooks
           ├── 登录页 + 角色切换
           ├── 任务中心页面（家长视图 + 孩子视图）
           ├── 任务卡片 + 打卡动画
           └── 一周创建器

Week 5:    Phase 2.5 — 金币市场
           ├── 金币市场页面
           ├── 兑换流程
           └── 兑换记录

Week 6:    Phase 3 — 与成长中心融合
           ├── Hero 面板增加金币显示
           ├── TodayOverview 新增打卡指标
           ├── 图表数据接入真实 API
           └── 成就徽章融合

Week 7:    Phase 4 — 桌面端 + 打磨
           ├── Electron 集成
           ├── 生产构建
           └── 端到端测试 + Bug 修复
```

---

## 八、风险与注意事项

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| 视觉风格差异 | study-plan-app 卡通风 vs learning-app 游戏化风 | 统一设计系统，以 learning-app 风格为准 |
| 技术栈差异 | Vue vs React | 不移植 Vue 代码，只提取业务逻辑重新实现为 React 组件 |
| 数据格式变化 | JSON 文件 → SQLite JSON 列 | 迁移脚本处理，初期保持向后兼容 |
| 状态管理复杂度 | 从无状态 import → 有 API 调用 | 使用 React Query，提供 optimistic update 保持流畅体验 |
| Electron 打包 | 需要同时打包 Node 前端 + Python 后端 | 使用 electron-builder + PyInstaller 方案，已有先例 |
| 多孩子支持 | 当前 hardcode "child" | 数据库设计支持多孩子，但 Phase 1-2 先硬编码一个孩子 |

---

## 九、MVP 范围（最小可用版本）

如果时间紧张，可分两步走：

**MVP v1（2-3 周）**：
- ✅ 后端 API（任务 CRUD + 打卡 + JWT 认证）
- ✅ 登录页 + 角色切换
- ✅ 任务中心页面（家长创建 + 孩子打卡）
- ✅ 与现有 Hero 面板集成（显示金币数）

**MVP v2（+2 周）**：
- ✅ 一周批量创建
- ✅ 金币市场（兑换/记录）
- ✅ 图表数据接入
- ✅ Electron 桌面端打包
