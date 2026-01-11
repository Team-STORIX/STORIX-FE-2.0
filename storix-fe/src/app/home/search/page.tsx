'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import SearchBar from '@/components/common/SearchBar'
import HashtagList from '@/components/common/HashtagList'
import RecentSearchChip from '@/components/common/RecentSearchChip'
import {
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

export default function SearchHomePage() {
  const router = useRouter()

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
          <p className="text-[14px] font-semibold text-gray-700">최근 검색어</p>

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
          <p className="text-[14px] font-semibold text-gray-700">
            이런 해시태그는 어때요?
          </p>
          <HashtagList items={hashtagLabels} onSelect={goResult} />
        </div>
      </div>
    </div>
  )
}
