import Link from 'next/link';
import { getLibraryIndex } from '@/lib/maoxuan/content';

export const metadata = {
  title: '阅读库 | 毛选生存系统',
};

export default function LibraryPage() {
  const index = getLibraryIndex();
  const volumes = Object.entries(index.volumesMap);
  const tags = Object.entries(index.tagsMap).sort((a, b) => a[0].localeCompare(b[0], 'zh-Hans-CN'));
  const byCore = index.chapters.reduce(
    (acc, c) => {
      acc[c.core_level].push(c);
      return acc;
    },
    { S: [] as typeof index.chapters, A: [] as typeof index.chapters, B: [] as typeof index.chapters }
  );

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold" style={{ color: 'var(--wx-ink)' }}>
          阅读库
        </h1>
        <p className="mt-2" style={{ color: 'var(--wx-ink-soft)' }}>
          按卷/按主题/按核心等级三种入口组织内容，新增章节 Markdown 会自动出现在这里。
        </p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="wx-surface rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--wx-ink)' }}>
            按核心等级
          </h2>
          <div className="space-y-5">
            {([
              ['S', 'S 级 · 枢纽篇（系统内核）'],
              ['A', 'A 级 · 高频篇（主战工具）'],
              ['B', 'B 级 · 支撑篇（专项技能/案例库）'],
            ] as const).map(([level, label]) => (
              <div key={level}>
                <div className="text-sm font-semibold mb-2" style={{ color: 'var(--wx-ink-soft)' }}>
                  {label} · {byCore[level].length}
                </div>
                <ul className="space-y-2">
                  {byCore[level].map((c) => (
                    <li key={c.slug}>
                      <Link className="hover:underline" style={{ color: 'var(--wx-ink)' }} href={`/library/${c.slug}`}>
                        {c.title}
                      </Link>
                      <div className="text-xs mt-1" style={{ color: 'var(--wx-ink-faint)' }}>
                        卷 {c.volume || '未分卷'} · 标签：{c.tags.join('、')}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="wx-surface rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--wx-ink)' }}>
            按卷/篇
          </h2>
          <div className="space-y-5">
            {volumes.map(([vol, chapters]) => (
              <div key={vol}>
                <div className="text-sm font-semibold mb-2" style={{ color: 'var(--wx-ink-soft)' }}>
                  {vol}
                </div>
                <ul className="space-y-2">
                  {chapters.map((c) => (
                    <li key={c.slug}>
                      <Link className="hover:underline" style={{ color: 'var(--wx-ink)' }} href={`/library/${c.slug}`}>
                        {c.title}
                      </Link>
                      <div className="text-xs mt-1" style={{ color: 'var(--wx-ink-faint)' }}>
                        核心等级 {c.core_level} · 标签：{c.tags.join('、')}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="wx-surface rounded-2xl p-6 lg:col-span-2">
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--wx-ink)' }}>
            按主题/标签
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tags.map(([tag, chapters]) => (
              <div key={tag} className="rounded-xl p-4" style={{ border: '1px solid var(--wx-panel-border)', background: 'rgba(201, 100, 66, 0.03)' }}>
                <div className="flex items-center justify-between">
                  <div className="font-semibold" style={{ color: 'var(--wx-ink)' }}>
                    {tag}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--wx-ink-faint)' }}>
                    {chapters.length}
                  </div>
                </div>
                <ul className="mt-3 space-y-1">
                  {chapters.slice(0, 6).map((c) => (
                    <li key={c.slug} className="text-sm">
                      <Link className="hover:underline" style={{ color: 'var(--wx-ink-soft)' }} href={`/library/${c.slug}`}>
                        {c.title}
                      </Link>
                    </li>
                  ))}
                  {chapters.length > 6 ? (
                    <li className="text-xs" style={{ color: 'var(--wx-ink-faint)' }}>
                      …
                    </li>
                  ) : null}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
