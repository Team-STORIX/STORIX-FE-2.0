'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/common/NavBar'
import Warning from '@/components/common/Warining'
import LibraryHeader from '@/components/library/LibraryHeader'

type SortKey = 'DEFAULT' | 'REVIEW' | 'RATING'

type LibraryWork = {
  id: number
  title: string
  meta: string
  thumb: string
  rating: number
  reviewCount: number
}

const MOCK_WORKS: LibraryWork[] = [
  {
    id: 1,
    title: '무림세가 천대받는 막내딸로 태어났습니다',
    meta: '열매, 시오, 마루별 • 웹툰',
    thumb: '/image/sample/topicroom-1.webp',
    rating: 4.5,
    reviewCount: 100,
  },
  {
    id: 2,
    title: '상수리나무 아래',
    meta: 'P, 서말, 나무, 김수지 • 웹툰',
    thumb: '/image/sample/topicroom-2.webp',
    rating: 4.5,
    reviewCount: 100,
  },
  {
    id: 3,
    title: '재혼황후',
    meta: '히어리, 소품 • 웹툰',
    thumb: '/image/sample/topicroom-3.webp',
    rating: 4.5,
    reviewCount: 100,
  },
]

export default function LibraryListPage() {
  const router = useRouter()

  // 테스트용: 비어있는 화면 보고 싶으면 []로
  const [works] = useState<LibraryWork[]>(MOCK_WORKS)

  const [sort, setSort] = useState<SortKey>('DEFAULT')

  const sortedWorks = useMemo(() => {
    const copy = [...works]
    if (sort === 'REVIEW')
      return copy.sort((a, b) => b.reviewCount - a.reviewCount)
    if (sort === 'RATING') return copy.sort((a, b) => b.rating - a.rating)
    return copy
  }, [works, sort])

  const count = works.length

  return (
    <div className="px-4">
      {/* 헤더 */}
      <LibraryHeader />

      {/* 상단 컨트롤(드롭다운/카운트/뷰 전환) */}
      <div className="mt-2 flex items-center justify-between px-4 pb-3 border-b border-gray-100">
        {/* 드롭다운 */}
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="body-2 text-gray-500 pr-7 appearance-none bg-transparent outline-none cursor-pointer"
            aria-label="정렬"
          >
            <option value="DEFAULT" className="caption-1">
              기본순
            </option>
            <option value="REVIEW" className="caption-1">
              리뷰순
            </option>
            <option value="RATING" className="caption-1">
              별점순
            </option>
          </select>

          {/* caret */}
          <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-gray-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" />
            </svg>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="body-2 text-gray-400">{count}개</span>

          {/* list → gallery 전환 */}
          <button
            type="button"
            onClick={() => router.push('/library/gallery')}
            aria-label="갤러리형 보기"
            className="p-2 hover:opacity-70 cursor-pointer"
          >
            <Image
              src={'/icons/library/icon-gallery.svg'}
              alt={'갤러리형 보기'}
              width={24}
              height={24}
              className="inline-block"
            />
          </button>
        </div>
      </div>

      {/* 콘텐츠 */}
      {sortedWorks.length === 0 ? (
        <div className="px-4">
          <Warning
            title="아직 서재에 추가된 작품이 없어요."
            description="서재에 작품을 추가하고 기록을 시작해보세요."
            className="pt-24"
          />

          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => router.push('/home/search')}
              className="caprion-1 rounded-lg border border-[var(--color-magenta-100)] px-4 py-2 text-[var(--color-magenta-300)] hover:opacity-70"
            >
              서재에 작품 추가하러 가기
            </button>
          </div>
        </div>
      ) : (
        <div>
          {sortedWorks.map((w) => (
            <button
              key={w.id}
              type="button"
              className="w-full px-4 py-4 border-t border-gray-100 text-left hover:bg-gray-50"
              // TODO: 상세로 가는 라우트 생기면 연결
              onClick={() => {}}
            >
              <div className="flex">
                <div className="relative h-[116px] w-[87px] mr-3 overflow-hidden rounded-xl bg-gray-100">
                  <Image
                    src={w.thumb}
                    alt={w.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-start">
                  <p className="body-1 text-black line-clamp-1">{w.title}</p>
                  <p className="caption-1 text-gray-500 line-clamp-1 mt-1">
                    {w.meta}
                  </p>

                  <p className="caption-1 text-[var(--color-magenta-300)] mt-1">
                    <Image
                      src="/search/littleStar.svg"
                      alt="star icon"
                      width={9}
                      height={10}
                      className="w-[9px] h-[10px] inline-block mb-0.5"
                      priority
                    />{' '}
                    {w.rating.toFixed(1)}({w.reviewCount})
                  </p>
                </div>
              </div>

              <div className="w-full bg-gray-100" />
            </button>
          ))}
        </div>
      )}

      {/* 하단 네비 */}
      <NavBar active="library" />
    </div>
  )
}
