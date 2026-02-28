// src/app/feed/components/feedList.tsx
'use client'

import { useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useWindowVirtualizer } from '@tanstack/react-virtual'
import type { UIPost } from '../FeedPageClient'
import PostCard from '@/components/common/post/PostCard'

type Tab = 'works' | 'writers'

type MenuController<T extends number | string> = {
  openId: T | null
  bindRef: (id: T) => (el: HTMLDivElement | null) => void
  toggle: (id: T) => void
  close: () => void
}

type Props = {
  tab: Tab
  pick: string
  posts: UIPost[]
  menu: MenuController<number>
  currentUserId?: number
  onOpenReport: (post: UIPost) => void
  onOpenDelete: (post: UIPost) => void
  onToggleLike?: (post: UIPost) => void
  onClickWorksArrow?: (post: UIPost) => void
  onClickDetail?: (post: UIPost) => void
}

export default function FeedList({
  tab,
  pick,
  posts,
  menu,
  currentUserId,
  onOpenReport,
  onOpenDelete,
  onToggleLike,
  onClickWorksArrow,
  onClickDetail,
}: Props) {
  const router = useRouter()

  const filtered = useMemo(() => {
    if (pick === 'all') return posts
    if (tab === 'works') return posts.filter((p) => p.workId === pick)
    return posts.filter((p) => p.work.author === pick)
  }, [posts, pick, tab])

  const goDetail = useCallback(
    (post: UIPost) => {
      if (onClickDetail) return onClickDetail(post)
      router.push(`/feed/article/${post.id}`)
    },
    [onClickDetail, router],
  )

  // ✅ window 스크롤 가상화
  const rowVirtualizer = useWindowVirtualizer({
    count: filtered.length,
    estimateSize: (index) => {
      // measureElement가 실제 높이로 교정하지만, 초기 추정치가 정확할수록 레이아웃 안정적
      const post = filtered[index]
      if (!post) return 400
      const hasImages = (post.images?.length ?? 0) > 0
      const hasWorks = post.isWorksSelected && !!post.work?.title
      // base(헤더+텍스트+하단) + 이미지 영역 + 작품 카드
      return 210 + (hasImages ? 210 : 0) + (hasWorks ? 90 : 0)
    },
    overscan: 6, // 화면 밖으로 미리 렌더할 개수 (부드러움)
  })

  const items = rowVirtualizer.getVirtualItems()

  return (
    <div
      style={{
        position: 'relative',
        height: rowVirtualizer.getTotalSize(),
      }}
    >
      {items.map((vRow) => {
        const post = filtered[vRow.index]
        if (!post) return null

        const hasWorks =
          !!post.workId &&
          !!post.work?.coverImage &&
          !!post.work?.title &&
          !!post.work?.author

        return (
          <div
            key={post.id}
            ref={rowVirtualizer.measureElement} // ✅ 실제 높이 측정
            data-index={vRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${vRow.start}px)`,
            }}
          >
            <PostCard
              variant="list"
              boardId={post.id}
              writerUserId={post.writerUserId}
              currentUserId={currentUserId}
              profileImageUrl={post.user.profileImage}
              nickName={post.user.nickname}
              createdAt={post.createdAt}
              content={post.content}
              images={post.images ?? []}
              isSpoiler={post.isSpoiler}
              works={
                hasWorks
                  ? {
                      thumbnailUrl: post.work.coverImage,
                      worksName: post.work.title,
                      artistName: post.work.author,
                      worksType: post.work.type,
                      genre: post.work.genre,
                      hashtags: post.hashtags ?? [],
                    }
                  : undefined
              }
              isLiked={post.isLiked}
              likeCount={post.likeCount}
              replyCount={post.commentCount}
              onClickDetail={() => goDetail(post)}
              onToggleLike={() => onToggleLike?.(post)}
              onOpenReport={() => {
                onOpenReport(post)
                menu.close()
              }}
              onOpenDelete={() => {
                onOpenDelete(post)
                menu.close()
              }}
              onClickWorksArrow={
                hasWorks ? () => onClickWorksArrow?.(post) : undefined
              }
              isMenuOpen={menu.openId === post.id}
              onToggleMenu={() => menu.toggle(post.id)}
              menuRef={menu.bindRef(post.id)}
            />
          </div>
        )
      })}
    </div>
  )
}
