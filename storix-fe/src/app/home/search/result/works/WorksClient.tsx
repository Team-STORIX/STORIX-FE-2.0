// src/app/home/search/result/works/WorksClient.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import SearchBar from '@/components/common/SearchBar'
import SearchResultWorks from '@/components/home/search/SearchResultWorks'
import SearchResultBottomNav from '@/components/home/search/SearchResultBottomNav'
import { useWorksSearchInfinite } from '@/hooks/search/useSearch'
import type { WorksSort } from '@/lib/api/search/search.schema'
import ArrowDownIcon from '@/public/icons/ArrowDownIcon'

export default function SearchWorksPage() {
  const router = useRouter()
  const sp = useSearchParams()
  const keyword = (sp.get('keyword') ?? '').trim()

  useEffect(() => {
    if (!keyword) router.replace('/home/search')
  }, [keyword, router])

  const [sort, setSort] = useState<WorksSort>('NAME')
  const [sortOpen, setSortOpen] = useState(false)
  const sortWrapRef = useRef<HTMLDivElement | null>(null)

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

  const sortLabel: Record<WorksSort, string> = {
    NAME: '기본순',
    RATING: '별점순',
    REVIEW: '리뷰순',
  }

  const worksPager = useWorksSearchInfinite(keyword, sort)

  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  //   iPhone 스크롤 컨테이너 root
  const scrollRootRef = useRef<HTMLElement | null>(null)
  useEffect(() => {
    scrollRootRef.current = document.getElementById(
      'app-scroll-container',
    ) as HTMLElement | null
  }, [])

  //   무한스크롤 트리거
  const lockRef = useRef(false)
  const hasNextRef = useRef(false)
  const fetchingRef = useRef(false)

  useEffect(() => {
    hasNextRef.current = worksPager.hasNext
  }, [worksPager.hasNext])

  useEffect(() => {
    fetchingRef.current = worksPager.isFetching
  }, [worksPager.isFetching])

  useEffect(() => {
    if (!keyword) return
    const el = loadMoreRef.current
    const root = scrollRootRef.current
    if (!el || !root) return

    const obs = new IntersectionObserver(
      (entries) => {
        const e = entries[0]
        if (!e?.isIntersecting) return
        if (lockRef.current) return
        if (!hasNextRef.current) return
        if (fetchingRef.current) return

        lockRef.current = true
        worksPager.requestNext()

        setTimeout(() => {
          lockRef.current = false
        }, 250)
      },
      { root, rootMargin: '200px', threshold: 0 },
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [keyword, worksPager])

  const goSearch = (raw: string) => {
    const k = raw.replace(/^#/, '').trim()
    if (!k) return
    router.push(`/home/search/result/works?keyword=${encodeURIComponent(k)}`)
  }

  const isEmpty = worksPager.items.length === 0 && worksPager.meta !== null

  return (
    <div className="flex w-full flex-col">
      <SearchBar onSearchClick={goSearch} />

      <div className="flex justify-between">
        {/* sort (피그마 드롭다운 느낌용) */}
        {!isEmpty && (
          <div
            className="px-4 flex items-center justify-start"
            ref={sortWrapRef}
          >
            <div className="relative">
              <button
                type="button"
                onClick={() => setSortOpen((v) => !v)}
                className="py-1 body-2 text-gray-500 cursor-pointer flex items-center"
                onPointerDown={(e) => e.stopPropagation()}
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
                      sort === 'NAME' ? 'font-semibold' : '',
                    ].join(' ')}
                    onClick={() => {
                      setSort('NAME')
                      setSortOpen(false)
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    기본순
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
                    별점순
                  </button>

                  <div className="h-[1px] w-full bg-gray-100" />

                  <button
                    type="button"
                    className={[
                      'w-full px-2 pt-2 pb-1.5 text-left body-2 text-gray-900 rounded-b-sm cursor-pointer transition-bg hover:bg-gray-50',
                      sort === 'REVIEW' ? 'font-semibold' : '',
                    ].join(' ')}
                    onClick={() => {
                      setSort('REVIEW')
                      setSortOpen(false)
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    리뷰순
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="px-4 inline-flex items-center justify-end">
          <button
            className="py-1 body-2 text-gray-300 cursor-pointer"
            onClick={() =>
              window.open(
                `https://truth-gopher-09e.notion.site/2ede81f70948801bb0f4ecc8e76a6015`,
              )
            }
          >
            <p className="underline">찾는 작품이 없다면?</p>
          </button>
        </div>
      </div>

      <div className="pb-24">
        <SearchResultWorks
          works={worksPager.items}
          isFetching={worksPager.isFetching}
          loadMoreRef={loadMoreRef}
        />
      </div>

      {/*   하단 Nav(작품/작가 전환) */}
      <SearchResultBottomNav keyword={keyword} active="works" />
    </div>
  )
}
