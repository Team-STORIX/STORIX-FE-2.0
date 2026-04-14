// src/components/home/search/SearchResultTopicRoomTab.tsx
'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Warning from '@/components/common/Warining'
import TopicRoomSearchList from '@/components/topicroom/TopicRoomSearchList'
import { useTopicRoomSearchInfinite } from '@/hooks/search/useSearch'
import { useJoinTopicRoom } from '@/hooks/topicroom/useJoinTopicRoom'
import { formatTopicRoomSubtitle } from '@/lib/api/topicroom/formatTopicRoomSubtitle'
import { formatTimeAgo } from '@/lib/utils/formatTimeAgo'
import type {
  TopicRoomSort,
  SearchWorksType,
  SearchGenre,
} from '@/lib/api/search/search.schema'

type Props = {
  keyword: string
  sort: TopicRoomSort
  worksTypes: SearchWorksType[]
  genres: SearchGenre[]
}

export default function SearchResultTopicRoomTab({
  keyword,
  sort,
  worksTypes,
  genres,
}: Props) {
  const router = useRouter()
  const pager = useTopicRoomSearchInfinite(keyword, sort, worksTypes, genres)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  // infinite scroll
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
    hasNextRef.current = pager.hasNext
  }, [pager.hasNext])

  useEffect(() => {
    fetchingRef.current = pager.isFetching
  }, [pager.isFetching])

  useEffect(() => {
    if (!keyword) return
    const el = loadMoreRef.current
    const root = scrollRootRef.current
    if (!el || !root) return

    const obs = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        if (lockRef.current) return
        if (!hasNextRef.current) return
        if (fetchingRef.current) return

        lockRef.current = true
        pager.requestNext()
        setTimeout(() => {
          lockRef.current = false
        }, 250)
      },
      { root, rootMargin: '200px', threshold: 0 },
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [keyword, pager])

  // join logic
  const joinMut = useJoinTopicRoom()
  const pendingJoinRef = useRef<{ roomId: number; worksName: string } | null>(
    null,
  )

  const pushToRoom = (roomId: number, worksName: string) => {
    router.push(
      `/home/topicroom/${roomId}?worksName=${encodeURIComponent(worksName ?? '')}`,
    )
  }

  useEffect(() => {
    if (!joinMut.isSuccess) return
    const pending = pendingJoinRef.current
    if (!pending) return
    pendingJoinRef.current = null
    pushToRoom(pending.roomId, pending.worksName)
  }, [joinMut.isSuccess])

  const handleItemClick = (id: number | string) => {
    const found = pager.items.find((x) => String(x.topicRoomId) === String(id))
    if (!found) return
    const roomId = Number(found.topicRoomId)
    const worksName = found.worksName ?? ''
    if (!Number.isFinite(roomId) || roomId <= 0) return

    if (found.isJoined) {
      pushToRoom(roomId, worksName)
      return
    }
    if (joinMut.isPending) return
    pendingJoinRef.current = { roomId, worksName }
    joinMut.mutate(roomId)
  }

  const listItems = pager.items.map((r) => ({
    id: r.topicRoomId,
    roomId: r.topicRoomId,
    thumbnail: r.thumbnailUrl ?? '/home/topicroom/sample/topicroom-2.webp',
    title: r.topicRoomName,
    subtitle: formatTopicRoomSubtitle(r.worksType, r.worksName),
    memberCount: r.activeUserNumber ?? 0,
    timeAgo: formatTimeAgo(r.lastChatTime),
    worksName: r.worksName,
    isJoined: !!r.isJoined,
  }))

  const isEmpty = pager.items.length === 0 && pager.meta !== null

  if (pager.meta === null) {
    return (
      <div className="px-4 py-10 body-2 text-gray-400">불러오는 중…</div>
    )
  }

  if (pager.error) {
    return (
      <div className="px-4 py-10 body-2 text-gray-400">검색에 실패했어요.</div>
    )
  }

  if (isEmpty) {
    return (
      <Warning
        title="검색 결과가 없어요.."
        description="대신 이런 검색어는 어때요?"
        className="mt-48"
      />
    )
  }

  return (
    <>
      <TopicRoomSearchList list={listItems} onItemClick={handleItemClick} />
      <div ref={loadMoreRef} className="h-6 w-full" />
    </>
  )
}
