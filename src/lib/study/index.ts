import fs from 'node:fs';
import path from 'node:path';
import type { StudyIndex, StudyItem } from './types';

const INDEX_PATH = path.join(process.cwd(), 'content/maoxuan-cos/index.json');

export function getStudyIndex(): StudyIndex {
  const raw = fs.readFileSync(INDEX_PATH, 'utf8');
  return JSON.parse(raw) as StudyIndex;
}

export function getStudyItemById(id: string): StudyItem | null {
  const index = getStudyIndex();
  for (const vol of Object.values(index.volumes)) {
    const hit = vol.items.find((x) => x.id === id);
    if (hit) return hit;
  }
  return null;
}

