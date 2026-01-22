// src/app/home/topicroom/search/ResultClient.tsx
'use client'

import { useMemo, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import SearchBar from '@/components/common/SearchBar'
import Warning from '@/components/common/Warining'
import TopicRoomSearchList from '@/components/topicroom/TopicRoomSearchList'
import { useTopicRoomSearchInfinite } from '@/hooks/topicroom/useTopicRoomSearchInfinite'
import { useJoinTopicRoom } from '@/hooks/topicroom/useJoinTopicRoom'
import { formatTopicRoomSubtitle } from '@/lib/api/topicroom/formatTopicRoomSubtitle'

export default function ResultClient() {
  const router = useRouter()
  const sp = useSearchParams()
  const keyword = (sp.get('keyword') ?? '').trim()

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTopicRoomSearchInfinite(keyword, 20)

  const formatTimeAgo = (iso?: string) => {
    if (!iso) return ''
    const t = new Date(iso).getTime()
    if (Number.isNaN(t)) return ''
    const diff = Date.now() - t
    if (diff < 60_000) return '방금 전'
    const min = Math.floor(diff / 60_000)
    if (min < 60) return `${min}분 전`
    const hour = Math.floor(min / 60)
    if (hour < 24) return `${hour}시간 전`
    const day = Math.floor(hour / 24)
    return `${day}일 전`
  }

  // isJoined 체크 + join 후 이동
  const joinMut = useJoinTopicRoom() // ✅
  const pendingJoinRef = useRef<{
    roomId: number
    worksName: string
  } | null>(null) // ✅

  const items = useMemo(() => {
    const pages = data?.pages ?? [] // ✅
    const flat = pages.flatMap((p) => p.content ?? []) // ✅

    return flat.map((r) => ({
      id: r.topicRoomId,
      roomId: r.topicRoomId, // ✅
      thumbnail: r.thumbnailUrl ?? '/image/sample/topicroom-2.webp',
      title: r.topicRoomName,
      subtitle: formatTopicRoomSubtitle(r.worksType, r.worksName), // ✅
      memberCount: r.activeUserNumber ?? 0,
      timeAgo: formatTimeAgo(r.lastChatTime),
      worksName: r.worksName,
      isJoined: !!r.isJoined, // ✅
    }))
  }, [data])

  useEffect(() => {
    if (!sentinelRef.current) return
    if (!hasNextPage) return

    const el = sentinelRef.current
    const io = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (!first?.isIntersecting) return
        if (isFetchingNextPage) return
        fetchNextPage() // ✅
      },
      { root: null, rootMargin: '200px', threshold: 0 },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]) // ✅

  const pushToRoom = (roomId: number, worksName: string) => {
    router.push(
      `/home/topicroom/${roomId}?worksName=${encodeURIComponent(worksName ?? '')}`, // ✅
    )
  }

  useEffect(() => {
    if (!joinMut.isSuccess) return
    const pending = pendingJoinRef.current
    if (!pending) return

    pendingJoinRef.current = null // ✅
    pushToRoom(pending.roomId, pending.worksName) // ✅
  }, [joinMut.isSuccess]) // ✅ onSuccess 금지(A안) -> useEffect로 처리

  const goSearch = (raw: string) => {
    const k = raw.replace(/^#/, '').trim()
    if (!k) return
    router.push(`/home/topicroom/search?keyword=${encodeURIComponent(k)}`) // ✅
  }

  const handleItemClick = (id: number | string) => {
    const found = items.find((x) => String(x.id) === String(id))
    if (!found) return

    const roomId = Number(found.roomId)
    const worksName = found.worksName ?? ''

    if (!Number.isFinite(roomId) || roomId <= 0) return

    // ✅ 이미 참여 중이면 바로 이동
    if (found.isJoined) {
      pushToRoom(roomId, worksName)
      return
    }

    // ✅ join 진행 중이면 중복 클릭 방지
    if (joinMut.isPending) return

    // ✅ join 후 성공하면 useEffect에서 이동
    pendingJoinRef.current = { roomId, worksName } // ✅
    joinMut.mutate(roomId) // ✅
  }

  // 무한스크롤 트리거
  const sentinelRef = useRef<HTMLDivElement | null>(null) // ✅

  return (
    <main className="min-h-screen bg-white">
      <SearchBar
        defaultKeyword={keyword}
        onSearchClick={goSearch}
        backHref="/home/topicroom"
      />

      {keyword.length === 0 ? (
        <div className="px-4 py-10 body-2 text-gray-400">
          검색어를 입력해 주세요.
        </div>
      ) : isError ? (
        <div className="px-4 py-10 body-2 text-gray-400">
          검색에 실패했어요.
        </div>
      ) : isLoading ? (
        <div className="px-4 py-10 body-2 text-gray-400">불러오는 중…</div>
      ) : items.length === 0 ? (
        <Warning
          title={'검색 결과가 없어요...'}
          description="대신 이런 검색어는 어때요?"
          buttonText="재혼황후"
          onButtonClick={() => goSearch('재혼황후')}
        />
      ) : (
        <>
          <TopicRoomSearchList list={items} onItemClick={handleItemClick} />
          <div ref={sentinelRef} className="h-1" /> {/* ✅ 무한스크롤 트리거 */}
          {isFetchingNextPage && (
            <div className="px-4 py-6 body-2 text-gray-400">불러오는 중…</div>
          )}{' '}
        </>
      )}
    </main>
  )
}
