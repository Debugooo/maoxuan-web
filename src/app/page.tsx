import type { Metadata } from 'next';
import './globals.css';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Navbar, Footer } from '@/components/Navigation';
import { HomePage } from '@/components/HomePage';
import { OriginalTextSection } from '@/components/OriginalTextSection';
import { QuestionSection } from '@/components/QuestionSection';
import { QuoteCard } from '@/components/QuoteCard';

export const metadata: Metadata = {
  title: '毛选精读 Day 1 | 《实践论》',
  description: '毛泽东选集精读学习平台，Day 1《实践论》完整学习指南',
};

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <ThemeToggle />
      <Navbar />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4">
          <HomePage />
          <hr className="border-slate-200 dark:border-slate-700 my-8" />
          <OriginalTextSection />
          <hr className="border-slate-200 dark:border-slate-700 my-8" />
          <QuestionSection />
          <hr className="border-slate-200 dark:border-slate-700 my-8" />
          <QuoteCard />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
