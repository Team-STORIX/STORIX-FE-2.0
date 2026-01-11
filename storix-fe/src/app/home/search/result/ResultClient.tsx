'use client'

import { useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import SearchBar from '@/components/common/SearchBar'
import Warning from '@/components/common/Warining'
import {
  useWorksSearchInfinite,
  useArtistsSearchInfinite,
} from '@/hooks/search/useSearch'

export default function SearchResultEmptyOnlyPage() {
  const router = useRouter()
  const sp = useSearchParams()
  const keyword = (sp.get('keyword') ?? '').trim()

  // keyword 없으면 검색 홈으로
  useEffect(() => {
    if (!keyword) router.replace('/home/search')
  }, [keyword, router])

  // ✅ 0페이지 요청해서 존재 여부만 판단(페이저 훅 그대로 사용)
  const worksPager = useWorksSearchInfinite(keyword, 'NAME')
  const artistsPager = useArtistsSearchInfinite(keyword)

  const worksReady = worksPager.meta !== null
  const artistsReady = artistsPager.meta !== null

  const worksHasAny = worksPager.items.length > 0
  const artistsHasAny = artistsPager.items.length > 0

  const isReady = worksReady && artistsReady
  const hasAny = worksHasAny || artistsHasAny

  // ✅ 결과가 하나라도 있으면 자동으로 works 화면으로 이동
  useEffect(() => {
    if (!keyword) return
    if (!isReady) return
    if (hasAny) {
      router.replace(
        `/home/search/result/works?keyword=${encodeURIComponent(keyword)}`,
      )
    }
  }, [keyword, isReady, hasAny, router])

  const goSearch = (raw: string) => {
    const k = raw.replace(/^#/, '').trim()
    if (!k) return
    router.push(`/home/search/result?keyword=${encodeURIComponent(k)}`)
  }

  // ✅ 준비 전엔 깜빡임 방지
  const showEmpty = useMemo(() => {
    if (!keyword) return false
    if (!isReady) return false
    return !hasAny
  }, [keyword, isReady, hasAny])

  return (
    <div className="flex w-full flex-col">
      <SearchBar onSearchClick={goSearch} />

      {showEmpty ? (
        <Warning
          title="검색 결과가 없습니다"
          description="다른 키워드로 검색해보세요."
          className="mt-20"
        />
      ) : (
        // 결과가 있으면 곧바로 replace 될 거라서 빈 컨테이너만
        <div className="px-4 py-10 text-[12px] text-gray-400">불러오는 중…</div>
      )}
    </div>
  )
}
