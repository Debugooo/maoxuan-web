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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {VOLUMES.map((v) => (
          <div
            key={v.volume}
            className="rounded-2xl p-5"
            style={{ border: '1px solid var(--wx-panel-border)', background: 'rgba(255,255,255,0.02)' }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-xs" style={{ color: 'var(--wx-ink-faint)' }}>
                  {v.range}
                </div>
                <div className="mt-1 text-2xl font-serif font-bold" style={{ color: 'var(--wx-ink)' }}>
                  {v.label}
                </div>
              </div>
              <div className="shrink-0">
                <span
                  className="text-xs px-3 py-2 rounded-xl inline-block"
                  style={{
                    color: 'var(--wx-ink)',
                    border: '1px solid var(--wx-panel-border)',
                    background: 'rgba(201, 100, 66, 0.06)',
                    maxWidth: 260,
                  }}
                >
                  {v.theme}
                </span>
              </div>
            </div>

            <div className="mt-4" style={{ borderTop: '1px solid var(--wx-panel-border)' }} />

            <p className="mt-4 text-sm leading-7" style={{ color: 'var(--wx-ink)' }}>
              {v.intro}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {v.bullets.map((b) => (
                <span
                  key={b}
                  className="text-xs px-3 py-2 rounded-xl"
                  style={{ border: '1px solid var(--wx-panel-border)', color: 'var(--wx-ink-soft)', background: 'rgba(255,255,255,0.02)' }}
                >
                  {b}
                </span>
              ))}
            </div>

            <div className="mt-4">
              <Link href={`/study/volume/${v.volume}`} className="text-sm hover:underline" style={{ color: 'var(--wx-brand)' }}>
                查看目录 →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
