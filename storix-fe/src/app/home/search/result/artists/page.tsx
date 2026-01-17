import { Suspense } from 'react'
import ArtistsClient from './ArtistsClient'

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-10 text-[12px] text-gray-400">불러오는 중…</div>
      }
    >
      <ArtistsClient />
    </Suspense>
  )
}
