// src/app/profile/likes/LikesClient.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
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
  rated?: { score: number } | null
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

export default function LikesClient() {
  const sp = useSearchParams()
  const tab: Tab = (sp.get('tab') as Tab) ?? 'works'
  const router = useRouter()

  // ✅ 더미 데이터(일단 보이게 넉넉히)
  const worksSeed: LikedWork[] = useMemo(
    () => [
      {
        id: 'seed-work-01',
        title: '상수리 나무 아래',
        author: '서말',
        kind: '웹툰',
        rated: { score: 4.5 },
      },
      {
        id: 'seed-work-02',
        title: '전지적독자시점',
        author: '싱숑',
        kind: '웹소설',
        rated: null,
      },
      {
        id: 'seed-work-03',
        title: '재혼황후',
        author: '히어리',
        kind: '웹툰',
        rated: { score: 5 },
      },
      {
        id: 'seed-work-04',
        title: '나 혼자만 레벨업',
        author: '추공',
        kind: '웹소설',
        rated: { score: 4.0 },
      },
      {
        id: 'seed-work-05',
        title: '마도조사',
        author: '묵향동후',
        kind: '웹소설',
        rated: null,
      },
      {
        id: 'seed-work-06',
        title: '여신강림',
        author: '야옹이',
        kind: '웹툰',
        rated: { score: 4.2 },
      },
      {
        id: 'seed-work-07',
        title: '그 해 우리는',
        author: '작가A',
        kind: '웹툰',
        rated: null,
      },
      {
        id: 'seed-work-08',
        title: '악역의 엔딩은 죽음뿐',
        author: '권겨을',
        kind: '웹소설',
        rated: { score: 4.8 },
      },
      {
        id: 'seed-work-09',
        title: '연애혁명',
        author: '232',
        kind: '웹툰',
        rated: null,
      },
      {
        id: 'seed-work-10',
        title: '나의 히어로 아카데미아',
        author: '호리코시',
        kind: '웹툰',
        rated: { score: 4.1 },
      },
    ],
    [],
  )

  const writersSeed: LikedWriter[] = useMemo(
    () => [
      { id: 'seed-writer-01', name: '서말', bio: '감정선을 촘촘하게 그려요' },
      { id: 'seed-writer-02', name: '싱숑', bio: '세계관 설계가 탄탄해요' },
      { id: 'seed-writer-03', name: '히어리', bio: '몰입감 있는 전개가 강점' },
      {
        id: 'seed-writer-04',
        name: '야옹이',
        bio: '현실 공감 포인트가 좋아요',
      },
      { id: 'seed-writer-05', name: '권겨을', bio: '로판 장르 맛집' },
      { id: 'seed-writer-06', name: '추공', bio: '시원한 성장 서사' },
      { id: 'seed-writer-07', name: '232', bio: '캐릭터가 살아있어요' },
      { id: 'seed-writer-08', name: '작가A', bio: '잔잔한 감성 스토리' },
    ],
    [],
  )

  // ✅ 로컬스토리지에 이미 반영된 "영구 제거" 목록
  const [removedIds, setRemovedIds] = useState<string[]>([])
  // ✅ 이 화면에서만 표시되는 "제거 예정" 목록(아이콘만 plus로 바뀜)
  const [pendingRemovedIds, setPendingRemovedIds] = useState<string[]>([])

  useEffect(() => {
    // ✅ 개발 중 “항상 더미가 보이게” 하고 싶으면 아래 2줄 잠깐 켜도 됨
    // localStorage.removeItem(LS_KEY)
    // setRemovedIds([])

    setRemovedIds(loadRemovedIds())
  }, [])

  const isRemovedPersisted = (id: string) => removedIds.includes(id)
  const isPendingRemoved = (id: string) => pendingRemovedIds.includes(id)

  // ✅ 체크/플러스 토글: 즉시 삭제 X, 화면에서는 plus만 표시
  const toggleLike = (id: string) => {
    setPendingRemovedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  // ✅ 화면 떠날 때 pending을 로컬스토리지에 반영
  useEffect(() => {
    return () => {
      if (pendingRemovedIds.length === 0) return
      const next = Array.from(new Set([...removedIds, ...pendingRemovedIds]))
      saveRemovedIds(next)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingRemovedIds, removedIds])

  // ✅ 목록에서 실제로 제거되는 건 "다음 방문부터": persisted만 필터링
  const works = useMemo(
    () => worksSeed.filter((w) => !isRemovedPersisted(w.id)),
    [worksSeed, removedIds],
  )

  const writers = useMemo(
    () => writersSeed.filter((w) => !isRemovedPersisted(w.id)),
    [writersSeed, removedIds],
  )

  const hasData = tab === 'works' ? works.length > 0 : writers.length > 0

  return (
    <div className="relative w-full min-h-full pb-[169px] bg-white">
      <TopBar />
      <SelectBar />

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
                    onClick={() => toggleLike(w.id)}
                    className="ml-3 transition-opacity hover:opacity-70 cursor-pointer"
                    aria-label="관심 작품 토글"
                  >
                    <Image
                      src={
                        isPendingRemoved(w.id)
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
                    className="ml-3 transition-opacity hover:opacity-70 cursor-pointer"
                    aria-label="관심 작가 토글"
                  >
                    <Image
                      src={
                        isPendingRemoved(wr.id)
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
