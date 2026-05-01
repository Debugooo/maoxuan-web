import type { Metadata } from 'next';
import './globals.css';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Navbar, Footer } from '@/components/Navigation';

export const metadata: Metadata = {
  title: '毛选生存系统',
  description: '把《毛选》方法论做成可阅读、可调用、可训练、可复盘的生存系统',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased">
        <div className="min-h-screen flex flex-col">
          <ThemeToggle />
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  )
}
