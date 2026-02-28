// src/store/likes.store.ts
'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type LikeState = {
  isLiked: boolean
  likeCount: number
}

type LikesStore = {
  postLikes: Record<number, LikeState>
  commentLikes: Record<number, LikeState>

  initPost: (postId: number, initial: LikeState) => void
  togglePostLike: (postId: number) => void

  initComment: (commentId: number, initial: LikeState) => void
  toggleCommentLike: (commentId: number) => void

  clearLikes: () => void
}

export const useLikesStore = create<LikesStore>()(
  persist(
    (set, get) => ({
      postLikes: {},
      commentLikes: {},

      initPost: (postId, initial) => {
        const { postLikes } = get()
        if (postLikes[postId]) return // 이미 초기화됨
        set({ postLikes: { ...postLikes, [postId]: initial } })
      },

      togglePostLike: (postId) => {
        const { postLikes } = get()
        const curr = postLikes[postId]
        if (!curr) return

        const nextLiked = !curr.isLiked
        const nextCount = Math.max(0, curr.likeCount + (nextLiked ? 1 : -1))

        set({
          postLikes: {
            ...postLikes,
            [postId]: { isLiked: nextLiked, likeCount: nextCount },
          },
        })
      },

      initComment: (commentId, initial) => {
        const { commentLikes } = get()
        if (commentLikes[commentId]) return
        set({ commentLikes: { ...commentLikes, [commentId]: initial } })
      },

      toggleCommentLike: (commentId) => {
        const { commentLikes } = get()
        const curr = commentLikes[commentId]
        if (!curr) return

        const nextLiked = !curr.isLiked
        const nextCount = Math.max(0, curr.likeCount + (nextLiked ? 1 : -1))

        set({
          commentLikes: {
            ...commentLikes,
            [commentId]: { isLiked: nextLiked, likeCount: nextCount },
          },
        })
      },

      clearLikes: () => set({ postLikes: {}, commentLikes: {} }),
    }),
    {
      name: 'likes-store',
      partialize: (s) => ({
        postLikes: s.postLikes,
        commentLikes: s.commentLikes,
      }),
    },
  ),
)
