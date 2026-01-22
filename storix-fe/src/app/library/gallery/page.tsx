//src/app/library/gallery/page.tsx
'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/common/NavBar'
import BookSpineCarousel from '@/components/library/gallery/BookSpineCarousel'

type SortKey = 'DEFAULT' | 'REVIEW' | 'RATING'

const MOCK_WORKS = [
  {
    id: 1,
    title: '무림세가 천대받는 손녀딸이 되었다',
    meta: '웹툰 • 무협',
    thumb: '/image/sample/topicroom-1.webp',
    rating: 5.0,
    reviewCount: 100,
  },
  {
    id: 2,
    title: '재혼황후',
    meta: '웹툰 • 로판',
    thumb: '/image/sample/topicroom-2.webp',
    rating: 5.0,
    reviewCount: 100,
  },
  {
    id: 3,
    title: '상수리 나무 아래',
    meta: '웹툰 • 로판',
    thumb: '/image/sample/topicroom-3.webp',
    rating: 5.0,
    reviewCount: 100,
  },
  {
    id: 4,
    title: '재혼황후',
    meta: '웹툰 • 로판',
    thumb: '/image/sample/topicroom-4.webp',
    rating: 5.0,
    reviewCount: 100,
  },
  {
    id: 5,
    title: '상수리 나무 아래',
    meta: '웹툰 • 로판',
    thumb: '/image/sample/topicroom-1.webp',
    rating: 5.0,
    reviewCount: 100,
  },
]

export default function LibraryGalleryPage() {
  const router = useRouter()
  const [sort, setSort] = useState<SortKey>('DEFAULT')
  const works = MOCK_WORKS

  const sortedWorks = useMemo(() => {
    const copy = [...works]
    if (sort === 'REVIEW')
      return copy.sort((a, b) => b.reviewCount - a.reviewCount)
    if (sort === 'RATING') return copy.sort((a, b) => b.rating - a.rating)
    return copy
  }, [works, sort])

  return (
    <div className="relative min-h-screen pb-[169px] bg-white">
      <div className="h-[54px]" />

      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 pt-2">
        <p className="heading-2 text-black">내 서재</p>

        <button
          type="button"
          onClick={() => router.push('/library/search')}
          aria-label="서재 검색"
          className="p-2 hover:opacity-70"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M10.5 18.5a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M21 21l-4.35-4.35"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* 상단 컨트롤 */}
      <div className="mt-2 flex items-center justify-between px-4 mb-25 border-b border-gray-100">
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="body-2 text-gray-500 pr-7 appearance-none bg-transparent"
            aria-label="정렬"
          >
            <option value="DEFAULT">기본순</option>
            <option value="REVIEW">리뷰순</option>
            <option value="RATING">별점순</option>
          </select>

          <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-gray-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" />
            </svg>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="body-2 text-gray-400">{sortedWorks.length}개</span>

          {/* gallery → list */}
          <button
            type="button"
            onClick={() => router.push('/library/list')}
            aria-label="리스트형 보기"
            className="p-2 hover:opacity-70"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 7h14M5 12h14M5 17h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <BookSpineCarousel works={MOCK_WORKS} />

      <NavBar active="library" />
    </div>
  )
}
