# mx-v1-002《湖南农民运动考察报告》生成 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在研读系统中新增第四篇 `mx-v1-002`《湖南农民运动考察报告》，包含原文导入与排版清理、H01–H12 行内标注、按固定 10 段结构的指南（尽量搬运用户提供的“精读实操指南”内容），并确保 `/study/mx-v1-002` 与 `/original/mx-v1-002` 可访问且联动校验通过。

**Architecture:** 保持现有“内容资产分离 + canonical index + 渲染层高亮解析”的架构不变。原文中用 `==〔Hxx〕...==` 标注重点句；指南第 9 段用 `- Hxx：...` 写旁批并自动嵌入引文；研读系统列表页继续以 learningOrder 为学习顺序，同时“已收录”展示所有已生成篇目。

**Tech Stack:** Next.js 14 App Router、TypeScript、react-markdown、gray-matter、Node scripts（`scripts/fetch-maoxuan-article.mjs`、`scripts/validate-study-content.mjs`）

---

## File/Module Map

**Content**
- Modify: `/workspace/content/maoxuan-cos/index.json`
- Create: `/workspace/content/maoxuan-original/v1/mx-v1-002.md`
- Create: `/workspace/content/maoxuan-guides/v1/mx-v1-002.md`

**Validation**
- Run: `npm run validate:study`
- Run: `npm run lint`
- Run: `npm run build`

---

### Task 1: 在索引中新增 mx-v1-002 并更新学习顺序

**Files:**
- Modify: `/workspace/content/maoxuan-cos/index.json`

- [ ] **Step 1: 在 v1.items 中新增 mx-v1-002 条目**

把下列条目插入到 `mx-v1-001` 后面（保持 items 里按 id 递增可读）：

```json
{
  "id": "mx-v1-002",
  "volume": "v1",
  "title": "湖南农民运动考察报告",
  "source_url": "https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-192703.htm",
  "guide_path": "content/maoxuan-guides/v1/mx-v1-002.md",
  "original_path": "content/maoxuan-original/v1/mx-v1-002.md",
  "cos": { "stage": 2, "module": "evidence" },
  "prev_learning": "mx-v1-001",
  "next_learning": null,
  "cross_refs": [],
  "concepts": []
}
```

- [ ] **Step 2: 更新 mx-v1-001 的 next_learning**

把 `mx-v1-001.next_learning` 改为 `"mx-v1-002"`。

- [ ] **Step 3: 更新 learningOrder**

把 `learningOrder` 改为：

```json
["mx-v1-001", "mx-v1-002"]
```

- [ ] **Step 4: 构建校验索引能被读取**

Run:

```bash
npm run build
```

Expected: build succeeds.

---

### Task 2: 导入《湖南农民运动考察报告》原文并清理开头

**Files:**
- Create/Modify: `/workspace/content/maoxuan-original/v1/mx-v1-002.md`

- [ ] **Step 1: 使用脚本导入原文**

Run:

```bash
node scripts/fetch-maoxuan-article.mjs mx-v1-002
```

Expected: `wrote /workspace/content/maoxuan-original/v1/mx-v1-002.md`.

- [ ] **Step 2: 清理抓取残留的“文库导航行”，并统一标题行格式**

把原文开头改成与其它篇一致的格式：

```md
### 湖南农民运动考察报告

（一九二七年三月）
```

并删除类似：

```text
中文马克思主义文库 -> 毛泽东 ...
```

---

### Task 3: 为原文添加 H01–H12 行内标注（不串联）

**Files:**
- Modify: `/workspace/content/maoxuan-original/v1/mx-v1-002.md`

- [ ] **Step 1: 在原文中插入 H01–H12**

要求：
- 标注格式必须是 `==〔Hxx〕...==`
- 相邻两个高亮之间必须用空格分隔，避免出现 `====` 导致串联

建议优先覆盖用户指南中强调的关键节点（暴风骤雨、好得很/糟得很、调查元数据、十四件大事、组织化、矫枉过正等）。

- [ ] **Step 2: 跑内容一致性校验（此时会失败，因为指南还没写旁批）**

Run:

```bash
npm run validate:study
```

Expected: FAIL，提示 `mx-v1-002` 缺少对应 `- Hxx：` 旁批（这是预期的红灯）。

---

### Task 4: 生成 mx-v1-002 指南（10 段固定结构，尽量搬运用户参考稿）

**Files:**
- Create: `/workspace/content/maoxuan-guides/v1/mx-v1-002.md`

- [ ] **Step 1: 写 frontmatter**

```yaml
---
id: mx-v1-002
title: 湖南农民运动考察报告
volume: v1
date: 1927-03
source_url: https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-192703.htm
prev_learning: mx-v1-001
next_learning: null
cross_refs: []
concepts: []
cos:
  stage: 2
  module: evidence
---
```

- [ ] **Step 2: 按固定 10 段标题写正文**

必须包含以下二级标题（完全一致）：

```md
## 1 历史坐标
## 2 认知操作系统位置
## 3 回答的核心问题
## 4 阅读定位（正确读法与学法）
## 5 金句摘录
## 6 核心思想/论点
## 7 关键概念（最小定义）
## 8 全文结构速览（认知地图）
## 9 逐段精读指引（重点句标注+旁批）
## 10 与其他文章的联动（互文与学习顺序）
```

并遵循现有系统约束：
- 第 5 段内容仅写“并入第9段”的固定句（不要单独列金句）
- 第 9 段：每条旁批必须形如 `- Hxx：...`，并与原文 `==〔Hxx〕...==` 一一对应（12 条）
- 第 10 段：写互文联动（与《阶级分析》《实践论》《矛盾论》《反对本本主义》等）

正文内容尽量“原样搬运”用户提供的参考稿（把它拆装进第 2/4/8/9/10 段；其余段落用同一文风补齐），不新增第 11 段或额外小节。

- [ ] **Step 3: 校验旁批与高亮一致**

Run:

```bash
npm run validate:study
```

Expected: PASS，输出 `study content OK`。

---

### Task 5: 运行构建并抽查页面联动

**Files:**
- (no new files)

- [ ] **Step 1: lint + build**

Run:

```bash
npm run lint && npm run build
```

Expected: both succeed.

- [ ] **Step 2: 本地启动 dev 并抽查**

Run:

```bash
npm run dev -- --port 3001 --hostname 0.0.0.0
```

Open:
- `http://localhost:3001/study/mx-v1-002`
- `http://localhost:3001/original/mx-v1-002`

Check:
- 指南 10 段以 card 呈现，左侧目录可折叠
- 第 9 段：每个 `Hxx` 条目上方能显示对应原文引文（自动抽取）
- 原文页：`==〔Hxx〕...==` 高亮可点击，能跳转到指南对应 `#note-Hxx`

- [ ] **Step 3: 若出现“Cannot find module './xxx.js'”/页面空白**

按既定修复流程：

```bash
rm -rf /workspace/.next
```

然后重启 dev server（再次执行上一步的 `npm run dev ...`）。

---

## Plan Self-Review

- 覆盖性：索引、原文、标注、指南、校验与页面抽查均包含任务。
- 无占位：所有步骤都有明确文件路径、命令与期望输出；内容写作部分明确了结构与硬约束。

