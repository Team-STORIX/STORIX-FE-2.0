// src/app/profile/likes/LikesClient.tsx
'use client'

import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'

import TopBar from './components/topbar'
import SelectBar from './components/selectBar'
import NavBar from '@/components/common/NavBar'
import { useFavoritesStore } from '@/store/favorites.store'

import {
  getReaderFavoriteArtists,
  getReaderFavoriteWorks,
  type FavoriteArtist,
  type FavoriteWork,
} from '@/api/profile/readerFavorites.api'

import {
  postFavoriteArtist,
  postFavoriteWork,
  deleteFavoriteArtist,
  deleteFavoriteWork,
} from '@/api/favorite/toggleFavorite.api'

type Tab = 'works' | 'writers'

export default function LikesClient() {
  const sp = useSearchParams()
  const tab: Tab = (sp.get('tab') as Tab) ?? 'works'
  const router = useRouter()

  // ✅ 전역 store (캐시/즉시 반영용)
  const storeAddWork = useFavoritesStore((s) => s.addFavoriteWork)
  const storeRemoveWork = useFavoritesStore((s) => s.removeFavoriteWork)
  const storeAddArtist = useFavoritesStore((s) => s.addFavoriteArtist)
  const storeRemoveArtist = useFavoritesStore((s) => s.removeFavoriteArtist)

  // ✅ API 기반 리스트 state (탭별)
  const [works, setWorks] = useState<FavoriteWork[]>([])
  const [writers, setWriters] = useState<FavoriteArtist[]>([])

  const [worksPage, setWorksPage] = useState(0)
  const [writersPage, setWritersPage] = useState(0)

  const [worksLast, setWorksLast] = useState(false)
  const [writersLast, setWritersLast] = useState(false)

  const [loading, setLoading] = useState(false)

  // ✅ 토글 pending (탭별)
  const [pendingWorkRemoved, setPendingWorkRemoved] = useState<Set<number>>(
    new Set(),
  )
  const [pendingArtistRemoved, setPendingArtistRemoved] = useState<Set<number>>(
    new Set(),
  )

  // ✅ pending 최신값 ref
  const pendingRef = useRef({
    pendingWorkRemoved,
    pendingArtistRemoved,
  })

  useEffect(() => {
    pendingRef.current = {
      pendingWorkRemoved,
      pendingArtistRemoved,
    }
  }, [pendingWorkRemoved, pendingArtistRemoved])

  // ✅ 커밋 중복 방지 (works/artist 별도 lock)
  const commitWorksLockRef = useRef(false)
  const commitArtistsLockRef = useRef(false)

  const commitWorks = useCallback(async () => {
    if (commitWorksLockRef.current) return
    commitWorksLockRef.current = true
    try {
      const wR = pendingRef.current.pendingWorkRemoved
      if (!wR || wR.size === 0) return

      wR.forEach((id) => storeRemoveWork(id))

      await Promise.allSettled(
        Array.from(wR).map((id) => deleteFavoriteWork(id)),
      )

      setWorks((prev) => prev.filter((w) => !wR.has(w.worksId)))
      setPendingWorkRemoved(new Set())
    } finally {
      commitWorksLockRef.current = false
    }
  }, [storeRemoveWork])

  const commitArtists = useCallback(async () => {
    if (commitArtistsLockRef.current) return
    commitArtistsLockRef.current = true
    try {
      const aR = pendingRef.current.pendingArtistRemoved
      if (!aR || aR.size === 0) return

      aR.forEach((id) => storeRemoveArtist(id))

      await Promise.allSettled(
        Array.from(aR).map((id) => deleteFavoriteArtist(id)),
      )

      setWriters((prev) => prev.filter((a) => !aR.has(a.artistId)))
      setPendingArtistRemoved(new Set())
    } finally {
      commitArtistsLockRef.current = false
    }
  }, [storeRemoveArtist])

  // ✅ 탭 변경을 저장 트리거로 사용 (이전 탭 커밋)
  const prevTabRef = useRef<Tab>(tab)
  useEffect(() => {
    const prev = prevTabRef.current
    if (prev === tab) return
    ;(async () => {
      try {
        if (prev === 'works') await commitWorks()
        else await commitArtists()
      } catch (e) {
        // console.error(e)
      } finally {
        prevTabRef.current = tab
      }
    })()
  }, [tab, commitWorks, commitArtists])

  // ✅ 언마운트 시 마지막 커밋
  useEffect(() => {
    return () => {
      void commitWorks()
      void commitArtists()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // -------------------------
  // API fetch (무한스크롤)
  // -------------------------
  const fetchWorksPage = useCallback(
    async (page: number) => {
      if (loading) return
      setLoading(true)
      try {
        const res = await getReaderFavoriteWorks({ page, sort: 'LATEST' })
        const content = res.result.content ?? []
        setWorks((prev) => (page === 0 ? content : [...prev, ...content]))
        setWorksLast(res.result.last)
        setWorksPage(page)
      } finally {
        setLoading(false)
      }
    },
    [loading],
  )

  const fetchWritersPage = useCallback(
    async (page: number) => {
      if (loading) return
      setLoading(true)
      try {
        const res = await getReaderFavoriteArtists({ page, sort: 'LATEST' })
        const content = res.result.content ?? []
        setWriters((prev) => (page === 0 ? content : [...prev, ...content]))
        setWritersLast(res.result.last)
        setWritersPage(page)
      } finally {
        setLoading(false)
      }
    },
    [loading],
  )

  useEffect(() => {
    if (tab === 'works') {
      if (works.length === 0) void fetchWorksPage(0)
    } else {
      if (writers.length === 0) void fetchWritersPage(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])

  // ✅ IntersectionObserver로 무한스크롤
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return

    const io = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (!entry?.isIntersecting) return
        if (loading) return

        if (tab === 'works') {
          if (!worksLast) void fetchWorksPage(worksPage + 1)
        } else {
          if (!writersLast) void fetchWritersPage(writersPage + 1)
        }
      },
      { root: null, rootMargin: '200px', threshold: 0.01 },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [
    tab,
    loading,
    worksLast,
    writersLast,
    worksPage,
    writersPage,
    fetchWorksPage,
    fetchWritersPage,
  ])

  // -------------------------
  // Toggle (아이콘만 즉시 반영)
  // -------------------------
  const isWorkFavoriteEffective = useCallback(
    (worksId: number) => {
      if (pendingWorkRemoved.has(worksId)) return false
      return true
    },
    [pendingWorkRemoved],
  )

  const isArtistFavoriteEffective = useCallback(
    (artistId: number) => {
      if (pendingArtistRemoved.has(artistId)) return false
      return true
    },
    [pendingArtistRemoved],
  )

  const toggleWork = (worksId: number) => {
    const nowFav = isWorkFavoriteEffective(worksId)
    if (nowFav) {
      setPendingWorkRemoved((p) => {
        const n = new Set(p)
        n.add(worksId)
        return n
      })
    } else {
      setPendingWorkRemoved((p) => {
        const n = new Set(p)
        n.delete(worksId)
        return n
      })
    }
  }

  const toggleArtist = (artistId: number) => {
    const nowFav = isArtistFavoriteEffective(artistId)
    if (nowFav) {
      setPendingArtistRemoved((p) => {
        const n = new Set(p)
        n.add(artistId)
        return n
      })
    } else {
      setPendingArtistRemoved((p) => {
        const n = new Set(p)
        n.delete(artistId)
        return n
      })
    }
  }

  const hasData = useMemo(() => {
    return tab === 'works' ? works.length > 0 : writers.length > 0
  }, [tab, works.length, writers.length])

  return (
    <div className="relative w-full min-h-full pb-[169px] bg-white">
      <TopBar />
      <SelectBar />

      {hasData ? (
        <div>
          {tab === 'works' ? (
            <div>
              {works.map((w) => {
                const fav = isWorkFavoriteEffective(w.worksId)
                return (
                  <div
                    key={w.worksId}
                    className="px-4 py-3 flex items-center"
                    style={{
                      borderBottom: '1px solid var(--color-gray-100)',
                      background: 'var(--color-white)',
                      height: 107,
                    }}
                  >
                    <div className="w-[62px] h-[83px] bg-[var(--color-gray-200)] rounded flex-shrink-0 overflow-hidden relative">
                      {w.thumbnailUrl ? (
                        <Image
                          src={w.thumbnailUrl}
                          alt={w.worksName}
                          fill
                          sizes="62px"
                          className="object-cover"
                        />
                      ) : null}
                    </div>

                    <div className="ml-3 flex-1 min-w-0">
                      {/* 제목 */}
                      <p className="body-1 text-[var(--color-black)] w-[210px] truncate">
                        {w.worksName}
                      </p>

                      {/* ✅ 제목 ↔ 작가 줄: 4px (mt-1) / ✅ 작가 줄: 14px 확정 (caption-1 제거) */}
                      <p className="mt-1 body-2 text-[var(--color-gray-500)]">
                        {w.artistName} · {w.worksType}
                      </p>

                      {w.isReviewed ? (
                        // ✅ 작가 줄 ↔ 평가함: 4px (mt-1)
                        <div className="mt-1 flex items-center">
                          <span
                            className="text-[12px] font-medium tracking-[0.2px] text-[var(--color-primary-main)]"
                            style={{ fontFamily: 'SUIT', lineHeight: '138%' }}
                          >
                            평가함
                          </span>
                          <span className="ml-1.5">
                            <Image
                              src="/icons/star.svg"
                              alt="별점"
                              width={9}
                              height={10}
                            />
                          </span>
                          <span className="ml-0.5 text-[10px] font-medium text-[var(--color-primary-main)]">
                            {w.rating ?? '-'}
                          </span>
                        </div>
                      ) : (
                        <div className="mt-1 h-[14px]" />
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleWork(w.worksId)}
                      className="ml-3 transition-opacity hover:opacity-70 cursor-pointer"
                      aria-label="관심 작품 토글"
                    >
                      <Image
                        src={
                          fav
                            ? '/profile/likes-check.svg'
                            : '/profile/likes-plus.svg'
                        }
                        alt="토글"
                        width={24}
                        height={24}
                      />
                    </button>
                  </div>
                )
              })}
            </div>
          ) : (
            <div>
              {writers.map((wr) => {
                const fav = isArtistFavoriteEffective(wr.artistId)
                return (
                  <div
                    key={wr.artistId}
                    className="px-4 py-3 flex items-center"
                    style={{
                      borderBottom: '1px solid var(--color-gray-100)',
                      background: 'var(--color-white)',
                      height: 88,
                    }}
                  >
                    <div className="w-[64px] h-[64px] rounded-full bg-[var(--color-gray-200)] flex-shrink-0 overflow-hidden relative">
                      {wr.profileImageUrl ? (
                        <Image
                          src={wr.profileImageUrl}
                          alt={wr.artistName}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : null}
                    </div>

                    <div className="ml-3 flex-1 min-w-0">
                      <p className="body-1 text-[var(--color-black)] truncate">
                        {wr.artistName}
                      </p>
                      <p className="mt-1 caption-1 text-[var(--color-gray-500)] truncate">
                        {wr.profileDescription}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleArtist(wr.artistId)}
                      className="ml-3 transition-opacity hover:opacity-70 cursor-pointer"
                      aria-label="관심 작가 토글"
                    >
                      <Image
                        src={
                          fav
                            ? '/profile/likes-check.svg'
                            : '/profile/likes-plus.svg'
                        }
                        alt="토글"
                        width={24}
                        height={24}
                      />
                    </button>
                  </div>
                )
              })}
            </div>
          )}

          <div ref={sentinelRef} className="h-1" />
        </div>
      ) : (
        <EmptyState tab={tab} onClickCta={() => router.push('/home/search')} />
      )}

      <NavBar active="profile" />
    </div>
  )
}

function EmptyState({ tab, onClickCta }: { tab: Tab; onClickCta: () => void }) {
  const title =
    tab === 'works'
      ? '아직 관심 작품 설정을\n하지 않았어요.'
      : '아직 관심 작가 설정을\n하지 않았어요.'
  const ctaImg =
    tab === 'works' ? '/profile/find-books.svg' : '/profile/find-writers.svg'

  return (
    <div className="flex flex-col items-center" style={{ marginTop: 148 }}>
      <Image src="/profile/warning.svg" alt="안내" width={100} height={100} />
      <h2
        className="mt-[22px] heading-2 text-[var(--color-gray-900)] text-center whitespace-pre-line"
        style={{ fontFamily: 'SUIT' }}
      >
        {title}
      </h2>
      <button
        type="button"
        className="mt-3 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={onClickCta}
        aria-label="검색으로 이동"
      >
        <Image src={ctaImg} alt="찾기" width={131} height={36} />
      </button>
    </div>
  )
}
