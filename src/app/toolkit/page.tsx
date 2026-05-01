'use client';

import { useMemo, useState } from 'react';
import { loadFromStorage, saveToStorage } from '@/lib/maoxuan/storage';

type ToolkitModelId = 'shijian.a' | 'shijian.b' | 'maodun.a' | 'maodun.c';

type ToolkitRun = {
  id: string;
  createdAt: number;
  modelId: ToolkitModelId;
  input: {
    situation: string;
    constraints: string;
    successMetric: string;
  };
  output: {
    restatement: string;
    steps: string[];
    validation: string[];
    stopLoss: string[];
    nextSmallAction: string;
  };
};

const STORAGE_KEY = 'maoxuan.toolkit.runs';

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function generateOutput(modelId: ToolkitModelId, situation: string, constraints: string, successMetric: string): ToolkitRun['output'] {
  const base = {
    restatement: `处境重述：${situation.trim() || '（未填写）'}。约束：${constraints.trim() || '（未填写）'}。胜负指标：${successMetric.trim() || '（未填写）'}`,
    steps: [
      '把问题改写成 1 条可检验命题（If-Then）',
      '列出 3 个关键不确定性（缺它就会走偏）',
      '设计 1 个最小试验（对照/时间窗/成本上限）',
      '执行并记录结果与偏差',
      '复盘并进入下一轮最小动作',
    ],
    validation: ['指标口径一致', '时间窗明确', '对照可复现'],
    stopLoss: ['变量太多导致无法归因 → 收敛为 1 个变量', '成本超预算/超时间窗 → 立即停止并复盘', '指标无显著变化 → 重新定位瓶颈'],
    nextSmallAction: '下一轮最小动作：把“关键不确定性 Top 1”做成一个 48 小时内可验证的小试验。',
  };

  if (modelId === 'maodun.a') {
    return {
      restatement: base.restatement,
      steps: [
        '写出本阶段胜负指标（只能 1 条）',
        '列出 3–5 个矛盾对（X vs Y）',
        '用判据选出主要矛盾（必达性/解释力/带动性/可杠杆）',
        '判定主要方面（谁在决定局势面貌）',
        '集中资源打击点并设止损',
      ],
      validation: ['主要方面开始转移', '胜负指标出现结构性改善', '次要矛盾随之缓解'],
      stopLoss: ['投入大但结构不动 → 回到瓶颈定位', '主要矛盾判断反复摇摆 → 先做低成本定位试验'],
      nextSmallAction: '下一轮最小动作：只做一件能改变主要方面的杠杆动作，并用 7 天窗口检验。',
    };
  }

  if (modelId === 'maodun.c') {
    return {
      restatement: base.restatement,
      steps: ['给冲突分级（0/1/2）', '设升级阈值与降级阈值', '0 级补信息、1 级谈交换与规则、2 级设边界/退出', '复盘冲突成本与目标推进'],
      validation: ['冲突成本下降', '规则被遵守', '目标推进更快'],
      stopLoss: ['对方持续破坏规则 → 升级或退出战场', '反复升级 → 重新设阈值与底线'],
      nextSmallAction: '下一轮最小动作：把“阈值”写成可观察行为，并在 1 次对话/会议中验证。',
    };
  }

  return base;
}

export default function ToolkitPage() {
  const stored = useMemo(() => loadFromStorage<ToolkitRun[]>(STORAGE_KEY), []);
  const [runs, setRuns] = useState<ToolkitRun[]>(stored?.data ?? []);

  const [modelId, setModelId] = useState<ToolkitModelId>('shijian.a');
  const [situation, setSituation] = useState('');
  const [constraints, setConstraints] = useState('');
  const [successMetric, setSuccessMetric] = useState('');

  function onSave() {
    const output = generateOutput(modelId, situation, constraints, successMetric);
    const run: ToolkitRun = {
      id: uid(),
      createdAt: Date.now(),
      modelId,
      input: { situation, constraints, successMetric },
      output,
    };

    const next = [run, ...runs].slice(0, 50);
    setRuns(next);
    saveToStorage(STORAGE_KEY, next);
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold" style={{ color: 'var(--wx-ink)' }}>
          生存工具箱
        </h1>
        <p className="mt-2" style={{ color: 'var(--wx-ink-soft)' }}>
          输入处境，按模型输出行动步骤、校验与止损，并支持本地保存。
        </p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
        <div className="rounded-2xl p-6 wx-surface">
          <label className="text-sm font-semibold" style={{ color: 'var(--wx-ink-soft)' }}>
            选择模型
          </label>
          <select
            className="mt-2 w-full rounded-xl px-3 py-2"
            value={modelId}
            onChange={(e) => setModelId(e.target.value as ToolkitModelId)}
            style={{
              border: '1px solid var(--wx-panel-border)',
              background: 'var(--wx-panel-bg)',
              color: 'var(--wx-ink)',
            }}
          >
            <option value="shijian.a">《实践论》模型A：调查研究四步法</option>
            <option value="shijian.b">《实践论》模型B：小步试验算法</option>
            <option value="maodun.a">《矛盾论》模型A：主要矛盾判定算法</option>
            <option value="maodun.c">《矛盾论》模型C：冲突分级处置</option>
          </select>

          <div className="mt-5 space-y-4">
            <div>
              <label className="text-sm font-semibold" style={{ color: 'var(--wx-ink-soft)' }}>
                你的处境（尽量具体）
              </label>
              <textarea
                className="mt-2 w-full min-h-28 rounded-xl px-3 py-2"
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                style={{
                  border: '1px solid var(--wx-panel-border)',
                  background: 'var(--wx-panel-bg)',
                  color: 'var(--wx-ink)',
                }}
              />
            </div>
            <div>
              <label className="text-sm font-semibold" style={{ color: 'var(--wx-ink-soft)' }}>
                约束（时间/资源/风险）
              </label>
              <input
                className="mt-2 w-full rounded-xl px-3 py-2"
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                style={{
                  border: '1px solid var(--wx-panel-border)',
                  background: 'var(--wx-panel-bg)',
                  color: 'var(--wx-ink)',
                }}
              />
            </div>
            <div>
              <label className="text-sm font-semibold" style={{ color: 'var(--wx-ink-soft)' }}>
                胜负指标（1 条）
              </label>
              <input
                className="mt-2 w-full rounded-xl px-3 py-2"
                value={successMetric}
                onChange={(e) => setSuccessMetric(e.target.value)}
                style={{
                  border: '1px solid var(--wx-panel-border)',
                  background: 'var(--wx-panel-bg)',
                  color: 'var(--wx-ink)',
                }}
              />
            </div>
          </div>

          <button
            className="mt-6 inline-flex items-center justify-center rounded-xl px-4 py-2 font-semibold"
            onClick={onSave}
            style={{ background: 'var(--wx-brand)', color: 'var(--wx-panel-bg)' }}
          >
            生成并保存
          </button>
        </div>

        <div className="rounded-2xl p-6 wx-surface">
          <h2 className="text-lg font-bold" style={{ color: 'var(--wx-ink)' }}>
            最近记录
          </h2>
          <div className="mt-4 space-y-3 max-h-[560px] overflow-auto pr-1">
            {runs.length === 0 ? (
              <div className="text-sm" style={{ color: 'var(--wx-ink-soft)' }}>
                暂无记录
              </div>
            ) : null}
            {runs.map((r) => (
              <div key={r.id} className="rounded-xl p-4" style={{ border: '1px solid var(--wx-panel-border)', background: 'rgba(201, 100, 66, 0.03)' }}>
                <div className="text-xs" style={{ color: 'var(--wx-ink-faint)' }}>
                  {new Date(r.createdAt).toLocaleString('zh-CN')} · {r.modelId}
                </div>
                <div className="mt-2 text-sm whitespace-pre-wrap" style={{ color: 'var(--wx-ink)' }}>
                  {r.output.restatement}
                </div>
                <div className="mt-3 text-xs" style={{ color: 'var(--wx-ink-soft)' }}>
                  下一步：{r.output.nextSmallAction}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
