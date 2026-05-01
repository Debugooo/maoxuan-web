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
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        核心等级 {c.core_level} · 标签：{c.tags.join('、')}
                      </div>
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

