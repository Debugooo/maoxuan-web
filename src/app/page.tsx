import Link from 'next/link';

export default function Page() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 md:p-12">
        <div className="absolute inset-0 bg-gradient-to-b from-red-50/60 to-transparent dark:from-red-900/10" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-4 py-2 rounded-full text-sm font-medium">
            双核方法论 · 可调用 · 可训练 · 可复盘
          </div>
          <h1 className="mt-6 text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white">
            毛选生存系统
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl">
            把《实践论》《矛盾论》做成你的决策与行动操作系统：读得懂、用得上、能复盘、能迭代。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/library"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2 font-semibold"
            >
              进入阅读库
            </Link>
            <Link
              href="/toolkit"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 font-semibold text-slate-800 dark:text-white"
            >
              打开工具箱
            </Link>
            <Link
              href="/training"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 font-semibold text-slate-800 dark:text-white"
            >
              训练与复盘
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">
          <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">阅读库</div>
          <div className="mt-2 text-xl font-bold text-slate-900 dark:text-white">双入口组织</div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">按卷/按主题浏览，新增章节 Markdown 自动接入。</p>
          <Link href="/library" className="mt-4 inline-block text-sm font-semibold text-red-700 dark:text-red-400 hover:underline">
            去阅读库 →
          </Link>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">
          <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">工具箱</div>
          <div className="mt-2 text-xl font-bold text-slate-900 dark:text-white">情境 → 模型 → 行动</div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">把处境结构化，输出步骤、校验、止损与下一轮最小动作。</p>
          <Link href="/toolkit" className="mt-4 inline-block text-sm font-semibold text-red-700 dark:text-red-400 hover:underline">
            去工具箱 →
          </Link>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">
          <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">训练与复盘</div>
          <div className="mt-2 text-xl font-bold text-slate-900 dark:text-white">写出来才算学会</div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">题库练习 + 复盘模板，本地保存并可导出。</p>
          <Link href="/training" className="mt-4 inline-block text-sm font-semibold text-red-700 dark:text-red-400 hover:underline">
            去训练 →
          </Link>
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">双核推荐</div>
            <div className="mt-1 text-xl font-bold text-slate-900 dark:text-white">先从两论开始</div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/library/shijianlun" className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-semibold">
              《实践论》
            </Link>
            <Link href="/library/maodunlun" className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-semibold">
              《矛盾论》
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
