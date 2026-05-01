import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';
import iconv from 'iconv-lite';

const OUT = path.resolve(process.cwd(), 'content/maoxuan-cos/index.json');
const BASE_URL = 'https://www.marxists.org/chinese/maozedong/index.htm';

function pad3(n) {
  return String(n).padStart(3, '0');
}

function mkId(vol, i) {
  return `mx-${vol}-${pad3(i + 1)}`;
}

async function main() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const html = iconv.decode(buf, 'gbk');
  const root = parse(html);

  const index = {
    version: 1,
    volumes: {
      v1: { label: '第一卷', items: [] },
      v2: { label: '第二卷', items: [] },
      v3: { label: '第三卷', items: [] },
      v4: { label: '第四卷', items: [] },
    },
    learningOrder: [],
    concepts: [],
  };

  const itemsByVol = { v1: [], v2: [], v3: [], v4: [] };
  const blocks = root.querySelectorAll('h4, pre');
  let current = null;

  for (const el of blocks) {
    const tag = (el.tagName || '').toUpperCase();
    const text = (el.text || '').trim();

    if (tag === 'H4') {
      if (text.includes('第一卷')) current = 'v1';
      else if (text.includes('第二卷')) current = 'v2';
      else if (text.includes('第三卷')) current = 'v3';
      else if (text.includes('第四卷')) current = 'v4';
      continue;
    }

    if (tag === 'PRE' && current) {
      const inner = el.innerHTML || '';
      const re = /\d+\.\s*[^<]*<a\s+href="([^"]+)">([^<]+)<\/a>/g;
      let m;
      while ((m = re.exec(inner))) {
        const href = (m[1] || '').trim();
        const title = (m[2] || '').trim();
        if (!href || !title) continue;
        const full = new URL(href, BASE_URL).toString();
        itemsByVol[current].push({ title, href: full });
      }
    }
  }

  for (const vol of ['v1', 'v2', 'v3', 'v4']) {
    const items = itemsByVol[vol];
    for (let i = 0; i < items.length; i += 1) {
      const id = mkId(vol, i);
      const title = items[i].title;
      const source_url = items[i].href;
      index.volumes[vol].items.push({
        id,
        volume: vol,
        title,
        source_url,
        guide_path: `content/maoxuan-guides/${vol}/${id}.md`,
        original_path: `content/maoxuan-original/${vol}/${id}.md`,
      });
    }
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(index, null, 2));
  console.log(`wrote ${OUT}`);
}

main();
