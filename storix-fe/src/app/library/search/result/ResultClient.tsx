// src/app/library/search/result/ResultClient.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useInView } from 'react-intersection-observer'

import SearchBar from '@/components/common/SearchBar'
import Warning from '@/components/common/Warining'
import ReviewWriteBottomSheet from '@/components/home/bottomsheet/ReviewWriteBottomSheet'
import LibraryWorksListContent, {
  type LibraryWorksListItem,
} from '@/components/library/LibraryWorksListContent'

import { useLibrarySearchWorksInfinite } from '@/hooks/library/useLibrarySearchWorks'

export default function ResultClient() {
  const router = useRouter()
  const sp = useSearchParams()
  const keyword = (sp.get('keyword') ?? '').trim()
  const [showReviewSheet, setShowReviewSheet] = useState(false)

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useLibrarySearchWorksInfinite(keyword)

  const works: LibraryWorksListItem[] = useMemo(() => {
    const items = data?.pages?.flatMap((p) => p.content) ?? []

    return items.map((w) => {
      const metaParts: string[] = []
      if (w.artistName) metaParts.push(w.artistName)
      if (w.worksType) metaParts.push(w.worksType)
      if (w.genre) metaParts.push(w.genre)

      return {
        id: w.worksId,
        title: w.worksName ?? '',
        meta: metaParts.join(' • '),
        thumb: w.thumbnailUrl ?? '',
        rating: w.rating ?? 0,
      }
    })
  }, [data])

  const { ref, inView } = useInView({ threshold: 0 })

  useEffect(() => {
    if (!inView) return
    if (!hasNextPage) return
    if (isFetchingNextPage) return
    fetchNextPage()
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const goResult = (raw: string) => {
    const k = raw.replace(/^#/, '').trim()
    if (!k) return
    router.push(`/library/search/result?keyword=${encodeURIComponent(k)}`)
  }

  return (
    <main className="min-h-screen bg-white">
      <SearchBar
        placeholder="좋아하는 작품/작가를 검색하세요"
        defaultKeyword={keyword}
        onSearchClick={goResult}
        backHref="/library/search"
      />

      {keyword.length === 0 ? (
        <div className="px-4 py-10 body-2 text-gray-400">
          검색어를 입력해 주세요.
        </div>
      ) : isError ? (
        <div className="px-4 py-10 body-2 text-gray-400">
          검색에 실패했어요.
        </div>
      ) : (
        <LibraryWorksListContent
          isLoading={isLoading}
          works={works}
          empty={
            <Warning
              title={`찾으시는 '검색어'는\n아직 서재에 추가되지 않았어요.`}
              buttonText="서재에 작품 추가하러 가기"
              onButtonClick={() => setShowReviewSheet(true)}
            />
          }
          onItemClick={(id) => router.push(`/library/works/${id}`)}
          infiniteScrollRef={ref}
          isFetchingNextPage={isFetchingNextPage}
        />
      )}
      {showReviewSheet && (
        <ReviewWriteBottomSheet onClose={() => setShowReviewSheet(false)} />
      )}
    </main>
  )
}
