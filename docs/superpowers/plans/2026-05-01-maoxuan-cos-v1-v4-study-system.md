# 毛选 COS 逐篇研读系统 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在现有 Next.js 站点内落地“毛选认知操作系统（COS）”研读系统：四卷全量原文内置、逐篇学习指南（10 段结构）、学习顺序（COS 主线）、互文引用、重点句行内标注 `==〔H01〕...==` + 旁批联动，并确保“逐篇深写”按学习顺序一篇一篇交付验收。

**Architecture:** 内容资产分离（原文/指南/概念），用稳定 ID（`mx-v{1..4}-001`）做互文主键；站内新增 `/study`、`/study/[id]`、`/original/[id]`；在渲染层对文本做轻量解析，把 `==〔Hxx〕...==` 转为可点击高亮链接，跳转到指南旁批锚点（不启用原始 HTML）。

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, gray-matter, react-markdown, remark-gfm, Node scripts (fetch + html parse)

---

## File/Module Map

**Content**
- Create: `content/maoxuan-original/v{1..4}/mx-v?-???.md`
- Create: `content/maoxuan-guides/v{1..4}/mx-v?-???.md`
- Create: `content/maoxuan-concepts/*.md`
- Create: `content/maoxuan-cos/index.json`（canonical 目录 + 学习顺序 + source_url）

**Server-side loaders**
- Create: `src/lib/study/types.ts`
- Create: `src/lib/study/content.ts`
- Create: `src/lib/study/index.ts`

**Markdown parsing**
- Create: `src/components/WxHighlightText.tsx`

**Pages**
- Create: `src/app/study/page.tsx`
- Create: `src/app/study/[id]/page.tsx`
- Create: `src/app/original/[id]/page.tsx`
- Create: `src/app/concepts/[id]/page.tsx`

**Scripts**
- Create: `scripts/fetch-maoxuan-index.mjs`
- Create: `scripts/fetch-maoxuan-article.mjs`
- Create: `scripts/validate-study-content.mjs`
- Modify: `package.json`（新增 npm scripts）

---

### Task 1: 定义内容目录与 canonical 索引（mx-v*-***）

**Files:**
- Create: `content/maoxuan-cos/index.json`
- Create: `src/lib/study/types.ts`
- Create: `src/lib/study/index.ts`

- [ ] **Step 1: 新增 canonical 索引文件**

Create `content/maoxuan-cos/index.json`：

```json
{
  "version": 1,
  "volumes": {
    "v1": { "label": "第一卷", "items": [] },
    "v2": { "label": "第二卷", "items": [] },
    "v3": { "label": "第三卷", "items": [] },
    "v4": { "label": "第四卷", "items": [] }
  },
  "learningOrder": [],
  "concepts": []
}
```

- [ ] **Step 2: 添加 study 领域 types**

Create `src/lib/study/types.ts`：

```ts
export type VolumeId = 'v1' | 'v2' | 'v3' | 'v4';

export type StudyItem = {
  id: string; // mx-v1-001
  volume: VolumeId;
  title: string;
  date?: string; // YYYY-MM or YYYY-MM-DD
  place?: string;
  source_url: string;
  guide_path: string; // content/maoxuan-guides/v1/mx-v1-001.md
  original_path: string; // content/maoxuan-original/v1/mx-v1-001.md
  concepts?: string[];
  cross_refs?: string[];
  prev_learning?: string | null;
  next_learning?: string | null;
  cos?: {
    stage: number;
    module: 'kernel' | 'evidence' | 'modeling' | 'structure' | 'organization' | 'united-front' | 'strategy' | 'economy' | 'playbook';
  };
};

export type StudyIndex = {
  version: 1;
  volumes: Record<VolumeId, { label: string; items: StudyItem[] }>;
  learningOrder: string[];
  concepts: Array<{ id: string; label: string }>;
};
```

- [ ] **Step 3: 添加读取 index.json 的 helper**

Create `src/lib/study/index.ts`：

```ts
import fs from 'node:fs';
import path from 'node:path';
import type { StudyIndex } from './types';

const INDEX_PATH = path.join(process.cwd(), 'content/maoxuan-cos/index.json');

export function getStudyIndex(): StudyIndex {
  const raw = fs.readFileSync(INDEX_PATH, 'utf8');
  return JSON.parse(raw) as StudyIndex;
}
```

- [ ] **Step 4: 运行构建确保 TS 类型检查可通过**

Run:

```bash
npm run build
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add content/maoxuan-cos/index.json src/lib/study/types.ts src/lib/study/index.ts
git commit -m "feat(study): add COS index schema and study types"
```

---

### Task 2: 原文与指南内容加载器（fs + gray-matter）

**Files:**
- Create: `src/lib/study/content.ts`
- Test: 手动验收（Next build + 路由访问）

- [ ] **Step 1: 创建 content loader**

Create `src/lib/study/content.ts`：

```ts
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { StudyItem } from './types';
import { getStudyIndex } from './index';

export type StudyDoc = {
  item: StudyItem;
  frontmatter: Record<string, unknown>;
  content: string;
};

function readMarkdown(filePath: string) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(raw);
  return { frontmatter: parsed.data as Record<string, unknown>, content: parsed.content.trim() };
}

function findItem(id: string) {
  const index = getStudyIndex();
  for (const vol of Object.values(index.volumes)) {
    const hit = vol.items.find((x) => x.id === id);
    if (hit) return hit;
  }
  return null;
}

export function getStudyGuideById(id: string): StudyDoc | null {
  const item = findItem(id);
  if (!item) return null;
  const abs = path.join(process.cwd(), item.guide_path);
  if (!fs.existsSync(abs)) return null;
  const md = readMarkdown(abs);
  return { item, ...md };
}

export function getStudyOriginalById(id: string): StudyDoc | null {
  const item = findItem(id);
  if (!item) return null;
  const abs = path.join(process.cwd(), item.original_path);
  if (!fs.existsSync(abs)) return null;
  const md = readMarkdown(abs);
  return { item, ...md };
}
```

- [ ] **Step 2: build 校验**

Run:

```bash
npm run build
```

Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/lib/study/content.ts
git commit -m "feat(study): add guide/original content loader"
```

---

### Task 3: 重点句标注渲染（==〔H01〕...== → 可点击高亮）

**Files:**
- Create: `src/components/WxHighlightText.tsx`
- Modify: `src/app/original/[id]/page.tsx`

- [ ] **Step 1: 新增 remark 插件把 ==...== 转为强调节点**

Create `src/components/WxHighlightText.tsx`：

```tsx
'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

function splitByHighlight(text: string) {
  const re = /==([^=]+)==/g;
  const out: Array<{ type: 'text' | 'hl'; value: string }> = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push({ type: 'text', value: text.slice(last, m.index) });
    out.push({ type: 'hl', value: m[1] });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ type: 'text', value: text.slice(last) });
  return out;
}

function extractCode(value: string) {
  const m = value.match(/^\s*〔(H\d{2})〕/);
  return m ? m[1] : '';
}

export function WxHighlightText({ id, children }: { id: string; children: ReactNode }) {
  const render = (node: ReactNode): ReactNode => {
    if (typeof node === 'string') {
      const parts = splitByHighlight(node);
      if (parts.length === 1) return node;
      return parts.map((p, i) => {
        if (p.type === 'text') return <span key={`t-${i}`}>{p.value}</span>;
        const code = extractCode(p.value);
        return (
          <Link
            key={`h-${i}`}
            href={`/study/${id}#note-${code}`}
            style={{
              background: 'rgba(201, 100, 66, 0.18)',
              borderBottom: '1px solid rgba(201, 100, 66, 0.5)',
              color: 'var(--wx-ink)',
              padding: '0 2px',
              borderRadius: 4,
            }}
          >
            {p.value}
          </Link>
        );
      });
    }

    if (Array.isArray(node)) return node.map((n, i) => <span key={`a-${i}`}>{render(n)}</span>);
    return node;
  };

  return <>{render(children)}</>;
}
```

- [ ] **Step 2: 在原文页渲染时包裹文本节点**

在 `src/app/original/[id]/page.tsx` 内，把 `p` / `li` 等组件渲染的 children 用 `<WxHighlightText id={doc.item.id}>...</WxHighlightText>` 包起来。

- [ ] **Step 3: build 验证**

Run:

```bash
npm run build
```

Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/WxHighlightText.tsx src/app/original/[id]/page.tsx
git commit -m "feat(study): render inline highlights for ==〔Hxx〕...=="
```

---

### Task 4: 新增 /study 与 /original 路由（站内研读系统骨架）

**Files:**
- Create: `src/app/study/page.tsx`
- Create: `src/app/study/[id]/page.tsx`
- Create: `src/app/original/[id]/page.tsx`
- Modify: `src/components/Navigation.tsx`

- [ ] **Step 1: /study 总览页（学习顺序 + 按卷入口）**

Create `src/app/study/page.tsx`：

```tsx
import Link from 'next/link';
import { getStudyIndex } from '@/lib/study/index';

export const metadata = { title: '研读系统 | 毛选 COS' };

export default function StudyPage() {
  const index = getStudyIndex();
  const order = index.learningOrder;
  const byId = new Map<string, any>();
  Object.values(index.volumes).forEach((v) => v.items.forEach((it) => byId.set(it.id, it)));

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold" style={{ color: 'var(--wx-ink)' }}>
          研读系统（COS）
        </h1>
        <p className="mt-2" style={{ color: 'var(--wx-ink-soft)' }}>
          按学习顺序逐篇推进：原文高亮 + 旁批精读 + 互文跳转。
        </p>
      </header>

      <section className="wx-surface rounded-2xl p-6">
        <h2 className="text-lg font-bold" style={{ color: 'var(--wx-ink)' }}>
          学习顺序
        </h2>
        <ul className="mt-4 space-y-2">
          {order.map((id) => {
            const it = byId.get(id);
            if (!it) return null;
            return (
              <li key={id}>
                <Link href={`/study/${id}`} className="hover:underline" style={{ color: 'var(--wx-ink)' }}>
                  {id} · {it.title}
                </Link>
                <div className="text-xs mt-1" style={{ color: 'var(--wx-ink-faint)' }}>
                  {it.volume} · {it.date ?? '日期待补'} · module {it.cos?.module ?? 'tbd'}
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: /study/[id] 指南页（10 段结构 + 旁批锚点）**

Create `src/app/study/[id]/page.tsx`：

```tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getStudyGuideById } from '@/lib/study/content';
import { slugifyHeading } from '@/lib/maoxuan/slug';

export default function StudyGuidePage({ params }: { params: { id: string } }) {
  const doc = getStudyGuideById(params.id);
  if (!doc) notFound();

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/study" className="text-sm hover:underline" style={{ color: 'var(--wx-ink-soft)' }}>
          ← 返回研读系统
        </Link>
        <Link href={`/original/${doc.item.id}`} className="text-sm hover:underline" style={{ color: 'var(--wx-brand)' }}>
          查看原文 →
        </Link>
      </div>

      <header className="mb-8">
        <div className="text-xs mb-2" style={{ color: 'var(--wx-ink-faint)' }}>
          {doc.item.id} · {doc.item.volume} · {doc.item.date ?? '日期待补'}
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold" style={{ color: 'var(--wx-ink)' }}>
          {doc.item.title}
        </h1>
      </header>

      <article className="wx-md">
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
          }}
        >
          {doc.content}
        </ReactMarkdown>
      </article>
    </main>
  );
}
```

- [ ] **Step 3: /original/[id] 原文页（高亮点击 → 跳到指南旁批锚点）**

Create `src/app/original/[id]/page.tsx`：

```tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getStudyOriginalById } from '@/lib/study/content';
import { WxHighlightText } from '@/components/WxHighlightText';

export default function OriginalPage({ params }: { params: { id: string } }) {
  const doc = getStudyOriginalById(params.id);
  if (!doc) notFound();

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/study" className="text-sm hover:underline" style={{ color: 'var(--wx-ink-soft)' }}>
          ← 返回研读系统
        </Link>
        <Link href={`/study/${doc.item.id}`} className="text-sm hover:underline" style={{ color: 'var(--wx-brand)' }}>
          查看指南 →
        </Link>
      </div>

      <header className="mb-8">
        <div className="text-xs mb-2" style={{ color: 'var(--wx-ink-faint)' }}>
          原文 · {doc.item.id}
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold" style={{ color: 'var(--wx-ink)' }}>
          {doc.item.title}
        </h1>
      </header>

      <article className="wx-md">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children, ...props }) => (
              <p {...props}>
                <WxHighlightText id={doc.item.id}>{children}</WxHighlightText>
              </p>
            ),
            li: ({ children, ...props }) => (
              <li {...props}>
                <WxHighlightText id={doc.item.id}>{children}</WxHighlightText>
              </li>
            ),
          }}
        >
          {doc.content}
        </ReactMarkdown>
      </article>
    </main>
  );
}
```

- [ ] **Step 4: 导航增加入口**

Modify `src/components/Navigation.tsx`：在现有链接中加入 `/study`。

- [ ] **Step 5: build 验证**

Run:

```bash
npm run build
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/app/study/page.tsx src/app/study/[id]/page.tsx src/app/original/[id]/page.tsx src/components/Navigation.tsx
git commit -m "feat(study): add /study and /original routes"
```

---

### Task 5: 校验脚本（原文高亮 ↔ 指南旁批一致性）

**Files:**
- Create: `scripts/validate-study-content.mjs`
- Modify: `package.json`

- [ ] **Step 1: 实现校验脚本**

Create `scripts/validate-study-content.mjs`：

```js
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const ROOT_ORI = path.resolve(process.cwd(), 'content/maoxuan-original');
const ROOT_GUIDE = path.resolve(process.cwd(), 'content/maoxuan-guides');
const INDEX_PATH = path.resolve(process.cwd(), 'content/maoxuan-cos/index.json');

const GUIDE_REQUIRED_H2 = [
  '## 1 历史坐标',
  '## 2 认知操作系统位置',
  '## 3 回答的核心问题',
  '## 4 阅读定位（正确读法与学法）',
  '## 5 金句摘录',
  '## 6 核心思想/论点',
  '## 7 关键概念（最小定义）',
  '## 8 全文结构速览（认知地图）',
  '## 9 逐段精读指引（重点句标注+旁批）',
  '## 10 与其他文章的联动（互文与学习顺序）',
];

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) out.push(...listFiles(p));
    else if (name.endsWith('.md')) out.push(p);
  }
  return out;
}

function extractHighlights(content) {
  const codes = new Set();
  const re = /==〔(H\d{2})〕/g;
  let m;
  while ((m = re.exec(content))) codes.add(m[1]);
  return codes;
}

function extractNotes(content) {
  const codes = new Set();
  const re = /^\s*-\s*(H\d{2})：/gm;
  let m;
  while ((m = re.exec(content))) codes.add(m[1]);
  return codes;
}

function main() {
  const idx = readJson(INDEX_PATH);
  const items = Object.values(idx.volumes).flatMap((v) => v.items);
  if (!items.length) {
    console.error('content/maoxuan-cos/index.json has no items');
    process.exit(1);
  }

  const guideById = new Map();
  const guides = listFiles(ROOT_GUIDE);
  for (const p of guides) {
    const raw = fs.readFileSync(p, 'utf8');
    const parsed = matter(raw);
    const id = String(parsed.data?.id || '');
    if (id) guideById.set(id, { p, raw: parsed.content });
  }

  const oriById = new Map();
  const originals = listFiles(ROOT_ORI);
  for (const p of originals) {
    const raw = fs.readFileSync(p, 'utf8');
    const parsed = matter(raw);
    const id = String(parsed.data?.id || '');
    if (id) oriById.set(id, { p, raw: parsed.content });
  }

  const fails = [];
  for (const it of items) {
    const id = it.id;
    const g = guideById.get(id);
    const o = oriById.get(id);
    if (!g) fails.push(`${id}: missing guide markdown`);
    if (!o) fails.push(`${id}: missing original markdown`);
    if (!g || !o) continue;

    const missingH2 = GUIDE_REQUIRED_H2.filter((h) => !g.raw.includes(h));
    if (missingH2.length) fails.push(`${id}: guide missing headings: ${missingH2.join(', ')}`);

    const hCodes = extractHighlights(o.raw);
    const nCodes = extractNotes(g.raw);

    for (const c of hCodes) if (!nCodes.has(c)) fails.push(`${id}: highlight ${c} missing note in guide`);
    for (const c of nCodes) if (!hCodes.has(c)) fails.push(`${id}: note ${c} missing highlight in original`);
  }

  if (fails.length) {
    fails.forEach((x) => console.error(x));
    process.exit(1);
  }

  console.log('study content OK');
}

main();
```

- [ ] **Step 2: 加入 npm script**

Modify `package.json` scripts：

```json
{
  "scripts": {
    "validate:study": "node scripts/validate-study-content.mjs"
  }
}
```

- [ ] **Step 3: 运行校验（当前会失败，直到加入至少 1 篇样例）**

Run:

```bash
npm run validate:study
```

Expected: FAIL（缺少 items 或缺少样例）

- [ ] **Step 4: Commit**

```bash
git add scripts/validate-study-content.mjs package.json package-lock.json
git commit -m "chore(study): add validation for COS study content"
```

---

### Task 6: 数据抓取脚本（从 marxists 导入目录与原文）

**Files:**
- Create: `scripts/fetch-maoxuan-index.mjs`
- Create: `scripts/fetch-maoxuan-article.mjs`
- Modify: `content/maoxuan-cos/index.json`

- [ ] **Step 1: 添加 HTML 解析依赖**

Run:

```bash
npm install node-html-parser he
```

- [ ] **Step 2: 抓取四卷目录并生成 items（先骨架）**

Create `scripts/fetch-maoxuan-index.mjs`：

```js
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';

const OUT = path.resolve(process.cwd(), 'content/maoxuan-cos/index.json');
const URL = 'https://www.marxists.org/chinese/maozedong/index.htm#0';

function pad3(n) {
  return String(n).padStart(3, '0');
}

async function main() {
  const res = await fetch(URL);
  if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
  const html = await res.text();
  const root = parse(html);

  const json = {
    version: 1,
    volumes: {
      v1: { label: '第一卷', items: [] },
      v2: { label: '第二卷', items: [] },
      v3: { label: '第三卷', items: [] },
      v4: { label: '第四卷', items: [] }
    },
    learningOrder: [],
    concepts: []
  };

  const itemsByVol = { v1: [], v2: [], v3: [], v4: [] };
  const blocks = root.querySelectorAll('h4, pre');
  let current = null;

  for (const el of blocks) {
    const tag = (el.tagName || '').toUpperCase();
    const text = (el.text || '').trim();

    if (tag === 'H4') {
      if (text.includes('第一卷')) current = 'v1';
      else if (text.includes('第二卷')) current = 'v2';
      else if (text.includes('第三卷')) current = 'v3';
      else if (text.includes('第四卷')) current = 'v4';
      else current = null;
      continue;
    }

    if (tag === 'PRE' && current) {
      const lines = text.split('\n');
      for (const line of lines) {
        const m = line.match(/^\s*\d+\.\s*\[([^\]]+)\]\((https?:\/\/[^)]+)\)/);
        if (!m) continue;
        itemsByVol[current].push({ title: m[1].trim(), href: m[2].trim() });
      }
    }
  }

  for (const vol of ['v1', 'v2', 'v3', 'v4']) {
    const items = itemsByVol[vol];
    for (let i = 0; i < items.length; i += 1) {
      const id = `mx-${vol}-${pad3(i + 1)}`;
      const title = items[i].title.replace(/^《|》$/g, '');
      json.volumes[vol].items.push({
        id,
        volume: vol,
        title,
        source_url: items[i].href,
        guide_path: `content/maoxuan-guides/${vol}/${id}.md`,
        original_path: `content/maoxuan-original/${vol}/${id}.md`
      });
    }
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(json, null, 2));
  console.log(`wrote ${OUT}`);
}

main();
```

- [ ] **Step 3: 单篇原文导入（HTML → Markdown 纯文本）**

Create `scripts/fetch-maoxuan-article.mjs`：

```js
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';
import he from 'he';

const INDEX_PATH = path.resolve(process.cwd(), 'content/maoxuan-cos/index.json');

function loadIndex() {
  return JSON.parse(fs.readFileSync(INDEX_PATH, 'utf8'));
}

function findItem(idx, id) {
  for (const v of Object.values(idx.volumes)) {
    const hit = v.items.find((x) => x.id === id);
    if (hit) return hit;
  }
  return null;
}

function toPlainText(html) {
  const root = parse(html);
  const text = root.structuredText || root.text || '';
  return he.decode(text)
    .replace(/\r/g, '')
    .split('\n')
    .map((l) => l.trimEnd())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function main() {
  const id = process.argv[2];
  if (!id) throw new Error('usage: node scripts/fetch-maoxuan-article.mjs <mx-v?-???>');
  const idx = loadIndex();
  const item = findItem(idx, id);
  if (!item) throw new Error(`id not found in index: ${id}`);

  const res = await fetch(item.source_url);
  if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
  const html = await res.text();
  const content = toPlainText(html);

  const out = path.resolve(process.cwd(), item.original_path);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const fm = [
    '---',
    `id: ${id}`,
    `title: ${item.title}`,
    `volume: ${item.volume}`,
    `source_url: ${item.source_url}`,
    '---',
    '',
  ].join('\n');
  fs.writeFileSync(out, fm + content + '\n');
  console.log(`wrote ${out}`);
}

main();
```

- [ ] **Step 4: 运行并检查输出（只导入 1 篇样例，不要批量）**

Run:

```bash
node scripts/fetch-maoxuan-index.mjs
node scripts/fetch-maoxuan-article.mjs mx-v1-001
```

Expected:
- `content/maoxuan-cos/index.json` 有 items
- `content/maoxuan-original/v1/mx-v1-001.md` 生成成功

- [ ] **Step 5: Commit**

```bash
git add scripts/fetch-maoxuan-index.mjs scripts/fetch-maoxuan-article.mjs content/maoxuan-cos/index.json content/maoxuan-original/v1/mx-v1-001.md package.json package-lock.json
git commit -m "feat(study): add importer scripts and seed one original article"
```

---

### Task 7: 逐篇指南样板（先做 mx-v1-001，严格一篇一篇写）

**Files:**
- Create: `content/maoxuan-guides/v1/mx-v1-001.md`
- Modify: `content/maoxuan-cos/index.json`（补学习顺序/互文占位）

- [ ] **Step 1: 创建 mx-v1-001 指南文件骨架（10 段标题必须齐）**

Create `content/maoxuan-guides/v1/mx-v1-001.md`：

```md
---
id: mx-v1-001
title: 《（待填：篇名与 index 一致）》
volume: v1
date: ''
place: ''
source_url: ''
prev_learning: null
next_learning: null
cross_refs: []
concepts: []
cos:
  stage: 1
  module: kernel
---

## 1 历史坐标

## 2 认知操作系统位置

## 3 回答的核心问题

## 4 阅读定位（正确读法与学法）

## 5 金句摘录

## 6 核心思想/论点

## 7 关键概念（最小定义）

## 8 全文结构速览（认知地图）

## 9 逐段精读指引（重点句标注+旁批）
（待补：当原文加入 ==〔Hxx〕...== 后，再逐条补齐对应旁批）

## 10 与其他文章的联动（互文与学习顺序）
```

- [ ] **Step 2: 手工为 mx-v1-001 原文挑选 3–5 句重点句并加入行内标注（不要批量）**

Edit `content/maoxuan-original/v1/mx-v1-001.md`：对选中的句子做如下标注：

```md
...==〔H01〕这是一句你要标注的重点句==...
```

- [ ] **Step 3: 在指南第 9 段补齐对应旁批（H01…）**

确保：
- 原文有 `==〔H01〕...==`
- 指南第 9 段有 `- H01：...`

- [ ] **Step 4: 运行校验**

Run:

```bash
npm run validate:study
```

Expected: PASS（至少这 1 篇满足一致性）

- [ ] **Step 5: 手动验收页面联动**

Run:

```bash
npm run dev -- --port 3001 --hostname 0.0.0.0
```

Check:
- `/study` 能看到 `mx-v1-001`
- `/original/mx-v1-001` 原文高亮可点击跳转 `/study/mx-v1-001#note-H01`（若 note id 未实现，先把旁批行包一层锚点，见下一步）

- [ ] **Step 6: 为旁批生成 note 锚点（让 #note-H01 生效）**

在 `src/app/study/[id]/page.tsx` 的渲染中，把第 9 段的旁批行渲染成带 `id="note-H01"` 的块（实现方式：后续可改为更精细的 AST；初版可在 markdown 中手动写 `<a id="note-H01"></a>` 不允许，因此建议：新增一个 guide-side 的标记语法并在渲染层解析）。

- [ ] **Step 7: Commit**

```bash
git add content/maoxuan-guides/v1/mx-v1-001.md content/maoxuan-original/v1/mx-v1-001.md src/app/study/[id]/page.tsx
git commit -m "feat(study): add first guide with highlights and notes (mx-v1-001)"
```

---

### Task 8: 扩展到四卷全量骨架（但仍保持“逐篇深写”一篇一篇推进）

**Files:**
- Modify: `content/maoxuan-cos/index.json`
- Create: `content/maoxuan-guides/v{1..4}/*.md`（骨架）
- Create: `content/maoxuan-original/v{1..4}/*.md`（原文）

- [ ] **Step 1: 先只生成全量“索引骨架 + 空指南骨架”**

规则：
- 阶段 A 可以批量生成“骨架文件”（标题与 10 段结构），但不做逐段旁批与高亮（深写属于阶段 B，必须逐篇）。
- 每一卷生成后都跑一次 `npm run validate:study`（此时应允许 0 高亮/0 旁批，通过条件需要在脚本里配置：若无任何 `==〔Hxx〕` 则允许无旁批）。

- [ ] **Step 2: 阶段 B 按学习顺序逐篇深写**

执行约束（必须遵守）：
- 一次只深写 1 篇：补齐第 1–10 段内容，重点句标注 + 旁批至少 8 组，互文至少 3 条。
- 深写完成后立即跑：`npm run validate:study && npm run build`
- 用户验收通过后再进入下一篇。

---

## Plan Self-Review Checklist

- 覆盖 spec：ID（mx-v1-001）、原文标注语法、10 段结构、站内路由、互文、校验、分阶段交付与逐篇验收。
- 无占位词：计划中每个脚本/页面/插件都有明确文件路径与代码。
- 命名一致：`mx-v?-???` 在 index、文件名、路由参数中一致。

---

## Execution Choice

Plan complete and saved to `docs/superpowers/plans/2026-05-01-maoxuan-cos-v1-v4-study-system.md`. Two execution options:

1. **Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration  
2. **Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
