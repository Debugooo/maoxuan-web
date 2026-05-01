'use client';

import { useMemo, useState } from 'react';
import { trainingQuestions } from '@/data/questions';
import { loadFromStorage, saveToStorage } from '@/lib/maoxuan/storage';

type Answer = {
  questionId: string;
  updatedAt: number;
  text: string;
};

type Review = {
  id: string;
  updatedAt: number;
  template: 'shijian' | 'maodun';
  fields: Record<string, string>;
};

const ANSWERS_KEY = 'maoxuan.training.answers';
const REVIEWS_KEY = 'maoxuan.reviews';

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function download(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function TrainingPage() {
  const storedAnswers = useMemo(() => loadFromStorage<Answer[]>(ANSWERS_KEY), []);
  const storedReviews = useMemo(() => loadFromStorage<Review[]>(REVIEWS_KEY), []);

  const [answers, setAnswers] = useState<Answer[]>(storedAnswers?.data ?? []);
  const [reviews, setReviews] = useState<Review[]>(storedReviews?.data ?? []);

  const [activeQuestionId, setActiveQuestionId] = useState(trainingQuestions[0]?.id ?? '');
  const [tab, setTab] = useState<'questions' | 'reviews'>('questions');

  const activeAnswer = answers.find((a) => a.questionId === activeQuestionId)?.text ?? '';

  function setAnswer(text: string) {
    const next: Answer[] = [
      { questionId: activeQuestionId, updatedAt: Date.now(), text },
      ...answers.filter((a) => a.questionId !== activeQuestionId),
    ];
    setAnswers(next);
    saveToStorage(ANSWERS_KEY, next);
  }

  function createReview(template: Review['template']) {
    const review: Review = { id: uid(), updatedAt: Date.now(), template, fields: {} };
    const next = [review, ...reviews].slice(0, 50);
    setReviews(next);
    saveToStorage(REVIEWS_KEY, next);
  }

  function updateReview(id: string, key: string, value: string) {
    const next = reviews.map((r) => (r.id === id ? { ...r, updatedAt: Date.now(), fields: { ...r.fields, [key]: value } } : r));
    setReviews(next);
    saveToStorage(REVIEWS_KEY, next);
  }

  function exportReview(r: Review) {
    const title = r.template === 'shijian' ? '实践论复盘' : '矛盾论复盘';
    const lines = [`# ${title}`, '', `更新时间：${new Date(r.updatedAt).toLocaleString('zh-CN')}`, ''];
    for (const [k, v] of Object.entries(r.fields)) {
      lines.push(`## ${k}`, '', v || '（未填写）', '');
    }
    download(`${title}-${r.id}.md`, lines.join('\n'));
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold" style={{ color: 'var(--wx-ink)' }}>
          训练与复盘
        </h1>
        <p className="mt-2" style={{ color: 'var(--wx-ink-soft)' }}>
          题库练习 + 复盘模板填写，本地自动保存并支持导出。
        </p>
      </header>

      <div className="flex gap-2 mb-6">
        <button
          className="px-4 py-2 rounded-xl border"
          onClick={() => setTab('questions')}
          style={
            tab === 'questions'
              ? { background: 'var(--wx-brand)', color: 'var(--wx-panel-bg)', borderColor: 'var(--wx-brand)' }
              : { background: 'var(--wx-panel-bg)', color: 'var(--wx-ink)', borderColor: 'var(--wx-panel-border)' }
          }
        >
          题库
        </button>
        <button
          className="px-4 py-2 rounded-xl border"
          onClick={() => setTab('reviews')}
          style={
            tab === 'reviews'
              ? { background: 'var(--wx-brand)', color: 'var(--wx-panel-bg)', borderColor: 'var(--wx-brand)' }
              : { background: 'var(--wx-panel-bg)', color: 'var(--wx-ink)', borderColor: 'var(--wx-panel-border)' }
          }
        >
          复盘
        </button>
      </div>

      {tab === 'questions' ? (
        <section className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
          <div className="rounded-2xl p-4 wx-surface">
            <div className="text-sm font-semibold mb-3" style={{ color: 'var(--wx-ink)' }}>
              题目
            </div>
            <div className="space-y-2">
              {trainingQuestions.map((q) => (
                <button
                  key={q.id}
                  onClick={() => setActiveQuestionId(q.id)}
                  className="w-full text-left rounded-xl p-3 border"
                  style={
                    activeQuestionId === q.id
                      ? { borderColor: 'var(--wx-brand)', background: 'rgba(201, 100, 66, 0.06)' }
                      : { borderColor: 'var(--wx-panel-border)', background: 'transparent' }
                  }
                >
                  <div className="text-sm font-semibold" style={{ color: 'var(--wx-ink)' }}>
                    {q.title}
                  </div>
                  <div className="text-xs mt-1" style={{ color: 'var(--wx-ink-faint)' }}>
                    {q.tags.join(' / ')}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-6 wx-surface">
            {(() => {
              const q = trainingQuestions.find((x) => x.id === activeQuestionId);
              if (!q) return null;
              return (
                <>
                  <div className="text-sm" style={{ color: 'var(--wx-ink-faint)' }}>
                    {q.chapterSlug}
                  </div>
                  <h2 className="text-xl font-bold mt-2" style={{ color: 'var(--wx-ink)' }}>
                    {q.title}
                  </h2>
                  <p className="mt-3 whitespace-pre-wrap" style={{ color: 'var(--wx-ink-soft)' }}>
                    {q.prompt}
                  </p>

                  <div className="mt-6">
                    <label className="text-sm font-semibold" style={{ color: 'var(--wx-ink-soft)' }}>
                      你的答案（自动保存）
                    </label>
                    <textarea
                      className="mt-2 w-full min-h-56 rounded-xl px-3 py-2"
                      value={activeAnswer}
                      onChange={(e) => setAnswer(e.target.value)}
                      style={{
                        border: '1px solid var(--wx-panel-border)',
                        background: 'var(--wx-panel-bg)',
                        color: 'var(--wx-ink)',
                      }}
                    />
                  </div>
                </>
              );
            })()}
          </div>
        </section>
      ) : (
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
          <div className="rounded-2xl p-6 wx-surface">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold" style={{ color: 'var(--wx-ink)' }}>
                复盘模板
              </h2>
              <div className="flex gap-2">
                <button
                  className="px-3 py-2 rounded-xl"
                  onClick={() => createReview('shijian')}
                  style={{ background: 'var(--wx-brand)', color: 'var(--wx-panel-bg)' }}
                >
                  新建实践论复盘
                </button>
                <button
                  className="px-3 py-2 rounded-xl border"
                  onClick={() => createReview('maodun')}
                  style={{ borderColor: 'var(--wx-panel-border)', color: 'var(--wx-ink)' }}
                >
                  新建矛盾论复盘
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="rounded-2xl p-4" style={{ border: '1px solid var(--wx-panel-border)', background: 'rgba(201, 100, 66, 0.03)' }}>
                  <div className="text-xs" style={{ color: 'var(--wx-ink-faint)' }}>
                    {r.template === 'shijian' ? '实践论复盘' : '矛盾论复盘'} · {new Date(r.updatedAt).toLocaleString('zh-CN')}
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-3">
                    {(r.template === 'shijian'
                      ? ['目标与胜负指标', '事实与证据', '假设与推理链', '行动试验设计', '结果与偏差', '下一轮最小动作']
                      : ['主要矛盾与次要矛盾', '主要方面与次要方面', '集中力量打击点', '阶段判断与节奏', '结果与结构变化', '下一轮策略修正']
                    ).map((k) => (
                      <div key={k}>
                        <div className="text-sm font-semibold" style={{ color: 'var(--wx-ink-soft)' }}>
                          {k}
                        </div>
                        <textarea
                          className="mt-2 w-full min-h-20 rounded-xl px-3 py-2"
                          value={r.fields[k] ?? ''}
                          onChange={(e) => updateReview(r.id, k, e.target.value)}
                          style={{
                            border: '1px solid var(--wx-panel-border)',
                            background: 'var(--wx-panel-bg)',
                            color: 'var(--wx-ink)',
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    className="mt-4 px-3 py-2 rounded-xl border"
                    onClick={() => exportReview(r)}
                    style={{ borderColor: 'var(--wx-panel-border)', color: 'var(--wx-ink)' }}
                  >
                    导出 Markdown
                  </button>
                </div>
              ))}
              {reviews.length === 0 ? (
                <div className="text-sm" style={{ color: 'var(--wx-ink-soft)' }}>
                  尚无复盘记录
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl p-6 wx-surface">
            <h2 className="text-lg font-bold" style={{ color: 'var(--wx-ink)' }}>
              提示
            </h2>
            <ul className="mt-3 text-sm space-y-2" style={{ color: 'var(--wx-ink-soft)' }}>
              <li>复盘默认本地保存，不需要登录。</li>
              <li>建议每次只抓一个“下一轮最小动作”，减少自嗨式复盘。</li>
              <li>导出 Markdown 后可放回仓库或个人笔记系统。</li>
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}
