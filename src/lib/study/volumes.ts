import type { VolumeId } from '@/lib/study/types';
import { slugifyHeading } from '@/lib/maoxuan/slug';

export type BookItem = {
  title: string;
  id?: string;
  source_url: string;
  date?: string;
  topic?: string;
  tags?: string[];
};

export type BookGroup = {
  title: string;
  items: BookItem[];
};

export type VolumeGuide = {
  volume: Extract<VolumeId, 'v1' | 'v2' | 'v3' | 'v4' | 'v5'>;
  range: string;
  label: string;
  theme: string;
  intro: string;
  bullets: string[];
  bookGroups: BookGroup[];
};

function hashString(input: string) {
  let h = 5381;
  for (let i = 0; i < input.length; i += 1) h = (h * 33) ^ input.charCodeAt(i);
  return (h >>> 0).toString(16).slice(0, 8);
}

function extractDateToken(url: string) {
  const m = url.match(/maozedong\/marxist\.org-chinese-mao-([^./]+)\.htm/i);
  const raw = m ? m[1] : null;
  const token = raw ? raw.match(/(\d{8}|\d{6}|\d{4})/) : null;
  return token ? token[1] : null;
}

function formatDate(token: string | null) {
  if (!token) return '未知';
  if (token.length === 8) return `${token.slice(0, 4)}-${token.slice(4, 6)}-${token.slice(6, 8)}`;
  if (token.length === 6) return `${token.slice(0, 4)}-${token.slice(4, 6)}`;
  if (token.length === 4) return token;
  return token;
}

function inferTopic(title: string) {
  const t = title.trim();
  if (t.startsWith('论')) return `围绕“${t.replace(/^论/, '')}”给出可执行的判断与方法框架。`;
  if (t.includes('谈话')) return '以对话方式提炼形势判断与策略要点，便于快速传达与统一口径。';
  if (t.includes('声明')) return '在关键节点发出政治信号，明确立场、底线与行动方向。';
  if (t.includes('命令')) return '把战略意图压成行动指令与组织要求，确保执行一致。';
  if (t.includes('报告')) return '集中回答中心问题，并给出可落地的路线、步骤与抓手。';
  if (t.includes('发刊词')) return '为组织与舆论阵地设定路线、任务与工作标准。';
  if (t.includes('纪念')) return '以人物为范式，提炼可执行的作风与价值标准。';
  if (t.includes('通知')) return '面向组织系统发布统一口径与工作部署，减少误解与内耗。';
  return '提炼本篇要解决的中心矛盾，并给出可复用的工作方法。';
}

const DEFAULT_TAGS: Record<VolumeId, string[]> = {
  v1: ['阶级分析', '根据地', '群众路线', '组织建设', '方法论'],
  v2: ['抗日战争', '统一战线', '战略判断', '政治动员', '建党'],
  v3: ['整风', '根据地治理', '学习方法', '领导方法', '政策'],
  v4: ['解放战争', '土地改革', '政权建设', '战略', '建国'],
  v5: ['治国理政', '社会主义建设', '人民内部矛盾', '反腐整风', '国际斗争'],
};

const KEYWORD_TAGS: Array<[RegExp, string]> = [
  [/持久战|游击|战略/,'战略'],
  [/统一战线|合作|团结|国共/,'统一战线'],
  [/经济|财政|生产|减租|工商业/,'经济财政'],
  [/土地|农村|农民|阶级/,'土地与阶级'],
  [/学习|调查/,'学习与调查'],
  [/自由主义|纪律|作风/,'纪律作风'],
  [/宪政|民主|政府|政权/,'政权与民主'],
  [/国际|苏联|美国|英国/,'国际形势'],
  [/宣传|日报|发刊词/,'舆论与宣传'],
  [/军|战争|作战|战役/,'军事'],
];

function inferTags(volume: VolumeId, title: string) {
  const picked: string[] = [];
  for (const [re, tag] of KEYWORD_TAGS) {
    if (re.test(title) && !picked.includes(tag)) picked.push(tag);
    if (picked.length >= 5) break;
  }
  for (const tag of DEFAULT_TAGS[volume]) {
    if (picked.length >= 5) break;
    if (!picked.includes(tag)) picked.push(tag);
  }
  while (picked.length < 5) picked.push('方法');
  return picked.slice(0, 5);
}

export function computeBookItemId(volume: VolumeId, it: BookItem) {
  if (it.id) return it.id;
  const token = extractDateToken(it.source_url);
  const datePart = token ? formatDate(token).replaceAll('-', '') : 'unknown';
  const slug = slugifyHeading(it.title).slice(0, 18) || 'item';
  const h = hashString(`${volume}|${it.source_url}|${it.title}`);
  return `mx-${volume}-${datePart}-${h}-${slug}`;
}

export type EnrichedBookItem = {
  id: string;
  title: string;
  source_url: string;
  date: string;
  topic: string;
  tags: [string, string, string, string, string];
};

export function enrichBookItem(volume: VolumeId, it: BookItem): EnrichedBookItem {
  const id = computeBookItemId(volume, it);
  const date = it.date ?? formatDate(extractDateToken(it.source_url));
  const topic = it.topic ?? inferTopic(it.title);
  const tags = (it.tags ?? inferTags(volume, it.title)).slice(0, 5) as [string, string, string, string, string];
  return { id, title: it.title, source_url: it.source_url, date, topic, tags };
}

export function getBookItemById(id: string) {
  for (const v of VOLUMES) {
    for (const g of v.bookGroups) {
      for (const it of g.items) {
        const full = enrichBookItem(v.volume, it);
        if (full.id === id) return { volume: v.volume, guide: v, groupTitle: g.title, item: full };
      }
    }
  }
  return null;
}

export const VOLUMES: VolumeGuide[] = [
  {
    volume: 'v1',
    range: '1925–1937',
    label: '第一卷',
    theme: '革命的基本问题与土地革命经验',
    intro:
      '这一卷可以说是中国共产党人在黑暗里摸索出路的“生存指南”。敌强我弱、四面围堵，年轻的革命者首先要回答的不是“怎样胜利”，而是“怎样活下去”。毛泽东没有躲进书斋去抄答案，他脱下长衫，把脚踩进泥里：从阶级与农民问题入手，去辨人心的走向，去摸力量的源头。于是你会看到《湖南农民运动考察报告》那种带着泥土气的目光，也会看到《星星之火，可以燎原》那种在绝境里点灯的判断——不是豪言壮语，而是把残酷现实拆开，硬生生踩出一条“农村包围城市”的路。',
    bullets: ['阶级分析：确认对象、动力与同盟', '农民运动：发动群众与组织力量', '根据地建设：政权、经济与武装的生存体系', '实践论/矛盾论：从实际出发的认识与分析方法'],
    bookGroups: [
      {
        title: '第一次国内革命战争时期',
        items: [
          {
            id: 'mx-v1-001',
            title: '中国社会各阶级的分析',
            source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19251201.htm',
          },
          {
            id: 'mx-v1-002',
            title: '湖南农民运动考察报告',
            source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-192703.htm',
          },
        ],
      },
      {
        title: '第二次国内革命战争时期',
        items: [
          {
            id: 'mx-v1-003',
            title: '中国的红色政权为什么能够存在？',
            source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19281005.htm',
          },
          {
            id: 'mx-v1-004',
            title: '井冈山的斗争',
            source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19281125.htm',
          },
          {
            id: 'mx-v1-005',
            title: '关于纠正党内的错误思想',
            source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-192912.htm',
          },
          {
            id: 'mx-v1-006',
            title: '星星之火，可以燎原',
            source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19300105.htm',
          },
          {
            id: 'mx-v1-007',
            title: '反对本本主义',
            source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-193005.htm',
          },
          {
            id: 'mx-v1-008',
            title: '必须注意经济工作',
            source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19330812.htm',
          },
          {
            id: 'mx-v1-009',
            title: '怎样分析农村阶级',
            source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-193310.htm',
          },
          {
            id: 'mx-v1-010',
            title: '我们的经济政策',
            source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-193401.htm',
          },
          {
            id: 'mx-v1-011',
            title: '关心群众生活，注意工作方法',
            source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19340127.htm',
          },
          {
            id: 'mx-v1-012',
            title: '论反对日本帝国主义的策略',
            source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19351227.htm',
          },
          {
            id: 'mx-v1-013',
            title: '中国革命战争的战略问题',
            source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-193612.htm',
          },
          {
            id: 'mx-v1-014',
            title: '关于蒋介石声明的声明',
            source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19361228.htm',
          },
          {
            id: 'mx-v1-015',
            title: '中国共产党在抗日时期的任务',
            source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19370503.htm',
          },
          {
            id: 'mx-v1-016',
            title: '为争取千百万群众进入抗日民族统一战线而斗争',
            source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19370508.htm',
          },
          {
            id: 'mx-v1-017',
            title: '实践论',
            source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-193707.htm',
          },
          {
            id: 'mx-v1-018',
            title: '矛盾论',
            source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-193708.htm',
          },
        ],
      },
    ],
  },
  {
    volume: 'v2',
    range: '1937–1941',
    label: '第二卷',
    theme: '抗日战争战略与新民主主义理论',
    intro:
      '当山河破碎、亡国论与速胜论交织成一片喧嚣时，中国到底路在何方？这一卷的文字，像在风雨里竖起一根根路标：它一面把战争的规律算清楚，一面把人心与组织的账也算清楚。最耀眼的莫过于《论持久战》——它不是简单的军事判断，而是把“时间”变成武器，把“信心”变成能力，把“人民”变成决定胜负的结构；同时，《新民主主义论》等文章又像一张施工图，把革命将走向何处、国家应如何重建，讲得清清楚楚。读完这一卷，你会感觉视野被抬高：局部的胜败退到后面，全局的节奏和路线浮上来。',
    bullets: ['统一战线：团结抗日与独立自主', '持久战与人民战争：战略结构与打法', '新民主主义理论：政治路线与社会方案', '党的建设：干部、纪律与政治领导'],
    bookGroups: [
      {
        title: '抗日战争时期（上）',
        items: [
          { title: '反对日本进攻的方针、办法和前途', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19370723.htm' },
          { title: '为动员一切力量争取抗战胜利而斗争', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19370825.htm' },
          { title: '反对自由主义', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19370907.htm' },
          { title: '国共合作成立后的迫切任务', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19370929.htm' },
          { title: '和英国记者贝特兰的谈话', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19371025.htm' },
          { title: '上海太原失陷以后抗日战争的形势和任务', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19371112.htm' },
          { title: '陕甘宁边区政府第八路军后方留守处布告', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19380515.htm' },
          { title: '抗日游击战争的战略问题', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-193805.htm' },
          { title: '论持久战', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-193805b.htm' },
          { title: '中国共产党在民族战争中的地位', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19381014.htm' },
          { title: '统一战线中的独立自主问题', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19381105.htm' },
          { title: '战争和战略问题', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19381106.htm' },
          { title: '五四运动', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19390501.htm' },
          { title: '青年运动的方向', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19390504.htm' },
          { title: '反对投降活动', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19390630.htm' },
          { title: '必须制裁反动派', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19390801.htm' },
          { title: '关于国际新形势对新华日报记者的谈话', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19390901.htm' },
          { title: '和中央社、扫荡报、新民报三记者的谈话', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19390916.htm' },
          { title: '苏联利益和人类利益的一致', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19390928.htm' },
          { title: '《共产党人》发刊词', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19391004.htm' },
          { title: '目前形势和党的任务', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19391010.htm' },
          { title: '大量吸收知识分子', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19391201.htm' },
          { title: '中国革命和中国共产党', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-193912.htm' },
          { title: '斯大林是中国人民的朋友', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19391220.htm' },
          { title: '纪念白求恩', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19391221.htm' },
          { title: '新民主主义论', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-194001.htm' },
          { title: '克服投降危险，力争时局好转', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19400128.htm' },
          { title: '团结一切抗日力量，反对反共顽固派', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19400201.htm' },
          { title: '向国民党的十点要求', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19400201b.htm' },
          { title: '《中国工人》发刊词', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19400207.htm' },
          { title: '必须强调团结和进步', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19400207b.htm' },
          { title: '新民主主义的宪政', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19400220.htm' },
          { title: '抗日根据地的政权问题', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19400306.htm' },
          { title: '目前抗日统一战线中的策略问题', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19400311.htm' },
          { title: '放手发展抗日力量，抵抗反共顽固派的进攻', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19400504.htm' },
          { title: '团结到底', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19400705.htm' },
          { title: '论政策', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19401225.htm' },
          { title: '为皖南事变发表的命令和谈话', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19410120.htm' },
          { title: '打退第二次反共高潮后的时局', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19410318.htm' },
          { title: '关于打退第二次反共高潮的总结', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19410508.htm' },
        ],
      },
    ],
  },
  {
    volume: 'v3',
    range: '1941–1945',
    label: '第三卷',
    theme: '整风与根据地建设：抗战胜利的内功',
    intro:
      '外患未平，内耗又起。胜利并不会自动降临，组织也不会自动变强——恰恰在最艰难的相持岁月里，思想的混乱、作风的漂浮、学习的虚假，会悄悄把一支队伍掏空。这一卷展示的是一种近乎“刮骨疗毒”的自我革新：从《改造我们的学习》《整顿党的作风》到《反对党八股》，刀锋直指人性的懒惰与组织的积弊，把“空话”“虚功”“小聪明”一层层剥掉，逼着人回到事实、回到问题、回到纪律。然后，《为人民服务》又用最朴素的语言，把一切归结到根上：一个组织能走多远，最终取决于它把谁放在心上、把什么当作目的。',
    bullets: ['整风：纠偏学风文风作风，重建方法', '调查研究/实事求是：把认识改造成证据链', '文艺为人民：文化动员与群众连接', '根据地治理：政权运行、政策执行与群众工作'],
    bookGroups: [
      {
        title: '抗日战争时期（下）',
        items: [
          { title: '《农村调查》的序言和跋', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-194134.htm' },
          { title: '改造我们的学习', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19410519.htm' },
          { title: '揭破远东慕尼黑的阴谋', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19410525.htm' },
          { title: '关于反法西斯的国际统一战线', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19410623.htm' },
          { title: '在陕甘宁边区参议会的演说', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19411106.htm' },
          { title: '整顿党的作风', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19420201.htm' },
          { title: '反对党八股', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19420208.htm' },
          { title: '在延安文艺座谈会上的讲话', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-194205.htm' },
          { title: '一个极其重要的政策', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19420907.htm' },
          { title: '第二次世界大战的转折点', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19421012.htm' },
          { title: '祝十月革命二十五周年', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19421106.htm' },
          { title: '抗日时期的经济问题和财政问题', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-194212.htm' },
          { title: '关于领导方法的若干问题', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19430601.htm' },
          { title: '质问国民党', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19430712.htm' },
          { title: '开展根据地的减租、生产和拥政爱民运动', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19431001.htm' },
          { title: '评国民党十一中全会和三届二次国民参政会', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19431005.htm' },
          { title: '组织起来', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19431129.htm' },
          { title: '学习和时局', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19440412.htm' },
          { title: '为人民服务', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19440908.htm' },
          { title: '评蒋介石在双十节的演说', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19441011.htm' },
          { title: '文化工作中的统一战线', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19441030.htm' },
          { title: '必须学会做经济工作', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19450110.htm' },
          { title: '游击区也能够进行生产', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19450131.htm' },
          { title: '两个中国之命运', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19450423.htm' },
          { title: '论联合政府', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19450424.htm' },
          { title: '愚公移山', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19450611.htm' },
          { title: '论军队生产自给，兼论整风和生产两大运动的重要性', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19450427.htm' },
          { title: '赫尔利和蒋介石的双簧已经破产', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19450710.htm' },
          { title: '评赫尔利政策的危险', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19450712.htm' },
          { title: '给福斯特同志的电报', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19450729.htm' },
          { title: '对日寇的最后一战', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19450809.htm' },
        ],
      },
    ],
  },
  {
    volume: 'v4',
    range: '1945–1949',
    label: '第四卷',
    theme: '解放战争与建国前夕的国家构想',
    intro:
      '这是《毛选》中最酣畅淋漓的一卷，也是“阳谋”与“大势”结合到极致的篇章。你会看到一种强烈的推进感：从抗战胜利后的时局判断开始，局势像潮水一样翻涌，而文字像指挥刀一样稳定——每一次判断都指向下一步，每一份电报都在塑造未来。三大战役期间的系列方略尤其让人震撼：它不仅是军事指挥的艺术，更像是一套对人性、资源、组织与时间的综合操盘。读这一卷，会有一种清晰的感觉：所谓“大势”，不是等来的；是把分散的力量组织起来，把摇摆的人心凝聚起来，把复杂的局面拆成可执行的步骤，一步步推出来的。',
    bullets: ['解放战争战略：集中优势、各个歼灭与战略推进', '土地改革与动员：重塑社会基础与组织能力', '人民民主专政：国家形态与政治秩序', '建国构想：政治、经济与外交的总体框架'],
    bookGroups: [
      {
        title: '第三次国内革命战争时期',
        items: [
          { title: '抗日战争胜利后的时局和我们的方针', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19450813.htm' },
          { title: '蒋介石在挑动内战', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19450813b.htm' },
          { title: '第十八集团军总司令给蒋介石的两个电报', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-194508.htm' },
          { title: '评蒋介石发言人谈话', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19450816.htm' },
          { title: '中共中央关于同国民党进行和平谈判的通知', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19450826.htm' },
          { title: '关于重庆谈判', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19451017.htm' },
          { title: '国民党进攻的真相', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19451105.htm' },
          { title: '减租和生产是保卫解放区的两件大事', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19451107.htm' },
          { title: '一九四六年解放区工作的方针', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19451215.htm' },
          { title: '建立巩固的东北根据地', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19451228.htm' },
          { title: '关于目前国际形势的几点估计', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-194604.htm' },
          { title: '以自卫战争粉碎蒋介石的进攻', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19460720.htm' },
          { title: '和美国记者安娜·刘易斯·斯特朗的谈话', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19460806.htm' },
          { title: '集中优势兵力，各个歼灭敌人', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19460916.htm' },
          { title: '美国“调解”真相和中国内战前途', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19460929.htm' },
          { title: '三个月总结', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19461001.htm' },
          { title: '迎接中国革命的新高潮', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19470201.htm' },
          { title: '中共中央关于暂时放弃延安和保卫陕甘宁边区的两个文件', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-194611and194704.htm' },
          { title: '关于西北战场的作战方针', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19470415.htm' },
          { title: '蒋介石政府已处在全民的包围中', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19470530.htm' },
          { title: '解放战争第二年的战略方针', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19470901.htm' },
          { title: '中国人民解放军宣言', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19471010.htm' },
          { title: '中国人民解放军总部关于重行颁布三大纪律八项注意的训令', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19471010a.htm' },
          { title: '目前形势和我们的任务', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19471225.htm' },
          { title: '关于建立报告制度', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19480107.htm' },
          { title: '关于目前党的政策中的几个重要问题', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19480118.htm' },
          { title: '军队内部的民主运动', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19480130.htm' },
          { title: '在不同地区实施土地法的不同策略', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19480203.htm' },
          { title: '纠正土地改革宣传中的“左”倾错误', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19480211.htm' },
          { title: '新解放区土地改革要点', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19480215.htm' },
          { title: '关于工商业政策', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19480227.htm' },
          { title: '关于民族资产阶级和开明绅士问题', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19480301.htm' },
          { title: '评西北大捷兼论解放军的新式整军运动', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19480307.htm' },
          { title: '关于情况的通报', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19480320.htm' },
          { title: '在晋绥干部会议上的讲话', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19480401.htm' },
          { title: '对晋绥日报编辑人员的谈话', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19480402.htm' },
          { title: '再克洛阳后给洛阳前线指挥部的电报', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19480408.htm' },
          { title: '新解放区农村工作的策略问题', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19480524.htm' },
          { title: '一九四八年的土地改革工作和整党工作', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19480525.htm' },
          { title: '关于辽沈战役的作战方针', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-194809and10.htm' },
          { title: '关于健全党委制', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19480920.htm' },
          { title: '中共中央关于九月会议的通知', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19481001.htm' },
          { title: '关于淮海战役的的作战方针', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19481011.htm' },
          { title: '全世界革命力量团结起来，反对帝国主义的侵略', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-194811.htm' },
          { title: '中国军事形势的重大变化', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19481114.htm' },
          { title: '关于平津战役的作战方针', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19481211.htm' },
          { title: '敦促杜聿明等投降书', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19481217.htm' },
          { title: '将革命进行到底', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19481230.htm' },
          { title: '评战犯求和', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19490104.htm' },
          { title: '中共中央毛泽东主席关于时局的声明', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19490114.htm' },
          { title: '中共发言人评南京行政院的决议', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19490121.htm' },
          { title: '中共发言人关于命令国民党反动政府重新逮捕前日本侵华军总司令冈村宁次和逮捕国民党内战罪犯的谈话', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19490128.htm' },
          { title: '中共发言人关于和平条件必须包括惩办日本战犯和国民党战犯的声明', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19490205.htm' },
          { title: '把军队变为工作队', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19490208a.htm' },
          { title: '四分五裂的反动派为什么还要空喊“全面和平”？', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19490215.htm' },
          { title: '国民党反动派由“呼吁和平”变为呼吁战争', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19490216.htm' },
          { title: '评国民党对战争责任问题的几种答案', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19490218.htm' },
          { title: '在中国共产党第七届中央委员会第二次全体会议上的报告', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19490305.htm' },
          { title: '党委会的工作方法', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19490313.htm' },
          { title: '南京政府向何处去？', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19490404.htm' },
          { title: '向全国进军的命令', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19490421.htm' },
          { title: '中国人民解放军布告', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19490425.htm' },
          { title: '中国人民解放军总部发言人为英国军舰暴行发表的声明', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19490330.htm' },
          { title: '在新政治协商会议筹备会上的讲话', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19490615.htm' },
          { title: '论人民民主专政', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19490630.htm' },
          { title: '丢掉幻想，准备斗争', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19490814.htm' },
          { title: '别了，司徒雷登', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19490818.htm' },
          { title: '友谊还是侵略', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19490830.htm' },
          { title: '为什么要讨论白皮书', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19490828.htm' },
          { title: '唯心历史观的破产', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19490916.htm' },
        ],
      },
    ],
  },
  {
    volume: 'v5',
    range: '1949–1957',
    label: '第五卷',
    theme: '治国理政与社会主义建设的开局',
    intro:
      '这一卷记录的是中国共产党从“打江山”到“治江山”的惊险一跃：胜利之后不是松一口气，而是走进另一种更艰难的战场。新中国在废墟上起步，外有封锁与战争的压迫，内有贪腐、低效与思想混乱的暗流，任何一次失手都可能让新秩序在摇晃中走形。你会看到一个“开国CEO”式的毛泽东：既要在《论十大关系》里做宏观层面的资源调配与结构布局，又要在《关于正确处理人民内部矛盾的问题》中拿出更柔性的冲突管理智慧——既要敢于划线，也要懂得疏导；既要建制度的骨架，也要稳住人心的温度。这一卷读下来，会让你意识到：夺取政权只是开始，治理才是真正漫长的考验。',
    bullets: ['开国治政：从胜利转入治理', '宏观布局：资源配置与结构调度', '内部矛盾：冲突管理与群众工作', '国家建设：制度、作风与路线选择'],
    bookGroups: [
      {
        title: '社会主义革命和社会主义建设时期（一）',
        items: [
          { title: '中国人民站起来了', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19490921.htm' },
          { title: '中国人民大团结万岁', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19490930.htm' },
          { title: '人民英雄们永垂不朽', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19490930b.htm' },
          { title: '永远保持艰苦奋斗的作风', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19491026.htm' },
          { title: '征询对待富农策略问题的意见', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19500312.htm' },
          { title: '为争取国家财政经济状况的基本好转而斗争', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19500606.htm' },
          { title: '不要四面出击', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19500606b.htm' },
          { title: '做一个完全的革命派', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19500623.htm' },
          { title: '你们是全民族的模范人物', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19500925.htm' },
          { title: '给中国人民志愿军的命令', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19501008.htm' },
          { title: '中国人民志愿军要爱护朝鲜的一山一水一草一木', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19510119.htm' },
          { title: '中共中央政治局扩大会议决议要点', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19510218.htm' },
          { title: '镇压反革命必须实行党的群众路线', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19510515.htm' },
          { title: '镇压反革命必须打得稳，打得准，打得狠', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-195012.htm' },
          { title: '应当重视电影《武训传》的讨论', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19510520.htm' },
          { title: '三大运动的伟大胜利', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19511023.htm' },
          { title: '关于“三反”、“五反”的斗争', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-195111.htm' },
          { title: '把农业互助合作当作一件大事去做', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19511215.htm' },
          { title: '元旦祝词', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19520101.htm' },
          { title: '中共中央关于西藏工作方针的指示', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19520406.htm' },
          { title: '工人阶级与资产阶级的矛盾是国内的主要矛盾', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19520606.htm' },
          { title: '团结起来，划清敌我界限', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19520804.htm' },
          { title: '祝贺中国人民志愿军的重大胜利', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19521024.htm' },
          { title: '反对官僚主义、命令主义和违法乱纪', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19530105.htm' },
          { title: '批判大汉族主义', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19530316.htm' },
          { title: '解决“五多”问题', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19530319.htm' },
          { title: '对刘少奇、杨尚昆破坏纪律擅自以中央名义发出文件的批评', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19530519.htm' },
          { title: '批判离开总路线的右倾观点', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19530615.htm' },
          { title: '青年团的工作要照顾青年的特点', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19530630.htm' },
          { title: '关于国家资本主义', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19530709.htm' },
          { title: '党在过渡时期的总路线', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-195308.htm' },
          { title: '反对党内的资产阶级思想', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19530812.htm' },
          { title: '改造资本主义工商业的必经之路', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19530907.htm' },
          { title: '抗美援朝的伟大胜利和今后的任务', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19530912.htm' },
          { title: '批判梁漱溟的反动思想', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19530916.htm' },
          { title: '关于农业互助合作的两次谈话', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19531015.htm' },
          { title: '关于中华人民共和国宪法草案', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19540614.htm' },
          { title: '为建设一个伟大的社会主义国家而奋斗', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19540915.htm' },
          { title: '关于《红楼梦》研究问题的信', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19541016.htm' },
          { title: '原子弹吓不倒中国人民', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19550128.htm' },
          { title: '在中国共产党全国代表会议上的讲话', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-195503.htm' },
          { title: '驳“舆论一律”', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19550524.htm' },
          { title: '《关于胡风反革命集团的材料》的序言和按语', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-195505.htm' },
          { title: '关于农业合作化问题', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19550731.htm' },
          { title: '农业合作化必须依靠党团员和贫农下中农', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19550907.htm' },
          { title: '农业合作化的一场辩论和当前的阶级斗争', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19551011.htm' },
          { title: '《中国农村的社会主义高潮》的序言', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-195509.htm' },
          { title: '《中国农村的社会主义高潮》的按语', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-195509a.htm' },
          { title: '征询对农业十七条的意见', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19551221.htm' },
          { title: '加快手工业的社会主义改造', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19560304.htm' },
          { title: '论十大关系', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19560425.htm' },
          { title: '美帝国主义是纸老虎', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19560714.htm' },
          { title: '增强党的团结，继承党的传统', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19560830.htm' },
          { title: '我们党的—些历史经验', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-195600925.htm' },
          { title: '纪念孙中山先生', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19561112.htm' },
          { title: '在中国共产党第八届中央委员会第二次全体会议上的讲话', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19561115.htm' },
          { title: '在省市自治区党委书记会议上的讲话', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-195701.htm' },
          { title: '关于正确处理人民内部矛盾的问题', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19570227.htm' },
          { title: '在中国共产党全国宣传工作会议上的讲话', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19570312.htm' },
          { title: '坚持艰苦奋斗，密切联系群众', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-195703.htm' },
          { title: '事情正在起变化', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19570515.htm' },
          { title: '中国共产党是全中国人民的领导核心', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19570525.htm' },
          { title: '组织力量反击右派分子的猖狂进攻', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19570608.htm' },
          { title: '文汇报的资产阶级方向应当批判', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19570701.htm' },
          { title: '打退资产阶级右派的进攻', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19570709.htm' },
          { title: '一九五七年夏季的形势', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-195707.htm' },
          { title: '做革命的促进派', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19571009.htm' },
          { title: '坚定地相信群众的大多数', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19571013.htm' },
          { title: '党内团结的辩证方法', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19571118.htm' },
          { title: '一切反动派都是纸老虎', source_url: 'https://www.marxists.org/chinese/maozedong/marxist.org-chinese-mao-19571118a.htm' },
        ],
      },
    ],
  },
];

export function getVolumeGuide(volume: string) {
  return VOLUMES.find((v) => v.volume === volume) ?? null;
}

export function flattenBookGroups(groups: BookGroup[]) {
  const out: BookItem[] = [];
  for (const g of groups) out.push(...g.items);
  return out;
}
