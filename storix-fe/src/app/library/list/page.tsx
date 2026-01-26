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
import LibraryWorksListContent from '@/components/library/LibraryWorksListContent'

import { useLibraryReviewInfinite } from '@/hooks/library/useLibraryReview'
import type { LibraryReviewSort } from '@/lib/api/library/library.api'

type SortKey = 'DEFAULT' | 'RATING' | 'RATING_ASC'

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

  const apiSort: LibraryReviewSort = useMemo(() => {
    if (sort === 'RATING' || sort === 'RATING_ASC') return 'DESC_RATING' //
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
        meta: metaParts.join(' · '),
        thumb: w.thumbnailUrl ?? '',
        rating: Number(rating ?? 0),
        reviewCount: Number(reviewCount ?? 0),
      }
    })

    // 별점 낮은 순은 "별점 높은 순(DESC)" 결과를 역순
    if (sort === 'RATING_ASC') {
      return [...mapped].reverse()
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
            className="body-2 text-gray-500 pr-3 appearance-none bg-transparent outline-none cursor-pointer"
            aria-label="정렬"
          >
            <option value="DEFAULT">전체 작품</option>
            <option value="RATING">별점 높은 순</option>
            <option value="RATING_ASC">별점 낮은 순</option>
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
      <div>
        <div>
          <LibraryWorksListContent
            isLoading={isLoading}
            works={works}
            empty={
              <Warning
                title="아직 리뷰한 작품이 없어요"
                buttonText="서재에 작품 추가하러 가기"
                onButtonClick={() => setShowReviewSheet(true)}
              />
            }
            onItemClick={(id) => router.push(`/library/works/${id}`)}
            infiniteScrollRef={ref}
            isFetchingNextPage={isFetchingNextPage}
          />
        </div>
      </div>

      <NavBar active="library" />

      {showReviewSheet && (
        <ReviewWriteBottomSheet onClose={() => setShowReviewSheet(false)} />
      )}
    </div>
  )
}
