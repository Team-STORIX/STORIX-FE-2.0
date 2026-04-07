'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import SearchBar from '@/components/common/SearchBar'
import RecentSearchChip from '@/components/common/RecentSearchChip'
import TrendingSearch from '@/components/home/search/TrendingSearch'
import {
  useRecentKeywords,
  useDeleteRecentKeyword,
} from '@/hooks/search/useSearch'

export default function SearchHomePage() {
  const router = useRouter()

  const { data: recentRes } = useRecentKeywords()
  const { mutate: removeRecent } = useDeleteRecentKeyword()

  const recentItems = useMemo(
    () => recentRes?.result?.recentKeywords ?? [],
    [recentRes],
  )

  const goResult = (raw: string) => {
    const k = raw.replace(/^#/, '').trim()
    if (!k) return
    router.push(`/home/search/result?keyword=${encodeURIComponent(k)}`)
  }

  return (
    <div className="flex w-full flex-col">
      <SearchBar onSearchClick={goResult} />

      <div className="flex w-full flex-col gap-6 px-4 pt-4 pb-10">
        <div className="flex flex-col w-full gap-3">
          <p className="body-1 text-gray-900">최근 검색어</p>

          {recentItems.length ? (
            <div className="flex flex-wrap gap-2">
              {recentItems.map((k) => (
                <RecentSearchChip
                  key={k}
                  label={k}
                  onRemove={() => removeRecent(k)}
                  onClick={() => goResult(k)}
                />
              ))}
            </div>
          ) : (
            <p className="text-[12px] font-medium text-gray-400">
              최근 검색어가 없어요.
            </p>
          )}
        </div>

        <div className="flex flex-col w-full gap-3">
          <TrendingSearch onSelect={goResult} className="mt-6" />
        </div>
      </div>
    </div>
  )
}
