// src/app/layout.tsx

import type { Metadata } from 'next'
import localFont from 'next/font/local'
import Script from 'next/script'
import { Providers } from './providers'
import { Suspense } from 'react'
import '@/styles/globals.css'

import ProfileBootstrap from '@/components/common/ProfileBootstrap'
import GoogleAnalytics from '@/components/common/GoogleAnalytics'
import GAListener from '@/components/common/GAListener'

const suit = localFont({
  src: './fonts/SUIT-Variable.woff2',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'STORIX',
  icons: {
    icon: '/common/pwa/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={`${suit.className}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <Script id="startup-error-capture" strategy="beforeInteractive">
          {`
            (function () {
              if (typeof window === 'undefined') return;
              window.addEventListener('error', function (e) {
                try {
                  var stack = e && e.error && e.error.stack ? String(e.error.stack) : '';
                  console.error('[BOOT_ERROR]', e.message, e.filename + ':' + e.lineno + ':' + e.colno, stack);
                } catch (_) {}
              });
              window.addEventListener('unhandledrejection', function (e) {
                try {
                  var reason = e && e.reason;
                  var msg = reason && reason.message ? reason.message : String(reason);
                  var stack = reason && reason.stack ? String(reason.stack) : '';
                  console.error('[BOOT_REJECTION]', msg, stack);
                } catch (_) {}
              });
            })();
          `}
        </Script>
      </head>
      <body className="min-h-dvh overflow-y-auto justify-center" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <Providers>
          <GoogleAnalytics />
          <Suspense fallback={null}>
            <GAListener />
          </Suspense>

          {/* 앱 시작 시 내 프로필 보장 */}
          <ProfileBootstrap />

          <main className="flex min-h-dvh w-full justify-center text-gray-900 bg-white">
            <div className="iphone16-container flex min-h-svh w-full max-w-[393px] flex-col">
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
