import Link from 'next/link';
import { KnowledgeGraph } from '@/components/KnowledgeGraph';
import { getMaoxuanGraphData } from '@/lib/maoxuan/graph';

export const metadata = {
  title: '知识图谱 | 毛选生存系统',
};

export default function MapPage() {
  const data = getMaoxuanGraphData();

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link href="/" className="text-sm hover:underline" style={{ color: 'var(--wx-ink-soft)' }}>
          ← 返回首页
        </Link>
      </div>

      <header className="mb-8">
        <div className="text-xs mb-2" style={{ color: 'var(--wx-ink-faint)' }}>
          第一卷 · 文章/主题/概念/事件
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold" style={{ color: 'var(--wx-ink)' }}>
          知识图谱
        </h1>
        <p className="mt-2" style={{ color: 'var(--wx-ink-soft)' }}>
          用关系网把章节联起来：从概念与事件回到文章，从文章回到结构化行动。
        </p>
      </header>

      <KnowledgeGraph data={data} />
    </main>
  );
}

