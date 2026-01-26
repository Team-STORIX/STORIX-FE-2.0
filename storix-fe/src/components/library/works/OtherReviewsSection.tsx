'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import ForwardArrowIcon from '@/public/icons/layout/FowardArrowIcon'

type OtherReviewItem = {
  reviewId: number
  userName?: string
  content?: string
  profileImageUrl?: string | null
}

type Props = {
  otherReviews: OtherReviewItem[]
  sentinelRef: (node?: Element | null) => void //   useInView의 ref 그대로 받기
}

export default function OtherReviewsSection({
  otherReviews,
  sentinelRef,
}: Props) {
  const router = useRouter()

  const goReviewDetail = (reviewId: number) => {
    router.push(`/library/works/review/${reviewId}`)
  }

  return (
    <section className="flex flex-col items-stretch w-full">
      <p className="heading-2 -mx-4 px-5 pt-5 pb-3 text-black">
        다른 유저들의 리뷰
      </p>

      {otherReviews.length === 0 ? (
        <p className="body-2 text-gray-400">아직 다른 유저 리뷰가 없어요</p>
      ) : (
        otherReviews.map((r) => {
          return (
            <div
              key={r.reviewId}
              className="text-left -mx-4 px-5 border-b border-gray-100"
            >
              <div className="flex items-center gap-2 mt-5">
                <div className="h-8 w-8 shrink-0 rounded-full overflow-hidden flex items-center justify-center">
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
                      src={'/common/icons/reviewProfile.svg'}
                      alt={r.userName ?? 'profile'}
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <p className="body-2 text-gray-900 flex-1 min-w-0 w-full truncate">
                  {r.userName ?? '익명'}
                </p>
              </div>

              {/*   아래: content 블럭 */}
              <button
                className="flex w-full py-5 justify-between items-center text-left cursor-pointer "
                key={r.reviewId}
                type="button"
                onClick={() => goReviewDetail(r.reviewId)}
              >
                <p className="body-2 text-gray-500 whitespace-pre-wrap break-words line-clamp-3">
                  {r.content ?? ''}
                </p>
                <ForwardArrowIcon />
              </button>
            </div>
          )
        })
      )}

      {/*   UI 변경 없음: 무한스크롤 sentinel */}
      <div ref={sentinelRef} />
    </section>
  )
}
