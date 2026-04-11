'use client';

import Link from 'next/link';
import { courseInfo } from '@/data/content';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">📖</span>
            <span className="font-serif text-lg font-bold text-slate-800 dark:text-white">
              毛选精读
            </span>
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/#course-info" className="text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors">
              课程信息
            </Link>
            <Link href="/#original-text" className="text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors">
              原文精读
            </Link>
            <Link href="/#questions" className="text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors">
              思考题
            </Link>
            <Link href="/#quotes" className="text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors">
              金句卡片
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            毛选精读 Day {courseInfo.day} · 《{courseInfo.title}》
          </p>
          <p className="text-slate-500 dark:text-slate-500 text-xs mt-2">
            学习毛泽东思想，指导实践工作
          </p>
        </div>
      </div>
    </footer>
  );
}
