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
        <Link href="/library" className="text-sm hover:underline" style={{ color: 'var(--wx-ink-soft)' }}>
          ← 返回阅读库
        </Link>
      </div>

      <header className="mb-8">
        <div className="text-xs mb-2" style={{ color: 'var(--wx-ink-faint)' }}>
          {chapter.volume ? `卷 ${chapter.volume}` : '未分卷'} · 核心等级 {chapter.core_level} · 标签：{chapter.tags.join('、')}
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold" style={{ color: 'var(--wx-ink)' }}>
          {chapter.title}
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        <aside className="lg:sticky lg:top-6 h-fit rounded-2xl p-4 wx-surface">
          <div className="text-sm font-semibold mb-3" style={{ color: 'var(--wx-ink)' }}>
            目录
          </div>
          <nav className="space-y-2">
            {toc.map((t) => (
              <a
                key={`${t.id}-${t.text}`}
                href={`#${t.id}`}
                className={[
                  'block text-sm hover:underline',
                  t.depth === 3 ? 'pl-3 text-[13px]' : '',
                  t.depth === 4 ? 'pl-6 text-[12px]' : '',
                ].join(' ')}
                style={{ color: 'var(--wx-ink-soft)' }}
              >
                {t.text}
              </a>
            ))}
          </nav>
        </aside>

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
              hr: () => <div className="wx-divider">◆ ◆ ◆</div>,
            }}
          >
            {chapter.content}
          </ReactMarkdown>
        </article>
      </div>
    </main>
  );
}
