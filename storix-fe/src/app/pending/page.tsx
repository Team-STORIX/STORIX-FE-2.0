// src/app/pending/page.tsx
import { Suspense } from 'react'
import PendingClient from './PendingClient'

export default function PendingPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div className="text-[16px] font-medium text-gray-700">
            로그인 중입니다
          </div>
        </div>
      }
    >
      <PendingClient />
    </Suspense>
  )
}
