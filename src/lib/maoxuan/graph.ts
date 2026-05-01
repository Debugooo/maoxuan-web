import type { Chapter } from './types';
import { getChapterBySlug, getLibraryIndex } from './content';

export type GraphNodeType = 'chapter' | 'tag' | 'concept' | 'event';

export type GraphNode = {
  id: string;
  type: GraphNodeType;
  label: string;
  slug?: string;
  date?: string;
};

export type GraphLinkType = 'tag' | 'concept' | 'event';

export type GraphLink = {
  source: string;
  target: string;
  type: GraphLinkType;
};

export type GraphData = {
  nodes: GraphNode[];
  links: GraphLink[];
};

function normalizeIdPart(value: string) {
  return encodeURIComponent(value).replace(/%/g, '_');
}

function extractTimelineEvents(chapter: Chapter) {
  const lines = chapter.content.split('\n');
  const events: string[] = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.includes('时间线')) continue;

    let j = i + 1;
    for (; j < lines.length; j += 1) {
      const l = lines[j];
      if (!l.trim()) break;
      if (/^\s*-\s*资料来源/.test(l)) break;
      if (/^\s*###\s+/.test(l)) break;
      if (/^\s*##\s+/.test(l)) break;
      if (/^\s*-\s+/.test(l) || /^\s{2,}-\s+/.test(l)) {
        const text = l.replace(/^\s*-\s+/, '').trim();
        if (text) events.push(text);
        continue;
      }
      if (/^\s+/.test(l)) continue;
      break;
    }

    if (events.length) break;
  }

  return events;
}

function extractDateFromEventLabel(label: string) {
  const m = label.match(/^([0-9]{4})([-.])([0-9]{2})(?:\2([0-9]{2}))?/);
  if (!m) return null;
  const y = m[1];
  const mo = m[3];
  const d = m[4];
  return d ? `${y}-${mo}-${d}` : `${y}-${mo}`;
}

export function getMaoxuanGraphData(): GraphData {
  const index = getLibraryIndex();

  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  const addNode = (node: GraphNode) => {
    if (nodes.some((n) => n.id === node.id)) return;
    nodes.push(node);
  };

  for (const ch of index.chapters) {
    const chapterId = `chapter:${ch.slug}`;
    addNode({ id: chapterId, type: 'chapter', label: ch.title, slug: ch.slug, date: ch.date });

    for (const tag of ch.tags) {
      const tagId = `tag:${normalizeIdPart(tag)}`;
      addNode({ id: tagId, type: 'tag', label: tag });
      links.push({ source: chapterId, target: tagId, type: 'tag' });
    }

    for (const concept of ch.concepts) {
      const conceptId = `concept:${normalizeIdPart(concept)}`;
      addNode({ id: conceptId, type: 'concept', label: concept });
      links.push({ source: chapterId, target: conceptId, type: 'concept' });
    }

    const chapter = getChapterBySlug(ch.slug);
    if (!chapter) continue;
    const events = extractTimelineEvents(chapter);
    for (let i = 0; i < events.length; i += 1) {
      const label = events[i];
      const eventId = `event:${ch.slug}:${i}`;
      addNode({ id: eventId, type: 'event', label, date: extractDateFromEventLabel(label) ?? ch.date });
      links.push({ source: chapterId, target: eventId, type: 'event' });
    }
  }

  return { nodes, links };
}
