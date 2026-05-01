'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { forceCenter, forceCollide, forceLink, forceManyBody, forceRadial, forceSimulation, forceX, forceY } from 'd3-force';
import { loadFromStorage, saveToStorage } from '@/lib/maoxuan/storage';
import type { GraphData, GraphNode, GraphNodeType } from '@/lib/maoxuan/graph';

type LayoutMode = 'force' | 'radial' | 'timeline';

type SimNode = GraphNode & {
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
};

type SimLink = {
  source: string | SimNode;
  target: string | SimNode;
  type: 'tag' | 'concept' | 'event';
};

function dateKey(date?: string) {
  if (!date) return 0;
  const [y, m, d] = date.split('-');
  const day = d ? Number(d) : 0;
  return Number(y) * 10000 + Number(m) * 100 + day;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function storageKey(suffix: string) {
  return `maoxuan.map.${suffix}`;
}

function nodeRadius(type: GraphNodeType) {
  if (type === 'chapter') return 9;
  if (type === 'concept') return 7;
  if (type === 'tag') return 6;
  return 5;
}

function nodeColor(type: GraphNodeType) {
  if (type === 'chapter') return '#C96442';
  if (type === 'concept') return '#3D2E20';
  if (type === 'tag') return '#6B5D4F';
  return '#9C8E7F';
}

function linkColor(type: 'tag' | 'concept' | 'event') {
  if (type === 'concept') return 'rgba(61, 46, 32, 0.25)';
  if (type === 'tag') return 'rgba(107, 93, 79, 0.22)';
  return 'rgba(156, 142, 127, 0.20)';
}

function defaultVisible() {
  return { chapter: true, tag: true, concept: true, event: true } as Record<GraphNodeType, boolean>;
}

export function KnowledgeGraph({ data }: { data: GraphData }) {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const simRef = useRef<ReturnType<typeof forceSimulation<SimNode>> | null>(null);
  const nodesRef = useRef<SimNode[]>([]);
  const linksRef = useRef<SimLink[]>([]);
  const rafRef = useRef<number | null>(null);
  const sizeRef = useRef<{ w: number; h: number }>({ w: 800, h: 520 });

  const [layout, setLayout] = useState<LayoutMode>('force');
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState<Record<GraphNodeType, boolean>>(defaultVisible);
  const [hovered, setHovered] = useState<string | null>(null);

  const queryLower = query.trim().toLowerCase();

  const highlightedIds = useMemo(() => {
    if (!queryLower) return new Set<string>();
    const s = new Set<string>();
    for (const n of data.nodes) {
      if (n.label.toLowerCase().includes(queryLower)) s.add(n.id);
    }
    return s;
  }, [data.nodes, queryLower]);

  useEffect(() => {
    const storedLayout = loadFromStorage<LayoutMode>(storageKey('layout'));
    if (storedLayout?.data) setLayout(storedLayout.data);
    const storedVisible = loadFromStorage<Record<GraphNodeType, boolean>>(storageKey('visible'));
    if (storedVisible?.data) setVisible({ ...defaultVisible(), ...storedVisible.data });
  }, []);

  useEffect(() => {
    saveToStorage(storageKey('layout'), layout);
  }, [layout]);

  useEffect(() => {
    saveToStorage(storageKey('visible'), visible);
  }, [visible]);

  useEffect(() => {
    nodesRef.current = data.nodes.map((n) => ({ ...n, x: Math.random() * 200 - 100, y: Math.random() * 200 - 100 }));
    linksRef.current = data.links.map((l) => ({ ...l }));
  }, [data]);

  useEffect(() => {
    if (!wrapRef.current) return;

    const ro = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (!rect) return;
      sizeRef.current = { w: Math.max(320, rect.width), h: Math.max(360, rect.height) };
      const canvas = canvasRef.current;
      if (canvas) {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.floor(sizeRef.current.w * dpr);
        canvas.height = Math.floor(sizeRef.current.h * dpr);
        canvas.style.width = `${sizeRef.current.w}px`;
        canvas.style.height = `${sizeRef.current.h}px`;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      if (simRef.current) {
        simRef.current.force('center', forceCenter(sizeRef.current.w / 2, sizeRef.current.h / 2));
        simRef.current.alpha(0.6).restart();
      }
    });

    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  function applyLayout(mode: LayoutMode) {
    const { w, h } = sizeRef.current;
    const nodes = nodesRef.current;

    const chapterDates = nodes.filter((n) => n.type === 'chapter').map((n) => dateKey(n.date));
    const minD = chapterDates.length ? Math.min(...chapterDates) : 0;
    const maxD = chapterDates.length ? Math.max(...chapterDates) : 1;

    const xScale = (d: number) => {
      if (!maxD || maxD === minD) return w / 2;
      const t = (d - minD) / (maxD - minD);
      return 40 + t * (w - 80);
    };

    const sim = simRef.current;
    if (!sim) return;

    sim.force('x', null);
    sim.force('y', null);
    sim.force('radial', null);

    if (mode === 'force') {
      sim.force('x', forceX(w / 2).strength(0.02));
      sim.force('y', forceY(h / 2).strength(0.02));
      return;
    }

    if (mode === 'radial') {
      const r = (n: SimNode) => {
        if (n.type === 'chapter') return Math.min(w, h) * 0.34;
        if (n.type === 'concept') return Math.min(w, h) * 0.22;
        if (n.type === 'tag') return Math.min(w, h) * 0.18;
        return Math.min(w, h) * 0.40;
      };
      sim.force('radial', forceRadial(r, w / 2, h / 2).strength(0.9));
      return;
    }

    const yCenter = h / 2;
    sim.force(
      'x',
      forceX((n: SimNode) => {
        if (n.type === 'chapter') return xScale(dateKey(n.date));
        if (n.type === 'event') return xScale(clamp(dateKey(n.date) || minD, minD, maxD));
        return w / 2;
      }).strength((n: SimNode) => (n.type === 'chapter' || n.type === 'event' ? 0.9 : 0.12))
    );
    sim.force(
      'y',
      forceY((n: SimNode) => {
        if (n.type === 'chapter') return yCenter;
        if (n.type === 'event') return yCenter + 90;
        if (n.type === 'concept') return yCenter - 110;
        return yCenter - 40;
      }).strength((n: SimNode) => (n.type === 'chapter' ? 0.5 : 0.25))
    );
  }

  useEffect(() => {
    const { w, h } = sizeRef.current;
    const nodes = nodesRef.current;
    const links = linksRef.current;

    if (!nodes.length) return;

    const sim = forceSimulation(nodes)
      .force('charge', forceManyBody().strength(-120))
      .force(
        'link',
        forceLink<SimNode, SimLink>(links)
          .id((d) => d.id)
          .distance((l) => (l.type === 'concept' ? 90 : l.type === 'tag' ? 75 : 60))
          .strength((l) => (l.type === 'concept' ? 0.7 : l.type === 'tag' ? 0.65 : 0.5))
      )
      .force('center', forceCenter(w / 2, h / 2))
      .force(
        'collide',
        forceCollide<SimNode>()
          .radius((n) => nodeRadius(n.type) + 6)
          .iterations(2)
      );

    simRef.current = sim;
    applyLayout(layout);

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const visibleTypes = visible;
      ctx.clearRect(0, 0, sizeRef.current.w, sizeRef.current.h);

      const byId = new Map<string, SimNode>();
      for (const n of nodes) byId.set(n.id, n);

      ctx.lineWidth = 1;
      for (const l of links) {
        const s = typeof l.source === 'string' ? byId.get(l.source) : l.source;
        const t = typeof l.target === 'string' ? byId.get(l.target) : l.target;
        if (!s || !t) continue;
        if (!visibleTypes[s.type] || !visibleTypes[t.type]) continue;
        if (queryLower && highlightedIds.size && !highlightedIds.has(s.id) && !highlightedIds.has(t.id)) continue;
        ctx.strokeStyle = linkColor(l.type);
        ctx.beginPath();
        ctx.moveTo(s.x ?? 0, s.y ?? 0);
        ctx.lineTo(t.x ?? 0, t.y ?? 0);
        ctx.stroke();
      }

      for (const n of nodes) {
        if (!visibleTypes[n.type]) continue;
        const hitQuery = queryLower && highlightedIds.size ? highlightedIds.has(n.id) : true;
        const isHovered = hovered === n.id;

        const alpha = hitQuery ? 1 : 0.15;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = nodeColor(n.type);
        const r = nodeRadius(n.type);
        ctx.beginPath();
        ctx.arc(n.x ?? 0, n.y ?? 0, isHovered ? r + 2 : r, 0, Math.PI * 2);
        ctx.fill();

        if (isHovered || (hitQuery && highlightedIds.size)) {
          ctx.globalAlpha = 1;
          ctx.font = '12px serif';
          ctx.fillStyle = '#2B2016';
          ctx.textBaseline = 'middle';
          ctx.fillText(n.label, (n.x ?? 0) + r + 6, n.y ?? 0);
        }
      }

      ctx.globalAlpha = 1;
    };

    const scheduleDraw = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(draw);
    };

    sim.on('tick', scheduleDraw);
    scheduleDraw();

    return () => {
      sim.stop();
      simRef.current = null;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [data, hovered, highlightedIds, layout, queryLower, visible]);

  useEffect(() => {
    applyLayout(layout);
    simRef.current?.alpha(0.7).restart();
  }, [layout]);

  function findNodeAt(x: number, y: number) {
    const nodes = nodesRef.current;
    const types = visible;
    for (let i = nodes.length - 1; i >= 0; i -= 1) {
      const n = nodes[i];
      if (!types[n.type]) continue;
      const r = nodeRadius(n.type) + 4;
      const dx = (n.x ?? 0) - x;
      const dy = (n.y ?? 0) - y;
      if (dx * dx + dy * dy <= r * r) return n;
    }
    return null;
  }

  function onMove(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const hit = findNodeAt(x, y);
    setHovered(hit?.id ?? null);
  }

  function onLeave() {
    setHovered(null);
  }

  function onClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const hit = findNodeAt(x, y);
    if (!hit) return;
    if (hit.type === 'chapter' && hit.slug) router.push(`/library/${hit.slug}`);
  }

  function toggleType(type: GraphNodeType) {
    setVisible((v) => ({ ...v, [type]: !v[type] }));
  }

  return (
    <div className="wx-surface rounded-2xl p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          {([
            ['force', '力导向'],
            ['radial', '分层同心'],
            ['timeline', '时间轴'],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setLayout(key)}
              className="wx-toc-action"
              style={{
                background: layout === key ? 'rgba(201, 100, 66, 0.16)' : 'rgba(201, 100, 66, 0.05)',
                color: layout === key ? 'var(--wx-ink)' : 'var(--wx-ink-soft)',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索节点…"
            className="px-3 py-2 rounded-xl text-sm"
            style={{ border: '1px solid var(--wx-panel-border)', background: 'var(--wx-panel-bg)', color: 'var(--wx-ink)' }}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {([
          ['chapter', '文章'],
          ['concept', '概念'],
          ['tag', '主题'],
          ['event', '事件'],
        ] as const).map(([type, label]) => (
          <button
            key={type}
            type="button"
            onClick={() => toggleType(type)}
            className="wx-toc-action"
            style={{
              background: visible[type] ? 'rgba(201, 100, 66, 0.10)' : 'transparent',
              color: visible[type] ? 'var(--wx-ink-soft)' : 'var(--wx-ink-faint)',
            }}
          >
            {label}
          </button>
        ))}
        <div className="text-xs" style={{ color: 'var(--wx-ink-faint)' }}>
          点击文章节点可跳转到章节页
        </div>
      </div>

      <div ref={wrapRef} className="rounded-2xl overflow-hidden" style={{ height: 560, background: 'linear-gradient(to bottom, rgba(201, 100, 66, 0.06), transparent)' }}>
        <canvas ref={canvasRef} onPointerMove={onMove} onPointerLeave={onLeave} onClick={onClick} />
      </div>
    </div>
  );
}

