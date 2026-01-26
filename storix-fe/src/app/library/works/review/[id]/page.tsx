// src/app/library/works/review/[id]/page.tsx
import ReviewDetailClient from './ReviewDetailClient'

export default function Page({ params }: { params: { id: string } }) {
  const reviewId = Number.parseInt(params.id, 10)
  return <ReviewDetailClient reviewId={reviewId} />
}
