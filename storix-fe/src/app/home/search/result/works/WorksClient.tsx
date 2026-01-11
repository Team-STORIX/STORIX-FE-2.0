// src/app/home/search/result/works/page.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import SearchBar from '@/components/common/SearchBar'
import SearchResultWorks from '@/components/home/search/SearchResultWorks'
import SearchResultBottomNav from '@/components/home/search/SearchResultBottomNav'
import { useWorksSearchInfinite } from '@/hooks/search/useSearch'
import type { WorksSort } from '@/api/search/search.schema'

export default function SearchWorksPage() {
  const router = useRouter()
  const sp = useSearchParams()
  const keyword = (sp.get('keyword') ?? '').trim()

  useEffect(() => {
    if (!keyword) router.replace('/home/search')
  }, [keyword, router])

  const [sort, setSort] = useState<WorksSort>('NAME')
  const worksPager = useWorksSearchInfinite(keyword, sort)

  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  // ✅ iPhone 스크롤 컨테이너 root
  const scrollRootRef = useRef<HTMLElement | null>(null)
  useEffect(() => {
    scrollRootRef.current = document.getElementById(
      'app-scroll-container',
    ) as HTMLElement | null
  }, [])

  // ✅ 무한스크롤 트리거
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

      {/* sort (피그마 드롭다운 느낌용) */}
      {!isEmpty && (
        <div className="px-4 flex items-center justify-start">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as WorksSort)}
            className="py-1 body-2 text-gray-500"
          >
            <option value="NAME">전체 작품</option>
            <option value="RATING">별점 높은 순</option>
            <option value="REVIEW">리뷰 많은 순</option>
          </select>
        </div>
      )}

      <div className="pb-24">
        <SearchResultWorks
          works={worksPager.items}
          isFetching={worksPager.isFetching}
          loadMoreRef={loadMoreRef}
        />
      </div>

      {/* ✅ 하단 Nav(작품/작가 전환) */}
      <SearchResultBottomNav keyword={keyword} active="works" />
    </div>
  )
}
