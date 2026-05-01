import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { StudyItem } from './types';
import { getStudyItemById } from './index';

export type StudyDoc = {
  item: StudyItem;
  frontmatter: Record<string, unknown>;
  content: string;
};

function readMarkdown(filePath: string) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(raw);
  return { frontmatter: parsed.data as Record<string, unknown>, content: parsed.content.trim() };
}

export function getStudyGuideById(id: string): StudyDoc | null {
  const item = getStudyItemById(id);
  if (!item) return null;
  const abs = path.join(process.cwd(), item.guide_path);
  if (!fs.existsSync(abs)) return null;
  const md = readMarkdown(abs);
  return { item, ...md };
}

export function getStudyOriginalById(id: string): StudyDoc | null {
  const item = getStudyItemById(id);
  if (!item) return null;
  const abs = path.join(process.cwd(), item.original_path);
  if (!fs.existsSync(abs)) return null;
  const md = readMarkdown(abs);
  return { item, ...md };
}

