//src/components/library/works/WorkTapContent.tsx
'use client'

import Image from 'next/image'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'
import ForwardArrowIcon from '@/public/icons/layout/FowardArrowIcon'

import {
  useWorksMyReview,
  useWorksReviewsInfinite,
} from '@/hooks/works/useWorksReviews'

type TabKey = 'info' | 'review'

type UIData = {
  reviewCount: number
  title: string
  description: string
  keywords: string[]
  platform: string
}

const getPlatformIconSrc = (platform: string) => {
  const p = platform.trim()

  if (p.includes('네이버웹툰')) return '/icons/platform/naverWebtoon.png'
  if (p.includes('리디북스')) return '/icons/platform/ridibooks.png'
  if (p.includes('카카오웹툰')) return '/icons/platform/kakaoWebtoon.png'
  if (p.includes('카카오페이지')) return '/icons/platform/kakaoPage.png'

  return null
}

type Props = {
  worksId: number
  tab: TabKey
  onChangeTab: (tab: TabKey) => void
  ui: UIData
  onReviewWrite: () => void
}

export default function WorkTabContent({
  worksId,
  tab,
  onChangeTab,
  ui,
  onReviewWrite,
}: Props) {
  const { data: myReview } = useWorksMyReview(worksId)
  const {
    data: reviewPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useWorksReviewsInfinite(worksId)

  const otherReviews = reviewPages?.pages.flatMap((p) => p.content ?? []) ?? []

  const { ref, inView } = useInView({
    threshold: 0,
  })

  // ✅ UI 변경 없음: 무한스크롤 트리거
  useEffect(() => {
    if (!inView) return
    if (!hasNextPage) return
    if (isFetchingNextPage) return
    fetchNextPage()
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const platformIconSrc = ui.platform ? getPlatformIconSrc(ui.platform) : null

  return (
    <>
      {/* Tabs */}
      <div className="px-4">
        <div className="flex border-b border-gray-200">
          <button
            type="button"
            onClick={() => onChangeTab('info')}
            className={[
              'flex-1 py-3 text-center caption-1 cursor-pointer',
              tab === 'info' ? 'text-black' : 'text-gray-400',
            ].join(' ')}
          >
            정보
          </button>
          <button
            type="button"
            onClick={() => onChangeTab('review')}
            className={[
              'flex-1 py-3 text-center caption-1 cursor-pointer',
              tab === 'review' ? 'text-black' : 'text-gray-400',
            ].join(' ')}
          >
            리뷰({ui.reviewCount})
          </button>
        </div>

        <div className="relative">
          <div
            className={[
              'absolute -top-[1px] h-[2px] w-1/2 bg-black transition-transform duration-200',
              tab === 'info' ? 'translate-x-0' : 'translate-x-full',
            ].join(' ')}
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 pb-10">
        {tab === 'info' ? (
          <div>
            <section className="pt-6">
              <p className="heading-2 text-black">감상 가능한 곳</p>

              {ui.platform.length === 0 ? (
                <p className="body-2 mt-3 text-gray-400">
                  플랫폼 정보가 없어요
                </p>
              ) : (
                <div className="mt-3 flex flex-col gap-2">
                  <div key={ui.platform} className="flex items-center gap-3">
                    {/* ✅ UI 변경: R 제거 -> 35px 원형 플랫폼 아이콘 */}
                    <div className="relative h-[35px] w-[35px] overflow-hidden rounded-full bg-gray-100">
                      {platformIconSrc ? (
                        <Image
                          src={platformIconSrc}
                          alt={ui.platform}
                          fill
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <p className="body-2 text-gray-700">{ui.platform}</p>
                  </div>
                </div>
              )}
            </section>

            <section className="pt-8">
              <p className="heading-2 text-black">작품 소개</p>
              <p className="body-2 mt-3 whitespace-pre-line text-gray-600 line-clamp-6">
                {ui.description || '작품 소개가 없어요'}
              </p>
            </section>

            <section className="pt-8">
              <p className="heading-2 text-black">키워드</p>
              {ui.keywords.length === 0 ? (
                <p className="body-2 mt-3 text-gray-400">키워드가 없어요</p>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2 ">
                  {ui.keywords.map((k) => (
                    <span
                      key={k}
                      className="inline-flex items-center gap-1 rounded border border-gray-200 bg-gray-50 px-2 py-1.5 text-sm cursor-pointer"
                    >
                      #{k}
                    </span>
                  ))}
                </div>
              )}
            </section>
          </div>
        ) : (
          <div>
            <section className="bg-gray-50 border-b border-gray-100">
              <p className="heading-2 text-black px-5 pt-5 pb-3">내 리뷰</p>
              <button
                type="button"
                onClick={onReviewWrite}
                className="w-full p-5 text-left cursor-pointer "
              >
                {myReview?.content ? (
                  <p className="inline-flex w-full body-2 mt-1 text-gray-500 line-clamp-2 justify-between">
                    {myReview.content}
                    <ForwardArrowIcon />
                  </p>
                ) : (
                  <p className="body-2 mt-1 text-gray-700 line-clamp-2">
                    아직 작성한 리뷰가 없어요. 리뷰를 작성해보세요!
                  </p>
                )}
              </button>
            </section>

            <section className="pt-8">
              <p className="heading-2 text-black">다른 유저들의 리뷰</p>

              <div className="mt-4 flex flex-col gap-4">
                {otherReviews.length === 0 ? (
                  <p className="body-2 text-gray-400">
                    아직 다른 유저 리뷰가 없어요
                  </p>
                ) : (
                  otherReviews.map((r) => {
                    const avatarColorClass =
                      r.reviewId % 2 === 0
                        ? 'bg-[var(--color-magenta-100)]'
                        : 'bg-gray-100'

                    return (
                      <button
                        key={r.reviewId}
                        type="button"
                        className="flex w-full items-start gap-3 rounded-xl border border-gray-100 px-4 py-4 text-left cursor-pointer"
                      >
                        <div
                          className={[
                            'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                            avatarColorClass,
                          ].join(' ')}
                        >
                          <span className="caption-1 text-[var(--color-magenta-300)]">
                            ✦
                          </span>
                        </div>

                        <div className="flex-1">
                          <p className="caption-1 text-gray-600">
                            {r.userName ?? '익명'}
                          </p>
                          <p className="body-2 mt-1 text-gray-700 line-clamp-2">
                            {r.content ?? ''}
                          </p>
                        </div>

                        <span className="text-gray-300">›</span>
                      </button>
                    )
                  })
                )}

                {/* ✅ UI 변경 없음: 무한스크롤 sentinel */}
                <div ref={ref} className="h-1" />
              </div>
            </section>
          </div>
        )}
      </div>
    </>
  )
}
