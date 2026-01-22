// src/app/profile/myActivity/components/myLikes.tsx
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import {
  getMyActivityLikes,
  type ActivityBoardItem,
} from '@/api/profile/readerActivity.api'
import BoardCard, {
  type BoardCardData,
} from '@/components/common/board/BoardCard'

export default function MyLikes() {
  const router = useRouter()

  // ✅ 무한스크롤 root/sentinel
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  // ✅ 상태
  const [items, setItems] = useState<ActivityBoardItem[]>([])
  const [page, setPage] = useState(0)
  const [isLast, setIsLast] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [initLoading, setInitLoading] = useState(true)

  const loadFirst = useCallback(async () => {
    setInitLoading(true)
    setIsLoading(true)
    setItems([])
    setPage(0)
    setIsLast(false)

    try {
      const res = await getMyActivityLikes({ page: 0, sort: 'LATEST' })
      setItems(res.content)
      setIsLast(res.last)
      setPage(0)
    } finally {
      setIsLoading(false)
      setInitLoading(false)
    }
  }, [])

  const loadMore = useCallback(async () => {
    if (isLoading || isLast) return
    const next = page + 1
    setIsLoading(true)

    try {
      const res = await getMyActivityLikes({ page: next, sort: 'LATEST' })
      setItems((prev) => [...prev, ...res.content])
      setIsLast(res.last)
      setPage(next)
    } finally {
      setIsLoading(false)
    }
  }, [isLast, isLoading, page])

  useEffect(() => {
    loadFirst()
  }, [loadFirst])

  // ✅ useInfiniteScroll 훅 시그니처에 맞게 수정
  useInfiniteScroll({
    root: scrollRef,
    target: sentinelRef,
    hasNextPage: !isLast,
    isLoading: isLoading,
    onLoadMore: loadMore,
    rootMargin: '200px',
  })

  if (initLoading) {
    return (
      <div
        className="px-4 py-8 body-2"
        style={{ color: 'var(--color-gray-400)' }}
      >
        불러오는 중...
      </div>
    )
  }

  if (!initLoading && items.length === 0) {
    return (
      <div
        className="px-4 py-8 body-2"
        style={{ color: 'var(--color-gray-400)' }}
      >
        아직 좋아요 누른 글이 없어요.
      </div>
    )
  }

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto">
      {items.map((it: ActivityBoardItem) => {
        const data: BoardCardData = {
          boardId: it.board.boardId,
          profile: {
            profileImageUrl: it.profile.profileImageUrl,
            nickName: it.profile.nickName,
          },
          board: {
            userId: it.board.userId,
            lastCreatedTime: it.board.lastCreatedTime,
            content: it.board.content,
            likeCount: it.board.likeCount,
            replyCount: it.board.replyCount,
            isLiked: it.board.isLiked,
          },
          images: it.images?.map((x) => ({
            imageUrl: x.imageUrl,
            sortOrder: x.sortOrder,
          })),
          works: it.works
            ? {
                thumbnailUrl: it.works.thumbnailUrl,
                worksName: it.works.worksName,
                artistName: it.works.artistName,
                worksType: it.works.worksType,
                genre: it.works.genre,
                hashtags: it.works.hashtags,
              }
            : null,
        }

        return (
          <BoardCard
            key={data.boardId}
            data={data}
            to={`/feed/article/${data.boardId}`}
          />
        )
      })}

      {/* sentinel */}
      <div ref={sentinelRef} style={{ height: 1 }} />

      {isLoading && (
        <div className="px-4 py-4" style={{ color: 'var(--color-gray-400)' }}>
          불러오는 중...
        </div>
      )}
    </div>
  )
}
