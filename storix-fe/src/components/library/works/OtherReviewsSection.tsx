'use client'

import Image from 'next/image'
import ForwardArrowIcon from '@/public/icons/layout/FowardArrowIcon'

type OtherReviewItem = {
  reviewId: number
  userName?: string
  content?: string
  profileImageUrl?: string | null
}

type Props = {
  otherReviews: OtherReviewItem[]
  sentinelRef: (node?: Element | null) => void // ✅ useInView의 ref 그대로 받기
}

export default function OtherReviewsSection({
  otherReviews,
  sentinelRef,
}: Props) {
  return (
    <section className="-mx-4 px-5 ">
      <p className="heading-2 px-1 pt-5 pb-3 text-black">다른 유저들의 리뷰</p>

      <div className="flex flex-col mt-5 -mx-5 px-5 border-b border-gray-100 ">
        {otherReviews.length === 0 ? (
          <p className="body-2 text-gray-400">아직 다른 유저 리뷰가 없어요</p>
        ) : (
          otherReviews.map((r) => {
            return (
              <button
                key={r.reviewId}
                type="button"
                className="w-full text-left cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 shrink-0 overflow-hidden flex items-center justify-center">
                    {r.profileImageUrl ? (
                      <Image
                        src={r.profileImageUrl}
                        alt={r.userName ?? 'profile'}
                        width={32}
                        height={32}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="caption-1 text-[var(--color-magenta-300)]">
                        ✦
                      </span>
                    )}
                  </div>

                  <p className="body-2 text-gray-900 flex-1 min-w-0 w-full truncate">
                    {r.userName ?? '익명'}
                  </p>
                </div>

                {/* ✅ 아래: content 블럭 */}
                <div className="flex py-5 justify-between items-center">
                  <p className="body-2 text-gray-700 whitespace-pre-wrap break-words line-clamp-3">
                    {r.content ?? ''}
                  </p>
                  <ForwardArrowIcon />
                </div>
              </button>
            )
          })
        )}

        {/* ✅ UI 변경 없음: 무한스크롤 sentinel */}
        <div ref={sentinelRef} />
      </div>
    </section>
  )
}
