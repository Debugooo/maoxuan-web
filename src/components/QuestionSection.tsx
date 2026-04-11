'use client';

import { useState } from 'react';
import { questions } from '@/data/content';

export function QuestionSection() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <section id="questions" className="py-12">
      <h2 className="text-2xl font-serif font-bold text-slate-800 dark:text-white mb-8 flex items-center gap-3">
        <span className="text-3xl">💭</span>
        思考题与参考答案
      </h2>
      <div className="space-y-4">
        {questions.map((q) => (
          <div
            key={q.id}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-lg"
          >
            <button
              onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  q.type === '基础题'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                    : 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
                }`}>
                  {q.type}
                </span>
                <div>
                  <h3 className="font-medium text-slate-800 dark:text-white">
                    {q.id}. {q.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {q.question}
                  </p>
                </div>
              </div>
              <svg
                className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                  expandedId === q.id ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div
              className={`overflow-hidden transition-all duration-300 ${
                expandedId === q.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-6 pb-4 border-t border-slate-100 dark:border-slate-700 pt-4">
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2 flex items-center gap-2">
                    <span>📝</span> 参考答案
                  </h4>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {q.answer.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-2">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
