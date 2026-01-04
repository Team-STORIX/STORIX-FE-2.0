// src/app/layout.tsx
import '@/styles/globals.css'
import type { Metadata } from 'next'
import localFont from 'next/font/local'

const suit = localFont({
  src: './fonts/SUIT-Variable.woff2',
  weight: '100 900',
  style: 'normal',
  display: 'swap', // 폰트 로딩 시 화면 깜빡임 줄이기 옵션
})

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
        className="min-h-screen flex items-center justify-center ${suit.className}"
        style={{ backgroundColor: 'var(--color-gray-400)' }}
      >
        <main className="flex min-h-dvh justify-center text-gray-900">
          {/* 가운데 393 x 852 카드: 흰색, relative 추가 */}
          <div className="iphone16-container relative flex min-h-dvh w-full max-w-[393px] flex-col bg-white shadow-lg">
            <div className="flex-1 overflow-y-auto no-scrollbar">
              {children}
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}
