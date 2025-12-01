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
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={`min-h-dvh ${suit.className}`}>
        <main className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-900">
          <div className="iphone16-container flex flex-col bg-white shadow-lg">
            <StatusBar />
            <div className="flex-1 overflow-y-auto no-scrollbar">
              {children}
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}
