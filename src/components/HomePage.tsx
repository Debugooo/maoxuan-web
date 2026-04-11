'use client';

import { courseInfo, teachingObjectives, keyPoints, historicalBackground } from '@/data/content';

export function HomePage() {
  return (
    <>
      {/* 英雄区域 */}
      <section className="relative py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-red-50/50 to-transparent dark:from-red-900/10 -z-10" />
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span>Day {courseInfo.day}</span>
            <span className="text-red-400">·</span>
            <span>1937</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-4">
            《{courseInfo.title}》
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-2">
            {courseInfo.subtitle}
          </p>
          <div className="flex items-center justify-center gap-4 text-slate-500 dark:text-slate-400 text-sm mt-4">
            <span className="flex items-center gap-1">
              <span>✍️</span> {courseInfo.author}
            </span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className="flex items-center gap-1">
              <span>📅</span> {courseInfo.date}
            </span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className="flex items-center gap-1">
              <span>⏱️</span> {courseInfo.duration}
            </span>
          </div>
        </div>
      </section>

      {/* 课程信息卡片 */}
      <section id="course-info" className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 教学目标 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🎯</span> 教学目标
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">知识目标</h4>
                  <ul className="space-y-1">
                    {teachingObjectives.knowledge.map((item, idx) => (
                      <li key={idx} className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">能力目标</h4>
                  <ul className="space-y-1">
                    {teachingObjectives.ability.map((item, idx) => (
                      <li key={idx} className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-2">素养目标</h4>
                  <ul className="space-y-1">
                    {teachingObjectives.quality.map((item, idx) => (
                      <li key={idx} className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2">
                        <span className="text-purple-500 mt-0.5">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* 重点难点 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">⭐</span> 重点与难点
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">重点</h4>
                  <ul className="space-y-2">
                    {keyPoints.focus.map((item, idx) => (
                      <li key={idx} className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2">
                        <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                  <h4 className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-2">难点</h4>
                  <ul className="space-y-2">
                    {keyPoints.difficult.map((item, idx) => (
                      <li key={idx} className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2">
                        <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* 历史背景 */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="text-2xl">📜</span> 历史背景
              </h3>
              
              <div className="space-y-4 text-sm">
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-slate-300 text-xs mb-1">写作时间</p>
                  <p className="text-white">{historicalBackground.time}</p>
                </div>
                
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-slate-300 text-xs mb-1">写作地点</p>
                  <p className="text-white">{historicalBackground.location}</p>
                </div>
                
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-slate-300 text-xs mb-1">历史意义</p>
                  <p className="text-white text-xs leading-relaxed">{historicalBackground.significance}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-xs text-slate-400 mb-2">针对两种错误倾向：</p>
                <div className="space-y-2">
                  {historicalBackground.purpose.errors.map((error, idx) => (
                    <div key={idx} className="bg-red-900/30 rounded-lg p-2">
                      <p className="text-red-400 font-medium text-xs">{error.name}</p>
                      <p className="text-slate-300 text-xs">{error.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
