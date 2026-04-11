// src/app/home/search/result/works/WorksClient.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import SearchBar from '@/components/common/SearchBar'
import WorksSortBottomSheet from '@/components/home/bottomsheet/WorksSortBottomSheet'
import SearchResultWorks from '@/components/home/search/SearchResultWorks'
import Warning from '@/components/common/Warining'
import Tabs from '@/components/common/Tabs'
import { useWorksSearchInfinite } from '@/hooks/search/useSearch'
import type { WorksSort } from '@/lib/api/search/search.schema'
import ArrowDownIcon from '@/public/common/icons/ArrowDownIcon'

type SearchTab = 'works' | 'topicroom'

export default function SearchWorksPage() {
  const router = useRouter()
  const sp = useSearchParams()
  const keyword = (sp.get('keyword') ?? '').trim()

  useEffect(() => {
    if (!keyword) router.replace('/home/search')
  }, [keyword, router])

  const [tab, setTab] = useState<SearchTab>('works')
  const [sort, setSort] = useState<WorksSort>('NAME')
  const [showSortSheet, setShowSortSheet] = useState(false)

  const sortLabel: Record<WorksSort, string> = {
    NAME: '기본순',
    RATING: '별점순',
    REVIEW: '리뷰순',
  }

  const worksPager = useWorksSearchInfinite(keyword, sort)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const scrollRootRef = useRef<HTMLElement | null>(null)
  useEffect(() => {
    scrollRootRef.current = document.getElementById(
      'app-scroll-container',
    ) as HTMLElement | null
  }, [])

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
        const entry = entries[0]
        if (!entry?.isIntersecting) return
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
    const nextKeyword = raw.replace(/^#/, '').trim()
    if (!nextKeyword) return
    router.push(
      `/home/search/result/works?keyword=${encodeURIComponent(nextKeyword)}`,
    )
  }

  const isEmpty = worksPager.items.length === 0 && worksPager.meta !== null

  return (
    <div className="flex w-full flex-col">
      <SearchBar onSearchClick={goSearch} />
      <Tabs
        tabs={['works', 'topicroom'] as [SearchTab, SearchTab]}
        labels={['작품', '토픽룸']}
        active={tab}
        onChange={setTab}
      />

      {tab === 'works' ? (
        <>
          <div className="flex justify-between pt-4">
            {!isEmpty && (
              <div className="px-4 flex items-center justify-start">
                <button
                  type="button"
                  onClick={() => setShowSortSheet(true)}
                  className="p-1 caption-1-medium text-gray-800 cursor-pointer flex items-center border border-gray-300 rounded-full"
                >
                  <p className="ml-1.5">{sortLabel[sort]}</p>
                  <ArrowDownIcon />
                </button>
              </div>
            )}

            <div className="px-4 inline-flex items-center justify-end">
              <button
                className="py-1 body-2 text-gray-300 cursor-pointer"
                onClick={() =>
                  window.open(
                    'https://truth-gopher-09e.notion.site/2ede81f70948801bb0f4ecc8e76a6015',
                  )
                }
              >
                <p className="underline">찾는 작품이 없다고?</p>
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
        </>
      ) : (
        <Warning
          title="검색 결과가 없어요"
          description="다른 키워드로 검색해보세요"
          className="mt-48"
        />
      )}

      {showSortSheet && (
        <WorksSortBottomSheet
          currentSort={sort}
          onApply={setSort}
          onClose={() => setShowSortSheet(false)}
        />
      )}
    </div>
  )
}
