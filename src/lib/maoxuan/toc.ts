import type { TocItem } from './types';
import { slugifyHeading } from './slug';

export function extractToc(markdown: string): TocItem[] {
  const lines = markdown.split('\n');
  const items: TocItem[] = [];

  for (const line of lines) {
    const m = /^(#{2,4})\s+(.+?)\s*$/.exec(line);
    if (!m) continue;

    const depth = m[1].length;
    if (depth < 2 || depth > 4) continue;

    const text = m[2].replace(/\s+#*$/, '').trim();
    const id = slugifyHeading(text);
    if (!id) continue;

    items.push({ depth: depth as 2 | 3 | 4, id, text });
  }

  return items;
}
