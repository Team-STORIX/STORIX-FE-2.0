// src/components/library/works/OtherReviewsSection.tsx
'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import ForwardArrowIcon from '@/public/common/icons/FowardArrowIcon'
import ReviewMetaBar from '@/components/library/works/ReviewMetaBar'

type OtherReviewItem = {
  reviewId: number
  userName?: string
  content?: string
  profileImageUrl?: string | null
  rating?: number | null
  likeCount?: number | null
  isSpoiler?: boolean
}

type Props = {
  otherReviews: OtherReviewItem[]
  sentinelRef: (node?: Element | null) => void
}

export default function OtherReviewsSection({
  otherReviews,
  sentinelRef,
}: Props) {
  const router = useRouter()
  const [revealedSpoilerIds, setRevealedSpoilerIds] = useState<Set<number>>(
    new Set(),
  )

  const goReviewDetail = (reviewId: number) => {
    router.push(`/library/works/review?id=${reviewId}`)
  }

  return (
    <section className="flex w-full flex-col items-stretch">
      <p className="heading-2 -mx-4 px-5 pt-5 pb-3 text-black">
        다른 유저들의 리뷰
      </p>

      {otherReviews.length === 0 ? (
        <p className="body-2 text-gray-400">아직 다른 유저 리뷰가 없어요</p>
      ) : (
        otherReviews.map((r) => {
          const isHidden = Boolean(r.isSpoiler) && !revealedSpoilerIds.has(r.reviewId)

          const onClick = () => {
            if (isHidden) {
              setRevealedSpoilerIds((prev) => {
                const next = new Set(prev)
                next.add(r.reviewId)
                return next
              })
              return
            }

            goReviewDetail(r.reviewId)
          }

          return (
            <div
              key={r.reviewId}
              className="-mx-4 border-b border-gray-100 px-5 text-left"
            >
              <div className="mt-5 flex items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full">
                  {r.profileImageUrl ? (
                    <Image
                      src={r.profileImageUrl}
                      alt={r.userName ?? 'profile'}
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Image
                      src="/common/icons/reviewProfile.svg"
                      alt={r.userName ?? 'profile'}
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <p className="body-2 min-w-0 flex-1 truncate text-gray-900">
                  {r.userName ?? '익명'}
                </p>
              </div>

              <button
                className="flex w-full items-center justify-between py-5 text-left"
                type="button"
                onClick={onClick}
              >
                <div className="relative flex-1">
                  <p
                    className={[
                      'body-2 break-words whitespace-pre-wrap pr-6 text-gray-700 line-clamp-3',
                      isHidden ? 'select-none blur-sm' : '',
                    ].join(' ')}
                  >
                    {r.content ?? ''}
                  </p>
                  {isHidden && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="caption-1 px-3 py-1.5 text-[var(--color-magenta-300)]">
                        스포일러가 포함된 리뷰입니다 · 탭해서 보기
                      </span>
                    </span>
                  )}
                </div>

                <ForwardArrowIcon />
              </button>

              <div className="pb-5">
                <ReviewMetaBar rating={r.rating} likeCount={r.likeCount} />
              </div>
            </div>
          )
        })
      )}

      <div ref={sentinelRef} />
    </section>
  )
}
