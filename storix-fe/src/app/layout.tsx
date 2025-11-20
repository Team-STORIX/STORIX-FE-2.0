import '@/styles/globals.css'
import type { Metadata } from 'next'

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
      <body className="min-h-dvh">{children}</body>
    </html>
  )
}
