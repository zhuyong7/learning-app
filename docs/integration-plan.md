# Learning App + Study Plan App 集成技术方案

## 一、现状对比

| 维度 | learning-app（学习成长看板） | study-plan-app（学习计划） |
|------|---------------------------|--------------------------|
| 前端 | React 18 + Vite + Tailwind CSS | Vue 3 + Vite + Element Plus |
| 后端 | 无（纯静态 JSON 数据） | FastAPI + JSON 文件存储 |
| 打包 | Web 应用 | Electron 桌面应用 |
| 用户模型 | 单个硬编码用户"南南" | 基于 `X-User-Name` 请求头 + localStorage 的角色认证（admin=家长，其他=孩子） |
| 核心功能 | 学习成长数据可视化、徽章系统、作品展示 | 家长创建任务、孩子打卡完成、金币奖励体系 |

## 二、目标

在一个统一的应用中同时提供：
1. **家长端**：登录 → 创建/管理学习任务 → 查看孩子完成情况
2. **孩子端**：登录 → 查看自己的任务 → 打卡完成 → 获得金币 → 兑换奖励
3. **新增**：学习成长看板（学习时长、能力雷达图、成长趋势等可视化）

## 三、方案选择

### 方案概要：合并到一个 React 项目，统一后端

选择将 **study-plan-app 的 Vue 前端和 FastAPI 后端功能移植到 learning-app（React）项目中**，理由：
- learning-app 的前端框架（React）生态更活跃，与学习看板的设计一致
- 合并到一个项目减少维护成本
- FastAPI 后端可复用于两个场景

### 整体架构

```
┌─────────────────────────────────────────────┐
│              React SPA (Vite)                │
│  ┌──────────┐  ┌──────────┐  ┌────────────┐ │
│  │ 家长端页面 │  │ 孩子端页面 │  │ 成长看板   │ │
│  │ (创建任务 │  │ (打卡/   │  │ (雷达/趋势) │ │
│  │ 管理任务) │  │ 金币市场) │  │            │ │
│  └──────────┘  └──────────┘  └────────────┘ │
│          │              │            │       │
│          └──────────────┴────────────┘       │
│                    │                         │
└────────────────────┼─────────────────────────┘
                     │ HTTP (fetch)
                     ▼
┌─────────────────────────────────────────────┐
│         FastAPI Backend (Python)             │
│  ┌────────────┐  ┌───────────┐  ┌────────┐  │
│  │ User/Auth  │  │  Task API │  │Reward  │  │
│  │ 管理       │  │ 任务 CRUD │  │ 管理   │  │
│  └────────────┘  └───────────┘  └────────┘  │
│                    │                         │
│              ┌─────┴─────┐                   │
│              │ JSON File  │                   │
│              │  存储       │                   │
│              └────────────┘                   │
└─────────────────────────────────────────────┘
```

## 四、具体实施步骤

### 阶段一：搭建后端（FastAPI + 认证升级）

**关键文件**：从 study-plan-app 移植 `backend/main.py`，并做以下改造：

1. **升级认证方式**
   - 当前方案：`X-User-Name` 请求头，纯字符串身份，无密码
   - 改造方案：保留简单的账号密码认证（适合家庭使用场景）
   - 实现：
     - `POST /api/auth/login` — 提交用户名密码，返回 `{ user_name, role, token }`
     - 用户数据存储到 `backend/data/users.json`
     - 预置两个默认账号：`admin`（家长，密码可配置）和 `child`（孩子）
     - 后续请求使用 `Authorization: Bearer <token>` 头（简单 JWT 或 session token）

2. **扩展数据模型**
   - 保留 study-plan-app 的 Task、DayPlan、WeekPlan、MarketReward、Redemption
   - 新增学习数据模型（从 learning-app 移植）：
     ```
     - StudyRecord: { date, duration, exp, score }
     - AbilityScore: { key, label, value, max }
     - WorkItem: { id, title, type, cover, score, duration, completedAt }
     - Badge: { id, name, description, icon, earned, rarity }
     ```
   - 打卡完成时自动生成 StudyRecord，驱动成长看板数据

3. **新增/改造 API**
   ```
   保留 study-plan-app 的：
   - GET    /api/plans/{date}           获取某日任务
   - GET    /api/week/{date}            获取一周计划
   - POST   /api/plans/{date}/tasks      创建任务（家长）
   - PATCH  /api/plans/{date}/tasks/{id} 打卡（孩子）
   - DELETE /api/plans/{date}/tasks/{id} 删除任务（家长）
   - PUT    /api/week/{date}             周计划替换（家长）
   - GET    /api/rewards/{user_name}     获取金币/市场
   - POST   /api/rewards/redeem          兑换奖励
   - POST   /api/rewards/market          添加自定义奖励（家长）
   - DELETE /api/rewards/market/{id}     删除自定义奖励（家长）

   新增：
   - POST   /api/auth/login              登录认证
   - GET    /api/child/{user_name}       获取孩子成长数据
   - POST   /api/records                 记录学习数据（打卡时自动触发）
   - GET    /api/badges/{user_name}      获取徽章列表
   ```

4. **配置文件**
   - `backend/requirements.txt` 新增：`pyjwt`、`passlib`（哈希密码）
   - `backend/data/users.json` — 用户存储

### 阶段二：改造前端 React 项目

1. **目录结构调整**
   ```
   src/
     app/
       App.tsx              — 保留，修改路由
       routes.tsx           — 新增家长端/孩子端路由
     auth/                  — 新增
       LoginScreen.tsx      — 登录页面（切换家长/孩子模式）
       AuthContext.tsx      — 新增，认证状态管理
       api.ts               — 新增，封装所有 API 调用
     pages/
       parent/              — 新增，家长端页面
         TaskCreatePage.tsx — 创建任务（移植 study-plan-app 的 add-task-panel）
         WeekCreatePage.tsx — 周计划创建（移植一周创建器）
         TaskListPage.tsx   — 查看/管理任务列表
         RewardMarketPage.tsx — 金币市场管理（查看/添加/删除奖励）
       child/               — 新增，孩子端页面
         TaskCheckinPage.tsx — 任务打卡（移植 study-plan-app 的打卡卡片）
         RewardMarketPage.tsx — 金币市场（移植金币市场兑换）
       dashboard/           — 保留，家长端查看成长数据
       trends/              — 保留
       works/               — 保留
       badges/              — 保留
     data/                  — 保留，初期仍用 mock 数据
     types/
       domain.ts            — 合并 study-plan-app 的类型
       plan.ts              — 新增，学习任务相关类型
   ```

2. **用户认证实现**
   - 新增 `AuthContext.tsx` — 用 React Context 管理当前用户（用户名、角色、token）
   - 新增 `LoginScreen.tsx` — 简单的登录表单，下拉选择"家长登录"/"孩子登录"，输入用户名
   - 登录成功后，根据角色路由到不同页面
   - token 存 localStorage，请求时自动带上 `Authorization` 头

3. **UI 风格统一**
   - 全部使用 Tailwind CSS（learning-app 已用，放弃 Element Plus）
   - 复用 learning-app 的 `components/ui/` 按钮、卡片等组件
   - 配色沿用 learning-app 的设计系统（绿色主色调）
   - 动画效果保留 Framer Motion

4. **家长端页面（参考 study-plan-app 功能，用 Tailwind 重写）**
   - 任务创建：预设任务选择器 + CoinStepper 金币选择器
   - 周计划创建器：textarea + 复制到整周
   - 任务管理列表：查看/删除任务

5. **孩子端页面（参考 study-plan-app 功能，用 Tailwind 重写）**
   - 今日任务打卡卡片：点击完成/取消，实时金币变化
   - 金币余额 + 兑换市场
   - 非今日任务显示锁定状态

6. **路由设计**
   ```
   /              — 登录页
   /parent        — 家长端（家长登录后跳转）
   /parent/tasks  — 家长端任务管理
   /parent/week   — 家长端周计划
   /child         — 孩子端（孩子登录后跳转）
   /child/tasks   — 孩子端任务打卡
   /child/rewards — 孩子端金币市场
   /dashboard     — 学习成长看板（家长视角，保留原 HomePage）
   /trends        — 成长趋势（保留原 TrendsPage）
   /works         — 作品库（保留原 WorksPage）
   /badges        — 徽章墙（保留原 BadgesPage）
   ```

### 阶段三：前后端对接与联调

1. 所有页面接入真实 API（替换当前 JSON mock 数据）
2. 家长端功能联调：创建任务 → 后端存储 → 孩子端可见
3. 孩子端功能联调：打卡 → 后端更新 → 家长端同步 → 成长数据更新
4. 金币体系联调：打卡加金币 → 兑换扣金币 → 余额同步
5. 权限校验：家长不可打卡，孩子不可创建任务

### 阶段四：可选优化

1. **本地开发运行**：保留 Electron 打包方案（如果还需要桌面应用），或纯 Web 部署
2. **数据持久化**：如果数据量增大，从 JSON 文件迁移到 SQLite
3. **成长看板联动**：孩子打卡后自动记录学习时长和得分，驱动雷达图和趋势图更新
4. **通知提醒**：简单的站内消息提醒（孩子完成打卡后家长端提示）

## 五、技术选型决策

| 决策项 | 选择 | 理由 |
|--------|------|------|
| 前端框架 | React（统一用 learning-app） | 已有大量代码可复用，学习曲线统一 |
| 后端 | FastAPI（移植自 study-plan-app） | 已有成熟实现，功能完整且经过测试 |
| 存储 | JSON 文件（保留） | 家庭级数据量，无需数据库 |
| 认证 | 简单账号密码 + token | 家庭使用场景，不需要 OAuth/SAML |
| UI 风格 | Tailwind CSS（统一） | 放弃 Element Plus，保持设计一致性 |
| 状态管理 | React Context（轻量） | 当前项目无外部状态管理，保持简单 |

## 六、工作量评估

| 阶段 | 内容 | 预估工作量 |
|------|------|-----------|
| 阶段一 | 后端改造 | 1-2 天 |
| 阶段二 | 前端改造 | 3-4 天 |
| 阶段三 | 联调 | 1 天 |
| 阶段四 | 优化（可选） | 1-2 天 |

**总计：约 6-9 个工作日**

## 七、风险与注意事项

1. **样式冲突**：study-plan-app 使用 Element Plus，learning-app 使用 Tailwind，需要统一重写
2. **数据结构变更**：learning-app 的成长看板和 study-plan-app 的金币体系需要数据打通，设计要一致
3. **用户数据迁移**：如果 study-plan-app 已有数据，需要考虑导入到新的 users.json
4. **密码安全**：家庭场景下简单哈希即可，但如果后续要联网同步，需要更完善的加密方案
5. **Electron 打包**：如果仍需要桌面应用，需要同时打包 React + Python 后端，打包方案会比原来复杂
