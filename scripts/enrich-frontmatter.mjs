import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const ROOT = path.resolve(process.cwd(), 'content/maoxuan');

function listMdFiles(dir) {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md') && f !== 'README.md' && f !== 'index.md')
    .map((f) => path.join(dir, f));
}

function extractDateFromContent(content) {
  const m = content.match(/^\s*-\s*写作时间：\s*([0-9]{4}-[0-9]{2}(?:-[0-9]{2})?)/m);
  return m ? m[1] : null;
}

function extractFirstSourceUrl(content) {
  const idx = content.indexOf('资料来源');
  const region = idx >= 0 ? content.slice(idx, idx + 800) : content;
  const m = region.match(/https?:\/\/[^\s)]+/);
  return m ? m[0] : null;
}

function uniqStrings(arr) {
  return Array.from(new Set(arr.map((v) => String(v).trim()).filter((v) => v.length > 0)));
}

function main() {
  if (!fs.existsSync(ROOT)) {
    console.error(`content root not found: ${ROOT}`);
    process.exit(1);
  }

  const files = listMdFiles(ROOT);
  const failures = [];
  let updated = 0;

  for (const filePath of files) {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = matter(raw);
    const data = parsed.data ?? {};
    const rel = path.relative(process.cwd(), filePath);

    let changed = false;

    if (!data.date) {
      const extracted = extractDateFromContent(parsed.content);
      if (!extracted) failures.push(`${rel}: cannot extract 写作时间`);
      else {
        data.date = extracted;
        changed = true;
      }
    }

    if (!data.concepts) {
      if (Array.isArray(data.tags)) data.concepts = uniqStrings(data.tags);
      else data.concepts = [];
      changed = true;
    }

    if (!data.source) {
      const extracted = extractFirstSourceUrl(parsed.content);
      if (extracted) {
        data.source = extracted;
        changed = true;
      }
    }

    if (Array.isArray(data.tags)) data.tags = uniqStrings(data.tags);
    if (Array.isArray(data.concepts)) data.concepts = uniqStrings(data.concepts);

    const ordered = {
      slug: data.slug,
      title: data.title,
      volume: data.volume ?? '',
      date: data.date,
      core_level: data.core_level,
      tags: data.tags,
      concepts: data.concepts,
      scenarios: data.scenarios ?? {},
      summary: data.summary,
      source: data.source,
    };

    const cleaned = Object.fromEntries(Object.entries(ordered).filter(([, v]) => v !== undefined));

    if (changed) {
      const next = matter.stringify(parsed.content, cleaned);
      fs.writeFileSync(filePath, next);
      updated += 1;
    }
  }

  if (failures.length) {
    failures.forEach((f) => console.error(f));
    process.exit(1);
  }

  console.log(`updated frontmatter: ${updated}/${files.length}`);
}

main();

