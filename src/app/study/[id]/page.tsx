import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getStudyGuideById } from '@/lib/study/content';
import { slugifyHeading } from '@/lib/maoxuan/slug';

function extractNoteCode(children: unknown) {
  const text = String(children);
  const m = text.match(/^H(\d{2})：/);
  return m ? `H${m[1]}` : null;
}

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
            li: ({ children, ...props }) => {
              const code = extractNoteCode(children);
              return (
                <li id={code ? `note-${code}` : undefined} {...props}>
                  {children}
                </li>
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

