# 毛选生存系统 Web 版（Next.js）Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在现有 Next.js 14 项目中实现“毛选生存系统 Web 版”V1：阅读库（双入口）+ 工具箱（模型化输出）+ 训练与复盘（本地保存），并支持后续无痛新增章节 Markdown。

**Architecture:** 内容以 `/content/**/**/*.md` 为单一事实来源（SSOT），服务端读取 + frontmatter 建索引；阅读页服务端渲染 Markdown（含 TOC）；工具箱/训练/复盘为客户端交互模块，使用 LocalStorage 持久化并支持导出 Markdown。

**Tech Stack:** Next.js 14 (App Router) / TypeScript / TailwindCSS / react-markdown + remark-gfm / node:fs（服务端读取内容）

---

## File Structure

- Create: `/workspace/src/lib/maoxuan/types.ts`
- Create: `/workspace/src/lib/maoxuan/slug.ts`
- Create: `/workspace/src/lib/maoxuan/storage.ts`
- Create: `/workspace/src/lib/maoxuan/content.ts`
- Create: `/workspace/src/lib/maoxuan/toc.ts`
- Create: `/workspace/src/app/library/page.tsx`
- Create: `/workspace/src/app/library/[slug]/page.tsx`
- Create: `/workspace/src/app/toolkit/page.tsx`
- Create: `/workspace/src/app/training/page.tsx`
- Create: `/workspace/src/data/questions.ts`
- Modify: `/workspace/src/components/Navigation.tsx`
- Modify: `/workspace/src/app/page.tsx`
- Modify: `/workspace/package.json`

---

### Task 1: 安装 Markdown 渲染与 frontmatter 解析依赖

**Files:**
- Modify: `/workspace/package.json`

- [ ] **Step 1: 安装依赖**

Run:

```bash
npm install gray-matter react-markdown remark-gfm
```

Expected: 安装成功，`package.json` 与 `package-lock.json` 更新。

- [ ] **Step 2: 验证 Next.js build 可通过**

Run:

```bash
npm run build
```

Expected: build exit code 为 0。

---

### Task 2: 建立内容与索引基础（types/slug/toc/content）

**Files:**
- Create: `/workspace/src/lib/maoxuan/types.ts`
- Create: `/workspace/src/lib/maoxuan/slug.ts`
- Create: `/workspace/src/lib/maoxuan/toc.ts`
- Create: `/workspace/src/lib/maoxuan/content.ts`

- [ ] **Step 1: 创建类型定义**

Create `/workspace/src/lib/maoxuan/types.ts`:

```ts
export type CoreLevel = 'S' | 'A' | 'B';
export type ScenarioLevel = 'high' | 'medium' | 'low';

export type ChapterFrontmatter = {
  slug: string;
  title: string;
  volume?: string;
  core_level: CoreLevel;
  tags: string[];
  scenarios?: Record<string, ScenarioLevel>;
  summary?: string;
  date?: string;
  source?: string;
};

export type ChapterIndexItem = ChapterFrontmatter & {
  filePath: string;
};

export type Chapter = ChapterFrontmatter & {
  content: string;
};

export type LibraryIndex = {
  chapters: ChapterIndexItem[];
  volumesMap: Record<string, ChapterIndexItem[]>;
  tagsMap: Record<string, ChapterIndexItem[]>;
};

export type TocItem = {
  depth: 2 | 3 | 4;
  id: string;
  text: string;
};
```

- [ ] **Step 2: 创建 slug 工具**

Create `/workspace/src/lib/maoxuan/slug.ts`:

```ts
export function slugifyHeading(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[\s]+/g, '-')
    .replace(/[^\p{L}\p{N}-]+/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
```

- [ ] **Step 3: 创建 TOC 提取工具（从 Markdown 文本提取标题）**

Create `/workspace/src/lib/maoxuan/toc.ts`:

```ts
import type { TocItem } from './types';
import { slugifyHeading } from './slug';

export function extractToc(markdown: string): TocItem[] {
  const lines = markdown.split('\n');
  const items: TocItem[] = [];

  for (const line of lines) {
    const m = /^(#{2,4})\s+(.+?)\s*$/.exec(line);
    if (!m) continue;

    const depth = m[1].length;
    if (depth < 2 || depth > 4) continue;

    const text = m[2].replace(/\s+#*$/, '').trim();
    const id = slugifyHeading(text);
    if (!id) continue;

    items.push({ depth: depth as 2 | 3 | 4, id, text });
  }

  return items;
}
```

- [ ] **Step 4: 创建内容读取与索引生成（服务端）**

Create `/workspace/src/lib/maoxuan/content.ts`:

```ts
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { Chapter, ChapterFrontmatter, ChapterIndexItem, LibraryIndex } from './types';

const CONTENT_ROOT = path.join(process.cwd(), 'content');

function assertFrontmatter(data: unknown, filePath: string): ChapterFrontmatter {
  const d = data as Partial<ChapterFrontmatter>;

  if (!d || typeof d !== 'object') throw new Error(`Invalid frontmatter in ${filePath}`);
  if (!d.slug || typeof d.slug !== 'string') throw new Error(`Missing slug in ${filePath}`);
  if (!d.title || typeof d.title !== 'string') throw new Error(`Missing title in ${filePath}`);
  if (!d.core_level || !['S', 'A', 'B'].includes(d.core_level)) throw new Error(`Invalid core_level in ${filePath}`);
  if (!Array.isArray(d.tags)) throw new Error(`Missing tags[] in ${filePath}`);

  return {
    slug: d.slug,
    title: d.title,
    volume: d.volume ?? '',
    core_level: d.core_level,
    tags: d.tags,
    scenarios: d.scenarios ?? {},
    summary: d.summary,
    date: d.date,
    source: d.source,
  };
}

function listMarkdownFiles(dir: string) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => path.join(dir, f));
}

export function getLibraryIndex(): LibraryIndex {
  const maoxuanDir = path.join(CONTENT_ROOT, 'maoxuan');
  const files = listMarkdownFiles(maoxuanDir).filter((p) => !p.endsWith('README.md') && !p.endsWith('index.md'));

  const chapters: ChapterIndexItem[] = files.map((filePath) => {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = matter(raw);
    const fm = assertFrontmatter(parsed.data, filePath);
    return { ...fm, filePath };
  });

  const volumesMap: Record<string, ChapterIndexItem[]> = {};
  const tagsMap: Record<string, ChapterIndexItem[]> = {};

  for (const ch of chapters) {
    const vol = ch.volume && ch.volume.trim() ? ch.volume.trim() : '未分卷';
    volumesMap[vol] ??= [];
    volumesMap[vol].push(ch);

    for (const tag of ch.tags) {
      const t = String(tag);
      tagsMap[t] ??= [];
      tagsMap[t].push(ch);
    }
  }

  const sortByTitle = (a: ChapterIndexItem, b: ChapterIndexItem) => a.title.localeCompare(b.title, 'zh-Hans-CN');
  chapters.sort(sortByTitle);
  Object.values(volumesMap).forEach((arr) => arr.sort(sortByTitle));
  Object.values(tagsMap).forEach((arr) => arr.sort(sortByTitle));

  return { chapters, volumesMap, tagsMap };
}

export function getChapterBySlug(slug: string): Chapter | null {
  const index = getLibraryIndex();
  const hit = index.chapters.find((c) => c.slug === slug);
  if (!hit) return null;

  const raw = fs.readFileSync(hit.filePath, 'utf8');
  const parsed = matter(raw);
  const fm = assertFrontmatter(parsed.data, hit.filePath);

  return {
    ...fm,
    content: parsed.content.trim(),
  };
}
```

- [ ] **Step 5: TypeScript 检查**

Run:

```bash
npm run build
```

Expected: build 通过。

---

### Task 3: 阅读库入口页（双入口：按卷/按主题）

**Files:**
- Create: `/workspace/src/app/library/page.tsx`

- [ ] **Step 1: 创建阅读库入口页**

Create `/workspace/src/app/library/page.tsx`:

```tsx
import Link from 'next/link';
import { getLibraryIndex } from '@/lib/maoxuan/content';

export const metadata = {
  title: '阅读库 | 毛选生存系统',
};

export default function LibraryPage() {
  const index = getLibraryIndex();
  const volumes = Object.entries(index.volumesMap);
  const tags = Object.entries(index.tagsMap).sort((a, b) => a[0].localeCompare(b[0], 'zh-Hans-CN'));

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white">阅读库</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">按卷/按主题两种入口组织内容，新增章节 Markdown 会自动出现在这里。</p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">按卷/篇</h2>
          <div className="space-y-5">
            {volumes.map(([vol, chapters]) => (
              <div key={vol}>
                <div className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">{vol}</div>
                <ul className="space-y-2">
                  {chapters.map((c) => (
                    <li key={c.slug}>
                      <Link className="text-slate-900 dark:text-white hover:underline" href={`/library/${c.slug}`}>
                        {c.title}
                      </Link>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">核心等级 {c.core_level} · 标签：{c.tags.join('、')}</div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">按主题/标签</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tags.map(([tag, chapters]) => (
              <div key={tag} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-slate-900 dark:text-white">{tag}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{chapters.length}</div>
                </div>
                <ul className="mt-3 space-y-1">
                  {chapters.slice(0, 6).map((c) => (
                    <li key={c.slug} className="text-sm">
                      <Link className="text-slate-700 dark:text-slate-200 hover:underline" href={`/library/${c.slug}`}>
                        {c.title}
                      </Link>
                    </li>
                  ))}
                  {chapters.length > 6 ? <li className="text-xs text-slate-500 dark:text-slate-400">…</li> : null}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: 运行开发服务器并验证页面**

Run:

```bash
npm run dev -- --port 3000
```

Expected: 访问 `/library` 能看到按卷/按主题两栏，能点击进入两论。

---

### Task 4: 章节阅读页（Markdown 渲染 + TOC + 锚点跳转）

**Files:**
- Create: `/workspace/src/app/library/[slug]/page.tsx`
- Create: `/workspace/src/lib/maoxuan/slug.ts`（已在 Task 2）
- Create: `/workspace/src/lib/maoxuan/toc.ts`（已在 Task 2）

- [ ] **Step 1: 创建阅读页**

Create `/workspace/src/app/library/[slug]/page.tsx`:

```tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getChapterBySlug } from '@/lib/maoxuan/content';
import { extractToc } from '@/lib/maoxuan/toc';
import { slugifyHeading } from '@/lib/maoxuan/slug';

export default function ChapterPage({ params }: { params: { slug: string } }) {
  const chapter = getChapterBySlug(params.slug);
  if (!chapter) notFound();

  const toc = extractToc(chapter.content);

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link href="/library" className="text-sm text-slate-600 dark:text-slate-300 hover:underline">
          ← 返回阅读库
        </Link>
      </div>

      <header className="mb-8">
        <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
          {chapter.volume ? `卷 ${chapter.volume}` : '未分卷'} · 核心等级 {chapter.core_level} · 标签：{chapter.tags.join('、')}
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white">{chapter.title}</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        <aside className="lg:sticky lg:top-6 h-fit border border-slate-200 dark:border-slate-700 rounded-2xl p-4 bg-white/70 dark:bg-slate-900/40 backdrop-blur">
          <div className="text-sm font-semibold text-slate-900 dark:text-white mb-3">目录</div>
          <nav className="space-y-2">
            {toc.map((t) => (
              <a
                key={`${t.id}-${t.text}`}
                href={`#${t.id}`}
                className={[
                  'block text-sm hover:underline text-slate-700 dark:text-slate-200',
                  t.depth === 3 ? 'pl-3 text-[13px]' : '',
                  t.depth === 4 ? 'pl-6 text-[12px]' : '',
                ].join(' ')}
              >
                {t.text}
              </a>
            ))}
          </nav>
        </aside>

        <article className="prose prose-slate dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ children, ...props }) => {
                const text = String(children);
                const id = slugifyHeading(text);
                return (
                  <h2 id={id} {...props}>
                    {children}
                  </h2>
                );
              },
              h3: ({ children, ...props }) => {
                const text = String(children);
                const id = slugifyHeading(text);
                return (
                  <h3 id={id} {...props}>
                    {children}
                  </h3>
                );
              },
              h4: ({ children, ...props }) => {
                const text = String(children);
                const id = slugifyHeading(text);
                return (
                  <h4 id={id} {...props}>
                    {children}
                  </h4>
                );
              },
            }}
          >
            {chapter.content}
          </ReactMarkdown>
        </article>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: 校验 Tailwind Typography（prose）是否可用**

如果 `prose` 样式缺失，检查 `tailwind.config.js` 是否已包含 typography 插件；若没有，则在实现时补装 `@tailwindcss/typography` 并配置。

验证：

```bash
npm run dev -- --port 3000
```

Expected: `/library/shijianlun` 与 `/library/maodunlun` 可正常渲染，目录点击能跳转到标题锚点。

---

### Task 5: 本地保存封装（LocalStorage + 版本字段）

**Files:**
- Create: `/workspace/src/lib/maoxuan/storage.ts`

- [ ] **Step 1: 创建 LocalStorage 工具**

Create `/workspace/src/lib/maoxuan/storage.ts`:

```ts
export type Stored<T> = {
  version: 1;
  updatedAt: number;
  data: T;
};

export function loadFromStorage<T>(key: string): Stored<T> | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Stored<T>;
  } catch {
    return null;
  }
}

export function saveToStorage<T>(key: string, data: T): Stored<T> {
  const stored: Stored<T> = { version: 1, updatedAt: Date.now(), data };
  window.localStorage.setItem(key, JSON.stringify(stored));
  return stored;
}
```

- [ ] **Step 2: 在浏览器控制台手动验证**

启动 dev server，进入任意页面，在 console 执行：

```js
localStorage.setItem('maoxuan.test', JSON.stringify({ version: 1, updatedAt: Date.now(), data: { ok: true } }))
```

Expected: 刷新后仍存在。

---

### Task 6: 工具箱页（结构化引导 + 保存 runs）

**Files:**
- Create: `/workspace/src/app/toolkit/page.tsx`

- [ ] **Step 1: 创建工具箱页面（客户端组件）**

Create `/workspace/src/app/toolkit/page.tsx`:

```tsx
'use client';

import { useMemo, useState } from 'react';
import { loadFromStorage, saveToStorage } from '@/lib/maoxuan/storage';

type ToolkitModelId = 'shijian.a' | 'shijian.b' | 'maodun.a' | 'maodun.c';

type ToolkitRun = {
  id: string;
  createdAt: number;
  modelId: ToolkitModelId;
  input: {
    situation: string;
    constraints: string;
    successMetric: string;
  };
  output: {
    restatement: string;
    steps: string[];
    validation: string[];
    stopLoss: string[];
    nextSmallAction: string;
  };
};

const STORAGE_KEY = 'maoxuan.toolkit.runs';

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function generateOutput(modelId: ToolkitModelId, situation: string, constraints: string, successMetric: string): ToolkitRun['output'] {
  const base = {
    restatement: `处境重述：${situation.trim() || '（未填写）'}。约束：${constraints.trim() || '（未填写）'}。胜负指标：${successMetric.trim() || '（未填写）'}`,
    steps: [
      '把问题改写成 1 条可检验命题（If-Then）',
      '列出 3 个关键不确定性（缺它就会走偏）',
      '设计 1 个最小试验（对照/时间窗/成本上限）',
      '执行并记录结果与偏差',
      '复盘并进入下一轮最小动作',
    ],
    validation: ['指标口径一致', '时间窗明确', '对照可复现'],
    stopLoss: ['变量太多导致无法归因 → 收敛为 1 个变量', '成本超预算/超时间窗 → 立即停止并复盘', '指标无显著变化 → 重新定位瓶颈'],
    nextSmallAction: '下一轮最小动作：把“关键不确定性 Top 1”做成一个 48 小时内可验证的小试验。',
  };

  if (modelId === 'maodun.a') {
    return {
      restatement: base.restatement,
      steps: [
        '写出本阶段胜负指标（只能 1 条）',
        '列出 3–5 个矛盾对（X vs Y）',
        '用判据选出主要矛盾（必达性/解释力/带动性/可杠杆）',
        '判定主要方面（谁在决定局势面貌）',
        '集中资源打击点并设止损',
      ],
      validation: ['主要方面开始转移', '胜负指标出现结构性改善', '次要矛盾随之缓解'],
      stopLoss: ['投入大但结构不动 → 回到瓶颈定位', '主要矛盾判断反复摇摆 → 先做低成本定位试验'],
      nextSmallAction: '下一轮最小动作：只做一件能改变主要方面的杠杆动作，并用 7 天窗口检验。',
    };
  }

  if (modelId === 'maodun.c') {
    return {
      restatement: base.restatement,
      steps: ['给冲突分级（0/1/2）', '设升级阈值与降级阈值', '0 级补信息、1 级谈交换与规则、2 级设边界/退出', '复盘冲突成本与目标推进'],
      validation: ['冲突成本下降', '规则被遵守', '目标推进更快'],
      stopLoss: ['对方持续破坏规则 → 升级或退出战场', '反复升级 → 重新设阈值与底线'],
      nextSmallAction: '下一轮最小动作：把“阈值”写成可观察行为，并在 1 次对话/会议中验证。',
    };
  }

  return base;
}

export default function ToolkitPage() {
  const stored = useMemo(() => loadFromStorage<ToolkitRun[]>(STORAGE_KEY), []);
  const [runs, setRuns] = useState<ToolkitRun[]>(stored?.data ?? []);

  const [modelId, setModelId] = useState<ToolkitModelId>('shijian.a');
  const [situation, setSituation] = useState('');
  const [constraints, setConstraints] = useState('');
  const [successMetric, setSuccessMetric] = useState('');

  function onSave() {
    const output = generateOutput(modelId, situation, constraints, successMetric);
    const run: ToolkitRun = {
      id: uid(),
      createdAt: Date.now(),
      modelId,
      input: { situation, constraints, successMetric },
      output,
    };

    const next = [run, ...runs].slice(0, 50);
    setRuns(next);
    saveToStorage(STORAGE_KEY, next);
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white">生存工具箱</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">输入处境，按模型输出行动步骤、校验与止损，并支持本地保存。</p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">选择模型</label>
          <select
            className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
            value={modelId}
            onChange={(e) => setModelId(e.target.value as ToolkitModelId)}
          >
            <option value="shijian.a">《实践论》模型A：调查研究四步法</option>
            <option value="shijian.b">《实践论》模型B：小步试验算法</option>
            <option value="maodun.a">《矛盾论》模型A：主要矛盾判定算法</option>
            <option value="maodun.c">《矛盾论》模型C：冲突分级处置</option>
          </select>

          <div className="mt-5 space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">你的处境（尽量具体）</label>
              <textarea
                className="mt-2 w-full min-h-28 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">约束（时间/资源/风险）</label>
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">胜负指标（1 条）</label>
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
                value={successMetric}
                onChange={(e) => setSuccessMetric(e.target.value)}
              />
            </div>
          </div>

          <button
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2 font-semibold"
            onClick={onSave}
          >
            生成并保存
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">最近记录</h2>
          <div className="mt-4 space-y-3 max-h-[560px] overflow-auto pr-1">
            {runs.length === 0 ? <div className="text-sm text-slate-600 dark:text-slate-300">暂无记录</div> : null}
            {runs.map((r) => (
              <div key={r.id} className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {new Date(r.createdAt).toLocaleString('zh-CN')} · {r.modelId}
                </div>
                <div className="mt-2 text-sm text-slate-900 dark:text-white whitespace-pre-wrap">{r.output.restatement}</div>
                <div className="mt-3 text-xs text-slate-600 dark:text-slate-300">
                  下一步：{r.output.nextSmallAction}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: 手动验证保存**

Run:

```bash
npm run dev -- --port 3000
```

Expected:
- 访问 `/toolkit`，点击“生成并保存”
- 刷新页面后“最近记录”仍存在
- LocalStorage 中存在 `maoxuan.toolkit.runs`

---

### Task 7: 训练与复盘页（题库 + 模板填写 + 导出）

**Files:**
- Create: `/workspace/src/data/questions.ts`
- Create: `/workspace/src/app/training/page.tsx`

- [ ] **Step 1: 创建题库数据（V1 两论各 ≥3）**

Create `/workspace/src/data/questions.ts`:

```ts
export type TrainingQuestion = {
  id: string;
  chapterSlug: 'shijianlun' | 'maodunlun';
  tags: string[];
  title: string;
  prompt: string;
};

export const trainingQuestions: TrainingQuestion[] = [
  {
    id: 'shijian-1',
    chapterSlug: 'shijianlun',
    tags: ['实践', '调查研究'],
    title: '把争论改写成可检验命题',
    prompt: '选一个你最近的争论（工作/家庭/选择），把它改写成 1 条 If-Then 命题，并写出一个 48 小时内完成的小试验。',
  },
  {
    id: 'shijian-2',
    chapterSlug: 'shijianlun',
    tags: ['试验', '止损'],
    title: '设计最小试验与止损阈值',
    prompt: '你当前最不确定的一件事是什么？写出成功阈值、成本上限、失败即止损条件。',
  },
  {
    id: 'shijian-3',
    chapterSlug: 'shijianlun',
    tags: ['复盘', '认识迭代'],
    title: '用复盘模板写一页纸',
    prompt: '用实践论复盘模板，复盘你最近一次失败/返工：目标、事实证据、假设、试验、结果偏差、下一轮最小动作。',
  },
  {
    id: 'maodun-1',
    chapterSlug: 'maodunlun',
    tags: ['主要矛盾', '结构化'],
    title: '列出矛盾对并选主要矛盾',
    prompt: '列出 3–5 个矛盾对（X vs Y），用四条判据选出主要矛盾，并写出打击点。',
  },
  {
    id: 'maodun-2',
    chapterSlug: 'maodunlun',
    tags: ['主要方面', '阶段'],
    title: '判定主要方面与阶段切换',
    prompt: '你当前处境的主要方面是什么？如果主要方面翻转，意味着什么打法切换？写出一个可观察的翻转信号。',
  },
  {
    id: 'maodun-3',
    chapterSlug: 'maodunlun',
    tags: ['冲突', '边界'],
    title: '冲突分级处置',
    prompt: '给一段冲突分级（0/1/2），写出升级阈值与降级阈值，并给出一条“下一步最小动作”。',
  },
];
```

- [ ] **Step 2: 创建训练与复盘页面（本地保存 + 导出）**

Create `/workspace/src/app/training/page.tsx`:

```tsx
'use client';

import { useMemo, useState } from 'react';
import { trainingQuestions } from '@/data/questions';
import { loadFromStorage, saveToStorage } from '@/lib/maoxuan/storage';

type Answer = {
  questionId: string;
  updatedAt: number;
  text: string;
};

type Review = {
  id: string;
  updatedAt: number;
  template: 'shijian' | 'maodun';
  fields: Record<string, string>;
};

const ANSWERS_KEY = 'maoxuan.training.answers';
const REVIEWS_KEY = 'maoxuan.reviews';

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function download(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function TrainingPage() {
  const storedAnswers = useMemo(() => loadFromStorage<Answer[]>(ANSWERS_KEY), []);
  const storedReviews = useMemo(() => loadFromStorage<Review[]>(REVIEWS_KEY), []);

  const [answers, setAnswers] = useState<Answer[]>(storedAnswers?.data ?? []);
  const [reviews, setReviews] = useState<Review[]>(storedReviews?.data ?? []);

  const [activeQuestionId, setActiveQuestionId] = useState(trainingQuestions[0]?.id ?? '');
  const [tab, setTab] = useState<'questions' | 'reviews'>('questions');

  const activeAnswer = answers.find((a) => a.questionId === activeQuestionId)?.text ?? '';

  function setAnswer(text: string) {
    const next: Answer[] = [
      { questionId: activeQuestionId, updatedAt: Date.now(), text },
      ...answers.filter((a) => a.questionId !== activeQuestionId),
    ];
    setAnswers(next);
    saveToStorage(ANSWERS_KEY, next);
  }

  function createReview(template: Review['template']) {
    const review: Review = { id: uid(), updatedAt: Date.now(), template, fields: {} };
    const next = [review, ...reviews].slice(0, 50);
    setReviews(next);
    saveToStorage(REVIEWS_KEY, next);
  }

  function updateReview(id: string, key: string, value: string) {
    const next = reviews.map((r) => (r.id === id ? { ...r, updatedAt: Date.now(), fields: { ...r.fields, [key]: value } } : r));
    setReviews(next);
    saveToStorage(REVIEWS_KEY, next);
  }

  function exportReview(r: Review) {
    const title = r.template === 'shijian' ? '实践论复盘' : '矛盾论复盘';
    const lines = [`# ${title}`, '', `更新时间：${new Date(r.updatedAt).toLocaleString('zh-CN')}`, ''];
    for (const [k, v] of Object.entries(r.fields)) {
      lines.push(`## ${k}`, '', v || '（未填写）', '');
    }
    download(`${title}-${r.id}.md`, lines.join('\n'));
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white">训练与复盘</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">题库练习 + 复盘模板填写，本地自动保存并支持导出。</p>
      </header>

      <div className="flex gap-2 mb-6">
        <button
          className={`px-4 py-2 rounded-xl border ${tab === 'questions' ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'}`}
          onClick={() => setTab('questions')}
        >
          题库
        </button>
        <button
          className={`px-4 py-2 rounded-xl border ${tab === 'reviews' ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'}`}
          onClick={() => setTab('reviews')}
        >
          复盘
        </button>
      </div>

      {tab === 'questions' ? (
        <section className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
            <div className="text-sm font-semibold text-slate-900 dark:text-white mb-3">题目</div>
            <div className="space-y-2">
              {trainingQuestions.map((q) => (
                <button
                  key={q.id}
                  onClick={() => setActiveQuestionId(q.id)}
                  className={`w-full text-left rounded-xl p-3 border ${activeQuestionId === q.id ? 'border-slate-900 dark:border-white' : 'border-slate-200 dark:border-slate-700'}`}
                >
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">{q.title}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{q.tags.join(' / ')}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
            {(() => {
              const q = trainingQuestions.find((x) => x.id === activeQuestionId);
              if (!q) return null;
              return (
                <>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{q.chapterSlug}</div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-2">{q.title}</h2>
                  <p className="mt-3 text-slate-700 dark:text-slate-200 whitespace-pre-wrap">{q.prompt}</p>

                  <div className="mt-6">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">你的答案（自动保存）</label>
                    <textarea
                      className="mt-2 w-full min-h-56 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
                      value={activeAnswer}
                      onChange={(e) => setAnswer(e.target.value)}
                    />
                  </div>
                </>
              );
            })()}
          </div>
        </section>
      ) : (
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">复盘模板</h2>
              <div className="flex gap-2">
                <button className="px-3 py-2 rounded-xl bg-slate-900 text-white" onClick={() => createReview('shijian')}>
                  新建实践论复盘
                </button>
                <button className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700" onClick={() => createReview('maodun')}>
                  新建矛盾论复盘
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {r.template === 'shijian' ? '实践论复盘' : '矛盾论复盘'} · {new Date(r.updatedAt).toLocaleString('zh-CN')}
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-3">
                    {(r.template === 'shijian'
                      ? ['目标与胜负指标', '事实与证据', '假设与推理链', '行动试验设计', '结果与偏差', '下一轮最小动作']
                      : ['主要矛盾与次要矛盾', '主要方面与次要方面', '集中力量打击点', '阶段判断与节奏', '结果与结构变化', '下一轮策略修正']
                    ).map((k) => (
                      <div key={k}>
                        <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">{k}</div>
                        <textarea
                          className="mt-2 w-full min-h-20 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
                          value={r.fields[k] ?? ''}
                          onChange={(e) => updateReview(r.id, k, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                  <button className="mt-4 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700" onClick={() => exportReview(r)}>
                    导出 Markdown
                  </button>
                </div>
              ))}
              {reviews.length === 0 ? <div className="text-sm text-slate-600 dark:text-slate-300">尚无复盘记录</div> : null}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">提示</h2>
            <ul className="mt-3 text-sm text-slate-700 dark:text-slate-200 space-y-2">
              <li>复盘默认本地保存，不需要登录。</li>
              <li>建议每次只抓一个“下一轮最小动作”，减少自嗨式复盘。</li>
              <li>导出 Markdown 后可放回仓库或个人笔记系统。</li>
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}
```

- [ ] **Step 3: 手动验收**

Run:

```bash
npm run dev -- --port 3000
```

Expected:
- `/training`：题目可切换，输入后刷新仍保留
- 新建复盘后填写内容可保存，刷新不丢
- 点击“导出 Markdown”可下载文件

---

### Task 8: 导航与首页升级为“系统入口”

**Files:**
- Modify: `/workspace/src/components/Navigation.tsx`
- Modify: `/workspace/src/app/page.tsx`

- [ ] **Step 1: 更新导航项（Dashboard/阅读库/工具箱/训练）**

编辑 `/workspace/src/components/Navigation.tsx`，将导航链接替换为：

- `/` 仪表盘
- `/library` 阅读库
- `/toolkit` 工具箱
- `/training` 训练与复盘

（实现时遵循该文件现有组件风格与 Tailwind class 规范）

- [ ] **Step 2: 更新首页为 Dashboard**

编辑 `/workspace/src/app/page.tsx`，替换为 Dashboard 内容：

- 顶部：系统标题 + 一句话定位
- 卡片区：三大入口快捷卡（阅读库/工具箱/训练）
- 推荐：两论双核入口（链接到 `/library/shijianlun` 与 `/library/maodunlun`）
- 最近记录：从 LocalStorage 展示最近 3 条 toolkit runs / reviews（无记录则显示空态）

（Dashboard 可先做最小实现；最近记录可在 V1 简化为“提示用户去对应页面查看”）

- [ ] **Step 3: 手动验收导航可达**

Run:

```bash
npm run dev -- --port 3000
```

Expected: 三个新页面均可从导航进入，且返回链路正常。

---

### Task 9: “新增章节无痛接入”验证

**Files:**
- Create: `/workspace/content/maoxuan/《示例章节》.md`（仅用于验证，可在验收后保留或删除）

- [ ] **Step 1: 新增一个示例章节 Markdown**

Create `/workspace/content/maoxuan/《示例章节》.md`:

```md
---
slug: sample-chapter
title: 《示例章节》
volume: "1"
core_level: B
tags:
  - 示例
  - 方法论
scenarios:
  职场内卷: medium
---

# 《示例章节》｜用于验证索引

## 01 局势快照（20%）

## 02 思维骨架（40%）

## 03 知识图鉴（60%）

## 04 底层解码（80%）

## 05 认知破局（100%）
```

- [ ] **Step 2: 运行内容校验脚本**

Run:

```bash
npm run validate:content
```

Expected: 输出 `content/maoxuan/《示例章节》.md: OK`。

- [ ] **Step 3: 验证阅读库双入口出现新章节**

Run:

```bash
npm run dev -- --port 3000
```

Expected:
- `/library` 的“按卷/篇”里出现《示例章节》
- “按主题/标签”里示例相关 tag 可点进章节

---

### Task 10: 全量质量校验

**Files:**
- Modify: (multiple)

- [ ] **Step 1: Lint**

Run:

```bash
npm run lint
```

Expected: exit code 为 0。

- [ ] **Step 2: Build**

Run:

```bash
npm run build
```

Expected: exit code 为 0。

---

## Spec Coverage Self-Review

- 阅读库双入口：Task 3 + Task 4 覆盖
- 工具箱（模型化输出 + 保存）：Task 6 覆盖
- 训练与复盘（题库 + 模板 + 导出 + 本地保存）：Task 7 覆盖
- 双入口可扩展：Task 2（索引）+ Task 9（新增章节验证）覆盖
- 本地保存与未来迁移：Task 5 覆盖

## Placeholder Scan

本计划不包含 TBD/TODO。Dashboard 最近记录允许 V1 最小实现（不阻塞核心功能）。

---

## Execution Handoff

Plan complete and saved to `/workspace/docs/superpowers/plans/2026-05-01-maoxuan-survival-system-web.md`. Two execution options:

1. **Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration
2. **Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
