// src/app/library/works/review/page.tsx
'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ReviewDetailClient from './ReviewDetailClient'

function Entry() {
  const sp = useSearchParams()
  const reviewId = Number.parseInt(sp.get('id') ?? '', 10)
  return <ReviewDetailClient reviewId={reviewId} />
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Entry />
    </Suspense>
  )
}
