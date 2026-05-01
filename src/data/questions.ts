export type TrainingQuestion = {
  id: string;
  chapterSlug: 'shijianlun' | 'maodunlun';
  tags: string[];
  title: string;
  prompt: string;
};

export const trainingQuestions: TrainingQuestion[] = [
  {
    id: 'shijian-1',
    chapterSlug: 'shijianlun',
    tags: ['实践', '调查研究'],
    title: '把争论改写成可检验命题',
    prompt: '选一个你最近的争论（工作/家庭/选择），把它改写成 1 条 If-Then 命题，并写出一个 48 小时内完成的小试验。',
  },
  {
    id: 'shijian-2',
    chapterSlug: 'shijianlun',
    tags: ['试验', '止损'],
    title: '设计最小试验与止损阈值',
    prompt: '你当前最不确定的一件事是什么？写出成功阈值、成本上限、失败即止损条件。',
  },
  {
    id: 'shijian-3',
    chapterSlug: 'shijianlun',
    tags: ['复盘', '认识迭代'],
    title: '用复盘模板写一页纸',
    prompt: '用实践论复盘模板，复盘你最近一次失败/返工：目标、事实证据、假设、试验、结果偏差、下一轮最小动作。',
  },
  {
    id: 'maodun-1',
    chapterSlug: 'maodunlun',
    tags: ['主要矛盾', '结构化'],
    title: '列出矛盾对并选主要矛盾',
    prompt: '列出 3–5 个矛盾对（X vs Y），用四条判据选出主要矛盾，并写出打击点。',
  },
  {
    id: 'maodun-2',
    chapterSlug: 'maodunlun',
    tags: ['主要方面', '阶段'],
    title: '判定主要方面与阶段切换',
    prompt: '你当前处境的主要方面是什么？如果主要方面翻转，意味着什么打法切换？写出一个可观察的翻转信号。',
  },
  {
    id: 'maodun-3',
    chapterSlug: 'maodunlun',
    tags: ['冲突', '边界'],
    title: '冲突分级处置',
    prompt: '给一段冲突分级（0/1/2），写出升级阈值与降级阈值，并给出一条“下一步最小动作”。',
  },
];

