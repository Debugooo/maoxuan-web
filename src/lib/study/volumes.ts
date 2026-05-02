import type { VolumeId } from '@/lib/study/types';

export type BookItem = {
  title: string;
  id?: string;
  source_url: string;
};

export type BookGroup = {
  title: string;
  items: BookItem[];
};

export type VolumeGuide = {
  volume: Extract<VolumeId, 'v1' | 'v2' | 'v3' | 'v4'>;
  range: string;
  label: string;
  theme: string;
  intro: string;
  bullets: string[];
  bookGroups: BookGroup[];
};

export const VOLUMES: VolumeGuide[] = [
  {
    volume: 'v1',
    range: '1925–1937',
    label: '第一卷',
    theme: '中国革命的基本问题与土地革命经验',
    intro:
      '第一卷主要收入第一次国内革命战争和土地革命战争时期的重要著作，围绕中国社会阶级结构、农民运动、革命道路、根据地建设、军事斗争和思想方法展开。它展示了毛泽东对中国革命对象、动力、领导力量和道路选择的早期系统思考。',
    bullets: ['阶级分析与革命对象', '农民运动与群众力量', '农村根据地与武装斗争', '实践论、矛盾论等哲学方法'],
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
    theme: '抗日战争全面展开与统一战线策略（上）',
    intro:
      '第二卷集中呈现抗战全面爆发后，党在战争形势判断、游击战争与持久战战略、统一战线中的独立自主、政治动员与组织建设等方面的系统部署。它把“如何打”“如何团结”“如何建党”三条线压成一条可执行的路线图。',
    bullets: ['抗战形势判断与总方针', '游击战争与持久战战略', '统一战线中的独立自主', '新民主主义政治与社会动员'],
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
    theme: '整风与根据地治理、夺取抗战胜利（下）',
    intro:
      '第三卷聚焦抗战相持阶段与反攻前夕的组织整风、学习方法、经济财政、领导方法与群众动员，并延伸到战后政治格局的总判断。它把“如何学习、如何领导、如何治理根据地、如何准备胜利”连成一个系统。',
    bullets: ['整风：改造学习与反对党八股', '根据地治理：经济财政与政策', '领导方法：组织起来与为人民服务', '战后方针：两个中国之命运与联合政府'],
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
    theme: '解放战争与夺取全国政权的战略与政治',
    intro:
      '第四卷覆盖抗战胜利到新中国成立前夕的全局判断与战争指导：从和平谈判到粉碎内战进攻，从建立巩固根据地到集中优势兵力歼敌，从土地改革到党委工作方法与人民民主专政。它展示了在大规模对抗中如何掌握主动权并完成政权转换。',
    bullets: ['战后方针与和平谈判', '解放战争战略：集中优势兵力与各个歼灭', '土地改革与新解放区治理', '夺取全国政权与建国纲领'],
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
];

export function getVolumeGuide(volume: string) {
  return VOLUMES.find((v) => v.volume === volume) ?? null;
}

export function flattenBookGroups(groups: BookGroup[]) {
  const out: BookItem[] = [];
  for (const g of groups) out.push(...g.items);
  return out;
}

