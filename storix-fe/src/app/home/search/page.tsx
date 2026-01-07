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

export default function Search() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="flex w-full flex-col" />
  }
  const [submittedKeyword, setSubmittedKeyword] = useState('')

  const fallbackHashtags = [
    '#로맨스',
    '#무협/사극',
    '#액션',
    '#로맨스판타지',
    '#금발남주',
  ]

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
    submittedKeyword.trim().length === 0
      ? fallbackHashtags
      : trendingItems.map((t) =>
          t.keyword.startsWith('#') ? t.keyword : `#${t.keyword}`,
        )

  const worksQuery = useWorksSearchInfinite(submittedKeyword, 'NAME')
  const artistsQuery = useArtistsSearchInfinite(submittedKeyword)

  const works = useMemo(
    () => worksQuery.data?.pages.flatMap((p) => p.result.content ?? []) ?? [],
    [worksQuery.data],
  )
  const artists = useMemo(
    () => artistsQuery.data?.pages.flatMap((p) => p.result.content ?? []) ?? [],
    [artistsQuery.data],
  )

  const isFetching = worksQuery.isFetching || artistsQuery.isFetching

  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!submittedKeyword) return
    const el = loadMoreRef.current
    if (!el) return

    const obs = new IntersectionObserver((entries) => {
      const entry = entries[0]
      if (!entry.isIntersecting) return

      if (worksQuery.hasNextPage && !worksQuery.isFetchingNextPage) {
        worksQuery.fetchNextPage()
      }
      if (artistsQuery.hasNextPage && !artistsQuery.isFetchingNextPage) {
        artistsQuery.fetchNextPage()
      }
    })

    obs.observe(el)
    return () => obs.disconnect()
  }, [
    submittedKeyword,
    worksQuery.hasNextPage,
    worksQuery.isFetchingNextPage,
    artistsQuery.hasNextPage,
    artistsQuery.isFetchingNextPage,
  ])

  const handleSearch = (keyword: string) => {
    const k = keyword.replace(/^#/, '').trim()
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
          </div>

          <div className="flex flex-col gap-3">
            <p className="body-2 text-gray-700">작품</p>

            {works.length ? (
              <div className="flex flex-col gap-3">
                {works.map((w) => (
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
                {artists.map((a) => (
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
