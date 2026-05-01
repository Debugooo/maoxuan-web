import fs from 'node:fs';
import path from 'node:path';

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

function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const rel = path.relative(process.cwd(), filePath);

  if (!hasFrontmatter(content)) {
    return { ok: false, message: `${rel}: missing YAML frontmatter` };
  }

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
