import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { Chapter, ChapterFrontmatter, ChapterIndexItem, LibraryIndex } from './types';

const CONTENT_ROOT = path.join(process.cwd(), 'content');

function assertFrontmatter(data: unknown, filePath: string): ChapterFrontmatter {
  const d = data as Partial<ChapterFrontmatter>;

  if (!d || typeof d !== 'object') throw new Error(`Invalid frontmatter in ${filePath}`);
  if (!d.slug || typeof d.slug !== 'string') throw new Error(`Missing slug in ${filePath}`);
  if (!d.title || typeof d.title !== 'string') throw new Error(`Missing title in ${filePath}`);
  if (!d.core_level || !['S', 'A', 'B'].includes(d.core_level)) throw new Error(`Invalid core_level in ${filePath}`);
  if (!Array.isArray(d.tags)) throw new Error(`Missing tags[] in ${filePath}`);

  return {
    slug: d.slug,
    title: d.title,
    volume: d.volume ?? '',
    core_level: d.core_level,
    tags: d.tags,
    scenarios: d.scenarios ?? {},
    summary: d.summary,
    date: d.date,
    source: d.source,
  };
}

function listMarkdownFiles(dir: string) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => path.join(dir, f));
}

export function getLibraryIndex(): LibraryIndex {
  const maoxuanDir = path.join(CONTENT_ROOT, 'maoxuan');
  const files = listMarkdownFiles(maoxuanDir).filter((p) => !p.endsWith('README.md') && !p.endsWith('index.md'));

  const chapters: ChapterIndexItem[] = files.map((filePath) => {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = matter(raw);
    const fm = assertFrontmatter(parsed.data, filePath);
    return { ...fm, filePath };
  });

  const volumesMap: Record<string, ChapterIndexItem[]> = {};
  const tagsMap: Record<string, ChapterIndexItem[]> = {};

  for (const ch of chapters) {
    const vol = ch.volume && ch.volume.trim() ? ch.volume.trim() : '未分卷';
    volumesMap[vol] ??= [];
    volumesMap[vol].push(ch);

    for (const tag of ch.tags) {
      const t = String(tag);
      tagsMap[t] ??= [];
      tagsMap[t].push(ch);
    }
  }

  const sortByTitle = (a: ChapterIndexItem, b: ChapterIndexItem) => a.title.localeCompare(b.title, 'zh-Hans-CN');
  chapters.sort(sortByTitle);
  Object.values(volumesMap).forEach((arr) => arr.sort(sortByTitle));
  Object.values(tagsMap).forEach((arr) => arr.sort(sortByTitle));

  return { chapters, volumesMap, tagsMap };
}

export function getChapterBySlug(slug: string): Chapter | null {
  const index = getLibraryIndex();
  const hit = index.chapters.find((c) => c.slug === slug);
  if (!hit) return null;

  const raw = fs.readFileSync(hit.filePath, 'utf8');
  const parsed = matter(raw);
  const fm = assertFrontmatter(parsed.data, hit.filePath);

  return {
    ...fm,
    content: parsed.content.trim(),
  };
}
