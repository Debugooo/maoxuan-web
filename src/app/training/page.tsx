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
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white">训练与复盘</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">题库练习 + 复盘模板填写，本地自动保存并支持导出。</p>
      </header>

      <div className="flex gap-2 mb-6">
        <button
          className={`px-4 py-2 rounded-xl border ${tab === 'questions' ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'}`}
          onClick={() => setTab('questions')}
        >
          题库
        </button>
        <button
          className={`px-4 py-2 rounded-xl border ${tab === 'reviews' ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'}`}
          onClick={() => setTab('reviews')}
        >
          复盘
        </button>
      </div>

      {tab === 'questions' ? (
        <section className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
            <div className="text-sm font-semibold text-slate-900 dark:text-white mb-3">题目</div>
            <div className="space-y-2">
              {trainingQuestions.map((q) => (
                <button
                  key={q.id}
                  onClick={() => setActiveQuestionId(q.id)}
                  className={`w-full text-left rounded-xl p-3 border ${activeQuestionId === q.id ? 'border-slate-900 dark:border-white' : 'border-slate-200 dark:border-slate-700'}`}
                >
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">{q.title}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{q.tags.join(' / ')}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
            {(() => {
              const q = trainingQuestions.find((x) => x.id === activeQuestionId);
              if (!q) return null;
              return (
                <>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{q.chapterSlug}</div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-2">{q.title}</h2>
                  <p className="mt-3 text-slate-700 dark:text-slate-200 whitespace-pre-wrap">{q.prompt}</p>

                  <div className="mt-6">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">你的答案（自动保存）</label>
                    <textarea
                      className="mt-2 w-full min-h-56 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
                      value={activeAnswer}
                      onChange={(e) => setAnswer(e.target.value)}
                    />
                  </div>
                </>
              );
            })()}
          </div>
        </section>
      ) : (
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">复盘模板</h2>
              <div className="flex gap-2">
                <button className="px-3 py-2 rounded-xl bg-slate-900 text-white" onClick={() => createReview('shijian')}>
                  新建实践论复盘
                </button>
                <button className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700" onClick={() => createReview('maodun')}>
                  新建矛盾论复盘
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {r.template === 'shijian' ? '实践论复盘' : '矛盾论复盘'} · {new Date(r.updatedAt).toLocaleString('zh-CN')}
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-3">
                    {(r.template === 'shijian'
                      ? ['目标与胜负指标', '事实与证据', '假设与推理链', '行动试验设计', '结果与偏差', '下一轮最小动作']
                      : ['主要矛盾与次要矛盾', '主要方面与次要方面', '集中力量打击点', '阶段判断与节奏', '结果与结构变化', '下一轮策略修正']
                    ).map((k) => (
                      <div key={k}>
                        <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">{k}</div>
                        <textarea
                          className="mt-2 w-full min-h-20 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
                          value={r.fields[k] ?? ''}
                          onChange={(e) => updateReview(r.id, k, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                  <button className="mt-4 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700" onClick={() => exportReview(r)}>
                    导出 Markdown
                  </button>
                </div>
              ))}
              {reviews.length === 0 ? <div className="text-sm text-slate-600 dark:text-slate-300">尚无复盘记录</div> : null}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">提示</h2>
            <ul className="mt-3 text-sm text-slate-700 dark:text-slate-200 space-y-2">
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

