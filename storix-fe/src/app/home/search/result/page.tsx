import { Suspense } from 'react'
import SearchResultClient from './SearchResultClient'

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-10 text-xs text-gray-400">불러오는 중…</div>
      }
    >
      <SearchResultClient />
    </Suspense>
  )
}
