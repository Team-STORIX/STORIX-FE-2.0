// src/app/library/list/page.tsx
'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useInView } from 'react-intersection-observer'

import NavBar from '@/components/common/NavBar'
import Warning from '@/components/common/Warining'
import LibraryHeader from '@/components/library/LibraryHeader'
import ReviewWriteBottomSheet from '@/components/home/bottomsheet/ReviewWriteBottomSheet'
import LibraryWorksListContent from '@/components/library/LibraryWorksListContent'
import ArrowDownIcon from '@/public/icons/ArrowDownIcon'

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

  const [sortOpen, setSortOpen] = useState(false)
  const sortWrapRef = useRef<HTMLDivElement | null>(null)

  const sortLabel: Record<SortKey, string> = {
    DEFAULT: '전체 작품',
    RATING: '별점 높은 순',
    RATING_ASC: '별점 낮은 순',
  }

  useEffect(() => {
    if (!sortOpen) return
    const onDown = (e: MouseEvent) => {
      const el = sortWrapRef.current
      if (!el) return
      if (el.contains(e.target as Node)) return
      setSortOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [sortOpen])

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
        <div className="relative" ref={sortWrapRef}>
          {' '}
          <button
            type="button"
            onClick={() => setSortOpen((v) => !v)}
            className="py-1 body-2 text-gray-500 cursor-pointer flex items-center"
            onPointerDown={(e) => e.stopPropagation()}
            aria-label="정렬"
          >
            {sortLabel[sort]}
            <ArrowDownIcon />
          </button>
          {sortOpen && (
            <div className="absolute left-0 top-8 z-50 w-24 rounded-sm border border-gray-100 bg-white shadow-md">
              <button
                type="button"
                className={[
                  'w-full px-2 pt-2 pb-1.5 text-left body-2 text-gray-900 rounded-t-sm cursor-pointer transition-bg hover:bg-gray-50',
                  sort === 'DEFAULT' ? 'font-semibold' : '',
                ].join(' ')}
                onClick={() => {
                  setSort('DEFAULT')
                  setSortOpen(false)
                }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                전체 작품
              </button>

              <div className="h-[1px] w-full bg-gray-100" />

              <button
                type="button"
                className={[
                  'w-full px-2 pt-2 pb-1.5 text-left body-2 text-gray-900 cursor-pointer transition-bg hover:bg-gray-50',
                  sort === 'RATING' ? 'font-semibold' : '',
                ].join(' ')}
                onClick={() => {
                  setSort('RATING')
                  setSortOpen(false)
                }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                별점 높은 순
              </button>

              <div className="h-[1px] w-full bg-gray-100" />

              <button
                type="button"
                className={[
                  'w-full px-2 pt-2 pb-1.5 text-left body-2 text-gray-900 rounded-b-sm cursor-pointer transition-bg hover:bg-gray-50',
                  sort === 'RATING_ASC' ? 'font-semibold' : '',
                ].join(' ')}
                onClick={() => {
                  setSort('RATING_ASC')
                  setSortOpen(false)
                }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                별점 낮은 순
              </button>
            </div>
          )}
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
            onItemClick={(id) => {
              const returnTo = encodeURIComponent(
                `${window.location.pathname}${window.location.search}`,
              )
              router.push(`/library/works/${id}?returnTo=${returnTo}`)
            }}
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
