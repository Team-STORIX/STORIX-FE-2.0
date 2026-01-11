import { Suspense } from 'react'
import WorksClient from './WorksClient'

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-10 text-[12px] text-gray-400">불러오는 중…</div>
      }
    >
      <WorksClient />
    </Suspense>
  )
}
