# 第 1 卷剩余篇章（000–015）生成 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `/content/maoxuan/` 生成第一卷除《实践论》《矛盾论》外的 16 篇深写版章节，满足校验规则并在 `/library` 可浏览。

**Architecture:** 以“统一模板（01–05）+ 统一 frontmatter + core_level/tags/scenarios 标准化”生成；每篇内容输出为“当代生存斗争系统”的方法论转译（非原文全文搬运）。

**Tech Stack:** Next.js App Router（已存在）、Markdown（gray-matter + react-markdown）、内容校验脚本 `scripts/validate-maoxuan-md.mjs`。

---

## 文件结构与职责

**新增（内容文件）**
- Create: `/workspace/content/maoxuan/《中国社会各阶级的分析》.md`
- Create: `/workspace/content/maoxuan/《湖南农民运动考察报告》.md`
- Create: `/workspace/content/maoxuan/《中国的红色政权为什么能够存在？》.md`
- Create: `/workspace/content/maoxuan/《井冈山的斗争》.md`
- Create: `/workspace/content/maoxuan/《关于纠正党内的错误思想》.md`
- Create: `/workspace/content/maoxuan/《星星之火，可以燎原》.md`
- Create: `/workspace/content/maoxuan/《反对本本主义》.md`
- Create: `/workspace/content/maoxuan/《必须注意经济工作》.md`
- Create: `/workspace/content/maoxuan/《怎样分析农村阶级》.md`
- Create: `/workspace/content/maoxuan/《我们的经济政策》.md`
- Create: `/workspace/content/maoxuan/《关心群众生活，注意工作方法》.md`
- Create: `/workspace/content/maoxuan/《论反对日本帝国主义的策略》.md`
- Create: `/workspace/content/maoxuan/《中国革命战争的战略问题》.md`
- Create: `/workspace/content/maoxuan/《关于蒋介石声明的声明》.md`
- Create: `/workspace/content/maoxuan/《中国共产党在抗日时期的任务》.md`
- Create: `/workspace/content/maoxuan/《为争取千百万群众进入抗日民族统一战线而斗争》.md`

**已有（不改）**
- `/workspace/content/maoxuan/《实践论》.md`
- `/workspace/content/maoxuan/《矛盾论》.md`

## 统一 frontmatter 规则

每篇必须包含：

```yaml
---
slug: v1-000
title: 中国社会各阶级的分析
volume: "1"
core_level: A
tags:
  - 阶级分析
  - 组织
  - 战略
  - 群众路线
scenarios:
  职场内卷: high
  创业困境: medium
  人生抉择: medium
  人际交往: medium
  家庭生活: low
  家庭教育: low
summary: 一句话定位
---
```

## 正文模板（每篇必须包含以下 01–05 标题）

```md
# 《标题》｜一句话定位（引擎/算法/武器库命名）

一句硬核结论：……

## 01 局势快照（20%）

## 02 思维骨架（40%）

## 03 知识图鉴（60%）

## 04 底层解码（80%）

## 05 认知破局（100%）
```

---

### Task 1：生成 16 篇文件骨架（frontmatter + 01–05 结构）

**Files:**
- Create: 上述 16 个 `/workspace/content/maoxuan/*.md`
- Test: `npm run validate:content`

- [ ] **Step 1：为 v1-000…v1-015 确定 slug/标题/文件名映射**

映射表（固定）：

```text
v1-000 中国社会各阶级的分析
v1-001 湖南农民运动考察报告
v1-002 中国的红色政权为什么能够存在？
v1-003 井冈山的斗争
v1-004 关于纠正党内的错误思想
v1-005 星星之火，可以燎原
v1-006 反对本本主义
v1-007 必须注意经济工作
v1-008 怎样分析农村阶级
v1-009 我们的经济政策
v1-010 关心群众生活，注意工作方法
v1-011 论反对日本帝国主义的策略
v1-012 中国革命战争的战略问题
v1-013 关于蒋介石声明的声明
v1-014 中国共产党在抗日时期的任务
v1-015 为争取千百万群众进入抗日民族统一战线而斗争
```

- [ ] **Step 2：创建每个文件的 frontmatter（volume 固定为 "1"）**

规则：
- core_level 初始赋值：优先 A；明显“系统级方法/战略框架”的设为 S；明显“材料/专项支撑”的设为 B
- tags 从 spec 的“标签词表”选 4–8 个
- scenarios 六场景必须全填（high/medium/low）

- [ ] **Step 3：写入正文模板（只写标题，不留空 YAML）**

- [ ] **Step 4：运行内容校验**

Run:

```bash
npm run validate:content
```

Expected: 16 篇新文件均 `OK`。

- [ ] **Step 5：可选提交**

```bash
git add content/maoxuan/*.md
git commit -m "content(v1): add volume1 chapters skeleton"
```

---

### Task 2：逐篇补全“深写版”正文（每篇都能被工具箱/训练复用）

**Files:**
- Modify: `/workspace/content/maoxuan/《…》.md`（16 篇）
- Test: `npm run validate:content`

每篇写作检查清单（落到内容里）：
- [ ] 顶部“硬核结论”必须是可执行/可判定句
- [ ] 01：至少 1 个长案例 + 5–8 个概念最小定义 + 3 条可操作结论
- [ ] 02：至少 6 条论证链 + 2 条误区 + 一条流程化落地步骤
- [ ] 03：至少 1 个清单/判据/模板 + 1 个文本图 + 术语对照
- [ ] 04：明确适用/失效条件 + 杠杆点识别信号
- [ ] 05：至少 2 个“模型A/模型B”（含输入/步骤/校验/止损）+ 六场景推演 + 复盘模板 + 3 道练习题

- [ ] **Step 1：按 core_level 先写 S/A 再写 B（保证系统主干优先可用）**

建议优先序（可调整）：
1) v1-012 中国革命战争的战略问题（倾向 S）
2) v1-011 论反对日本帝国主义的策略（A/S 之间）
3) v1-006 反对本本主义（A）
4) v1-005 星星之火，可以燎原（A）
5) v1-004 关于纠正党内的错误思想（A）
…其余依次补齐

- [ ] **Step 2：每写完 1 篇即跑一次校验，避免积累错误**

Run:

```bash
npm run validate:content
```

Expected: 全部 `OK`。

- [ ] **Step 3：可选提交（按篇或按批次）**

```bash
git add content/maoxuan/《xxx》.md
git commit -m "content(v1): add 《xxx》 deep chapter"
```

---

### Task 3：最终可用性验收

**Files:**
- Test only

- [ ] **Step 1：构建校验**

Run:

```bash
npm run build
```

Expected: build 成功，且路由 `/library`、`/library/[slug]` 正常生成。

- [ ] **Step 2：启动开发服务器与手工走查**

Run:

```bash
npm run dev -- --port 3000 --hostname 0.0.0.0
```

Check:
- `/library` 能看到新增 16 篇，且 S/A/B 分类可用
- 任意新篇章 `/library/v1-0xx` 可打开，目录树可折叠且状态可记忆
- Markdown 中 h2/h3/h4 锚点跳转正常

