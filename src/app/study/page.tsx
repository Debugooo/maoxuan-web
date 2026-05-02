import Link from 'next/link';
import { getStudyIndex } from '@/lib/study/index';
import { VOLUMES } from '@/lib/study/volumes';

export const metadata = { title: '研读系统 | 毛选生存系统' };

export default function StudyPage() {
  const index = getStudyIndex();
  const order = index.learningOrder;
  const byId = new Map<string, (typeof index.volumes)['v1']['items'][number]>();
  Object.values(index.volumes).forEach((v) => v.items.forEach((it) => byId.set(it.id, it)));
  const all: (typeof index.volumes)['v1']['items'][number][] = [];
  byId.forEach((it) => all.push(it));
  all.sort((a, b) => a.id.localeCompare(b.id));

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <header className="mb-8">
        <div className="text-xs mb-2" style={{ color: 'var(--wx-ink-faint)' }}>
          原文 · 重点句 · 旁批 · 互文 · 学习顺序
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold" style={{ color: 'var(--wx-ink)' }}>
          研读系统（COS）
        </h1>
        <p className="mt-2" style={{ color: 'var(--wx-ink-soft)' }}>
          按学习顺序逐篇推进：先建认知地图，再做逐段精读与当代映射。
        </p>
      </header>

      <section className="wx-surface rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold" style={{ color: 'var(--wx-ink)' }}>
          毛选四卷导读
        </h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {VOLUMES.map((v) => (
            <div key={v.volume} className="rounded-2xl p-5" style={{ border: '1px solid var(--wx-panel-border)' }}>
              <div className="text-xs" style={{ color: 'var(--wx-ink-faint)' }}>
                {v.range}
              </div>
              <div className="mt-1 text-lg font-bold" style={{ color: 'var(--wx-ink)' }}>
                {v.label}
              </div>
              <div className="mt-1 text-sm" style={{ color: 'var(--wx-ink-soft)' }}>
                {v.theme}
              </div>
              <p className="mt-3 text-sm" style={{ color: 'var(--wx-ink)' }}>
                {v.intro}
              </p>
              <ul className="mt-3 space-y-1 text-sm" style={{ color: 'var(--wx-ink-soft)' }}>
                {v.bullets.map((b) => (
                  <li key={b}>◆{b}</li>
                ))}
              </ul>
              <div className="mt-4">
                <Link href={`/study/volume/${v.volume}`} className="text-sm hover:underline" style={{ color: 'var(--wx-brand)' }}>
                  查看目录 →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="wx-surface rounded-2xl p-6">
        <h2 className="text-lg font-bold" style={{ color: 'var(--wx-ink)' }}>
          学习顺序
        </h2>
        {order.length ? (
          <ul className="mt-4 space-y-2">
            {order.map((id) => {
              const it = byId.get(id);
              if (!it) return null;
              return (
                <li key={id}>
                  <Link href={`/study/${id}`} className="hover:underline" style={{ color: 'var(--wx-ink)' }}>
                    {it.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="mt-3 text-sm" style={{ color: 'var(--wx-ink-soft)' }}>
            学习顺序尚未初始化（先导入索引与首篇种子后会出现在这里）。
          </div>
        )}
      </section>

      <section className="wx-surface rounded-2xl p-6 mt-6">
        <h2 className="text-lg font-bold" style={{ color: 'var(--wx-ink)' }}>
          已收录
        </h2>
        <div className="mt-2 text-sm" style={{ color: 'var(--wx-ink-soft)' }}>
          这里展示当前已生成并可阅读的篇目；学习顺序仍以“学习顺序”区为准。
        </div>
        {all.length ? (
          <ul className="mt-4 space-y-2">
            {all.map((it) => (
              <li key={it.id}>
                <Link href={`/study/${it.id}`} className="hover:underline" style={{ color: 'var(--wx-ink)' }}>
                  {it.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-3 text-sm" style={{ color: 'var(--wx-ink-soft)' }}>
            暂无已收录篇目。
          </div>
        )}
      </section>
    </main>
  );
}
