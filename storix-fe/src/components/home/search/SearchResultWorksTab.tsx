// src/components/home/search/SearchResultWorksTab.tsx
'use client'

import { useEffect, useRef } from 'react'
import SearchResultWorks from '@/components/home/search/SearchResultWorks'
import { useWorksSearchInfinite } from '@/hooks/search/useSearch'
import type {
  WorksSort,
  SearchWorksType,
  SearchGenre,
} from '@/lib/api/search/search.schema'

type Props = {
  keyword: string
  sort: WorksSort
  worksTypes: SearchWorksType[]
  genres: SearchGenre[]
}

export default function SearchResultWorksTab({
  keyword,
  sort,
  worksTypes,
  genres,
}: Props) {
  const pager = useWorksSearchInfinite(keyword, sort, worksTypes, genres)
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
    hasNextRef.current = pager.hasNext
  }, [pager.hasNext])

  useEffect(() => {
    fetchingRef.current = pager.isFetching
  }, [pager.isFetching])

  useEffect(() => {
    if (!keyword) return
    const el = loadMoreRef.current
    const root = scrollRootRef.current
    if (!el || !root) return

    const obs = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        if (lockRef.current) return
        if (!hasNextRef.current) return
        if (fetchingRef.current) return

        lockRef.current = true
        pager.requestNext()
        setTimeout(() => {
          lockRef.current = false
        }, 250)
      },
      { root, rootMargin: '200px', threshold: 0 },
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [keyword, pager])

  if (pager.meta === null) {
    return <div className="px-4 py-10 body-2 text-gray-400">불러오는 중…</div>
  }

  return (
    <SearchResultWorks
      works={pager.items}
      isFetching={pager.isFetching}
      loadMoreRef={loadMoreRef}
    />
  )
}
