# Learning Growth Dashboard
## 家长端学习成长中心（高保真版）

Version: v1.0

---

# 一、项目定位

打造一款高颜值、强激励、游戏化的儿童学习成长管理平台。

帮助家长：

- 查看孩子学习数据
- 查看成长轨迹
- 查看学习成果
- 查看能力成长
- 查看勋章奖励
- 获得AI学习建议

---

# 二、设计理念

## 核心关键词

成长、激励、陪伴、成就感、游戏化

参考产品：

- Duolingo
- ClassDojo
- Khan Academy Kids
- 学而思
- 猿辅导

---

# 三、整体UI风格

## 风格方向

Minecraft + Duolingo + 卡通科技风

### 视觉特点

- 主色调：
  - Primary: #4ADE80
  - Secondary: #60A5FA
  - Warning: #FBBF24
  - Danger: #FB7185
  - Background: #F8FAFC

- 页面风格：
  - 圆角大卡片
  - 玻璃拟态
  - 渐变背景
  - 动态粒子
  - 游戏成就感

- 设计语言：
  - 8px 栅格
  - 大圆角：24px
  - 小圆角：16px
  - 卡片阴影：shadow-xl
  - 动画：Framer Motion

---

# 四、整体布局

首页布局：

```
┌────────────────────┐
│ 顶部成长信息         │
├────────────────────┤
│ 今日学习概览         │
├────────────────────┤
│ 学习能力分布         │
├────────────────────┤
│ 高光作品             │
├────────────────────┤
│ 勋章中心             │
├────────────────────┤
│ 成长趋势             │
├────────────────────┤
│ AI家长助手           │
└────────────────────┘
```

---

# 五、首页设计

## Hero区域

- 高度：320px
- 背景：动态渐变、云层漂浮、卡通山脉

## 用户信息卡

- 显示：
  - 头像
  - 昵称
  - 等级
  - 成长值
  - 连续学习天数
- 效果：发光边框、悬浮动画、渐变背景
- 示例：
  ```
  Lv.15 小明
  成长值：4580 / 5000
  🔥 连续学习32天
  ```

---

# 六、学习数据卡片

- 卡片布局：
  ```
  ┌───────────────┐
  │累计学习时长    │
  │               │
  │420分钟        │
  │↑15%           │
  └───────────────┘
  ```
- 动效：数字从0递增，动画时间1500ms

---

# 七、能力分析模块

- 雷达图展示听力、口语、阅读、表达、词汇
- 样式：渐变填充rgba(74,222,128,.4)、边缘发光

---

# 八、高光作品模块

- 横向滚动卡片
- 卡片内容：
  - 缩略图
  - 标题
  - 分数
- Hover效果：放大1.05倍、阴影增强、边框发光
- 点击作品进入详情页：
  - 播放录音
  - AI点评
  - 老师点评
  - 评分分析

---

# 九、勋章中心

- 页面布局：九宫格
- 已获得：金色边框、发光、粒子动画
- 未获得：灰色、锁图标
- 获取动画：
  - 勋章出现
  - 金光爆发
  - 粒子扩散
  - 飞入背包
  - 持续时间：3秒

---

# 十、成长趋势页

- 学习时长趋势：折线图，时间维度周/月/年
- 成长值趋势：面积图
- 学习热力图：GitHub风格，颜色越深学习时间越长

---

# 十一、学习成果库

- 布局：筛选栏 + 搜索栏 + 瀑布流
- 卡片显示：封面、标题、评分、完成时间
- 支持：搜索、排序、筛选、收藏

---

# 十二、AI家长助手

- 悬浮入口：右下角
- 形象设计：卡通机器人
- 动画：
  - 闲置状态轻微漂浮
  - 眨眼、呼吸
- 对话能力：
  - 分析学习情况
  - 制定计划
  - 发现弱项
  - 生成周报

---

# 十三、成就系统

- 经验值规则：
  - 完成任务 +10
  - 完成作品 +20
  - 连续学习7天 +50
  - 获得勋章 +100
- 等级体系：Lv1 ~ Lv100
- 升级动画：等级数字放大 + 粒子 + 彩带喷射

---

# 十四、Minecraft风格增强

- 完成任务：
  - 显示 ✓ 任务完成
  - 经验球飞出，飞向成长值进度条
- 获得奖励：
  - 弹出 +50 EXP / +1 勋章
- 音效：
  - 经验获得、升级、勋章解锁

---

# 十五、技术架构

## 前端

- React 18 + TypeScript
- Vite + TailwindCSS
- Shadcn UI
- Framer Motion
- ECharts

## 后端

- FastAPI + SQLAlchemy
- SQLite（开发）、MySQL（生产）

## 桌面端

- Electron
- 支持 Windows / MacOS

---

# 十六、数据库设计

## user

```sql
CREATE TABLE user (
 id INTEGER PRIMARY KEY,
 name VARCHAR(50),
 avatar VARCHAR(255),
 level INT,
 exp INT
);
```

## study_record

```sql
CREATE TABLE study_record (
 id INTEGER PRIMARY KEY,
 user_id INT,
 duration INT,
 score INT,
 type VARCHAR(50),
 created_time DATETIME
);
```

## badge

```sql
CREATE TABLE badge (
 id INTEGER PRIMARY KEY,
 name VARCHAR(50),
 description TEXT,
 icon VARCHAR(255)
);
```

## user_badge

```sql
CREATE TABLE user_badge (
 id INTEGER PRIMARY KEY,
 user_id INT,
 badge_id INT,
 earned_time DATETIME
);
```

## work

```sql
CREATE TABLE work (
 id INTEGER PRIMARY KEY,
 user_id INT,
 title VARCHAR(100),
 cover VARCHAR(255),
 score INT,
 audio_url VARCHAR(255),
 created_time DATETIME
);
```

---

# 十七、Agent开发要求

- 生成完整可运行项目：
  - Electron + React + TypeScript + TailwindCSS + Shadcn UI + Framer Motion + FastAPI + SQLite
- 必须实现：
  - ✅ 首页成长中心
  - ✅ 学习数据统计
  - ✅ 学习能力分析
  - ✅ 高光作品
  - ✅ 勋章中心
  - ✅ 成长趋势
  - ✅ AI家长助手
  - ✅ 学习成果库
  - ✅ Minecraft经验动画
  - ✅ 本地运行部署
- UI设计目标：
  - 产品级
  - 可直接上线
  - 儿童喜欢
  - 家长愿意长期使用
  - 视觉效果接近商业教育产品
- Agent建议开发阶段：
  1. 完成全部页面UI和动画
  2. 接入Mock数据
  3. 接入FastAPI后端
  4. 接入AI学习助手能力
  
请优先完成高保真UI，再实现业务逻辑。
第一阶段：
完成全部页面UI和动画。
第二阶段：
接入Mock数据。
第三阶段：
接入FastAPI后端。
第四阶段：
接入AI学习助手能力。  

AI学习相关功能可暂不实现
