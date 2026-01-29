// src/app/library/works/review/[id]/page.tsx
import ReviewDetailClient from './ReviewDetailClient'

type Props = {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: Props) {
  const { id } = await params
  const reviewId = Number.parseInt(id, 10)
  return <ReviewDetailClient reviewId={reviewId} />
}
