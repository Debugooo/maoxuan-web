import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { getStudyIndex } from '@/lib/study/index';
import type { StudyItem } from '@/lib/study/types';
import { flattenBookGroups, getVolumeGuide } from '@/lib/study/volumes';

export const metadata = { title: '分卷目录 | 毛选生存系统' };

function isExternal(href: string) {
  return href.startsWith('http://') || href.startsWith('https://');
}

function GuideLink({ href, children }: { href: string; children: ReactNode }) {
  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className="text-sm hover:underline" style={{ color: 'var(--wx-brand)' }}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className="text-sm hover:underline" style={{ color: 'var(--wx-brand)' }}>
      {children}
    </Link>
  );
}

function getLearningItems(volume: string) {
  const v = getVolumeGuide(volume);
  if (!v) return [];

  if (volume !== 'v1') return flattenBookGroups(v.bookGroups);

  const index = getStudyIndex();
  const byId = new Map<string, StudyItem>();
  index.volumes.v1.items.forEach((it) => byId.set(it.id, it));

  const ids = index.learningOrder.filter((id) => {
    const it = byId.get(id);
    return Boolean(it && it.volume === 'v1');
  });

  return ids
    .map((id) => byId.get(id))
    .filter(Boolean)
    .map((it) => ({ id: it!.id, title: it!.title, source_url: it!.source_url }));
}

export default function StudyVolumePage({
  params,
  searchParams,
}: {
  params: { volume: string };
  searchParams?: { tab?: string };
}) {
  const volume = params.volume;
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
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold" style={{ color: 'var(--wx-ink)' }}>
            目录
          </h2>
          <div className="flex items-center gap-3 text-sm">
            <Link
              href={`/study/volume/${volume}?tab=learning`}
              className="hover:underline"
              style={{ color: tab === 'learning' ? 'var(--wx-ink)' : 'var(--wx-ink-soft)' }}
            >
              学习顺序
            </Link>
            <Link
              href={`/study/volume/${volume}?tab=book`}
              className="hover:underline"
              style={{ color: tab === 'book' ? 'var(--wx-ink)' : 'var(--wx-ink-soft)' }}
            >
              原书顺序
            </Link>
          </div>
        </div>

        {tab === 'learning' ? (
          <ul className="mt-4 space-y-2">
            {learningItems.map((it) => {
              const guideHref = it.id ? `/study/${it.id}` : it.source_url;
              const originalHref = it.id ? `/original/${it.id}` : it.source_url;
              return (
                <li key={`${it.title}-${it.source_url}`} className="flex items-start justify-between gap-4">
                  <div style={{ color: 'var(--wx-ink)' }}>{it.title}</div>
                  <div className="flex items-center gap-3 whitespace-nowrap">
                    <GuideLink href={guideHref}>指南</GuideLink>
                    <GuideLink href={originalHref}>原文</GuideLink>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="mt-4 space-y-6">
            {v.bookGroups.map((g) => (
              <section key={g.title}>
                <h3 className="text-sm font-bold" style={{ color: 'var(--wx-ink)' }}>
                  {g.title}
                </h3>
                <ul className="mt-3 space-y-2">
                  {g.items.map((it) => {
                    const guideHref = it.id ? `/study/${it.id}` : it.source_url;
                    const originalHref = it.id ? `/original/${it.id}` : it.source_url;
                    return (
                      <li key={`${g.title}-${it.title}`} className="flex items-start justify-between gap-4">
                        <div style={{ color: 'var(--wx-ink)' }}>{it.title}</div>
                        <div className="flex items-center gap-3 whitespace-nowrap">
                          <GuideLink href={guideHref}>指南</GuideLink>
                          <GuideLink href={originalHref}>原文</GuideLink>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
