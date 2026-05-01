import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';
import he from 'he';
import iconv from 'iconv-lite';

const INDEX_PATH = path.resolve(process.cwd(), 'content/maoxuan-cos/index.json');

function loadIndex() {
  return JSON.parse(fs.readFileSync(INDEX_PATH, 'utf8'));
}

function findItem(idx, id) {
  for (const v of Object.values(idx.volumes)) {
    const hit = v.items.find((x) => x.id === id);
    if (hit) return hit;
  }
  return null;
}

function toPlainText(html) {
  const root = parse(html);
  const body = root.querySelector('body') ?? root;
  const text = body.structuredText || body.text || '';
  return he
    .decode(text)
    .replace(/\r/g, '')
    .split('\n')
    .map((l) => l.trimEnd())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function main() {
  const id = process.argv[2];
  if (!id) throw new Error('usage: node scripts/fetch-maoxuan-article.mjs <mx-v?-???>');
  const idx = loadIndex();
  const item = findItem(idx, id);
  if (!item) throw new Error(`id not found in index: ${id}`);

  const res = await fetch(item.source_url);
  if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const html = iconv.decode(buf, 'gbk');
  const content = toPlainText(html);

  const out = path.resolve(process.cwd(), item.original_path);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const fm = ['---', `id: ${id}`, `title: ${item.title}`, `volume: ${item.volume}`, `source_url: ${item.source_url}`, '---', '', ''].join('\n');
  fs.writeFileSync(out, fm + content + '\n');
  console.log(`wrote ${out}`);
}

main();
