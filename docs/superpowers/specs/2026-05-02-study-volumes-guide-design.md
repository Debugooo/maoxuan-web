# 研读系统“四卷导读 + 分卷目录页” Design

**Goal**

- 在 `/study`（研读系统）页面新增“毛选四卷导读”信息区，展示第一～四卷的年代范围、卷名、主题一句话、导读段落、要点列表。
- 点击某一卷进入新页面 `/study/volume/<volume>`（`v1`/`v2`/`v3`/`v4`），展示该卷目录（分时期/分组），并为每篇文章同时提供两个入口：指南 / 原文。
  - 若站内存在对应 `mx-v*-***`：指南链接到 `/study/<id>`；原文链接到 `/original/<id>`。
  - 若站内不存在：指南与原文都外链到 Marxists 原文页（同一链接）。

---

## Non-Goals

- 不引入运行时抓取外部网站；目录数据以本地静态数据为准。
- 不改变既有 `/study/[id]` 与 `/original/[id]` 的渲染逻辑。
- 不要求第二～四卷立即生成站内文章内容；目录页先支持外链占位。

---

## Data Source

- 目录参考：https://www.marxists.org/chinese/maozedong/index.htm#0
- 第一卷站内已落盘：`content/maoxuan-cos/index.json`（`v1.items` + `learningOrder`）。
- 第二～四卷目录先写为静态数据（可后续逐篇补齐站内内容时再迭代）。

---

## Routes & UI

### 1) `/study` 增加“四卷导读”

- 新增一个板块（置于“学习顺序/已收录”之前）：
  - 每卷一个卡片：
    - 年代范围（如 `1925–1937`）
    - `第一卷/第二卷/第三卷/第四卷`
    - 主题一句话
    - 导读段落（1 段）
    - 要点列表（4 条左右）
    - “查看目录”链接，指向 `/study/volume/v1` 等

### 2) `/study/volume/[volume]` 分卷目录页

- 页面标题：`毛选·第X卷`
- 内容结构：
  - 顶部显示该卷年代范围 + 主题一句话 + 导读段落 + 要点列表
  - 下方为“目录”，按分组（时期）展示：
    - 分组标题（例如“第一次国内革命战争时期”）
    - 每篇文章一行：`标题` + 两个入口按钮/链接：`指南`、`原文`
      - 站内可用 → 站内
      - 站内不可用 → 外链（两入口同一外链）

---

## Data Model (Local)

新增静态数据文件（建议）：

- `src/lib/study/volumes.ts`

结构建议：

- `type VolumeGuide = {`
  - `volume: 'v1' | 'v2' | 'v3' | 'v4'`
  - `range: string`（如 `1925–1937`）
  - `label: string`（如 `第一卷`）
  - `theme: string`（一句话主题）
  - `intro: string`（导读段落）
  - `bullets: string[]`
  - `groups: Array<{`
    - `title: string`
    - `items: Array<{`
      - `title: string`
      - `id?: string`（站内 id，若已生成）
      - `source_url: string`（外链）
    - `}>`
  - `}>`
- `}`

链接规则：

- `guideHref(item)`：
  - `id` 存在 → `/study/${id}`
  - 否则 → `source_url`
- `originalHref(item)`：
  - `id` 存在 → `/original/${id}`
  - 否则 → `source_url`

---

## Implementation Notes

- `/study` 页面目前仅展示学习顺序与已收录列表（`src/app/study/page.tsx`）。
- 新增分卷页：`src/app/study/volume/[volume]/page.tsx`，从 `volumes.ts` 读取数据渲染。
- 目录页无需依赖 `content/maoxuan-cos/index.json` 来推断第二～四卷；第一卷也以 `volumes.ts` 提供分组目录为准（其中条目可标注站内 `id`，便于未来拓展）。

---

## Acceptance Criteria

- `/study` 页面出现四卷导读卡片区，可点击进入四个分卷目录页。
- `/study/volume/v1`～`/study/volume/v4` 均可访问：
  - 有分组目录
  - 每篇条目提供“指南 / 原文”两个入口
  - 第一卷条目链接指向站内 `/study/mx-v1-xxx` 与 `/original/mx-v1-xxx`
  - 第二～四卷条目链接为外链（指南/原文同一外链）
- `npm run lint && npm run build` 通过。

