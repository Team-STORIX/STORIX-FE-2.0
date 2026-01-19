// src/app/library/search/page.tsx
'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import SearchBar from '@/components/common/SearchBar'
import RecentSearchChip from '@/components/common/RecentSearchChip' // ✅ 추가
import {
  useLibraryRecentKeywords,
  useDeleteLibraryRecentKeyword,
} from '@/hooks/library/useLibraryRecentKeywords'
import { useLibrarySearchWorksInfinite } from '@/hooks/library/useLibrarySearchWorks'

export default function LibrarySearchPage() {
  const [keyword, setKeyword] = useState('')

  const { data: recentData } = useLibraryRecentKeywords()
  const { mutate: deleteRecent } = useDeleteLibraryRecentKeyword()

  const {
    data: searchData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useLibrarySearchWorksInfinite(keyword)

  const recentKeywords = recentData?.recentKeywords ?? []

  const results = useMemo(() => {
    const pages = searchData?.pages ?? []
    return pages.flatMap((p) => p.slice.content ?? [])
  }, [searchData])

  const handleSearch = (k: string) => {
    const trimmed = k.trim()
    if (!trimmed) return
    setKeyword(trimmed)
  }

  const handleRecentClick = (k: string) => {
    setKeyword(k)
  }

  return (
    <main className="min-h-screen bg-white">
      <SearchBar
        placeholder="좋아하는 작품/작가를 검색하세요"
        defaultKeyword={keyword}
        onSearchClick={handleSearch}
        backHref="/library/list"
      />

      {/* ✅ 최근 검색어 */}
      <section className="px-4 pt-5">
        <p className="body-1 text-gray-900">최근 검색어</p>

        {recentKeywords.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {recentKeywords.map((k) => (
              <RecentSearchChip
                key={k}
                label={k}
                onClick={() => handleRecentClick(k)}
                onRemove={() => deleteRecent(k)}
              />
            ))}
          </div>
        ) : (
          <p className="mt-3 text-[12px] font-medium text-gray-400">
            최근 검색어가 없어요.
          </p>
        )}
      </section>

      {/* 검색 결과 리스트 */}
      <section className="pt-4">
        <div className="divide-y divide-gray-100">
          {results.map((item) => (
            <button
              key={item.worksId}
              type="button"
              className="w-full px-4 py-4 text-left"
            >
              <div className="flex gap-4">
                <div className="relative h-[88px] w-[68px] overflow-hidden rounded-lg bg-gray-100">
                  {item.thumbnailUrl ? (
                    <Image
                      src={item.thumbnailUrl}
                      alt={item.worksName ?? 'thumbnail'}
                      fill
                      className="object-cover"
                      sizes="68px"
                    />
                  ) : null}
                </div>

                <div className="flex flex-1 flex-col justify-center">
                  <p className="body-1 text-gray-900 line-clamp-1">
                    {item.worksName ?? ''}
                  </p>

                  <p className="body-2 text-gray-500 mt-1 line-clamp-1">
                    {(item.artistName ?? '') && `P. ${item.artistName}`}
                    {item.genre ? ` · ${item.genre}` : ''}
                    {item.worksType ? ` · ${item.worksType}` : ''}
                  </p>

                  {(item as any).avgRating != null && (
                    <p className="body-2 text-magenta-300 mt-1">
                      + {(item as any).avgRating}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {hasNextPage && (
          <div className="px-4 py-6">
            <button
              type="button"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="w-full rounded-xl border border-gray-200 py-3 body-2"
            >
              {isFetchingNextPage ? '불러오는 중…' : '더 보기'}
            </button>
          </div>
        )}

        {isLoading && keyword && (
          <div className="px-4 py-6 body-2 text-gray-400">불러오는 중…</div>
        )}
      </section>
    </main>
  )
}
