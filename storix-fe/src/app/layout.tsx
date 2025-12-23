// src/app/layout.tsx
import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'STORIX',
  icons: {
    icon: '/icons/logo.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className="h-full">
      {/* 화면 전체 배경: gray-400 */}
      <body
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-gray-400)' }}
      >
        {/* 가운데 393 x 852 카드: 흰색 */}
        <div
          className="w-[393px] h-[852px] shadow-2xl overflow-hidden"
          style={{ backgroundColor: 'var(--color-white)' }}
        >
          {children}
        </div>
      </body>
    </html>
  )
}
