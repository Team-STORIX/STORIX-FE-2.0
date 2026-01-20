// src/app/library/list/page.tsx
'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useInView } from 'react-intersection-observer'

import NavBar from '@/components/common/NavBar'
import Warning from '@/components/common/Warining'
import LibraryHeader from '@/components/library/LibraryHeader'
import ReviewWriteBottomSheet from '@/components/home/bottomsheet/ReviewWriteBottomSheet'

import { useLibraryReviewInfinite } from '@/hooks/library/useLibraryReview'
import type { LibraryReviewSort } from '@/lib/api/library/library.api'

type SortKey = 'DEFAULT' | 'REVIEW' | 'RATING'

type UILibraryWork = {
  id: number
  title: string
  meta: string
  thumb: string
  rating: number
  reviewCount: number
}

export default function LibraryListPage() {
  const router = useRouter()
  const [sort, setSort] = useState<SortKey>('DEFAULT')

  const [showReviewSheet, setShowReviewSheet] = useState(false)

  // 기존 기능 유지: 서버 정렬은 현재 LATEST / DESC_RATING만 사용
  const apiSort: LibraryReviewSort = useMemo(() => {
    if (sort === 'RATING') return 'DESC_RATING'
    return 'LATEST'
  }, [sort])

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useLibraryReviewInfinite({ sort: apiSort })

  const totalReviewCount = data?.pages?.[0]?.totalReviewCount ?? 0

  const works: UILibraryWork[] = useMemo(() => {
    const items = data?.pages?.flatMap((p) => p.result.content) ?? []

    const mapped = items.map((w) => {
      const metaParts: string[] = []
      const artist = (w as any).artistName
      const worksType = (w as any).worksType
      const genre = (w as any).genre
      if (artist) metaParts.push(artist)
      if (worksType) metaParts.push(worksType)
      if (genre) metaParts.push(genre)

      const rating =
        (w as any).reviewRating ??
        (w as any).avgRating ??
        (w as any).rating ??
        0
      const reviewCount = (w as any).reviewCount ?? (rating ? 1 : 0)

      return {
        id: w.worksId,
        title: w.worksName ?? '',
        meta: metaParts.join(' • '),
        thumb: w.thumbnailUrl ?? '',
        rating: Number(rating ?? 0),
        reviewCount: Number(reviewCount ?? 0),
      }
    })

    // REVIEW 정렬은 클라에서만 보정
    if (sort === 'REVIEW') {
      return [...mapped].sort(
        (a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0),
      )
    }

    return mapped
  }, [data, sort])

  const { ref, inView } = useInView({ threshold: 0 })

  useEffect(() => {
    if (!inView) return
    if (!hasNextPage) return
    if (isFetchingNextPage) return
    fetchNextPage()
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const count = totalReviewCount || works.length

  return (
    <div className="relative min-h-screen pb-[169px] bg-white">
      {/* 헤더 */}
      <LibraryHeader />

      {/* 상단 컨트롤(드롭다운/카운트/뷰 전환) */}
      <div className="flex items-center justify-between px-4 py-4.5 border-b border-gray-200">
        {/* 드롭다운 */}
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="body-2 text-gray-500 pr-7 appearance-none bg-transparent outline-none cursor-pointer"
            aria-label="정렬"
          >
            <option value="DEFAULT">전체 작품</option>
            <option value="RATING">별점 높은 순</option>
            <option value="REVIEW">리뷰 많은 순</option>
          </select>

          {/* caret */}
          <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-gray-400">
            <Image
              src={'/icons/arrow-down.svg'}
              alt={'정렬 옵션 열기'}
              width={24}
              height={24}
              className="inline-block"
            />
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="body-2 text-gray-400">{count}개</span>

          {/* list → gallery 전환 */}
          <button
            type="button"
            onClick={() => router.push('/library/gallery')}
            aria-label="갤러리형 보기"
            className="hover:opacity-70 cursor-pointer"
          >
            <Image
              src={'/icons/library/icon-gallery.svg'}
              alt={'갤러리형 보기'}
              width={24}
              height={24}
              className=""
            />
          </button>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="px-4">
        {isLoading ? (
          <div className="py-10 text-center body-2 text-gray-500">
            불러오는 중…
          </div>
        ) : works.length === 0 ? (
          <Warning
            title="아직 리뷰한 작품이 없어요"
            buttonText="서재에 작품 추가하러 가기"
            onButtonClick={() => setShowReviewSheet(true)}
          />
        ) : (
          <div>
            {works.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => router.push(`/library/works/${w.id}`)}
                className="flex w-full gap-4 py-4 border-b border-gray-100 text-left hover:opacity-90 cursor-pointer"
              >
                {/* 썸네일 */}
                <div className="relative h-[116px] w-[87px] overflow-hidden rounded-sm bg-gray-100 flex-shrink-0">
                  {w.thumb ? (
                    <Image
                      src={w.thumb}
                      alt={w.title}
                      fill
                      className="object-cover"
                    />
                  ) : null}
                </div>
                {/* 텍스트 */}
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="truncate body-1 text-black">{w.title}</p>
                  <p className="truncate body-2 text-gray-500">{w.meta}</p>

                  <div className="flex items-center gap-2">
                    <span className="caption-1 font-extrabold text-pink-500">
                      <Image
                        src="/search/littleStar.svg"
                        alt="star icon"
                        width={9}
                        height={10}
                        className="inline-block mr-1 mb-0.5"
                        priority
                      />
                      {Number(w.rating ?? 0).toFixed(1)}
                    </span>
                  </div>
                </div>
              </button>
            ))}

            {/* 무한 스크롤 센티넬 */}
            <div ref={ref} className="h-6" />

            {isFetchingNextPage ? (
              <div className="py-4 text-center body-2 text-gray-500">
                더 불러오는 중…
              </div>
            ) : null}
          </div>
        )}
      </div>

      <NavBar active="library" />

      {showReviewSheet && (
        <ReviewWriteBottomSheet onClose={() => setShowReviewSheet(false)} />
      )}
    </div>
  )
}
