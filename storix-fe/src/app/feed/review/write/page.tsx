// src/app/feed/review/write/page.tsx
'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ReviewWriteClient from './ReviewWriteClient'

function ReviewWriteEntry() {
  const sp = useSearchParams()
  const worksId = Number.parseInt(sp.get('id') ?? '', 10)
  return <ReviewWriteClient worksId={worksId} />
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ReviewWriteEntry />
    </Suspense>
  )
}
