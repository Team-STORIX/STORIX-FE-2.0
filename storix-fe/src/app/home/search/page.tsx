// src/app/home/search/page.tsx
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import SearchBar from '@/components/common/SearchBar'
import HashtagList from '@/components/common/HashtagList'
import RecentSearchChip from '@/components/common/RecentSearchChip'
import {
  useWorksSearchInfinite,
  useArtistsSearchInfinite,
  useRecentKeywords,
  useTrendingKeywords,
  useDeleteRecentKeyword,
} from '@/hooks/search/useSearch'

const FALLBACK_HASHTAGS = [
  '#로맨스',
  '#무협/사극',
  '#액션',
  '#로맨스판타지',
  '#금발남주',
]

export default function Search() {
  const [submittedKeyword, setSubmittedKeyword] = useState('')

  const { data: recentRes } = useRecentKeywords()
  const { data: trendingRes } = useTrendingKeywords()
  const { mutate: removeRecent } = useDeleteRecentKeyword()

  const recentItems = useMemo(
    () => recentRes?.result?.recentKeywords ?? [],
    [recentRes],
  )
  const trendingItems = useMemo(
    () => trendingRes?.result?.trendingKeywords ?? [],
    [trendingRes],
  )

  const hashtagLabels =
    trendingItems.length > 0
      ? trendingItems.map((t) =>
          t.keyword.startsWith('#') ? t.keyword : `#${t.keyword}`,
        )
      : FALLBACK_HASHTAGS

  // ✅ pager(훅 내부에서 stop/중복 제어)
  const worksPager = useWorksSearchInfinite(submittedKeyword, 'NAME')
  const artistsPager = useArtistsSearchInfinite(submittedKeyword)

  const works = worksPager.items
  const artists = artistsPager.items
  const isFetching = worksPager.isFetching || artistsPager.isFetching

  // ✅ stale closure 방지(ref)
  const hasNextRef = useRef({ works: false, artists: false })
  const fetchingRef = useRef({ works: false, artists: false })

  useEffect(() => {
    hasNextRef.current = {
      works: worksPager.hasNext,
      artists: artistsPager.hasNext,
    }
  }, [worksPager.hasNext, artistsPager.hasNext])

  useEffect(() => {
    fetchingRef.current = {
      works: worksPager.isFetching,
      artists: artistsPager.isFetching,
    }
  }, [worksPager.isFetching, artistsPager.isFetching])

  const requestNextRef = useRef({ works: () => {}, artists: () => {} })
  useEffect(() => {
    requestNextRef.current = {
      works: worksPager.requestNext,
      artists: artistsPager.requestNext,
    }
  }, [worksPager.requestNext, artistsPager.requestNext])

  // ✅ root(스크롤 컨테이너)
  const scrollRootRef = useRef<HTMLElement | null>(null)
  useEffect(() => {
    scrollRootRef.current = document.getElementById(
      'app-scroll-container',
    ) as HTMLElement | null
  }, [])

  const loadLockRef = useRef(false)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  // ✅ 트리거 후 fetch가 끝날 때까지 lock 유지
  useEffect(() => {
    if (!loadLockRef.current) return
    if (!isFetching) loadLockRef.current = false
  }, [isFetching])

  useEffect(() => {
    if (!submittedKeyword.trim()) return
    console.log('[SEARCH]', { submittedKeyword })
  }, [submittedKeyword])

  useEffect(() => {
    if (!submittedKeyword.trim()) return
    console.log('[WORKS]', {
      items: works.length,
      hasNext: worksPager.hasNext,
      meta: worksPager.meta,
    })
    console.log('[ARTISTS]', {
      items: artists.length,
      hasNext: artistsPager.hasNext,
      meta: artistsPager.meta,
    })
  }, [
    submittedKeyword,
    works.length,
    artists.length,
    worksPager.hasNext,
    artistsPager.hasNext,
    worksPager.meta,
    artistsPager.meta,
  ])

  useEffect(() => {
    if (!submittedKeyword.trim()) return
    const el = loadMoreRef.current
    const root = scrollRootRef.current
    if (!el || !root) return

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry?.isIntersecting) return
        if (loadLockRef.current) return

        if (!hasNextRef.current.works && !hasNextRef.current.artists) return
        if (fetchingRef.current.works || fetchingRef.current.artists) return

        loadLockRef.current = true
        console.log('[LOAD_MORE_TRIGGER]', {
          hasNext: hasNextRef.current,
          fetching: fetchingRef.current,
        })

        // ✅ fetchNextPage 직접 호출 금지 → requestNext만
        if (hasNextRef.current.works) requestNextRef.current.works()
        if (hasNextRef.current.artists) requestNextRef.current.artists()
      },
      { root, rootMargin: '200px', threshold: 0 },
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [submittedKeyword])

  const handleSearch = (raw: string) => {
    const k = raw.replace(/^#/, '').trim()
    console.log('[handleSearch]', { raw, k })
    setSubmittedKeyword(k)
  }

  return (
    <div className="flex flex-col w-full">
      <SearchBar onSearchClick={handleSearch} />

      {!submittedKeyword && (
        <div className="flex flex-col w-full gap-6 px-4 pt-4 pb-10">
          <div className="flex flex-col w-full gap-3">
            <p className="body-2 text-gray-700">최근 검색어</p>

            {recentItems.length ? (
              <div className="flex flex-wrap gap-2">
                {recentItems.map((k) => (
                  <RecentSearchChip
                    key={k}
                    label={k}
                    onRemove={() => removeRecent(k)}
                    onClick={() => handleSearch(k)}
                  />
                ))}
              </div>
            ) : (
              <p className="caption-1 text-gray-400">최근 검색어가 없어요.</p>
            )}
          </div>

          <div className="flex flex-col w-full gap-3">
            <p className="body-2 text-gray-700">이런 해시태그는 어때요?</p>
            <HashtagList items={hashtagLabels} onSelect={handleSearch} />
          </div>
        </div>
      )}

      {submittedKeyword && (
        <div className="flex flex-col w-full gap-6 px-4 pt-4 pb-10">
          <div className="flex items-center justify-between">
            <p className="body-1">검색 결과</p>
            {isFetching && (
              <p className="caption-1 text-gray-400">불러오는 중…</p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <p className="body-2 text-gray-700">작품</p>

            {works.length ? (
              <div className="flex flex-col gap-3">
                {works.map((w: any) => (
                  <div key={w.worksId} className="flex gap-3">
                    <div className="relative h-14 w-14 overflow-hidden rounded bg-gray-100">
                      {w.thumbnailUrl ? (
                        <Image
                          src={w.thumbnailUrl}
                          alt={w.worksName}
                          fill
                          className="object-cover"
                        />
                      ) : null}
                    </div>

                    <div className="flex flex-1 flex-col justify-center">
                      <p className="body-2">{w.worksName}</p>
                      <p className="caption-1 text-gray-500">
                        {w.artistName} · ⭐ {Number(w.avgRating).toFixed(1)} ·
                        리뷰 {w.reviewsCount}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="caption-1 text-gray-400">
                작품 검색 결과가 없어요.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <p className="body-2 text-gray-700">작가</p>

            {artists.length ? (
              <div className="flex flex-col gap-3">
                {artists.map((a: any) => (
                  <div key={a.artistId} className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                      {a.profileUrl ? (
                        <Image
                          src={a.profileUrl}
                          alt={a.artistName}
                          fill
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <p className="body-2">{a.artistName}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="caption-1 text-gray-400">
                작가 검색 결과가 없어요.
              </p>
            )}
          </div>

          <div ref={loadMoreRef} className="h-6 w-full" />
        </div>
      )}
    </div>
  )
}
