import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const ROOT = path.resolve(process.cwd(), 'content/maoxuan');
const REQUIRED_HEADINGS = [
  '## 01 局势快照（20%）',
  '## 02 思维骨架（40%）',
  '## 03 知识图鉴（60%）',
  '## 04 底层解码（80%）',
  '## 05 认知破局（100%）',
];

function listMdFiles(dir) {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md') && f !== 'README.md' && f !== 'index.md')
    .map((f) => path.join(dir, f));
}

function hasFrontmatter(content) {
  return content.startsWith('---\n') && content.includes('\n---\n');
}

function isStringArray(value) {
  return Array.isArray(value) && value.every((v) => typeof v === 'string');
}

function isValidDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}(-\d{2})?$/.test(value);
}

function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const rel = path.relative(process.cwd(), filePath);

  if (!hasFrontmatter(content)) {
    return { ok: false, message: `${rel}: missing YAML frontmatter` };
  }

  const parsed = matter(content);
  const fm = parsed.data ?? {};
  if (typeof fm.slug !== 'string' || !fm.slug.trim()) return { ok: false, message: `${rel}: missing frontmatter.slug` };
  if (typeof fm.title !== 'string' || !fm.title.trim()) return { ok: false, message: `${rel}: missing frontmatter.title` };
  if (!['S', 'A', 'B'].includes(fm.core_level)) return { ok: false, message: `${rel}: invalid frontmatter.core_level` };
  if (!isStringArray(fm.tags) || fm.tags.length === 0) return { ok: false, message: `${rel}: invalid frontmatter.tags[]` };
  if (!isStringArray(fm.concepts)) return { ok: false, message: `${rel}: invalid frontmatter.concepts[]` };
  if (!isValidDate(fm.date)) return { ok: false, message: `${rel}: invalid frontmatter.date (YYYY-MM or YYYY-MM-DD)` };

  const missing = REQUIRED_HEADINGS.filter((h) => !content.includes(h));
  if (missing.length) {
    return { ok: false, message: `${rel}: missing headings: ${missing.join(', ')}` };
  }

  return { ok: true, message: `${rel}: OK` };
}

function main() {
  if (!fs.existsSync(ROOT)) {
    console.error(`content root not found: ${ROOT}`);
    process.exit(1);
  }

  const files = listMdFiles(ROOT);
  if (!files.length) {
    console.error('no chapter md files found');
    process.exit(1);
  }

  const results = files.map(validateFile);
  const failed = results.filter((r) => !r.ok);

  results.forEach((r) => console.log(r.message));

  if (failed.length) process.exit(1);
}

main();
