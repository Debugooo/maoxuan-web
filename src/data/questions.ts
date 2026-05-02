export type TrainingQuestion = {
  id: string;
  chapterSlug: 'shijianlun' | 'maodunlun' | 'hunan';
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
  {
    id: 'hunan-1',
    chapterSlug: 'hunan',
    tags: ['调查', '交叉验证', '复盘'],
    title: '32小时版“考察报告”演练',
    prompt:
      '拿出一张空白A4纸或打开一个空白文档，完成一次“32天调查”的微型版（32小时版）。\n\n一、选择考察题目（选一个就行）\n- 你所在的团队/公司，最近有没有一项新制度/新流程引发了争议？（有人叫好，有人喊糟）\n- 你关注的行业/赛道，有没有一个被全网吹捧或被全网群嘲的现象，而你其实并不确定真相？\n- 你的朋友圈里，有没有一个人或一类人，大家对 ta 的评价非常两极分化？\n\n二、按“32小时版”走一遍流程\n1) 记录你的初始预判：开始调查之前，你听说了什么？你的直觉判断是什么？\n2) 设计调查参数：\n   - 时间投入：我打算花多少小时在这件事上？\n   - 信源覆盖：至少三个不同利益相关方（参考“农会干部 + 绅士 + 普通农民”的三角覆盖法）\n   - 采集方式：公开讨论还是私下深聊？一对一还是小型座谈？\n3) 实际采集并记录：至少找 2–3 个不同立场的人聊完，把他们的原话记下来（先记录原话，不要急着总结）。\n4) 用“五维分类法”整理你的发现：组织、政治/权力、经济/利益、力量/能力、文化/认知。\n5) 做出判断并注明依据：每一个判断后面都写清楚事实依据来自哪一次访谈或哪一项观察；找不到依据的判断先存疑，不作为决策依据。',
  },
];
