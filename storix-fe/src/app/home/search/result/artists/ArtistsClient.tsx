// src/app/home/search/result/artists/page.tsx
'use client'

import { useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import SearchBar from '@/components/common/SearchBar'
import SearchResultArtists from '@/components/home/search/SearchResultArtists'
import SearchResultBottomNav from '@/components/home/search/SearchResultBottomNav'
import { useArtistsSearchInfinite } from '@/hooks/search/useSearch'

export default function SearchArtistsPage() {
  const router = useRouter()
  const sp = useSearchParams()
  const keyword = (sp.get('keyword') ?? '').trim()

  useEffect(() => {
    if (!keyword) router.replace('/home/search')
  }, [keyword, router])

  const artistsPager = useArtistsSearchInfinite(keyword)
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
    hasNextRef.current = artistsPager.hasNext
  }, [artistsPager.hasNext])

  useEffect(() => {
    fetchingRef.current = artistsPager.isFetching
  }, [artistsPager.isFetching])

  useEffect(() => {
    if (!keyword) return
    const el = loadMoreRef.current
    const root = scrollRootRef.current
    if (!el || !root) return

    const obs = new IntersectionObserver(
      (entries) => {
        const e = entries[0]
        if (!e?.isIntersecting) return
        if (lockRef.current) return
        if (!hasNextRef.current) return
        if (fetchingRef.current) return

        lockRef.current = true
        artistsPager.requestNext()
        setTimeout(() => {
          lockRef.current = false
        }, 250)
      },
      { root, rootMargin: '200px', threshold: 0 },
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [keyword, artistsPager])

  const goSearch = (raw: string) => {
    const k = raw.replace(/^#/, '').trim()
    if (!k) return
    router.push(`/home/search/result/artists?keyword=${encodeURIComponent(k)}`)
  }

  return (
    <div className="flex w-full flex-col">
      <SearchBar onSearchClick={goSearch} />

      <div className="px-4 pt-4 pb-24">
        <SearchResultArtists
          artists={artistsPager.items}
          isFetching={artistsPager.isFetching}
          loadMoreRef={loadMoreRef}
        />
      </div>

      {/* ✅ 하단 Nav(작품/작가 전환) */}
      <SearchResultBottomNav keyword={keyword} active="artists" />
    </div>
  )
}
