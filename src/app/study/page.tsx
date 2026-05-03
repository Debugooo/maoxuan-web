import Link from 'next/link';
import { VOLUMES } from '@/lib/study/volumes';

export const metadata = { title: '毛选研读 | 毛选生存系统' };

export default function StudyPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <header className="mb-8">
        <div className="text-xs mb-2" style={{ color: 'var(--wx-ink-faint)' }}>
          原文 · 重点句 · 旁批 · 互文 · 学习顺序
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold" style={{ color: 'var(--wx-ink)' }}>
          毛选研读
        </h1>
        <p className="mt-2" style={{ color: 'var(--wx-ink-soft)' }}>
          用五卷把“局势、路线、组织、方法、治理”串成一条线：先读懂每卷的主问题与关键方法，再逐篇推进，把历史经验转成今天能用的判断与行动。
        </p>
      </header>

      <section className="wx-surface rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold" style={{ color: 'var(--wx-ink)' }}>
          毛选五卷导读
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
    </main>
  );
}
