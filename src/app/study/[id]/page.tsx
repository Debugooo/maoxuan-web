import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getStudyGuideById, getStudyOriginalById } from '@/lib/study/content';
import { slugifyHeading } from '@/lib/maoxuan/slug';

function stripHeadingNumber(text: string) {
  return text.replace(/^\s*\d+\s+/, '').trim();
}

function isQuotesSection(title: string) {
  return title.startsWith('金句摘录');
}

function isNotesSection(title: string) {
  return title.startsWith('逐段精读指引');
}

function splitByH2(markdown: string) {
  const lines = markdown.split('\n');
  const sections: Array<{ heading: string; body: string }> = [];
  let currentHeading: string | null = null;
  let currentBody: string[] = [];

  const push = () => {
    if (!currentHeading) return;
    sections.push({ heading: currentHeading, body: currentBody.join('\n').trim() });
  };

  for (const line of lines) {
    const m = line.match(/^##\s+(.*)$/);
    if (m) {
      push();
      currentHeading = m[1];
      currentBody = [];
      continue;
    }
    if (currentHeading) currentBody.push(line);
  }
  push();
  return sections;
}

function extractNoteCode(children: unknown) {
  const text = String(children);
  const m1 = text.match(/^H(\d{2})：/);
  if (m1) return `H${m1[1]}`;
  const m2 = text.match(/^〔H(\d{2})〕/);
  if (m2) return `H${m2[1]}`;
  return null;
}

function extractHighlightsMap(original: string) {
  const map = new Map<string, string>();
  const re = /==([^=]+)==/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(original))) {
    const raw = m[1];
    const codeMatch = raw.match(/^\s*〔(H\d{2})〕/);
    if (!codeMatch) continue;
    const code = codeMatch[1];
    const text = raw.replace(/^\s*〔H\d{2}〕\s*/, '').trim();
    const cleaned = text.replace(/\[\d+\]/g, '').replace(/\s{2,}/g, ' ').trim();
    map.set(code, cleaned);
  }
  return map;
}

export default function StudyGuidePage({ params }: { params: { id: string } }) {
  const doc = getStudyGuideById(params.id);
  if (!doc) notFound();

  const original = getStudyOriginalById(params.id);
  const highlightMap = original ? extractHighlightsMap(original.content) : new Map<string, string>();

  const rawSections = splitByH2(doc.content);
  const sections = rawSections
    .filter((s) => !isQuotesSection(stripHeadingNumber(s.heading)))
    .map((s) => ({ ...s, heading: stripHeadingNumber(s.heading) }));

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
        <h1 className="text-3xl md:text-4xl font-serif font-bold" style={{ color: 'var(--wx-ink)' }}>
          {doc.item.title}
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[240px,1fr] gap-6">
        <aside className="hidden lg:block">
          <div className="wx-surface rounded-2xl p-4 sticky top-6">
            <details open>
              <summary className="font-semibold cursor-pointer" style={{ color: 'var(--wx-ink)' }}>
                目录
              </summary>
              <nav className="mt-3">
                <ul className="space-y-2 text-sm" style={{ color: 'var(--wx-ink-soft)' }}>
                  {sections.map((s) => {
                    const title = s.heading;
                    const h2Id = slugifyHeading(title);
                    return (
                      <li key={h2Id}>
                        <a href={`#${h2Id}`} className="hover:underline" style={{ color: 'var(--wx-ink-soft)' }}>
                          {title}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </details>
          </div>
        </aside>

        <div className="space-y-4">
          {sections.map((s) => {
            const title = s.heading;
            const h2Id = slugifyHeading(title);
            const isNotes = isNotesSection(title);
            return (
              <section key={h2Id} className="wx-surface rounded-2xl p-5">
                <h2 id={h2Id} className="text-lg font-bold" style={{ color: 'var(--wx-ink)' }}>
                  {title}
                </h2>
                <div className="wx-md wx-md-plain mt-4">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      li: ({ children, ...props }) => {
                        const code = extractNoteCode(children);
                        const hasInlineQuote = /^\s*〔H\d{2}〕/.test(String(children));
                        const excerpt = isNotes && code && !hasInlineQuote ? highlightMap.get(code) : null;
                        return (
                          <li id={code ? `note-${code}` : undefined} {...props}>
                            {excerpt ? (
                              <div
                                className="mb-2 px-3 py-2 rounded-xl text-sm"
                                style={{
                                  background: 'rgba(201, 100, 66, 0.06)',
                                  border: '1px solid var(--wx-panel-border)',
                                  color: 'var(--wx-ink)',
                                  whiteSpace: 'pre-wrap',
                                }}
                              >
                                {excerpt}
                              </div>
                            ) : null}
                            <div>{children}</div>
                          </li>
                        );
                      },
                    }}
                  >
                    {s.body}
                  </ReactMarkdown>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
