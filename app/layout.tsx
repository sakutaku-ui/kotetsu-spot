import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '子鉄スポット帳',
  description: '電車好きの子を持つ親のためのお出かけ支援アプリ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}