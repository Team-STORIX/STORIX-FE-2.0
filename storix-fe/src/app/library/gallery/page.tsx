//src/app/library/gallery/page.tsx
'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import NavBar from '@/components/common/NavBar'
import BookSpineCarousel from '@/components/library/gallery/BookSpineCarousel'
import LibraryHeader from '@/components/library/LibraryHeader'
// list와 동일: empty 상태 Warning + 리뷰 작성 바텀시트
import Warning from '@/components/common/Warining'
import ReviewWriteBottomSheet from '@/components/home/bottomsheet/ReviewWriteBottomSheet'
// list와 동일하게 서재 리뷰 작품 API를 사용
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

export default function LibraryGalleryPage() {
  const router = useRouter()
  const [sort, setSort] = useState<SortKey>('DEFAULT')
  //  Warning 버튼 누르면 바텀시트 열기
  const [showReviewSheet, setShowReviewSheet] = useState(false)

  const apiSort: LibraryReviewSort = useMemo(() => {
    if (sort === 'RATING' || sort === 'RATING_ASC') return 'DESC_RATING'
    return 'LATEST'
  }, [sort])

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useLibraryReviewInfinite({ sort: apiSort })

  const totalReviewCount = data?.pages?.[0]?.totalReviewCount ?? 0

  // UI 모델로 매핑 + rating 추출 방식 동일
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

      const ratingRaw =
        (w as any).rating ??
        (w as any).reviewRating ??
        (w as any).avgRating ??
        0

      const rating = Number(ratingRaw) || 0
      const reviewCount = (w as any).reviewCount ?? (rating ? 1 : 0)

      return {
        id: w.worksId,
        title: w.worksName ?? '',
        meta: metaParts.join(' • '),
        thumb: w.thumbnailUrl ?? '',
        rating,
        reviewCount: Number(reviewCount ?? 0),
      }
    })

    // 별점 낮은 순은 "별점 높은 순(DESC)" 결과를 역순
    if (sort === 'RATING_ASC') {
      return [...mapped].reverse() // ✅
    }

    // DEFAULT / RATING은 서버 정렬을 신뢰(list와 동일)
    return mapped
  }, [data, sort])

  const sortedWorks = works

  return (
    <div className="relative min-h-screen pb-[169px] bg-white">
      {/* 헤더 */}
      <LibraryHeader />

      {/* 상단 컨트롤 */}
      <div className="flex items-center justify-between px-4 py-4.5 border-b border-gray-200">
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="body-2 text-gray-500 pr-7 appearance-none bg-transparent outline-none cursor-pointer"
            aria-label="정렬"
          >
            <option value="DEFAULT">전체 작품</option>
            <option value="RATING">별점 높은 순</option>
            <option value="RATING_ASC">별점 낮은 순</option>
          </select>

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
          {/* ✅ (API 연동) 총 개수는 서버값 우선 (UI 텍스트는 동일) */}
          <span className="body-2 text-gray-400">
            {totalReviewCount || sortedWorks.length}개
          </span>

          {/* gallery → list */}
          <button
            type="button"
            onClick={() => router.push('/library/list')}
            aria-label="리스트형 보기"
            className="hover:opacity-70 cursor-pointer"
          >
            <Image
              src={'/icons/library/icon-list.svg'}
              alt={'리스트형 보기'}
              width={24}
              height={24}
              className=""
            />
          </button>
        </div>
      </div>

      {/* 페이지네이션으로 추가 로딩 가능 (끝쪽 도달 시 자동 fetchNextPage)*/}
      {isLoading ? (
        <div className="px-4 py-10 text-center body-2 text-gray-500">
          불러오는 중…
        </div>
      ) : sortedWorks.length === 0 ? (
        <div className="px-4">
          <Warning
            title="아직 리뷰한 작품이 없어요"
            description="검색에서 작품을 찾아 리뷰를 작성해보세요"
            buttonText="작품 검색하기"
            onButtonClick={() => setShowReviewSheet(true)}
          />
        </div>
      ) : (
        <BookSpineCarousel
          works={sortedWorks}
          hasMore={!!hasNextPage} // (API 연동) 추가 로딩 가능 여부 전달 (UI 변화 없음)
          isFetchingMore={isFetchingNextPage} // ✅ (API 연동) 중복 fetch 방지용
          onNeedMore={() => {
            // (API 연동) UI 변경 없이 다음 페이지 로드
            if (hasNextPage && !isFetchingNextPage) fetchNextPage()
          }}
        />
      )}

      <NavBar active="library" />

      {showReviewSheet && (
        <ReviewWriteBottomSheet onClose={() => setShowReviewSheet(false)} />
      )}
    </div>
  )
}
