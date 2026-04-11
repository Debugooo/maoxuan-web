import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '毛选精读 Day 1 | 《实践论》',
  description: '毛泽东选集精读学习平台，Day 1《实践论》完整学习指南',
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
        {children}
      </body>
    </html>
  )
}
