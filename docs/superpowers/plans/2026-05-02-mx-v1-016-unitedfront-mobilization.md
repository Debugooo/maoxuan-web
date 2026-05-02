# 《为争取千百万群众进入抗日民族统一战线而斗争》内容落盘 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增 `mx-v1-016` 的指南、原文与训练题，使其进入研读系统学习顺序，并满足“实操放训练页、删除本周行动清单、原文格式按第一篇”的要求。

**Architecture:** 以 `content/maoxuan-cos/index.json` 为索引单一来源，新增一条 items 记录；按既有模板生成 guide/original；训练题写入 `src/data/questions.ts` 并扩展 `chapterSlug` 联合类型。

**Tech Stack:** Next.js 14、TypeScript、Markdown 内容系统、`scripts/validate-study-content.mjs` 校验脚本。

---

## Files Overview

- Create:
  - `content/maoxuan-guides/v1/mx-v1-016.md`
  - `content/maoxuan-original/v1/mx-v1-016.md`
  - `docs/superpowers/plans/2026-05-02-mx-v1-016-unitedfront-mobilization.md`
- Modify:
  - `content/maoxuan-cos/index.json`
  - `src/data/questions.ts`

---

### Task 1: Add mx-v1-016 to COS index

**Files:**
- Modify: `content/maoxuan-cos/index.json`

- [ ] Step 1: Locate the last v1 item and confirm current tail is `mx-v1-015`
- [ ] Step 2: Append new item to `volumes.v1.items[]`:
  - `id: "mx-v1-016"`
  - `volume: "v1"`
  - `title: "为争取千百万群众进入抗日民族统一战线而斗争"`
  - `source_url: "https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19370508.htm"`
  - `guide_path: "content/maoxuan-guides/v1/mx-v1-016.md"`
  - `original_path: "content/maoxuan-original/v1/mx-v1-016.md"`
  - `cos.stage/module`: keep consistent with stage 5 unifiedfront lineage (recommend `stage: 5`, `module: "unitedfront"`)
  - `prev_learning: "mx-v1-015"`
  - `next_learning: null`
- [ ] Step 3: Update `mx-v1-015.next_learning` to `mx-v1-016`
- [ ] Step 4: Append `mx-v1-016` to `learningOrder[]` and ensure ordering remains valid
- [ ] Step 5: Validate JSON formatting

---

### Task 2: Create original markdown (full text + highlight appendix)

**Files:**
- Create: `content/maoxuan-original/v1/mx-v1-016.md`

- [ ] Step 1: Fetch full text from `source_url` and write frontmatter:
  - `id: mx-v1-016`
  - `title: 为争取千百万群众进入抗日民族统一战线而斗争`
  - `volume: v1`
  - `source_url: https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19370508.htm`
- [ ] Step 2: Normalize display format to match v1-001 style:
  - Remove the “中文马克思主义文库 -> 毛泽东” banner line if present
  - Start body with:
    - `### 为争取千百万群众进入抗日民族统一战线而斗争`
    - blank line
    - `（一九三七年五月八日）`
- [ ] Step 3: Append `### 高亮摘录` at end with `==〔H01〕...==` through `==〔H12〕...==`
  - These highlights must match the guide’s H01–H12 notes exactly (Task 3)

---

### Task 3: Create guide markdown (no action list; practice moved to training)

**Files:**
- Create: `content/maoxuan-guides/v1/mx-v1-016.md`

- [ ] Step 1: Create frontmatter consistent with prior guides:
  - `id: mx-v1-016`
  - `title: 为争取千百万群众进入抗日民族统一战线而斗争`
  - `volume: v1`
  - `prev_learning: mx-v1-015`
  - `next_learning: null`
- [ ] Step 2: Fill required sections with unified template headings:
  - `## 1 历史坐标`
  - `## 2 认知操作系统位置`
  - `## 3 回答的核心问题`
  - `## 4 阅读定位（正确读法与学法）`
  - `## 5 金句摘录`
  - `## 6 核心思想`
  - `## 7 关键概念（最小定义）`
  - `## 8 全文结构速览（认知地图）`
  - `## 9 金句摘录`
  - `## 10 与其他文章的联动（互文与学习顺序）`
- [ ] Step 3: Place the “逐段精读指引” under `## 9` (as `### 逐段精读指引`)
  - Include 3.1/3.2/3.3 拆解（按用户提供文本，不精简）
- [ ] Step 4: Under `## 9` include a `- H01：...` through `- H12：...` list (no omissions)
- [ ] Step 5: Ensure the guide does NOT include:
  - “四、实操转化 …”
  - “七、本周行动清单”

---

### Task 4: Add training question (practice conversion)

**Files:**
- Modify: `src/data/questions.ts`

- [ ] Step 1: Add a new question entry:
  - `chapterSlug: 'dongyuan'` (or another agreed slug)
  - Use the full “四、实操转化：你的‘千百万群众’动员计划” text as prompt/content (no summarization)
  - Ensure it appears in the same export structure and formatting as existing questions
- [ ] Step 2: Extend the `TrainingQuestion.chapterSlug` union type to include the new slug
- [ ] Step 3: Ensure no trailing semicolons break union formatting

---

### Task 5: Verification

**Commands:**
- [ ] Step 1: Run validation
  - Run: `npm run validate:study`
  - Expected: `study content OK`
- [ ] Step 2: Run lint + build
  - Run: `npm run lint && npm run build`
  - Expected: no ESLint warnings; build succeeds
- [ ] Step 3: Run preview and spot-check pages
  - Run: `npm run start -- -p 3000`
  - Check:
    - `/study/mx-v1-016` (guide)
    - `/original/mx-v1-016` (original)
    - `/training` (new exercise appears and renders)

