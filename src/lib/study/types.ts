export type VolumeId = 'v1' | 'v2' | 'v3' | 'v4';

export type StudyModule =
  | 'kernel'
  | 'evidence'
  | 'modeling'
  | 'structure'
  | 'organization'
  | 'united-front'
  | 'strategy'
  | 'economy'
  | 'playbook';

export type StudyItem = {
  id: string;
  volume: VolumeId;
  title: string;
  date?: string;
  place?: string;
  source_url: string;
  guide_path: string;
  original_path: string;
  concepts?: string[];
  cross_refs?: string[];
  prev_learning?: string | null;
  next_learning?: string | null;
  cos?: {
    stage: number;
    module: StudyModule;
  };
};

export type StudyIndex = {
  version: 1;
  volumes: Record<VolumeId, { label: string; items: StudyItem[] }>;
  learningOrder: string[];
  concepts: Array<{ id: string; label: string }>;
};

