// src/app/library/search/page.tsx
'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'

import SearchBar from '@/components/common/SearchBar'
import RecentSearchChip from '@/components/common/RecentSearchChip'
import {
  useLibraryRecentKeywords,
  useDeleteLibraryRecentKeyword,
} from '@/hooks/library/useLibraryRecentKeywords'

export default function LibrarySearchPage() {
  const router = useRouter()

  const { data: recentData } = useLibraryRecentKeywords()
  const { mutate: deleteRecent } = useDeleteLibraryRecentKeyword()

  const recentKeywords = useMemo(
    () => recentData?.recentKeywords ?? [],
    [recentData],
  )

  const goResult = (raw: string) => {
    const k = raw.replace(/^#/, '').trim()
    if (!k) return
    router.push(`/library/search/result?keyword=${encodeURIComponent(k)}`)
  }

  return (
    <main className="min-h-screen bg-white">
      <SearchBar
        placeholder="내 서재 내 작품/작가를 검색해보세요"
        onSearchClick={goResult}
        backHref="/library/list"
      />
      <section className="px-4 pt-5">
        <p className="body-1 text-gray-900">최근 검색어</p>

        {recentKeywords.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {recentKeywords.map((k) => (
              <RecentSearchChip
                key={k}
                label={k}
                onClick={() => goResult(k)}
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
    </main>
  )
}
