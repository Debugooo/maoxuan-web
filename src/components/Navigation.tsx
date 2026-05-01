'use client';

import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🧭</span>
            <span className="font-serif text-lg font-bold text-slate-800 dark:text-white">
              毛选生存系统
            </span>
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/library" className="text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors">
              阅读库
            </Link>
            <Link href="/toolkit" className="text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors">
              工具箱
            </Link>
            <Link href="/training" className="text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors">
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
    <footer className="bg-slate-100 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            毛选生存系统 · 双核入口（《实践论》/《矛盾论》）
          </p>
          <p className="text-slate-500 dark:text-slate-500 text-xs mt-2">
            用结构化模型把阅读转化为行动与复盘
          </p>
        </div>
      </div>
    </footer>
  );
}
