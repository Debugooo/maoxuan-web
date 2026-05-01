import Link from 'next/link';
import type { ReactNode } from 'react';

function splitByHighlight(text: string) {
  const re = /==([^=]+)==/g;
  const out: Array<{ type: 'text' | 'hl'; value: string }> = [];
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(text))) {
    if (m.index > last) out.push({ type: 'text', value: text.slice(last, m.index) });
    out.push({ type: 'hl', value: m[1] });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ type: 'text', value: text.slice(last) });
  return out;
}

function extractCode(value: string) {
  const m = value.match(/^\s*〔(H\d{2})〕/);
  return m ? m[1] : '';
}

export function WxHighlightText({ id, children }: { id: string; children: ReactNode }) {
  const render = (node: ReactNode): ReactNode => {
    if (typeof node === 'string') {
      const parts = splitByHighlight(node);
      if (parts.length === 1) return node;
      return parts.map((p, i) => {
        if (p.type === 'text') return <span key={`t-${i}`}>{p.value}</span>;
        const code = extractCode(p.value);
        return (
          <Link
            key={`h-${i}`}
            href={`/study/${id}#note-${code}`}
            style={{
              background: 'rgba(201, 100, 66, 0.18)',
              borderBottom: '1px solid rgba(201, 100, 66, 0.5)',
              color: 'var(--wx-ink)',
              padding: '0 2px',
              borderRadius: 4,
            }}
          >
            {p.value}
          </Link>
        );
      });
    }
    if (Array.isArray(node)) return node.map((n, i) => <span key={`a-${i}`}>{render(n)}</span>);
    return node;
  };

  return <>{render(children)}</>;
}
