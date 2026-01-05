// src/app/pending/page.tsx
import { Suspense } from 'react'
import PendingClient from '@/app/pending/pendingClient'

export default function PendingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full flex-col items-center justify-center">
          <p className="text-[16px] font-medium text-gray-700">
            로그인 중입니다
          </p>
        </div>
      }
    >
      <PendingClient />
    </Suspense>
  )
}
