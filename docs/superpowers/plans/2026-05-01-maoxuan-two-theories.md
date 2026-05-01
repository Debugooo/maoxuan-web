# 毛选“方法论两论”（实践论/矛盾论）知识库落地 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在仓库内新增《实践论》《矛盾论》两篇“研讨级”单篇 Markdown 文档，并配套索引与校验脚本，作为后续全四卷知识库的核心思维操作系统内核。

**Architecture:** 内容以 Markdown 作为单一事实来源（SSOT），每篇按固定 01-05 阶梯结构组织，并在 YAML frontmatter 中标注核心等级、标签与现代场景适配度；通过一个轻量校验脚本保证结构一致性，方便规模化扩展到全四卷。

**Tech Stack:** Next.js 14 / TypeScript / Node.js（校验脚本）/ Markdown（内容源）

---

## File Structure

- Create: `/workspace/content/maoxuan/README.md`
- Create: `/workspace/content/maoxuan/《实践论》.md`
- Create: `/workspace/content/maoxuan/《矛盾论》.md`
- Create: `/workspace/content/maoxuan/index.md`
- Create: `/workspace/scripts/validate-maoxuan-md.mjs`
- Modify: `/workspace/package.json`

---

### Task 1: 建立内容目录与命名/结构约定

**Files:**
- Create: `/workspace/content/maoxuan/README.md`

- [ ] **Step 1: 创建内容目录**

Run:

```bash
mkdir -p /workspace/content/maoxuan /workspace/scripts
```

- [ ] **Step 2: 写入内容约定 README**

Create `/workspace/content/maoxuan/README.md`:

```md
# 毛选内容库约定

## 文件命名

- 单篇文档：`《篇名》.md`
- 索引文档：`index.md`

## 单篇 frontmatter（必填）

- slug: URL 友好标识（建议用拼音或英文短语）
- title: 篇名（含书名号）
- volume: 卷信息（未知可填 1-4 或留空字符串）
- core_level: S / A / B
- tags: 方法论标签（矛盾/实践/调查/组织/战略/战术/资源/复盘 等）
- scenarios: 现代场景适配度（high/medium/low）

## 单篇正文结构（必填）

每篇必须包含以下 5 个一级标题（完全一致，用于自动校验与索引）：

- 01 局势快照（20%）
- 02 思维骨架（40%）
- 03 知识图鉴（60%）
- 04 底层解码（80%）
- 05 认知破局（100%）

其中 05 必须包含：
- 可调用模型（输入→判断→动作→校验）
- 六场景推演（职场/创业/抉择/人际/家庭/教育）
- 复盘模板
- 研讨练习题
```

- [ ] **Step 3: 验证 README 可被正常查看**

Run:

```bash
ls -la /workspace/content/maoxuan && sed -n '1,120p' /workspace/content/maoxuan/README.md
```

Expected: 目录存在，README 内容可读。

---

### Task 2: 生成两篇“研讨级”单篇 Markdown 骨架（含元信息）

**Files:**
- Create: `/workspace/content/maoxuan/《实践论》.md`
- Create: `/workspace/content/maoxuan/《矛盾论》.md`

- [ ] **Step 1: 创建《实践论》.md（骨架+元信息）**

Create `/workspace/content/maoxuan/《实践论》.md`:

```md
---
slug: shijianlun
title: 《实践论》
volume: "1"
core_level: S
tags:
  - 方法论
  - 实践
  - 认识论
  - 调查研究
  - 复盘
scenarios:
  职场内卷: high
  创业困境: high
  人生抉择: high
  人际交往: medium
  家庭生活: medium
  家庭教育: high
---

# 《实践论》｜现实校验引擎（Reality → Action）

一句硬核结论：用实践把认知变成可验证的行动闭环，所有“想清楚再动手”的拖延都是认知逃避。

## 01 局势快照（20%）

## 02 思维骨架（40%）

## 03 知识图鉴（60%）

## 04 底层解码（80%）

## 05 认知破局（100%）
```

- [ ] **Step 2: 创建《矛盾论》.md（骨架+元信息）**

Create `/workspace/content/maoxuan/《矛盾论》.md`:

```md
---
slug: maodunlun
title: 《矛盾论》
volume: "1"
core_level: S
tags:
  - 方法论
  - 矛盾分析
  - 战略
  - 集中力量
  - 结构化决策
scenarios:
  职场内卷: high
  创业困境: high
  人生抉择: high
  人际交往: high
  家庭生活: high
  家庭教育: medium
---

# 《矛盾论》｜局势建模引擎（Problem → Structure）

一句硬核结论：复杂局面不是“难”，而是你没画出矛盾结构；抓错主要矛盾，所有努力都会变成内耗。

## 01 局势快照（20%）

## 02 思维骨架（40%）

## 03 知识图鉴（60%）

## 04 底层解码（80%）

## 05 认知破局（100%）
```

- [ ] **Step 3: 验证两篇文件名与结构**

Run:

```bash
ls -la /workspace/content/maoxuan && sed -n '1,80p' /workspace/content/maoxuan/《实践论》.md && sed -n '1,80p' /workspace/content/maoxuan/《矛盾论》.md
```

Expected: 两个文件存在，frontmatter 存在，5 个一级标题存在。

---

### Task 3: 将两篇补全为“研讨级”内容（结构化、可训练、可调用）

**Files:**
- Modify: `/workspace/content/maoxuan/《实践论》.md`
- Modify: `/workspace/content/maoxuan/《矛盾论》.md`

- [ ] **Step 1: 补全《实践论》｜01-05 五层内容**

编辑 `/workspace/content/maoxuan/《实践论》.md`，逐段补齐以下内容块（每一块必须可直接用于现实决策/行动）：

```md
## 01 局势快照（20%）
- 这篇解决的核心博弈：
- 赢的判据：
- 最常见的认知失败（至少 6 条，对应六场景）：

## 02 思维骨架（40%）
- 全文论证链（用 6-12 条要点串起）：
- 关键概念最小定义（感性/理性、两次飞跃、真理标准等）：

## 03 知识图鉴（60%）
- 认识迭代闭环（输入→假设→试验→证伪→升级）：
- 教条主义 vs 经验主义（当代等价物对照 + 失败信号）：

## 04 底层解码（80%）
- 写作处境的关键约束（只写足以解释“为什么必须强调实践/调查”）：
- 这篇在当时要解决的组织性问题是什么：

## 05 认知破局（100%）
### 可调用模型
#### 模型A：调查研究四步法
- 输入：
- 判断：
- 动作：
- 校验：
- 失败信号与止损：

#### 模型B：小步试验（低成本试错）算法
- 输入：
- 判断：
- 动作：
- 校验：
- 失败信号与止损：

### 六场景推演（每个给“动作序列 + 风险提示 + 一条可复用原则”）
- 职场内卷：
- 创业困境：
- 人生抉择：
- 人际交往：
- 家庭生活：
- 家庭教育：

### 复盘模板（可直接复制使用）
1. 目标与胜负指标：
2. 事实与证据（不要观点）：
3. 假设与推理链：
4. 行动试验设计：
5. 结果与偏差：
6. 下一轮最小动作：

### 研讨练习题（至少 3 题）
1.
2.
3.
```

- [ ] **Step 2: 补全《矛盾论》｜01-05 五层内容**

编辑 `/workspace/content/maoxuan/《矛盾论》.md`，逐段补齐以下内容块：

```md
## 01 局势快照（20%）
- 这篇解决的核心博弈：
- 赢的判据：
- 典型失败：抓错主要矛盾/主要方面/阶段（至少 6 条，对应六场景）：

## 02 思维骨架（40%）
- 全文论证链（用 8-14 条要点串起）：
- 关键概念最小定义（普遍性/特殊性，主次矛盾，主要方面，同一性/斗争性等）：

## 03 知识图鉴（60%）
- 矛盾图谱画法（步骤 + 示例）：
- 主要矛盾判定规则（可操作判据，不用抽象形容词）：
- 阶段切换表（防御/相持/反攻在当代的等价物）：

## 04 底层解码（80%）
- 敌强我弱条件下为什么必须“集中优势兵力”：
- 内部不统一时的优先级怎么定：

## 05 认知破局（100%）
### 可调用模型
#### 模型A：主要矛盾判定算法（胜负指标→瓶颈→杠杆点）
- 输入：
- 判断：
- 动作：
- 校验：
- 失败信号与止损：

#### 模型B：主要方面翻转策略（把弱点变成对方代价）
- 输入：
- 判断：
- 动作：
- 校验：
- 失败信号与止损：

#### 模型C：冲突分级处置（非对抗→对抗的升级/降级阈值）
- 输入：
- 判断：
- 动作：
- 校验：
- 失败信号与止损：

### 六场景推演（每个给“识局→破局→控局”的动作链）
- 职场内卷：
- 创业困境：
- 人生抉择：
- 人际交往：
- 家庭生活：
- 家庭教育：

### 复盘模板（可直接复制使用）
1. 主要矛盾与次要矛盾：
2. 主要方面与次要方面：
3. 集中力量打击点：
4. 阶段判断与节奏：
5. 结果与结构变化：
6. 下一轮策略修正：

### 研讨练习题（至少 3 题）
1.
2.
3.
```

- [ ] **Step 3: 人工验收（研讨级标准）**

Checklist（两篇都必须满足）：
- 5 个一级标题齐全
- 05 中至少 2 个“输入→判断→动作→校验”的模型
- 六场景推演齐全，且每个推演都能落到具体动作
- 至少 1 份可直接复制使用的复盘模板
- 至少 3 道练习题

---

### Task 4: 建立索引入口（按问题调用，而非按年代罗列）

**Files:**
- Create: `/workspace/content/maoxuan/index.md`

- [ ] **Step 1: 创建索引文件**

Create `/workspace/content/maoxuan/index.md`:

```md
# 毛选方法论双核｜索引

## 核心篇（S级）

- 《实践论》：现实校验引擎（Reality → Action）｜适用：内卷、创业、学习、教育
- 《矛盾论》：局势建模引擎（Problem → Structure）｜适用：内卷、创业、抉择、人际、家庭

## 按问题调用

- 信息不全但必须决策：优先《实践论》→ 调查研究四步法 + 小步试验
- 选择太多/用力分散/越努力越没结果：优先《矛盾论》→ 主要矛盾判定 + 集中打击点
- 冲突升级/关系撕裂风险：优先《矛盾论》→ 冲突分级处置
- 方案落地难/执行反复失败：优先《实践论》→ 复盘模板 + 认识迭代闭环
```

- [ ] **Step 2: 检查索引可读**

Run:

```bash
sed -n '1,120p' /workspace/content/maoxuan/index.md
```

Expected: 索引可作为“调用入口”使用。

---

### Task 5: 加入结构校验脚本（保证未来规模化扩展不会跑偏）

**Files:**
- Create: `/workspace/scripts/validate-maoxuan-md.mjs`
- Modify: `/workspace/package.json`

- [ ] **Step 1: 创建校验脚本**

Create `/workspace/scripts/validate-maoxuan-md.mjs`:

```js
import fs from 'node:fs';
import path from 'node:path';

const ROOT = '/workspace/content/maoxuan';
const REQUIRED_HEADINGS = [
  '## 01 局势快照（20%）',
  '## 02 思维骨架（40%）',
  '## 03 知识图鉴（60%）',
  '## 04 底层解码（80%）',
  '## 05 认知破局（100%）',
];

function listMdFiles(dir) {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md') && f !== 'README.md' && f !== 'index.md')
    .map((f) => path.join(dir, f));
}

function hasFrontmatter(content) {
  return content.startsWith('---\n') && content.includes('\n---\n');
}

function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const rel = path.relative('/workspace', filePath);

  if (!hasFrontmatter(content)) {
    return { ok: false, message: `${rel}: missing YAML frontmatter` };
  }

  const missing = REQUIRED_HEADINGS.filter((h) => !content.includes(h));
  if (missing.length) {
    return { ok: false, message: `${rel}: missing headings: ${missing.join(', ')}` };
  }

  return { ok: true, message: `${rel}: OK` };
}

function main() {
  if (!fs.existsSync(ROOT)) {
    console.error(`content root not found: ${ROOT}`);
    process.exit(1);
  }

  const files = listMdFiles(ROOT);
  if (!files.length) {
    console.error('no chapter md files found');
    process.exit(1);
  }

  const results = files.map(validateFile);
  const failed = results.filter((r) => !r.ok);

  results.forEach((r) => console.log(r.message));

  if (failed.length) process.exit(1);
}

main();
```

- [ ] **Step 2: 将校验命令加入 npm scripts**

Update `/workspace/package.json` scripts:

```json
{
  "scripts": {
    "validate:content": "node scripts/validate-maoxuan-md.mjs"
  }
}
```

- [ ] **Step 3: 运行校验**

Run:

```bash
npm run validate:content
```

Expected: 输出每个 md 文件 `OK`，命令 exit code 为 0。

---

## Spec Coverage Self-Review

- 需求“先攻方法论两论”：Task 2/3 直接覆盖（两篇单篇 md）
- 需求“研讨级”：Task 3 的内容清单（模型+六场景+复盘+练习题）作为验收标准
- 需求“核心篇目标记”：frontmatter `core_level: S` + 索引 Task 4
- 需求“现代场景侧重”：frontmatter `scenarios` + Task 3 的六场景推演

## Placeholder Scan

本计划不使用 TBD/TODO；内容补全步骤用“必须包含的结构块”来约束输出，避免写作偏离与遗漏。

---

## Execution Handoff

Plan complete and saved to `/workspace/docs/superpowers/plans/2026-05-01-maoxuan-two-theories.md`. Two execution options:

1. **Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration
2. **Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?

