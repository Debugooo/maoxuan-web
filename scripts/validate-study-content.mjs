import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const ROOT_ORI = path.resolve(process.cwd(), 'content/maoxuan-original');
const ROOT_GUIDE = path.resolve(process.cwd(), 'content/maoxuan-guides');
const INDEX_PATH = path.resolve(process.cwd(), 'content/maoxuan-cos/index.json');

const GUIDE_REQUIRED_H2 = [
  '## 1 历史坐标',
  '## 2 认知操作系统位置',
  '## 3 回答的核心问题',
  '## 4 阅读定位（正确读法与学法）',
  '## 5 金句摘录',
  '## 6 核心思想/论点',
  '## 7 关键概念（最小定义）',
  '## 8 全文结构速览（认知地图）',
  '## 9 逐段精读指引（重点句标注+旁批）',
  '## 10 与其他文章的联动（互文与学习顺序）',
];

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) out.push(...listFiles(p));
    else if (name.endsWith('.md')) out.push(p);
  }
  return out;
}

function extractHighlights(content) {
  const codes = new Set();
  const re = /==〔(H\d{2})〕/g;
  let m;
  while ((m = re.exec(content))) codes.add(m[1]);
  return codes;
}

function extractNotes(content) {
  const codes = new Set();
  const re = /^\s*-\s*(H\d{2})：/gm;
  let m;
  while ((m = re.exec(content))) codes.add(m[1]);
  return codes;
}

function main() {
  const idx = readJson(INDEX_PATH);
  const items = Object.values(idx.volumes).flatMap((v) => v.items);
  if (!items.length) {
    console.error('content/maoxuan-cos/index.json has no items');
    process.exit(1);
  }

  const guideById = new Map();
  const guides = listFiles(ROOT_GUIDE);
  for (const p of guides) {
    const raw = fs.readFileSync(p, 'utf8');
    const parsed = matter(raw);
    const id = String(parsed.data?.id || '');
    if (id) guideById.set(id, { p, raw: parsed.content });
  }

  const oriById = new Map();
  const originals = listFiles(ROOT_ORI);
  for (const p of originals) {
    const raw = fs.readFileSync(p, 'utf8');
    const parsed = matter(raw);
    const id = String(parsed.data?.id || '');
    if (id) oriById.set(id, { p, raw: parsed.content });
  }

  const fails = [];
  for (const it of items) {
    const id = it.id;
    const g = guideById.get(id);
    const o = oriById.get(id);
    if (!g) fails.push(`${id}: missing guide markdown`);
    if (!o) fails.push(`${id}: missing original markdown`);
    if (!g || !o) continue;

    const missingH2 = GUIDE_REQUIRED_H2.filter((h) => !g.raw.includes(h));
    if (missingH2.length) fails.push(`${id}: guide missing headings: ${missingH2.join(', ')}`);

    const hCodes = extractHighlights(o.raw);
    const nCodes = extractNotes(g.raw);

    for (const c of hCodes) if (!nCodes.has(c)) fails.push(`${id}: highlight ${c} missing note in guide`);
    for (const c of nCodes) if (!hCodes.has(c)) fails.push(`${id}: note ${c} missing highlight in original`);
  }

  if (fails.length) {
    fails.forEach((x) => console.error(x));
    process.exit(1);
  }

  console.log('study content OK');
}

main();
