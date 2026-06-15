"""
Study Plan Backend API
FastAPI server for parent-child task management with coin rewards.
Ported from study-plan-app with enhancements for learning-app integration.
"""
from __future__ import annotations

import json
import os
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


app = FastAPI(title="Learning Growth API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Pydantic Models ──────────────────────────────────────────────


class Task(BaseModel):
    id: int
    name: str
    done: bool = False
    coins: int = 1
    rewardClaimedBy: List[str] = Field(default_factory=list)


class DayPlan(BaseModel):
    date: str
    tasks: List[Task]


class TaskCreate(BaseModel):
    name: str
    coins: int = 1


class TaskUpdate(BaseModel):
    done: bool


class WeekDayTasks(BaseModel):
    date: str
    tasks: List[Any]


class WeekPlanUpdate(BaseModel):
    days: List[WeekDayTasks]


class WeekPlan(BaseModel):
    startDate: str
    endDate: str
    days: List[DayPlan]


class MarketReward(BaseModel):
    id: int
    name: str
    cost: int
    builtIn: bool = False


class Redemption(BaseModel):
    id: int
    userName: str
    rewardName: str
    cost: int
    redeemedAt: str


class RewardStore(BaseModel):
    balances: Dict[str, int] = Field(default_factory=dict)
    market: List[MarketReward] = Field(default_factory=list)
    redemptions: List[Redemption] = Field(default_factory=list)


class RewardCreate(BaseModel):
    name: str
    cost: int


class RewardRedeem(BaseModel):
    rewardId: int


class RewardSummary(BaseModel):
    userName: str
    balance: int
    market: List[MarketReward]
    redemptions: List[Redemption]


class LoginRequest(BaseModel):
    username: str
    password: str = ""


class LoginResponse(BaseModel):
    username: str
    role: str  # "parent" | "child"
    child_name: str


class StatsOverview(BaseModel):
    """Growth statistics for the dashboard."""
    total_tasks_completed: int
    total_tasks_today: int
    tasks_completed_today: int
    streak_days: int
    total_coins_earned: int
    total_coins_spent: int
    weekly_completion_rate: float


# ── Constants ─────────────────────────────────────────────────────

DEFAULT_MARKET = [
    MarketReward(id=1, name="看电视 15 分钟", cost=1, builtIn=True),
    MarketReward(id=2, name="小零食奖励一次", cost=2, builtIn=True),
    MarketReward(id=3, name="选择一次晚饭菜单", cost=2, builtIn=True),
    MarketReward(id=4, name="免一次小家务", cost=2, builtIn=True),
    MarketReward(id=5, name="玩手柄游戏半小时", cost=3, builtIn=True),
    MarketReward(id=6, name="周末多玩 30 分钟", cost=4, builtIn=True),
    MarketReward(id=7, name="玩真人 CS 一次", cost=5, builtIn=True),
    MarketReward(id=8, name="买一本喜欢的书", cost=6, builtIn=True),
    MarketReward(id=9, name="一次亲子电影夜", cost=8, builtIn=True),
    MarketReward(id=10, name="公园/游乐场活动一次", cost=10, builtIn=True),
    MarketReward(id=11, name="和家长一起做一次烘焙", cost=6, builtIn=True),
    MarketReward(id=12, name="睡前多听一个故事", cost=1, builtIn=True),
    MarketReward(id=13, name="周末选择一次家庭活动", cost=8, builtIn=True),
]
CHILD_ACCOUNT = "child"


# ── File Helpers ──────────────────────────────────────────────────


def _get_data_dir() -> Path:
    """Get the data directory path (backend/data/)."""
    return Path(__file__).resolve().parent / "data"


def get_plans_file() -> Path:
    p = os.environ.get("PLANS_FILE")
    return Path(p) if p else _get_data_dir() / "plans.json"


def get_rewards_file() -> Path:
    p = os.environ.get("REWARDS_FILE")
    return Path(p) if p else _get_data_dir() / "rewards.json"


def get_users_file() -> Path:
    p = os.environ.get("USERS_FILE")
    return Path(p) if p else _get_data_dir() / "users.json"


def _atomic_write(path: Path, content: str) -> None:
    """Write content atomically via temp file + rename."""
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(".tmp")
    tmp.write_text(content, encoding="utf-8")
    tmp.replace(path)


# ── Date Helpers ──────────────────────────────────────────────────


def parse_date(date: str) -> datetime:
    try:
        return datetime.strptime(date, "%Y-%m-%d")
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="date must use YYYY-MM-DD format") from exc


def validate_date(date: str) -> None:
    parse_date(date)


def today_string() -> str:
    return datetime.now().strftime("%Y-%m-%d")


def get_week_dates(date: str) -> List[str]:
    selected = parse_date(date)
    monday = selected - timedelta(days=selected.weekday())
    return [(monday + timedelta(days=offset)).strftime("%Y-%m-%d") for offset in range(7)]


def build_week_plan(date: str, plans: Dict[str, DayPlan]) -> WeekPlan:
    week_dates = get_week_dates(date)
    days = [plans.get(d, DayPlan(date=d, tasks=[])) for d in week_dates]
    return WeekPlan(startDate=week_dates[0], endDate=week_dates[-1], days=days)


# ── Auth Helpers ──────────────────────────────────────────────────


def normalize_user_name(user_name: Optional[str]) -> str:
    return (user_name or "").strip()


def require_login(user_name: Optional[str]) -> str:
    normalized = normalize_user_name(user_name)
    if not normalized:
        raise HTTPException(status_code=401, detail="login required")
    return normalized


def require_admin(user_name: Optional[str]) -> str:
    normalized = require_login(user_name)
    if normalized != "admin":
        raise HTTPException(status_code=403, detail="admin account required")
    return normalized


def sanitize_coins(value: Any, default: int = 1) -> int:
    try:
        coins = int(value)
    except (TypeError, ValueError):
        coins = default
    return max(coins, 0)


# ── Data Loaders / Savers ─────────────────────────────────────────


def load_plans() -> Dict[str, DayPlan]:
    data_file = get_plans_file()
    if not data_file.exists():
        return {}
    try:
        raw = json.loads(data_file.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=500, detail="stored plan data is invalid JSON") from exc
    return {date: DayPlan(**plan) for date, plan in raw.items()}


def save_plans(plans: Dict[str, DayPlan]) -> None:
    data_file = get_plans_file()
    serializable = {date: plan.model_dump() for date, plan in plans.items()}
    _atomic_write(data_file, json.dumps(serializable, ensure_ascii=False, indent=2))


def load_rewards() -> RewardStore:
    rewards_file = get_rewards_file()
    if not rewards_file.exists():
        return RewardStore(market=list(DEFAULT_MARKET))
    try:
        raw = json.loads(rewards_file.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=500, detail="stored reward data is invalid JSON") from exc
    store = RewardStore(**raw)
    # Ensure default market rewards exist
    existing_ids = {r.id for r in store.market}
    for reward in DEFAULT_MARKET:
        if reward.id not in existing_ids:
            store.market.append(reward)
    store.market.sort(key=lambda r: r.id)
    return store


def save_rewards(store: RewardStore) -> None:
    rewards_file = get_rewards_file()
    _atomic_write(rewards_file, json.dumps(store.model_dump(), ensure_ascii=False, indent=2))


def load_users() -> Dict[str, dict]:
    users_file = get_users_file()
    if not users_file.exists():
        return {}
    try:
        return json.loads(users_file.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {}


def save_users(users: Dict[str, dict]) -> None:
    users_file = get_users_file()
    _atomic_write(users_file, json.dumps(users, ensure_ascii=False, indent=2))


# ── Business Logic ────────────────────────────────────────────────


def build_reward_summary(user_name: str, store: Optional[RewardStore] = None) -> RewardSummary:
    store = store or load_rewards()
    user_redemptions = [r for r in store.redemptions if r.userName == user_name]
    user_redemptions.sort(key=lambda r: r.id, reverse=True)
    return RewardSummary(
        userName=user_name,
        balance=store.balances.get(user_name, 0),
        market=store.market,
        redemptions=user_redemptions,
    )


def change_balance(store: RewardStore, user_name: str, delta: int) -> None:
    current = store.balances.get(user_name, 0)
    store.balances[user_name] = max(current + delta, 0)


def find_task(plan: DayPlan, task_id: int) -> Task:
    for task in plan.tasks:
        if task.id == task_id:
            return task
    raise HTTPException(status_code=404, detail="task not found")


def task_from_week_item(index: int, item: Any) -> Optional[Task]:
    if isinstance(item, str):
        name = item.strip()
        coins = 1
    elif isinstance(item, dict):
        name = str(item.get("name", "")).strip()
        coins = sanitize_coins(item.get("coins"), default=1)
    else:
        return None
    if not name:
        return None
    return Task(id=index, name=name, done=False, coins=coins, rewardClaimedBy=[])


def compute_stats(user_name: str) -> StatsOverview:
    """Compute growth statistics from stored data."""
    plans = load_plans()
    rewards = load_rewards()

    # Total tasks completed across all dates
    total_completed = sum(
        sum(1 for t in day.tasks if t.done)
        for day in plans.values()
    )

    # Today's stats
    today = today_string()
    today_plan = plans.get(today, DayPlan(date=today, tasks=[]))
    today_total = len(today_plan.tasks)
    today_completed = sum(1 for t in today_plan.tasks if t.done)

    # Streak: count consecutive days ending today with all tasks done
    streak = 0
    for offset in range(365):
        d = (datetime.now() - timedelta(days=offset)).strftime("%Y-%m-%d")
        day_plan = plans.get(d)
        if not day_plan or not day_plan.tasks:
            break
        if all(t.done for t in day_plan.tasks):
            streak += 1
        else:
            break

    # Coin totals
    total_earned = sum(
        t.coins for day in plans.values() for t in day.tasks
        if t.done and user_name in t.rewardClaimedBy
    )
    total_spent = sum(r.cost for r in rewards.redemptions if r.userName == user_name)

    # Weekly completion rate
    week_dates = get_week_dates(today)
    week_tasks = 0
    week_done = 0
    for wd in week_dates:
        dp = plans.get(wd)
        if dp:
            week_tasks += len(dp.tasks)
            week_done += sum(1 for t in dp.tasks if t.done)
    rate = (week_done / week_tasks * 100) if week_tasks > 0 else 0.0

    return StatsOverview(
        total_tasks_completed=total_completed,
        total_tasks_today=today_total,
        tasks_completed_today=today_completed,
        streak_days=streak,
        total_coins_earned=total_earned,
        total_coins_spent=total_spent,
        weekly_completion_rate=round(rate, 1),
    )


# ── API Routes ────────────────────────────────────────────────────


@app.get("/health")
async def health():
    return {"status": "ok"}


# ── Auth ──────────────────────────────────────────────────────────


@app.post("/api/auth/login", response_model=LoginResponse)
async def login(req: LoginRequest):
    """Simple username login. Password currently ignored (placeholder)."""
    username = req.username.strip()
    if not username:
        raise HTTPException(status_code=400, detail="username required")

    users = load_users()
    if username in users:
        user = users[username]
        return LoginResponse(
            username=user["user_name"],
            role=user["role"],
            child_name=user.get("child_name", ""),
        )

    # Auto-create user on first login
    role = "parent" if username == "admin" else "child"
    child_name = "南南" if username == "admin" else username
    users[username] = {
        "user_name": username,
        "role": role,
        "password_hash": "",
        "child_name": child_name,
    }
    save_users(users)

    # Ensure child account exists for rewards
    if username != CHILD_ACCOUNT:
        rewards = load_rewards()
        if CHILD_ACCOUNT not in rewards.balances:
            rewards.balances[CHILD_ACCOUNT] = 0
        save_rewards(rewards)

    return LoginResponse(
        username=username,
        role=role,
        child_name=child_name,
    )


# ── Plans / Tasks ─────────────────────────────────────────────────


@app.get("/api/plans/{date}", response_model=DayPlan)
async def get_day_plan(date: str):
    validate_date(date)
    plans = load_plans()
    return plans.get(date, DayPlan(date=date, tasks=[]))


@app.get("/api/week/{date}", response_model=WeekPlan)
async def get_week_plan(date: str):
    validate_date(date)
    plans = load_plans()
    return build_week_plan(date, plans)


@app.put("/api/week/{date}", response_model=WeekPlan)
async def replace_week_plan(
    date: str,
    update: WeekPlanUpdate,
    x_user_name: Optional[str] = Header(default=None),
):
    validate_date(date)
    require_admin(x_user_name)
    plans = load_plans()
    week_dates = get_week_dates(date)
    submitted = {day.date: day.tasks for day in update.days if day.date in week_dates}

    for week_date in week_dates:
        tasks = []
        for idx, item in enumerate(submitted.get(week_date, []), 1):
            task = task_from_week_item(idx, item)
            if task:
                tasks.append(task)
        plans[week_date] = DayPlan(date=week_date, tasks=tasks)

    save_plans(plans)
    return build_week_plan(date, plans)


@app.post("/api/plans/{date}/tasks", response_model=DayPlan)
async def create_task(
    date: str,
    task: TaskCreate,
    x_user_name: Optional[str] = Header(default=None),
):
    validate_date(date)
    require_admin(x_user_name)
    task_name = task.name.strip()
    if not task_name:
        raise HTTPException(status_code=400, detail="task name cannot be empty")

    plans = load_plans()
    plan = plans.get(date, DayPlan(date=date, tasks=[]))
    next_id = max((t.id for t in plan.tasks), default=0) + 1
    plan.tasks.append(
        Task(
            id=next_id,
            name=task_name,
            done=False,
            coins=sanitize_coins(task.coins),
            rewardClaimedBy=[],
        )
    )
    plans[date] = plan
    save_plans(plans)
    return plan


@app.patch("/api/plans/{date}/tasks/{task_id}", response_model=DayPlan)
async def update_task(
    date: str,
    task_id: int,
    update: TaskUpdate,
    x_user_name: Optional[str] = Header(default=None),
):
    validate_date(date)
    user_name = require_login(x_user_name)
    if user_name != "admin" and date != today_string():
        raise HTTPException(status_code=403, detail="can only check in today's tasks")

    plans = load_plans()
    plan = plans.get(date, DayPlan(date=date, tasks=[]))
    task = find_task(plan, task_id)

    # Determine which account gets the coins
    reward_user_name = CHILD_ACCOUNT if user_name == "admin" else user_name
    rewards = load_rewards()

    if update.done and reward_user_name not in task.rewardClaimedBy:
        change_balance(rewards, reward_user_name, task.coins)
        task.rewardClaimedBy.append(reward_user_name)
    elif not update.done and reward_user_name in task.rewardClaimedBy:
        change_balance(rewards, reward_user_name, -task.coins)
        task.rewardClaimedBy = [u for u in task.rewardClaimedBy if u != reward_user_name]

    save_rewards(rewards)
    task.done = update.done
    plans[date] = plan
    save_plans(plans)
    return plan


@app.delete("/api/plans/{date}/tasks/{task_id}", response_model=DayPlan)
async def delete_task(
    date: str,
    task_id: int,
    x_user_name: Optional[str] = Header(default=None),
):
    validate_date(date)
    require_admin(x_user_name)
    plans = load_plans()
    plan = plans.get(date, DayPlan(date=date, tasks=[]))
    find_task(plan, task_id)
    plan.tasks = [t for t in plan.tasks if t.id != task_id]
    plans[date] = plan
    save_plans(plans)
    return plan


# ── Rewards / Market ──────────────────────────────────────────────


@app.get("/api/rewards/{user_name}", response_model=RewardSummary)
async def get_rewards(user_name: str):
    normalized = normalize_user_name(user_name) or CHILD_ACCOUNT
    return build_reward_summary(normalized)


@app.post("/api/rewards/market", response_model=RewardSummary)
async def create_market_reward(
    reward: RewardCreate,
    x_user_name: Optional[str] = Header(default=None),
):
    require_admin(x_user_name)
    reward_name = reward.name.strip()
    if not reward_name:
        raise HTTPException(status_code=400, detail="reward name cannot be empty")

    store = load_rewards()
    next_id = max((r.id for r in store.market), default=0) + 1
    store.market.append(
        MarketReward(
            id=next_id,
            name=reward_name,
            cost=sanitize_coins(reward.cost, default=0),
            builtIn=False,
        )
    )
    save_rewards(store)
    return build_reward_summary(CHILD_ACCOUNT, store)


@app.delete("/api/rewards/market/{reward_id}", response_model=RewardSummary)
async def delete_market_reward(
    reward_id: int,
    x_user_name: Optional[str] = Header(default=None),
):
    require_admin(x_user_name)
    store = load_rewards()
    reward = next((r for r in store.market if r.id == reward_id), None)
    if not reward:
        raise HTTPException(status_code=404, detail="reward not found")
    if reward.builtIn:
        raise HTTPException(status_code=400, detail="built-in reward cannot be deleted")

    store.market = [r for r in store.market if r.id != reward_id]
    save_rewards(store)
    return build_reward_summary(CHILD_ACCOUNT, store)


@app.post("/api/rewards/redeem", response_model=RewardSummary)
async def redeem_reward(
    redeem: RewardRedeem,
    x_user_name: Optional[str] = Header(default=None),
):
    user_name = require_login(x_user_name)
    if user_name == "admin":
        raise HTTPException(status_code=403, detail="children only")

    store = load_rewards()
    reward = next((r for r in store.market if r.id == redeem.rewardId), None)
    if not reward:
        raise HTTPException(status_code=404, detail="reward not found")
    if store.balances.get(user_name, 0) < reward.cost:
        raise HTTPException(status_code=400, detail="not enough coins")

    change_balance(store, user_name, -reward.cost)
    next_id = max((r.id for r in store.redemptions), default=0) + 1
    store.redemptions.append(
        Redemption(
            id=next_id,
            userName=user_name,
            rewardName=reward.name,
            cost=reward.cost,
            redeemedAt=datetime.now().isoformat(timespec="seconds"),
        )
    )
    save_rewards(store)
    return build_reward_summary(user_name, store)


# ── Stats (for dashboard integration) ─────────────────────────────


@app.get("/api/stats/overview", response_model=StatsOverview)
async def get_stats_overview(x_user_name: Optional[str] = Header(default=None)):
    """Growth statistics for the dashboard."""
    user = require_login(x_user_name)
    return compute_stats(user)


@app.get("/api/stats/completion-history")
async def get_completion_history(x_user_name: Optional[str] = Header(default=None)):
    """Daily completion data for charts (last 30 days)."""
    require_login(x_user_name)
    plans = load_plans()
    today_dt = datetime.now()
    history = []
    for offset in range(29, -1, -1):
        d = (today_dt - timedelta(days=offset)).strftime("%Y-%m-%d")
        day_plan = plans.get(d, DayPlan(date=d, tasks=[]))
        total = len(day_plan.tasks)
        done = sum(1 for t in day_plan.tasks if t.done)
        history.append({"date": d, "total": total, "done": done})
    return history
