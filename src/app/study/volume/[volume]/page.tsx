import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { getStudyIndex, getStudyItemById } from '@/lib/study/index';
import type { VolumeId } from '@/lib/study/types';
import type { EnrichedBookItem } from '@/lib/study/volumes';
import { enrichBookItem, flattenBookGroups, getVolumeGuide } from '@/lib/study/volumes';

export const metadata = { title: '分卷目录 | 毛选生存系统' };

function isExternal(href: string) {
  return href.startsWith('http://') || href.startsWith('https://');
}

function ActionLink({ href, children }: { href: string; children: ReactNode }) {
  if (isExternal(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="text-sm px-3 py-2 rounded-xl whitespace-nowrap"
        style={{
          color: 'var(--wx-brand)',
          border: '1px solid var(--wx-panel-border)',
          background: 'rgba(201, 100, 66, 0.04)',
        }}
      >
        {children}
      </a>
    );
  }
  return (
    <Link
      href={href}
      className="text-sm px-3 py-2 rounded-xl whitespace-nowrap"
      style={{
        color: 'var(--wx-brand)',
        border: '1px solid var(--wx-panel-border)',
        background: 'rgba(201, 100, 66, 0.04)',
      }}
    >
      {children}
    </Link>
  );
}

function buildItemMap(volume: VolumeId) {
  const v = getVolumeGuide(volume);
  const map = new Map<string, EnrichedBookItem>();
  if (!v) return map;
  for (const g of v.bookGroups) {
    for (const it of g.items) {
      const full = enrichBookItem(volume, it);
      map.set(full.id, full);
    }
  }
  return map;
}

function getLearningItems(volume: VolumeId) {
  const v = getVolumeGuide(volume);
  if (!v) return [];

  const map = buildItemMap(volume);

  if (volume !== 'v1') return flattenBookGroups(v.bookGroups).map((it) => enrichBookItem(volume, it));

  const index = getStudyIndex();
  const ids = index.learningOrder.filter((id) => id.startsWith('mx-v1-'));
  return ids.map((id) => map.get(id)).filter(Boolean) as EnrichedBookItem[];
}

function getOriginalHref(id: string, sourceUrl: string) {
  const it = getStudyItemById(id);
  if (!it) return sourceUrl;
  return `/original/${id}`;
}

function renderItem(it: EnrichedBookItem) {
  const guideHref = `/study/${it.id}`;
  const originalHref = getOriginalHref(it.id, it.source_url);
  return (
    <li
      key={it.id}
      className="rounded-2xl px-4 py-3 flex items-start justify-between gap-4"
      style={{ border: '1px solid var(--wx-panel-border)', background: 'rgba(255,255,255,0.02)' }}
    >
      <div className="min-w-0">
        <Link href={guideHref} className="font-semibold hover:underline" style={{ color: 'var(--wx-ink)' }}>
          {it.title}
        </Link>
        <div className="mt-1 text-sm" style={{ color: 'var(--wx-ink-soft)' }}>
          <span style={{ color: 'var(--wx-ink-faint)' }}>{it.date}</span>
          <span> · </span>
          <span>{it.topic}</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {it.tags.map((t) => (
            <span
              key={`${it.id}-${t}`}
              className="text-xs px-2 py-1 rounded-full"
              style={{ border: '1px solid var(--wx-panel-border)', color: 'var(--wx-ink-soft)', background: 'rgba(255,255,255,0.02)' }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="shrink-0">
        <ActionLink href={originalHref}>原文</ActionLink>
      </div>
    </li>
  );
}

export default function StudyVolumePage({
  params,
  searchParams,
}: {
  params: { volume: string };
  searchParams?: { tab?: string };
}) {
  const volume = params.volume as VolumeId;
  const v = getVolumeGuide(volume);
  if (!v) notFound();

  const tab = searchParams?.tab === 'book' ? 'book' : 'learning';
  const learningItems = getLearningItems(volume);

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link href="/study" className="text-sm hover:underline" style={{ color: 'var(--wx-ink-soft)' }}>
          ← 返回研读系统
        </Link>
      </div>

      <header className="wx-surface rounded-2xl p-6">
        <div className="text-xs" style={{ color: 'var(--wx-ink-faint)' }}>
          {v.range}
        </div>
        <h1 className="mt-1 text-3xl md:text-4xl font-serif font-bold" style={{ color: 'var(--wx-ink)' }}>
          {v.label}
        </h1>
        <div className="mt-2 text-sm" style={{ color: 'var(--wx-ink-soft)' }}>
          {v.theme}
        </div>
        <p className="mt-4 text-sm" style={{ color: 'var(--wx-ink)' }}>
          {v.intro}
        </p>
        <ul className="mt-4 space-y-1 text-sm" style={{ color: 'var(--wx-ink-soft)' }}>
          {v.bullets.map((b) => (
            <li key={b}>◆{b}</li>
          ))}
        </ul>
      </header>

      <section className="wx-surface rounded-2xl p-6 mt-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold" style={{ color: 'var(--wx-ink)' }}>
            目录
          </h2>
          <div
            className="flex items-center gap-1 p-1 rounded-full"
            style={{ border: '1px solid var(--wx-panel-border)', background: 'rgba(255,255,255,0.02)' }}
          >
            <Link
              href={`/study/volume/${volume}?tab=learning`}
              className="text-sm px-3 py-1.5 rounded-full"
              style={{
                color: tab === 'learning' ? 'var(--wx-ink)' : 'var(--wx-ink-soft)',
                border: tab === 'learning' ? '1px solid rgba(201, 100, 66, 0.35)' : '1px solid transparent',
                background: tab === 'learning' ? 'rgba(201, 100, 66, 0.06)' : 'transparent',
              }}
            >
              学习顺序
            </Link>
            <Link
              href={`/study/volume/${volume}?tab=book`}
              className="text-sm px-3 py-1.5 rounded-full"
              style={{
                color: tab === 'book' ? 'var(--wx-ink)' : 'var(--wx-ink-soft)',
                border: tab === 'book' ? '1px solid rgba(201, 100, 66, 0.35)' : '1px solid transparent',
                background: tab === 'book' ? 'rgba(201, 100, 66, 0.06)' : 'transparent',
              }}
            >
              原书顺序
            </Link>
          </div>
        </div>

        {tab === 'learning' ? (
          <ul className="mt-4 space-y-3">
            {learningItems.map((it) => renderItem(it))}
          </ul>
        ) : (
          <div className="mt-4 space-y-6">
            {v.bookGroups.map((g) => (
              <section key={g.title}>
                <h3 className="text-sm font-bold" style={{ color: 'var(--wx-ink)' }}>
                  {g.title}
                </h3>
                <ul className="mt-3 space-y-3">
                  {g.items.map((raw) => renderItem(enrichBookItem(volume, raw)))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
