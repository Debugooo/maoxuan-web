# mx-v1-003《红色政权为什么能够存在？》纳入研读系统 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将《红色政权为什么能够存在？》按既有规范加入研读系统：新增 guide + original、补齐 H01–H12 联动、把“生存条件诊断表”练习移入“训练与复盘”，并更新索引使其出现在 `/study`。

**Architecture:** 以 `content/maoxuan-cos/index.json` 为唯一权威索引；每篇文章一对文件：`content/maoxuan-guides/v1/mx-v1-003.md`（10 段结构）与 `content/maoxuan-original/v1/mx-v1-003.md`（原文 + ==〔Hxx〕== 高亮）。页面端通过 original 的高亮与 guide 第9段的 `- Hxx：` 联动显示引用块。

**Tech Stack:** Next.js 14 + MD（ReactMarkdown）+ `gray-matter` + Node 校验脚本 `scripts/validate-study-content.mjs`

---

## File Map

**Modify:**
- `content/maoxuan-cos/index.json`（新增 item、更新 learningOrder、串联 prev/next）
- `src/data/questions.ts`（新增训练题：五个条件生存诊断表）

**Create:**
- `content/maoxuan-guides/v1/mx-v1-003.md`
- `content/maoxuan-original/v1/mx-v1-003.md`

**Reference:**
- 原文来源：`https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19281005.htm`
- 用户提供的精读指南文本（本次对话内容）

---

### Task 1: 在索引中新增 mx-v1-003

**Files:**
- Modify: `content/maoxuan-cos/index.json`

- [ ] **Step 1: 读取 index.json 当前 v1 items 与 learningOrder**
- [ ] **Step 2: 在 `volumes.v1.items` 末尾新增 item**

新增字段建议（按既有模式）：

```json
{
  "id": "mx-v1-003",
  "volume": "v1",
  "title": "中国的红色政权为什么能够存在？",
  "source_url": "https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19281005.htm",
  "guide_path": "content/maoxuan-guides/v1/mx-v1-003.md",
  "original_path": "content/maoxuan-original/v1/mx-v1-003.md",
  "cos": { "stage": 3, "module": "base" },
  "prev_learning": "mx-v1-002",
  "next_learning": null,
  "cross_refs": [],
  "concepts": []
}
```

- [ ] **Step 3: 更新原有 mx-v1-002 的 `next_learning` 为 mx-v1-003**
- [ ] **Step 4: 更新 `learningOrder`：把 mx-v1-003 接在 mx-v1-002 后**
- [ ] **Step 5: 运行校验**

Run: `npm run validate:study`  
Expected: `study content OK`

---

### Task 2: 新增 original（原文）并插入 H01–H12 高亮

**Files:**
- Create: `content/maoxuan-original/v1/mx-v1-003.md`

- [ ] **Step 1: 创建 original 文件 frontmatter**

```md
---
id: mx-v1-003
title: 中国的红色政权为什么能够存在？
volume: v1
source_url: https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19281005.htm
---
```

- [ ] **Step 2: 从 source_url 获取原文并填入正文**
  - 目标：正文为“原文主文本”，不混入本仓库的“生存条件建模”等二次解读。
  - 允许保留原站点内的标题、日期、注释等结构。

- [ ] **Step 3: 选取 12 句关键原文并按以下格式高亮**

规则（与现有 original 一致）：
- 以 `==〔H01〕...==` 标记高亮句，H01–H12 共 12 条
- 高亮句必须是原文的连续片段（不要改写）
- 高亮句之间可以同段出现（与 mx-v1-001 的做法一致）

示例格式：

```md
==〔H01〕一国之内，在四围白色政权的包围中，有一小块或若干小块红色政权的区域长期地存在，这是世界各国从来没有的事。==
```

- [ ] **Step 4: 运行校验**

Run: `npm run validate:study`  
Expected: `study content OK`（若报 “highlight Hxx missing note”，说明 guide 第9段未同步）

---

### Task 3: 新增 guide（精读指南），并按既定规范整理用户提供原稿

**Files:**
- Create: `content/maoxuan-guides/v1/mx-v1-003.md`

- [ ] **Step 1: 创建 guide frontmatter（与 index 一致）**

```md
---
id: mx-v1-003
title: 中国的红色政权为什么能够存在？
volume: v1
date: 1928-10-05
source_url: https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19281005.htm
prev_learning: mx-v1-002
next_learning: null
cross_refs: []
concepts: []
cos:
  stage: 3
  module: base
---
```

- [ ] **Step 2: 写入 10 段 H2 固定结构（必须一字不差包含以下标题）**
  - `## 1 历史坐标`
  - `## 2 认知操作系统位置`
  - `## 3 回答的核心问题`
  - `## 4 阅读定位（正确读法与学法）`
  - `## 5 金句摘录`（保持为空即可，页面端会隐藏空段落）
  - `## 6 核心思想`
  - `## 7 关键概念（最小定义）`
  - `## 8 全文结构速览（认知地图）`
  - `## 9 金句摘录`
  - `## 10 与其他文章的联动（互文与学习顺序）`

- [ ] **Step 3: 融入用户提供内容时遵守全局规则**
  - 删除所有“（原稿）/原稿：”字样
  - 删除“本周行动清单”整节（不落入任何位置）
  - 不在 guide 中保留“实操转化”正文：改为“已移至训练与复盘”
  - 第9段用于联动：必须出现 12 条 `- Hxx：...`（H01–H12）
  - 避免 Markdown 有序列表渲染异常：在第9段以下的分点若需要序号，用 `1、2、3、...` 文本序号，不用 `1.` `2.`

- [ ] **Step 4: 第9段写 12 条旁批锚点**

格式（与现有一致）：

```md
## 9 金句摘录

- H01：...
- H02：...
...
- H12：...
```

- [ ] **Step 5: 运行校验**

Run: `npm run validate:study`  
Expected: `study content OK`

---

### Task 4: 将“五个条件生存诊断表”加入训练与复盘

**Files:**
- Modify: `src/data/questions.ts`

- [ ] **Step 1: 扩展 `TrainingQuestion['chapterSlug']` 联合类型，加入 `zhengquan`**
- [ ] **Step 2: 新增训练题（open）**

建议数据结构（按现有 questions.ts 风格）：

```ts
{
  id: 'zhengquan-1',
  chapterSlug: 'zhengquan',
  tags: ['生存诊断', '五个条件', '止损'],
  title: '个人版“红色政权存在条件”分析',
  prompt: '...（把用户提供的第“四、实操转化：五个条件生存诊断表”全文搬到这里）',
}
```

- [ ] **Step 3: 页面验收**

访问：`/training`  
Expected: 题库列表出现新题，点击后可编辑并自动保存

---

### Task 5: 端到端验证与稳态检查

**Files:**
- None

- [ ] **Step 1: 全量校验**

Run: `npm run validate:study && npm run lint && npm run build`  
Expected: 全部通过

- [ ] **Step 2: dev server 验收**

Run: `npm run dev -- --port 3001 --hostname 0.0.0.0`  
访问：
- `/study/mx-v1-003`：10 段结构齐全；第5段空内容不显示；第9段每条旁批能显示引用块（若 original 高亮齐全）
- `/training`：存在“红色政权存在条件分析”训练题

