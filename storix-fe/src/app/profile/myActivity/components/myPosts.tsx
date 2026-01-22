// src/app/profile/myActivity/components/myPosts.tsx
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import PostCard from '@/components/common/post/PostCard'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { useOpenMenu } from '@/hooks/useOpenMenu'

import { useDeleteFlow } from '@/hooks/useDeleteFlow'
import DeleteFlow from '@/components/common/delete/DeleteFlow'
import { useProfileStore } from '@/store/profile.store'
import {
  getMyActivityBoards,
  type ActivityBoardItem,
} from '@/api/profile/readerActivity.api'
import { apiClient } from '@/api/axios-instance'

const FALLBACK_PROFILE = '/profile/profile-default.svg'
const SORT: 'LATEST' = 'LATEST'

// ✅ 게시글 삭제 API (명세: DELETE /api/v1/feed/reader/board/{boardId})
const deleteBoard = async (boardId: number) => {
  const res = await apiClient.delete(`/api/v1/feed/reader/board/${boardId}`)
  return res.data
}

export default function MyPosts() {
  const router = useRouter()

  // ✅ 무한스크롤 root/sentinel
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const me = useProfileStore((s) => s.me)
  const myUserId = me?.userId

  // ✅ 점3개 메뉴
  const menu = useOpenMenu<number>()

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
      const res = await getMyActivityBoards({ page: 0, sort: SORT })
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
      const res = await getMyActivityBoards({ page: next, sort: SORT })
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

  // ✅ useInfiniteScroll 훅 시그니처에 맞게 수정 (enabled/onIntersect 제거)
  useInfiniteScroll({
    root: scrollRef,
    target: sentinelRef,
    hasNextPage: !isLast, // 다음 페이지 있냐
    isLoading: isLoading, // 로딩 중이냐
    onLoadMore: loadMore, // 더 불러오기
    rootMargin: '200px',
  })

  // ✅ 삭제 플로우 (MyComments랑 동일)
  const {
    isDeleteOpen,
    deleteTarget,
    deleteDoneOpen,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
    closeDeleteDone,
  } = useDeleteFlow<ActivityBoardItem>({
    onConfirm: async (target) => {
      const boardId = target.board.boardId
      const data = await deleteBoard(boardId)

      // ✅ 백엔드가 200 + isSuccess:false 로 실패를 줄 수도 있어서 방어
      if (data?.isSuccess === false) {
        throw new Error(data?.message ?? '삭제에 실패했어요.')
      }

      // ✅ UI 목록에서 제거
      setItems((prev) => prev.filter((x) => x.board.boardId !== boardId))

      // ✅ 메뉴 닫기
      menu.close()
    },
    doneDurationMs: 1500,
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
        아직 작성한 글이 없어요.
      </div>
    )
  }

  return (
    <>
      <div ref={scrollRef} className="h-full overflow-y-auto">
        {items.map((item) => {
          const boardId = item.board.boardId

          const images = (item.images ?? [])
            .slice()
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((x) => x.imageUrl)

          return (
            <PostCard
              key={boardId}
              variant="list"
              boardId={boardId}
              writerUserId={item.profile.userId}
              profileImageUrl={item.profile.profileImageUrl ?? FALLBACK_PROFILE}
              nickName={item.profile.nickName}
              createdAt={item.board.lastCreatedTime}
              content={item.board.content}
              images={images}
              works={
                item.works
                  ? {
                      thumbnailUrl: item.works.thumbnailUrl,
                      worksName: item.works.worksName,
                      artistName: item.works.artistName,
                      worksType: item.works.worksType,
                      genre: item.works.genre,
                      hashtags: item.works.hashtags ?? [],
                    }
                  : null
              }
              isLiked={item.board.isLiked}
              likeCount={item.board.likeCount}
              replyCount={item.board.replyCount}
              onClickDetail={() => router.push(`/feed/article/${boardId}`)}
              onToggleLike={() => {
                // (내 활동 글 목록에서 좋아요 토글 필요하면 여기 API 연결)
              }}
              onOpenReport={() => {
                // 내 글 목록이므로 사실 report는 안 뜨는 게 일반적
                menu.close()
              }}
              onOpenDelete={() => {
                openDeleteModal(item)
                menu.close()
              }}
              isMenuOpen={menu.openId === boardId}
              onToggleMenu={() => menu.toggle(boardId)}
              menuRef={menu.bindRef(boardId)}
              onClickWorksArrow={() => router.push('/feed')}
            />
          )
        })}

        {/* ✅ sentinel */}
        <div ref={sentinelRef} style={{ height: 1 }} />

        {isLoading && (
          <div className="px-4 py-4" style={{ color: 'var(--color-gray-400)' }}>
            불러오는 중...
          </div>
        )}
      </div>

      {/* ✅ 삭제 모달/토스트 (MyComments와 동일) */}
      <DeleteFlow<ActivityBoardItem>
        isDeleteOpen={isDeleteOpen}
        deleteTarget={deleteTarget}
        onCloseDelete={closeDeleteModal}
        onConfirmDelete={confirmDelete}
        deleteDoneOpen={deleteDoneOpen}
        onCloseDone={closeDeleteDone}
        getProfileImage={(t) => t.profile.profileImageUrl ?? FALLBACK_PROFILE}
        getNickname={(t) => t.profile.nickName}
      />
    </>
  )
}
