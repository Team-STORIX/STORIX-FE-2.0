// src/app/profile/likes/LikesClient.tsx
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'

import TopBar from './components/topbar'
import SelectBar from './components/selectBar'
import NavBar from '@/components/common/NavBar'
import { useFavoritesStore } from '@/store/favorites.store'
import { apiClient } from '@/lib/api/axios-instance'

type Tab = 'works' | 'writers'

type LikedWork = {
  id: number
  title: string
  author: string
  kind: '웹툰' | '웹소설'
  rated?: { score: number } | null
}

type LikedWriter = {
  id: number
  name: string
  bio: string
}

async function postFavoriteWork(worksId: number) {
  await apiClient.post(`/api/v1/favorite/works/${worksId}`)
}
async function deleteFavoriteWork(worksId: number) {
  await apiClient.delete(`/api/v1/favorite/works/${worksId}`)
}
async function postFavoriteArtist(artistId: number) {
  await apiClient.post(`/api/v1/favorite/artist/${artistId}`)
}
async function deleteFavoriteArtist(artistId: number) {
  await apiClient.delete(`/api/v1/favorite/artist/${artistId}`)
}

export default function LikesClient() {
  const sp = useSearchParams()
  const tab: Tab = (sp.get('tab') as Tab) ?? 'works'
  const router = useRouter()

  // ✅ 전역 store
  const favoriteWorkIds = useFavoritesStore((s) => s.favoriteWorkIds)
  const favoriteArtistIds = useFavoritesStore((s) => s.favoriteArtistIds)

  const addFavoriteWork = useFavoritesStore((s) => s.addFavoriteWork)
  const removeFavoriteWork = useFavoritesStore((s) => s.removeFavoriteWork)
  const addFavoriteArtist = useFavoritesStore((s) => s.addFavoriteArtist)
  const removeFavoriteArtist = useFavoritesStore((s) => s.removeFavoriteArtist)

  // ✅ 더미 마스터 데이터(목록 표시용) — "보이게"만 만드는 목적
  const worksSeed: LikedWork[] = useMemo(
    () => [
      {
        id: 1,
        title: '상수리 나무 아래',
        author: '서말',
        kind: '웹툰',
        rated: { score: 4.5 },
      },
      {
        id: 2,
        title: '전지적독자시점',
        author: '싱숑',
        kind: '웹소설',
        rated: null,
      },
      {
        id: 3,
        title: '재혼황후',
        author: '히어리',
        kind: '웹툰',
        rated: { score: 5 },
      },
      {
        id: 4,
        title: '나 혼자만 레벨업',
        author: '추공',
        kind: '웹소설',
        rated: null,
      },
      {
        id: 5,
        title: '화산귀환',
        author: '비가',
        kind: '웹소설',
        rated: { score: 4.8 },
      },
      {
        id: 6,
        title: '나노마신',
        author: '한중월야',
        kind: '웹소설',
        rated: null,
      },
      { id: 7, title: '여신강림', author: '야옹이', kind: '웹툰', rated: null },
      {
        id: 8,
        title: '외모지상주의',
        author: '박태준',
        kind: '웹툰',
        rated: null,
      },
      { id: 9, title: '신의 탑', author: 'SIU', kind: '웹툰', rated: null },
      {
        id: 10,
        title: '유미의 세포들',
        author: '이동건',
        kind: '웹툰',
        rated: null,
      },
      {
        id: 11,
        title: '고수',
        author: '문정후',
        kind: '웹툰',
        rated: { score: 4.2 },
      },
      {
        id: 12,
        title: '달빛조각사',
        author: '남희성',
        kind: '웹소설',
        rated: null,
      },
    ],
    [],
  )

  const writersSeed: LikedWriter[] = useMemo(
    () => [
      { id: 80, name: 'hi', bio: '실제 작가 계정(임시 소개)' },
      { id: 88, name: '아지', bio: '실제 작가 계정(임시 소개)' },
      { id: 101, name: '서말', bio: '감정선을 촘촘하게 그려요' },
      { id: 102, name: '싱숑', bio: '세계관 설계가 탄탄해요' },
      { id: 103, name: '히어리', bio: '캐릭터 케미 맛집' },
    ],
    [],
  )

  /**
   * ✅ 핵심
   * - 화면 목록은 “처음 들어왔을 때의 즐겨찾기 스냅샷(base)”로 고정
   * - 토글은 pending만 바꿔서 check/plus 즉시 전환
   * - 페이지 떠날 때 최종 pending을 store + API에 커밋
   */
  const [baseWorkIds, setBaseWorkIds] = useState<number[] | null>(null)
  const [baseArtistIds, setBaseArtistIds] = useState<number[] | null>(null)

  const [pendingWorkRemoved, setPendingWorkRemoved] = useState<Set<number>>(
    new Set(),
  )
  const [pendingWorkAdded, setPendingWorkAdded] = useState<Set<number>>(
    new Set(),
  )
  const [pendingArtistRemoved, setPendingArtistRemoved] = useState<Set<number>>(
    new Set(),
  )
  const [pendingArtistAdded, setPendingArtistAdded] = useState<Set<number>>(
    new Set(),
  )

  // 페이지 진입 시 base 스냅샷 고정
  useEffect(() => {
    if (baseWorkIds === null) setBaseWorkIds(favoriteWorkIds)
    if (baseArtistIds === null) setBaseArtistIds(favoriteArtistIds)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favoriteWorkIds, favoriteArtistIds])

  const works = useMemo(() => {
    const base = new Set(baseWorkIds ?? [])
    // ✅ base에 포함된 것만 “목록에” 보임 (중요)
    return worksSeed.filter((w) => base.has(w.id))
  }, [worksSeed, baseWorkIds])

  const writers = useMemo(() => {
    const base = new Set(baseArtistIds ?? [])
    return writersSeed.filter((w) => base.has(w.id))
  }, [writersSeed, baseArtistIds])

  const isWorkFavoriteEffective = (id: number) => {
    const baseFav = (baseWorkIds ?? favoriteWorkIds).includes(id)
    if (pendingWorkAdded.has(id)) return true
    if (pendingWorkRemoved.has(id)) return false
    return baseFav
  }

  const isArtistFavoriteEffective = (id: number) => {
    const baseFav = (baseArtistIds ?? favoriteArtistIds).includes(id)
    if (pendingArtistAdded.has(id)) return true
    if (pendingArtistRemoved.has(id)) return false
    return baseFav
  }

  const toggleWork = (id: number) => {
    const nowFav = isWorkFavoriteEffective(id)
    if (nowFav) {
      // check -> plus (제거 예약)
      setPendingWorkAdded((p) => {
        const n = new Set(p)
        n.delete(id)
        return n
      })
      setPendingWorkRemoved((p) => {
        const n = new Set(p)
        n.add(id)
        return n
      })
    } else {
      // plus -> check (제거 예약 취소 or 재추가 예약)
      setPendingWorkRemoved((p) => {
        const n = new Set(p)
        n.delete(id)
        return n
      })
      setPendingWorkAdded((p) => {
        const n = new Set(p)
        // base에 없었던 걸 체크로 만들었을 때만 add 예약인데,
        // 이 페이지는 "관심 목록" 페이지라 보통 base에 있는 것만 나오므로 사실상 거의 안 탐.
        // 그래도 안전하게 유지.
        const baseHas = (baseWorkIds ?? favoriteWorkIds).includes(id)
        if (!baseHas) n.add(id)
        return n
      })
    }
  }

  const toggleArtist = (id: number) => {
    const nowFav = isArtistFavoriteEffective(id)
    if (nowFav) {
      setPendingArtistAdded((p) => {
        const n = new Set(p)
        n.delete(id)
        return n
      })
      setPendingArtistRemoved((p) => {
        const n = new Set(p)
        n.add(id)
        return n
      })
    } else {
      setPendingArtistRemoved((p) => {
        const n = new Set(p)
        n.delete(id)
        return n
      })
      setPendingArtistAdded((p) => {
        const n = new Set(p)
        const baseHas = (baseArtistIds ?? favoriteArtistIds).includes(id)
        if (!baseHas) n.add(id)
        return n
      })
    }
  }

  // ✅ 언마운트 시 커밋
  const pendingRef = useRef({
    pendingWorkRemoved,
    pendingWorkAdded,
    pendingArtistRemoved,
    pendingArtistAdded,
  })

  useEffect(() => {
    pendingRef.current = {
      pendingWorkRemoved,
      pendingWorkAdded,
      pendingArtistRemoved,
      pendingArtistAdded,
    }
  }, [
    pendingWorkRemoved,
    pendingWorkAdded,
    pendingArtistRemoved,
    pendingArtistAdded,
  ])

  useEffect(() => {
    return () => {
      const {
        pendingWorkRemoved: wR,
        pendingWorkAdded: wA,
        pendingArtistRemoved: aR,
        pendingArtistAdded: aA,
      } = pendingRef.current

      // ✅ store 반영 → Preference/다른 페이지 즉시 일치
      wR.forEach((id) => removeFavoriteWork(id))
      wA.forEach((id) => addFavoriteWork(id))
      aR.forEach((id) => removeFavoriteArtist(id))
      aA.forEach((id) => addFavoriteArtist(id))

      // ✅ API best-effort (더미 workId는 400 날 수 있음)
      ;(async () => {
        for (const id of Array.from(wR)) {
          try {
            await deleteFavoriteWork(id)
          } catch (e) {
            console.error(e)
          }
        }
        for (const id of Array.from(wA)) {
          try {
            await postFavoriteWork(id)
          } catch (e) {
            console.error(e)
          }
        }
        for (const id of Array.from(aR)) {
          try {
            await deleteFavoriteArtist(id)
          } catch (e) {
            console.error(e)
          }
        }
        for (const id of Array.from(aA)) {
          try {
            await postFavoriteArtist(id)
          } catch (e) {
            console.error(e)
          }
        }
      })()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const hasData = tab === 'works' ? works.length > 0 : writers.length > 0

  return (
    <div className="relative w-full min-h-full pb-[169px] bg-white">
      <TopBar />
      <SelectBar />

      {hasData ? (
        <div>
          {tab === 'works' ? (
            <div>
              {works.map((w) => {
                const fav = isWorkFavoriteEffective(w.id)
                return (
                  <div
                    key={w.id}
                    className="px-4 py-3 flex items-center"
                    style={{
                      borderBottom: '1px solid var(--color-gray-100)',
                      background: 'var(--color-white)',
                      height: 107,
                    }}
                  >
                    <div className="w-[62px] h-[83px] bg-[var(--color-gray-200)] rounded flex-shrink-0" />

                    <div className="ml-3 flex-1 min-w-0">
                      <p className="body-1 text-[var(--color-black)] w-[210px] truncate">
                        {w.title}
                      </p>
                      <p className="mt-1 caption-1 text-[var(--color-gray-500)]">
                        {w.author} · {w.kind}
                      </p>

                      {w.rated ? (
                        <div className="mt-1 flex items-center">
                          <span
                            className="text-[10px] font-medium tracking-[0.2px] text-[var(--color-primary-main)]"
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
                            {w.rated.score}
                          </span>
                        </div>
                      ) : (
                        <div className="mt-1 h-[14px]" />
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleWork(w.id)}
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
                const fav = isArtistFavoriteEffective(wr.id)
                return (
                  <div
                    key={wr.id}
                    className="px-4 py-3 flex items-center"
                    style={{
                      borderBottom: '1px solid var(--color-gray-100)',
                      background: 'var(--color-white)',
                      height: 88,
                    }}
                  >
                    <div className="w-[64px] h-[64px] rounded-full bg-[var(--color-gray-200)] flex-shrink-0" />

                    <div className="ml-3 flex-1 min-w-0">
                      <p className="body-1 text-[var(--color-black)] truncate">
                        {wr.name}
                      </p>
                      <p className="mt-1 caption-1 text-[var(--color-gray-500)] truncate">
                        {wr.bio}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleArtist(wr.id)}
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
        className="mt-3 cursor-pointer hover:opacity-80  transition-opacity cursor-pointer"
        onClick={onClickCta}
        aria-label="검색으로 이동"
      >
        <Image src={ctaImg} alt="찾기" width={106} height={29} />
      </button>
    </div>
  )
}
