//src/components/library/works/WorkTapContent.tsx
'use client'

import Image from 'next/image'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ForwardArrowIcon from '@/public/common/icons/FowardArrowIcon'
import ForwardArrowSmallIcon from '@/public/common/icons/ForwardArrowSmallIcon'
import OtherReviewsSection from '@/components/library/works/OtherReviewsSection'
import ReviewMetaBar from '@/components/library/works/ReviewMetaBar'
import TopicRoomEnterButton from '@/components/library/works/TopicRoomEnterButton'
import Tabs from '@/components/common/Tabs'

import {
  useWorksMyReview,
  useWorksReviewsInfinite,
} from '@/hooks/works/useWorksReviews'
import { useProfileStore } from '@/store/profile.store'

type TabKey = 'info' | 'review'

type UIData = {
  reviewCount: number
  title: string
  description: string
  keywords: string[]
  platforms: string[]
}

const getPlatformIconSrc = (platform: string) => {
  const p = platform.trim()

  if (p.includes('네이버 웹툰')) return '/common/platform/naverWebtoon.png'
  if (p.includes('리디북스')) return '/common/platform/ridibooks.png'
  if (p.includes('카카오웹툰')) return '/common/platform/kakaoWebtoon.png'
  if (p.includes('카카오페이지')) return '/common/platform/kakaoPage.png'

  return null
}

type Props = {
  worksId: number
  tab: TabKey
  onChangeTab: (tab: TabKey) => void
  ui: UIData
  isCheckingRoom: boolean
  hasTopicRoom: boolean
  onReviewWrite: () => void
  onTopicroomEnter: () => void
}

export default function WorkTabContent({
  worksId,
  tab,
  onChangeTab,
  ui,
  isCheckingRoom,
  hasTopicRoom,
  onReviewWrite,
  onTopicroomEnter,
}: Props) {
  const router = useRouter()
  const userName = useProfileStore((s) => s.me?.nickName ?? '유저')
  const { data: myReview } = useWorksMyReview(worksId)
  const {
    data: reviewPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useWorksReviewsInfinite(worksId)

  const otherReviews = reviewPages?.pages.flatMap((p) => p.content ?? []) ?? []
  const platforms = ui.platforms.filter(
    (platform) => platform.trim().length > 0,
  )

  const { ref, inView } = useInView({
    threshold: 0,
  })

  useEffect(() => {
    if (!inView) return
    if (!hasNextPage) return
    if (isFetchingNextPage) return
    fetchNextPage()
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const goReviewDetail = (reviewId: number) => {
    router.push(`/library/works/review?id=${reviewId}`)
  }

  return (
    <>
      <Tabs
        tabs={['info', 'review'] as [TabKey, TabKey]}
        labels={['정보', `리뷰(${ui.reviewCount})`]}
        active={tab}
        onChange={onChangeTab}
      />

      <div className="px-4 pb-[calc(env(safe-area-inset-bottom)+88px)]">
        {tab === 'info' ? (
          <div>
            <section className="pt-6">
              <p className="heading-2 text-black">감상 가능한 곳</p>

              {platforms.length === 0 ? (
                <p className="body-2-medium mt-3 text-gray-400">
                  플랫폼 정보가 없어요
                </p>
              ) : (
                <div className="mt-3 flex flex-col gap-2">
                  {platforms.map((platform) => {
                    const platformIconSrc = getPlatformIconSrc(platform)

                    return (
                      <div key={platform} className="flex items-center gap-3">
                        <div className="relative h-9 w-9 overflow-hidden rounded-full bg-gray-100">
                          {platformIconSrc ? (
                            <Image
                              src={platformIconSrc}
                              alt={platform}
                              fill
                              className="object-cover"
                            />
                          ) : null}
                        </div>
                        <p className="body-1-bold text-gray-700">{platform}</p>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>

            <section className="pt-8">
              <p className="heading-2 text-black">작품 소개</p>
              <p className="body-2-medium mt-3 whitespace-pre-line text-gray-600 line-clamp-6">
                {ui.description || '작품 소개가 없어요'}
              </p>
            </section>

            <section className="pt-8">
              <p className="heading-2 text-black">키워드</p>
              {ui.keywords.length === 0 ? (
                <p className="body-2-medium mt-3 text-gray-600">
                  키워드가 없어요
                </p>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2 ">
                  {ui.keywords.map((k) => (
                    <span
                      key={k}
                      className="inline-flex cursor-pointer items-center gap-1 rounded border border-gray-200 bg-gray-50 px-2 py-1.5 text-sm"
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
            <section className="-mx-4 border-b border-gray-100 bg-gray-50 px-5">
              <p className="heading-2 px-1 pt-5 pb-3 text-black">내 리뷰</p>

              {myReview?.content ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      if (myReview.reviewId) {
                        goReviewDetail(myReview.reviewId)
                      }
                    }}
                    className="w-full cursor-pointer px-1 py-5 text-left"
                  >
                    <p className="body-2-medium mt-1 inline-flex w-full justify-between text-gray-500 line-clamp-2">
                      {myReview.content}
                      <ForwardArrowIcon />
                    </p>
                  </button>

                  <div className="px-1 pb-5">
                    <ReviewMetaBar
                      rating={myReview.rating}
                      likeCount={myReview.likeCount}
                    />
                  </div>
                </>
              ) : (
                <div className="px-1 pt-1 pb-5">
                  <div className="rounded-xl bg-white px-4 py-5 text-center shadow-[0_0_4px_0_rgba(19,17,18,0.20)]">
                    <p className="body-1-semibold text-gray-600">
                      아직 리뷰가 없어요!
                    </p>
                    <p className="body-1-semibold text-gray-600">
                      어서 {userName}님의 감상을 나눠주세요!
                    </p>

                    <button
                      type="button"
                      onClick={onReviewWrite}
                      className="body-2-bold mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--color-magenta-100)] bg-[var(--color-magenta-50)] px-6 py-2.5 text-[var(--color-magenta-300)]"
                    >
                      <span>리뷰 작성하기</span>
                      <ForwardArrowSmallIcon />
                    </button>
                  </div>
                </div>
              )}
            </section>

            <OtherReviewsSection
              otherReviews={otherReviews}
              sentinelRef={ref}
            />
          </div>
        )}
      </div>

      <TopicRoomEnterButton
        isCheckingRoom={isCheckingRoom}
        hasTopicRoom={hasTopicRoom}
        onClick={onTopicroomEnter}
      />
    </>
  )
}
