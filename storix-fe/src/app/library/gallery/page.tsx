//src/app/library/gallery/page.tsx
'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/common/NavBar'
import BookSpineCarousel from '@/components/library/gallery/BookSpineCarousel'
import LibraryHeader from '@/components/library/LibraryHeader'

type SortKey = 'DEFAULT' | 'REVIEW' | 'RATING'

const MOCK_WORKS = [
  {
    id: 1,
    title: '상수리 나무 아래',
    meta: '웹툰 • 무협',
    thumb: '/image/sample/topicroom-1.webp',
    rating: 5.0,
    reviewCount: 100,
  },
  {
    id: 2,
    title: '연의 편지',
    meta: '웹툰 • 로판',
    thumb: '/image/sample/topicroom-2.webp',
    rating: 4.5,
    reviewCount: 100,
  },
  {
    id: 3,
    title: '전지적 독자 시점',
    meta: '웹툰 • 로판',
    thumb: '/image/sample/topicroom-3.webp',
    rating: 3.0,
    reviewCount: 100,
  },
  {
    id: 4,
    title: '무림세가 천대받는 손녀딸이 되었다',
    meta: '웹툰 • 로판',
    thumb: '/image/sample/topicroom-4.webp',
    rating: 3.5,
    reviewCount: 100,
  },
  {
    id: 5,
    title: '재혼 황후',
    meta: '웹툰 • 로판',
    thumb: '/image/sample/topicroom-1.webp',
    rating: 4.0,
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
      {/* 헤더 */}
      <LibraryHeader />
      {/* 상단 컨트롤 */}
      <div className="flex items-center justify-between px-4 py-4.5 border-b border-gray-200">
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
          <span className="body-2 text-gray-400">{sortedWorks.length}개</span>

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
            />
          </button>
        </div>
      </div>

      <BookSpineCarousel works={MOCK_WORKS} />

      <NavBar active="library" />
    </div>
  )
}
