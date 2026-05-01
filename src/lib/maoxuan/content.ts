import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { Chapter, ChapterFrontmatter, ChapterIndexItem, LibraryIndex } from './types';

const CONTENT_ROOT = path.join(process.cwd(), 'content');
const DATE_RE = /^\d{4}-\d{2}(?:-\d{2})?$/;

function assertStringArray(value: unknown, field: string, filePath: string) {
  if (!Array.isArray(value)) throw new Error(`Missing ${field}[] in ${filePath}`);
  return value.map((v) => String(v)).filter((v) => v.trim().length > 0);
}

function assertDate(value: unknown, filePath: string) {
  if (typeof value !== 'string' || !DATE_RE.test(value)) throw new Error(`Invalid date in ${filePath}`);
  return value;
}

function dateKey(date: string) {
  const [y, m, d] = date.split('-');
  const day = d ? Number(d) : 0;
  return Number(y) * 10000 + Number(m) * 100 + day;
}

function assertFrontmatter(data: unknown, filePath: string): ChapterFrontmatter {
  const d = data as Partial<ChapterFrontmatter>;

  if (!d || typeof d !== 'object') throw new Error(`Invalid frontmatter in ${filePath}`);
  if (!d.slug || typeof d.slug !== 'string') throw new Error(`Missing slug in ${filePath}`);
  if (!d.title || typeof d.title !== 'string') throw new Error(`Missing title in ${filePath}`);
  const date = assertDate(d.date, filePath);
  if (!d.core_level || !['S', 'A', 'B'].includes(d.core_level)) throw new Error(`Invalid core_level in ${filePath}`);
  const tags = assertStringArray(d.tags, 'tags', filePath);
  const concepts = assertStringArray(d.concepts, 'concepts', filePath);

  return {
    slug: d.slug,
    title: d.title,
    volume: d.volume ?? '',
    date,
    core_level: d.core_level,
    tags,
    concepts,
    scenarios: d.scenarios ?? {},
    summary: d.summary,
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

export function getChaptersChronological(): ChapterIndexItem[] {
  const index = getLibraryIndex();
  return [...index.chapters].sort((a, b) => dateKey(a.date) - dateKey(b.date) || a.slug.localeCompare(b.slug));
}

export function getChapterNeighbors(slug: string) {
  const chapters = getChaptersChronological();
  const idx = chapters.findIndex((c) => c.slug === slug);
  if (idx < 0) return { prev: null, next: null };
  return {
    prev: idx > 0 ? chapters[idx - 1] : null,
    next: idx < chapters.length - 1 ? chapters[idx + 1] : null,
  };
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
