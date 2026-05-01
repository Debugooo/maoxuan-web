import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getChapterBySlug, getChapterNeighbors } from '@/lib/maoxuan/content';
import { extractToc } from '@/lib/maoxuan/toc';
import { slugifyHeading } from '@/lib/maoxuan/slug';
import { ChapterToc } from '@/components/ChapterToc';

export default function ChapterPage({ params }: { params: { slug: string } }) {
  const chapter = getChapterBySlug(params.slug);
  if (!chapter) notFound();

  const toc = extractToc(chapter.content);
  const { prev, next } = getChapterNeighbors(params.slug);

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
          <ChapterToc slug={params.slug} toc={toc} />
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

          <div className="mt-10 pt-6" style={{ borderTop: '1px solid var(--wx-hair)' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {prev ? (
                <Link
                  href={`/library/${prev.slug}`}
                  className="rounded-xl px-4 py-3 transition-colors"
                  style={{ border: '1px solid var(--wx-panel-border)', color: 'var(--wx-ink)' }}
                >
                  <div className="text-xs" style={{ color: 'var(--wx-ink-faint)' }}>
                    上一篇
                  </div>
                  <div className="mt-1 font-semibold">{prev.title}</div>
                </Link>
              ) : (
                <div className="rounded-xl px-4 py-3" style={{ border: '1px dashed var(--wx-panel-border)', color: 'var(--wx-ink-faint)' }}>
                  已是第一篇
                </div>
              )}
              {next ? (
                <Link
                  href={`/library/${next.slug}`}
                  className="rounded-xl px-4 py-3 transition-colors"
                  style={{ border: '1px solid var(--wx-panel-border)', color: 'var(--wx-ink)' }}
                >
                  <div className="text-xs" style={{ color: 'var(--wx-ink-faint)' }}>
                    下一篇
                  </div>
                  <div className="mt-1 font-semibold">{next.title}</div>
                </Link>
              ) : (
                <div className="rounded-xl px-4 py-3" style={{ border: '1px dashed var(--wx-panel-border)', color: 'var(--wx-ink-faint)' }}>
                  已是最后一篇
                </div>
              )}
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
