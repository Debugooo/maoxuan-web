# 研读系统“四卷导读 + 分卷目录页（含学习顺序/原书顺序 Tab）” Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `/study` 增加毛选四卷导读卡片，并新增 `/study/volume/v1-v4` 分卷目录页，支持“学习顺序 / 原书顺序”Tab，且每篇同时提供“指南/原文”两个入口（站内优先，否则外链）。

**Architecture:** 用本地静态数据 `src/lib/study/volumes.ts` 作为四卷导读与“原书顺序目录”的数据源；目录页的“学习顺序”Tab 对 v1 读取 `content/maoxuan-cos/index.json` 的 `learningOrder` 过滤生成，v2–v4 暂用原书顺序展平替代。

**Tech Stack:** Next.js 14 App Router、TypeScript、Tailwind（项目现有 class）、本地 JSON 索引读取（server component）。

---

## File Map

- Create:
  - `src/lib/study/volumes.ts`
  - `src/app/study/volume/[volume]/page.tsx`
- Modify:
  - `src/app/study/page.tsx`

---

### Task 1: Add local static data for volumes

**Files:**
- Create: `src/lib/study/volumes.ts`

- [ ] Step 1: Define types (`VolumeId`, `VolumeGuide`, `BookGroupItem`) and export `VOLUMES: VolumeGuide[]`
- [ ] Step 2: Fill v1–v4 guide info (range/label/theme/intro/bullets) and bookGroups/items from Marxists index
  - v1 items include `id: mx-v1-001..mx-v1-018`
  - v2–v4 items have only `title + source_url`

---

### Task 2: Update `/study` to show 4-volume intro cards

**Files:**
- Modify: `src/app/study/page.tsx`

- [ ] Step 1: Import `VOLUMES` and render “毛选四卷导读” section above current sections
- [ ] Step 2: Each volume card shows: range, label, theme, intro, bullets, and link to `/study/volume/<volume>`

---

### Task 3: Implement `/study/volume/[volume]` with two tabs

**Files:**
- Create: `src/app/study/volume/[volume]/page.tsx`

- [ ] Step 1: Load `VolumeGuide` by `params.volume`; 404 for invalid
- [ ] Step 2: Implement Tab UI via querystring `?tab=learning|book` (server component + `Link`)
- [ ] Step 3: Build “learning order” list:
  - v1: load `getStudyIndex()`, filter `learningOrder` ids by `item.volume === 'v1'`
  - v2–v4: flatten `bookGroups` to a list
- [ ] Step 4: Render book order view with groups
- [ ] Step 5: For each item render title + two links:
  - guide: id ? `/study/${id}` : `source_url`
  - original: id ? `/original/${id}` : `source_url`

---

### Task 4: Verification

- [ ] Step 1: Run `npm run lint && npm run build`
- [ ] Step 2: Start server and check:
  - `/study`
  - `/study/volume/v1` tab switching
  - `/study/volume/v2` tab switching
  - “指南/原文” link behaviors (internal vs external)

