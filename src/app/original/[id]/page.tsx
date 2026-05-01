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

