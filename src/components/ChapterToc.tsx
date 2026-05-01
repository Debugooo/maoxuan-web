'use client';

import { useMemo, useState } from 'react';
import { loadFromStorage, saveToStorage } from '@/lib/maoxuan/storage';
import type { TocItem } from '@/lib/maoxuan/types';

type TocGroup = {
  head: TocItem;
  children: TocItem[];
};

function groupToc(items: TocItem[]): TocGroup[] {
  const groups: TocGroup[] = [];
  let current: TocGroup | null = null;

  for (const item of items) {
    if (item.depth === 2) {
      if (current) groups.push(current);
      current = { head: item, children: [] };
      continue;
    }

    if (!current) {
      current = { head: { depth: 2, id: item.id, text: item.text }, children: [] };
    }
    current.children.push(item);
  }

  if (current) groups.push(current);
  return groups;
}

function storageKey(slug: string) {
  return `maoxuan.toc.${slug}`;
}

export function ChapterToc({ slug, toc }: { slug: string; toc: TocItem[] }) {
  const groups = useMemo(() => groupToc(toc), [toc]);
  const groupIds = useMemo(() => groups.map((g) => g.head.id), [groups]);

  const [collapsedIds, setCollapsedIds] = useState<string[]>(() => {
    const stored = loadFromStorage<string[]>(storageKey(slug));
    return Array.isArray(stored?.data) ? stored!.data : [];
  });

  function persist(next: string[]) {
    setCollapsedIds(next);
    saveToStorage(storageKey(slug), next);
  }

  function toggle(id: string) {
    const next = collapsedIds.includes(id) ? collapsedIds.filter((x) => x !== id) : [...collapsedIds, id];
    persist(next);
  }

  function expandAll() {
    persist([]);
  }

  function collapseAll() {
    persist(groupIds);
  }

  return (
    <div className="wx-toc">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="text-sm font-semibold" style={{ color: 'var(--wx-ink)' }}>
          目录
        </div>
        <div className="flex items-center gap-2">
          <button className="wx-toc-action" type="button" onClick={expandAll}>
            全部展开
          </button>
          <button className="wx-toc-action" type="button" onClick={collapseAll}>
            全部收起
          </button>
        </div>
      </div>

      <nav className="space-y-1">
        {groups.map((g) => {
          const hasChildren = g.children.length > 0;
          const collapsed = collapsedIds.includes(g.head.id);

          return (
            <div key={g.head.id} className="wx-toc-group">
              <div className="wx-toc-row">
                {hasChildren ? (
                  <button
                    className="wx-toc-toggle"
                    type="button"
                    aria-label={collapsed ? '展开' : '收起'}
                    onClick={() => toggle(g.head.id)}
                  >
                    {collapsed ? '▸' : '▾'}
                  </button>
                ) : (
                  <span className="wx-toc-spacer" aria-hidden="true" />
                )}

                <a className="wx-toc-link" href={`#${g.head.id}`}>
                  {g.head.text}
                </a>
              </div>

              {!collapsed
                ? g.children.map((c) => (
                    <div key={`${g.head.id}-${c.id}`} className="wx-toc-row">
                      <span className="wx-toc-spacer" aria-hidden="true" />
                      <a className={`wx-toc-link ${c.depth === 3 ? 'wx-toc-l3' : 'wx-toc-l4'}`} href={`#${c.id}`}>
                        {c.text}
                      </a>
                    </div>
                  ))
                : null}
            </div>
          );
        })}
      </nav>
    </div>
  );
}

