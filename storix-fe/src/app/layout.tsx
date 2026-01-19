// src/app/layout.tsx

import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Providers } from './providers'
import '@/styles/globals.css'

const suit = localFont({
  src: '/fonts/SUIT-Variable.woff2',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
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
    <html lang="ko" className={`${suit.className}`}>
      {/* ✅ body에서 스크롤 허용 */}
      <body className="min-h-dvh overflow-y-auto justify-center">
        <Providers>
          <main className="flex min-h-dvh w-full justify-center text-gray-900 bg-white">
            {/* ✅ h-svh(고정) -> min-h-svh(최소) 로 변경 */}
            <div className="iphone16-container flex min-h-svh w-full max-w-[393px] flex-col bg-white">
              {/* ✅ 내부 스크롤 제거 유지 */}
              <div id="app-scroll-container" className="flex-1">
                {children}
              </div>
            </div>
          </main>
        </Providers>
      </body>
    </html>
  )
}
