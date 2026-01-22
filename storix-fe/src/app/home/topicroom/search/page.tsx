// src/app/home/topicroom/search/page.tsx
import { Suspense } from 'react'
import ResultClient from './ResultClient'

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-10 text-[12px] text-gray-400">불러오는 중…</div>
      }
    >
      <ResultClient />
    </Suspense>
  )
}
