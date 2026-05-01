import Link from 'next/link';

export default function Page() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <section className="relative overflow-hidden rounded-3xl p-8 md:p-12 wx-surface">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(201, 100, 66, 0.10), transparent)' }} />
        <div className="relative">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
            style={{ background: 'rgba(201, 100, 66, 0.10)', color: 'var(--wx-brand)' }}
          >
            双核方法论 · 可调用 · 可训练 · 可复盘
          </div>
          <h1 className="mt-6 text-4xl md:text-5xl font-serif font-bold" style={{ color: 'var(--wx-ink)' }}>
            毛选生存系统
          </h1>
          <p className="mt-4 text-lg max-w-2xl" style={{ color: 'var(--wx-ink-soft)' }}>
            把《实践论》《矛盾论》做成你的决策与行动操作系统：读得懂、用得上、能复盘、能迭代。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/library"
              className="inline-flex items-center justify-center rounded-xl px-4 py-2 font-semibold"
              style={{ background: 'var(--wx-brand)', color: 'var(--wx-panel-bg)' }}
            >
              进入阅读库
            </Link>
            <Link
              href="/toolkit"
              className="inline-flex items-center justify-center rounded-xl px-4 py-2 font-semibold"
              style={{ border: '1px solid var(--wx-panel-border)', color: 'var(--wx-ink)' }}
            >
              打开工具箱
            </Link>
            <Link
              href="/training"
              className="inline-flex items-center justify-center rounded-xl px-4 py-2 font-semibold"
              style={{ border: '1px solid var(--wx-panel-border)', color: 'var(--wx-ink)' }}
            >
              训练与复盘
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl p-6 wx-surface">
          <div className="text-sm font-semibold" style={{ color: 'var(--wx-ink-faint)' }}>
            阅读库
          </div>
          <div className="mt-2 text-xl font-bold" style={{ color: 'var(--wx-ink)' }}>
            三入口组织
          </div>
          <p className="mt-2 text-sm" style={{ color: 'var(--wx-ink-soft)' }}>
            按核心等级/按卷/按主题浏览，新增章节 Markdown 自动接入。
          </p>
          <Link href="/library" className="mt-4 inline-block text-sm font-semibold hover:underline" style={{ color: 'var(--wx-brand)' }}>
            去阅读库 →
          </Link>
        </div>
        <div className="rounded-2xl p-6 wx-surface">
          <div className="text-sm font-semibold" style={{ color: 'var(--wx-ink-faint)' }}>
            工具箱
          </div>
          <div className="mt-2 text-xl font-bold" style={{ color: 'var(--wx-ink)' }}>
            情境 → 模型 → 行动
          </div>
          <p className="mt-2 text-sm" style={{ color: 'var(--wx-ink-soft)' }}>
            把处境结构化，输出步骤、校验、止损与下一轮最小动作。
          </p>
          <Link href="/toolkit" className="mt-4 inline-block text-sm font-semibold hover:underline" style={{ color: 'var(--wx-brand)' }}>
            去工具箱 →
          </Link>
        </div>
        <div className="rounded-2xl p-6 wx-surface">
          <div className="text-sm font-semibold" style={{ color: 'var(--wx-ink-faint)' }}>
            训练与复盘
          </div>
          <div className="mt-2 text-xl font-bold" style={{ color: 'var(--wx-ink)' }}>
            写出来才算学会
          </div>
          <p className="mt-2 text-sm" style={{ color: 'var(--wx-ink-soft)' }}>
            题库练习 + 复盘模板，本地保存并可导出。
          </p>
          <Link href="/training" className="mt-4 inline-block text-sm font-semibold hover:underline" style={{ color: 'var(--wx-brand)' }}>
            去训练 →
          </Link>
        </div>
      </section>

      <section className="mt-10 rounded-2xl p-6 wx-surface">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-sm font-semibold" style={{ color: 'var(--wx-ink-faint)' }}>
              双核推荐
            </div>
            <div className="mt-1 text-xl font-bold" style={{ color: 'var(--wx-ink)' }}>
              先从两论开始
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/library/shijianlun"
              className="px-4 py-2 rounded-xl font-semibold"
              style={{ border: '1px solid var(--wx-panel-border)', color: 'var(--wx-ink)' }}
            >
              《实践论》
            </Link>
            <Link
              href="/library/maodunlun"
              className="px-4 py-2 rounded-xl font-semibold"
              style={{ border: '1px solid var(--wx-panel-border)', color: 'var(--wx-ink)' }}
            >
              《矛盾论》
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
