'use client';

import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-40 backdrop-blur-md" style={{ background: 'rgba(250, 249, 246, 0.85)', borderBottom: '1px solid var(--wx-panel-border)' }}>
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🧭</span>
            <span className="font-serif text-lg font-bold" style={{ color: 'var(--wx-ink)' }}>
              毛选生存系统
            </span>
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/library" className="transition-colors" style={{ color: 'var(--wx-ink-soft)' }}>
              阅读库
            </Link>
            <Link href="/map" className="transition-colors" style={{ color: 'var(--wx-ink-soft)' }}>
              知识图谱
            </Link>
            <Link href="/toolkit" className="transition-colors" style={{ color: 'var(--wx-ink-soft)' }}>
              工具箱
            </Link>
            <Link href="/training" className="transition-colors" style={{ color: 'var(--wx-ink-soft)' }}>
              训练与复盘
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="mt-16" style={{ background: 'rgba(250, 249, 246, 0.8)', borderTop: '1px solid var(--wx-panel-border)' }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-sm" style={{ color: 'var(--wx-ink-soft)' }}>
            毛选生存系统 · 双核入口（《实践论》/《矛盾论》）
          </p>
          <p className="text-xs mt-2" style={{ color: 'var(--wx-ink-faint)' }}>
            用结构化模型把阅读转化为行动与复盘
          </p>
        </div>
      </div>
    </footer>
  );
}
