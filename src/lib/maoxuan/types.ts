export type CoreLevel = 'S' | 'A' | 'B';
export type ScenarioLevel = 'high' | 'medium' | 'low';

export type ChapterFrontmatter = {
  slug: string;
  title: string;
  volume?: string;
  core_level: CoreLevel;
  tags: string[];
  scenarios?: Record<string, ScenarioLevel>;
  summary?: string;
  date?: string;
  source?: string;
};

export type ChapterIndexItem = ChapterFrontmatter & {
  filePath: string;
};

export type Chapter = ChapterFrontmatter & {
  content: string;
};

export type LibraryIndex = {
  chapters: ChapterIndexItem[];
  volumesMap: Record<string, ChapterIndexItem[]>;
  tagsMap: Record<string, ChapterIndexItem[]>;
};

export type TocItem = {
  depth: 2 | 3 | 4;
  id: string;
  text: string;
};
