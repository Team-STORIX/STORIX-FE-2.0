// src/app/layout.tsx
import '@/styles/globals.css'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import StatusBar from '@/components/layout/StatusBar'

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
    <html lang="ko">
      <body className={`min-h-dvh overflow-hidden bg-black ${suit.className}`}>
        <div
          className="
          fixed top-0 left-1/2 z-50
          w-full max-w-[393px] -translate-x-1/2
        "
        >
          <StatusBar />
        </div>
        <main className="flex min-h-dvh justify-center text-gray-900">
          <div className="iphone16-container relative flex min-h-dvh w-full max-w-[393px] flex-col bg-white shadow-lg">
            <div className="flex-1 overflow-y-auto no-scrollbar pt-[54px] pb-10">
              {children}
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}
