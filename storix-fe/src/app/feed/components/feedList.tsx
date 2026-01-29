// src/app/feed/components/feedList.tsx
'use client'

import { useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
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

  //   FeedPageClient에서 내려줌
  menu: MenuController<number>

  currentUserId?: number

  onOpenReport: (post: UIPost) => void
  onOpenDelete: (post: UIPost) => void
  onToggleLike?: (post: UIPost) => void
  onClickWorksArrow?: (post: UIPost) => void

  // ✅ 추가: FeedPageClient에서 “상세 이동”을 제어하고 싶을 때(스크롤 복원 등)
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
  onClickDetail, // ✅ 추가
}: Props) {
  const router = useRouter()

  const filtered = useMemo(() => {
    if (pick === 'all') return posts
    if (tab === 'works') return posts.filter((p) => p.workId === pick)
    return posts.filter((p) => p.work.author === pick)
  }, [posts, pick, tab])

  const goDetail = useCallback(
    (post: UIPost) => {
      // ✅ 외부에서 주입되면(스크롤 저장/복원 로직) 그걸 우선 사용
      if (onClickDetail) return onClickDetail(post)
      router.push(`/feed/article/${post.id}`)
    },
    [onClickDetail, router],
  )

  return (
    <div>
      {filtered.map((post) => {
        const hasWorks =
          !!post.workId &&
          !!post.work?.coverImage &&
          !!post.work?.title &&
          !!post.work?.author

        return (
          <PostCard
            key={post.id}
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
            onClickDetail={() => goDetail(post)} // ✅ 여기만 변경
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
        )
      })}
    </div>
  )
}
