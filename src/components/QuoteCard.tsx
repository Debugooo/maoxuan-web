'use client';

import { useState } from 'react';
import { goldenQuotes } from '@/data/content';

export function QuoteCard() {
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  const toggleFlip = (id: number) => {
    setFlippedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <section id="quotes" className="py-12">
      <h2 className="text-2xl font-serif font-bold text-slate-800 dark:text-white mb-8 flex items-center gap-3">
        <span className="text-3xl">✨</span>
        金句速记
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goldenQuotes.map((quote, index) => (
          <div
            key={quote.id}
            className="quote-card opacity-0"
            style={{ animationFillMode: 'forwards' }}
          >
            <div
              className="relative h-64 cursor-pointer perspective-1000"
              onClick={() => toggleFlip(quote.id)}
            >
              <div
                className={`absolute inset-0 transition-transform duration-500 transform-style-3d ${
                  flippedCards.has(quote.id) ? 'rotate-y-180' : ''
                }`}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: flippedCards.has(quote.id) ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* 正面 */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl p-6 flex flex-col justify-between shadow-xl"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-white/80 text-xs font-medium">金句 #{quote.id}</span>
                    <span className="text-white/60 text-lg">📜</span>
                  </div>
                  <div className="flex-1 flex items-center">
                    <blockquote className="text-white text-lg font-medium leading-relaxed">
                      &ldquo;{quote.quote}&rdquo;
                    </blockquote>
                  </div>
                  <p className="text-white/70 text-sm mt-4">点击查看释义</p>
                </div>

                {/* 背面 */}
                <div
                  className="absolute inset-0 bg-white dark:bg-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl border border-slate-200 dark:border-slate-700"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-slate-400 text-xs font-medium">释义</span>
                    <span className="text-slate-400 text-lg">💡</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <p className="text-slate-700 dark:text-slate-200 font-medium mb-4">
                      {quote.meaning}
                    </p>
                    <div className="bg-amber-50 dark:bg-amber-900/30 rounded-lg px-4 py-2 inline-block">
                      <p className="text-amber-700 dark:text-amber-300 text-sm font-medium">
                        🎯 {quote.tip}
                      </p>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm">点击返回金句</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
