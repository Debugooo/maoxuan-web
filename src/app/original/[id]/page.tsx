import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getStudyOriginalById } from '@/lib/study/content';
import { WxHighlightText } from '@/components/WxHighlightText';

function normalizeParagraphs(text: string) {
  const t = text.replace(/\r/g, '').trim();
  const cleaned = t
    .split('\n')
    .map((l) => l.replace(/^\s*-\s+/, ''))
    .join('\n');
  return cleaned.replace(/([^\n])\n(?!\n)/g, '$1\n\n');
}

export default function OriginalPage({ params }: { params: { id: string } }) {
  const doc = getStudyOriginalById(params.id);
  if (!doc) notFound();
  const content = normalizeParagraphs(doc.content);

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
        <h1 className="text-3xl md:text-4xl font-serif font-bold" style={{ color: 'var(--wx-ink)' }}>
          {doc.item.title}
        </h1>
      </header>

      <article className="wx-md wx-original">
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
          {content}
        </ReactMarkdown>
      </article>
    </main>
  );
}
