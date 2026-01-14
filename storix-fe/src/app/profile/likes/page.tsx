// src/app/profile/likes/page.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

import Image from 'next/image'

import TopBar from './components/topbar'
import SelectBar from './components/selectBar'
import NavBar from '@/components/common/NavBar'

type Tab = 'works' | 'writers'

type LikedWork = {
  id: string
  title: string
  author: string
  kind: '웹툰' | '웹소설'
  rated?: {
    score: number
  } | null
}

type LikedWriter = {
  id: string
  name: string
  bio: string
}

const LS_KEY = 'likes_removed_ids_v1'

function loadRemovedIds(): string[] {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveRemovedIds(ids: string[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(ids))
}

export default function LikesPage() {
  const sp = useSearchParams()
  const tab: Tab = (sp.get('tab') as Tab) ?? 'works'
  const router = useRouter()

  // ✅ 더미 데이터(나중에 API로 교체)
  const worksSeed: LikedWork[] = useMemo(
    () => [
      {
        id: 'w1',
        title: '상수리 나무 아래',
        author: '서말',
        kind: '웹툰',
        rated: { score: 4.5 },
      },
      {
        id: 'w2',
        title: '전지적독자지시점 전독시 외전급으로 긴 제목 테스트',
        author: '싱숑',
        kind: '웹소설',
        rated: null, // 평가 안함
      },
      {
        id: 'w3',
        title: '재혼황후',
        author: '히어리',
        kind: '웹툰',
        rated: { score: 5 },
      },
    ],
    [],
  )

  const writersSeed: LikedWriter[] = useMemo(
    () => [
      { id: 'a1', name: '서말', bio: '감정선을 촘촘하게 그려요' },
      { id: 'a2', name: '나무', bio: '캐릭터 케미 맛집' },
      { id: 'a3', name: '싱숑', bio: '세계관 설계가 탄탄해요' },
    ],
    [],
  )

  // ✅ “제거된 항목” persisted 상태
  const [removedIds, setRemovedIds] = useState<string[]>([])

  useEffect(() => {
    setRemovedIds(loadRemovedIds())
  }, [])

  const isRemoved = (id: string) => removedIds.includes(id)

  const toggleLike = (id: string) => {
    setRemovedIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
      saveRemovedIds(next)
      return next
    })
  }

  // ✅ 표시용: removedIds에 포함된 건 목록에서 제거(요구사항)
  const works = useMemo(
    () => worksSeed.filter((w) => !isRemoved(w.id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [worksSeed, removedIds],
  )

  const writers = useMemo(
    () => writersSeed.filter((w) => !isRemoved(w.id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [writersSeed, removedIds],
  )

  const hasData = tab === 'works' ? works.length > 0 : writers.length > 0

  return (
    <div className="relative w-full min-h-full pb-[169px] bg-white">
      <div className="h-[56px]" />
      <TopBar />

      <SelectBar />

      {/* ✅ 내용 */}
      {hasData ? (
        <div>
          {tab === 'works' ? (
            <div>
              {works.map((w) => (
                <div
                  key={w.id}
                  className="px-4 py-3 flex items-center"
                  style={{
                    borderBottom: '1px solid var(--color-gray-100)',
                    background: 'var(--color-white)',
                    height: 107,
                  }}
                >
                  {/* 표지 */}
                  <div className="w-[62px] h-[83px] bg-[var(--color-gray-200)] rounded flex-shrink-0" />

                  <div className="ml-3 flex-1 min-w-0">
                    {/* 제목: 210px, ... */}
                    <p className="body-1 text-[var(--color-black)] w-[210px] truncate">
                      {w.title}
                    </p>

                    {/* 작가 · 웹툰/웹소설 */}
                    <p className="mt-1 caption-1 text-[var(--color-gray-500)]">
                      {w.author} · {w.kind}
                    </p>

                    {/* 평가 */}
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
                      // ✅ 평가 안했으면 자리 공백
                      <div className="mt-1 h-[14px]" />
                    )}
                  </div>

                  {/* 체크/플러스 토글 */}
                  <button
                    type="button"
                    onClick={() => toggleLike(w.id)}
                    className="ml-3 transition-opacity hover:opacity-70"
                    aria-label="관심 작품 토글"
                  >
                    <Image
                      src={
                        isRemoved(w.id)
                          ? '/profile/likes-plus.svg'
                          : '/profile/likes-check.svg'
                      }
                      alt="토글"
                      width={24}
                      height={24}
                    />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div>
              {writers.map((wr) => (
                <div
                  key={wr.id}
                  className="px-4 py-3 flex items-center"
                  style={{
                    borderBottom: '1px solid var(--color-gray-100)',
                    background: 'var(--color-white)',
                    height: 88,
                  }}
                >
                  {/* 작가 프로필 */}
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
                    onClick={() => toggleLike(wr.id)}
                    className="ml-3 transition-opacity hover:opacity-70"
                    aria-label="관심 작가 토글"
                  >
                    <Image
                      src={
                        isRemoved(wr.id)
                          ? '/profile/likes-plus.svg'
                          : '/profile/likes-check.svg'
                      }
                      alt="토글"
                      width={24}
                      height={24}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        // ✅ 빈 상태
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
        <Image src={ctaImg} alt="찾기" width={106} height={29} />
      </button>
    </div>
  )
}
