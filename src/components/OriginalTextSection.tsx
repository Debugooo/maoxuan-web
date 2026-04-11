'use client';

import { useState } from 'react';
import { originalTextSections } from '@/data/content';

const dimensionIcons = {
  work: { icon: '💼', label: '工作启发' },
  study: { icon: '📚', label: '学习启发' },
  family: { icon: '🏠', label: '家庭启发' },
  education: { icon: '🎓', label: '教育启发' },
};

export function OriginalTextSection() {
  const [expandedId, setExpandedId] = useState<number | null>(1);
  const [activeDimension, setActiveDimension] = useState<'work' | 'study' | 'family' | 'education'>('work');

  return (
    <section id="original-text" className="py-12">
      <h2 className="text-2xl font-serif font-bold text-slate-800 dark:text-white mb-8 flex items-center gap-3">
        <span className="text-3xl">📜</span>
        原文精读
      </h2>
      
      {/* 分段导航 */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex gap-2 pb-2">
          {originalTextSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setExpandedId(section.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                expandedId === section.id
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {section.id}. {section.title.slice(0, 8)}...
            </button>
          ))}
        </div>
      </div>

      {/* 原文内容 */}
      {originalTextSections.map((section) => (
        <div
          key={section.id}
          className={`transition-all duration-500 ${
            expandedId === section.id ? 'block' : 'hidden'
          }`}
        >
          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl p-6 mb-6 border border-red-100 dark:border-red-900/30">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                第{section.id}段
              </span>
              <h3 className="text-lg font-serif font-bold text-slate-800 dark:text-white">
                {section.title}
              </h3>
            </div>
            <div className="prose-original">
              {section.content.split('\n\n').map((para, idx) => (
                <p key={idx} className="text-slate-700 dark:text-slate-200 leading-loose mb-4">
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* 现实启发 */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
            {/* 维度切换 */}
            <div className="flex border-b border-slate-200 dark:border-slate-700">
              {(Object.keys(dimensionIcons) as Array<'work' | 'study' | 'family' | 'education'>).map((dim) => (
                <button
                  key={dim}
                  onClick={() => setActiveDimension(dim)}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    activeDimension === dim
                      ? 'bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 border-b-2 border-red-600 dark:border-red-400 -mb-px'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  <span>{dimensionIcons[dim].icon}</span>
                  <span className="hidden sm:inline">{dimensionIcons[dim].label}</span>
                </button>
              ))}
            </div>

            {/* 启发内容 */}
            <div className="p-6">
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{dimensionIcons[activeDimension].icon}</span>
                  <div>
                    <h4 className="font-medium text-slate-800 dark:text-white mb-2">
                      {dimensionIcons[activeDimension].label}
                    </h4>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {section.enlightenment[activeDimension]}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
