// src/app/feed/hooks/useFeedData.ts
'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import {
  getFeedBoards,
  type FeedBoardItem as AllFeedBoardItem,
} from '@/api/feed/readerFeed.api'
import {
  getFeedBoardsByWorksId,
  type FeedBoardItem as WorksFeedBoardItem,
} from '@/api/feed/readerWorksFeed.api'
import { toggleBoardLike } from '@/api/feed/readerBoard.api'

type Tab = 'works' | 'writers'

const FALLBACK_PROFILE = '/profile/profile-default.svg'

export const FEED_SNAPSHOT_KEY = 'storix_feed_snapshot_v1'
const SNAPSHOT_MAX_POSTS = 200

type FeedSnapshotV1 = {
  v: 1
  url: string
  tab: Tab
  pick: string
  scrollY: number
  posts: UIPost[]
  feedPage: number
  feedLast: boolean
  savedAt: number
}

export type UIPost = {
  id: number
  workId: string
  isWorksSelected: boolean
  isSpoiler: boolean

  profileImage: string
  nickname: string
  writerUserId: number

  isAuthorPost?: boolean
  user: { profileImage: string; nickname: string }
  createdAt: string

  work: {
    coverImage: string
    title: string
    author: string
    type: string
    genre: string
  }

  hashtags: string[]
  content: string
  isLiked: boolean
  likeCount: number
  commentCount: number
  images?: string[]
}

const mapToUIPost = (item: AllFeedBoardItem | WorksFeedBoardItem): UIPost => {
  const { profile, board, images, works } = item as any
  const isWorksSelected = board.isWorksSelected === true && works != null

  return {
    id: board.boardId,
    workId: isWorksSelected ? String(board.worksId) : '',
    isWorksSelected,

    isSpoiler: board.isSpoiler === true,

    profileImage: profile.profileImageUrl ?? FALLBACK_PROFILE,
    nickname: profile.nickName,
    writerUserId: profile.userId ?? board.userId,

    isAuthorPost: false,
    user: {
      profileImage: profile.profileImageUrl ?? FALLBACK_PROFILE,
      nickname: profile.nickName,
    },

    createdAt: board.lastCreatedTime,

    work: isWorksSelected
      ? {
          coverImage: works!.thumbnailUrl,
          title: works!.worksName,
          author: works!.artistName,
          type: works!.worksType,
          genre: works!.genre,
        }
      : { coverImage: '', title: '', author: '', type: '', genre: '' },

    hashtags: isWorksSelected ? (works!.hashtags ?? []) : [],
    content: board.content,
    isLiked: board.isLiked,
    likeCount: board.likeCount,
    commentCount: board.replyCount,

    images: (images ?? [])
      .slice()
      .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
      .map((x: any) => x.imageUrl),
  }
}

export function useFeedData() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const tab: Tab = searchParams.get('tab') === 'writers' ? 'writers' : 'works'
  const pick = searchParams.get('pick') ?? 'all'

  const mode = useMemo<'ALL' | 'WORKS'>(() => {
    return tab === 'works' && pick !== 'all' ? 'WORKS' : 'ALL'
  }, [tab, pick])

  const worksIdNumber = useMemo(() => {
    if (mode !== 'WORKS') return null
    const n = Number(pick)
    return Number.isFinite(n) ? n : null
  }, [mode, pick])

  const currentUrl = useMemo(() => {
    const qs = searchParams.toString()
    return qs ? `${pathname}?${qs}` : pathname
  }, [pathname, searchParams])

  // -------------------------
  // Feed state
  // -------------------------
  const [posts, setPosts] = useState<UIPost[]>([])
  const [feedPage, setFeedPage] = useState(0)
  const [feedLast, setFeedLast] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const fetchingRef = useRef(false)
  const nextPageRef = useRef(0)

  // -------------------------
  // 좋아요: pending을 ref로 관리
  // -------------------------
  const likePendingRef = useRef<Record<number, boolean>>({})

  const handleToggleLike = useCallback(async (post: UIPost) => {
    const boardId = post.id
    if (likePendingRef.current[boardId]) return

    const prevLiked = post.isLiked
    const prevCount = post.likeCount

    likePendingRef.current = { ...likePendingRef.current, [boardId]: true }

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== boardId) return p
        const nextLiked = !p.isLiked
        const nextCount = Math.max(0, p.likeCount + (nextLiked ? 1 : -1))
        return { ...p, isLiked: nextLiked, likeCount: nextCount }
      }),
    )

    try {
      const data = await toggleBoardLike(boardId)
      if (
        data &&
        typeof data.isLiked === 'boolean' &&
        typeof data.likeCount === 'number'
      ) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === boardId
              ? { ...p, isLiked: data.isLiked, likeCount: data.likeCount }
              : p,
          ),
        )
      }
    } catch {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === boardId
            ? { ...p, isLiked: prevLiked, likeCount: prevCount }
            : p,
        ),
      )
    } finally {
      const { [boardId]: _, ...rest } = likePendingRef.current
      likePendingRef.current = rest
    }
  }, [])

  const resetFeed = useCallback(() => {
    setPosts([])
    setFeedPage(0)
    setFeedLast(false)
    setErrorMsg(null)
    nextPageRef.current = 0
  }, [])

  const fetchFeedPage = useCallback(
    async (page: number) => {
      if (fetchingRef.current) return

      if (mode === 'WORKS' && worksIdNumber == null) {
        setErrorMsg('작품 선택 값이 올바르지 않습니다.')
        setFeedLast(true)
        return
      }

      fetchingRef.current = true
      setLoading(true)
      setErrorMsg(null)

      try {
        if (mode === 'ALL') {
          const res = await getFeedBoards({ page, sort: 'LATEST' })
          const mapped = (res.result.content ?? []).map(mapToUIPost)
          setPosts((prev) => (page === 0 ? mapped : [...prev, ...mapped]))
          setFeedLast(res.result.last)
          setFeedPage(page)
          nextPageRef.current = page + 1
          return
        }

        const res = await getFeedBoardsByWorksId({
          worksId: worksIdNumber!,
          page,
          sort: 'LATEST',
        })
        const mapped = (res.result.content ?? []).map(mapToUIPost)
        setPosts((prev) => (page === 0 ? mapped : [...prev, ...mapped]))
        setFeedLast(res.result.last)
        setFeedPage(page)
        nextPageRef.current = page + 1
      } catch {
        setErrorMsg('피드 불러오기에 실패했습니다. 네트워크/인증을 확인해주세요.')
      } finally {
        fetchingRef.current = false
        setLoading(false)
      }
    },
    [mode, worksIdNumber],
  )

  // -------------------------
  // 스냅샷 복원
  // -------------------------
  const restoredOnceRef = useRef(false)
  const restoreScrollYRef = useRef<number | null>(null)
  const restorePendingRef = useRef(false)

  const tryRestoreSnapshot = useCallback(() => {
    if (typeof window === 'undefined') return false

    try {
      const raw = sessionStorage.getItem(FEED_SNAPSHOT_KEY)
      if (!raw) return false

      const snap = JSON.parse(raw) as FeedSnapshotV1
      if (!snap || snap.v !== 1) return false
      if (Date.now() - snap.savedAt > 10 * 60 * 1000) return false

      const okByUrl = snap.url === currentUrl
      const okByTabPick = snap.tab === tab && snap.pick === pick
      if (!okByUrl && !okByTabPick) return false

      const safePosts = Array.isArray(snap.posts)
        ? snap.posts.slice(0, SNAPSHOT_MAX_POSTS)
        : []

      setPosts(safePosts)
      const p = typeof snap.feedPage === 'number' ? snap.feedPage : 0
      setFeedPage(p)
      setFeedLast(Boolean(snap.feedLast))
      setErrorMsg(null)
      nextPageRef.current = p + 1

      restoreScrollYRef.current =
        typeof snap.scrollY === 'number' ? snap.scrollY : 0
      restorePendingRef.current = true

      return true
    } catch {
      return false
    }
  }, [currentUrl, pick, tab])

  useEffect(() => {
    if (!restoredOnceRef.current) {
      restoredOnceRef.current = true
      const restored = tryRestoreSnapshot()
      if (restored) return
    }

    resetFeed()
    fetchFeedPage(0)
  }, [mode, worksIdNumber, tryRestoreSnapshot, resetFeed, fetchFeedPage])

  useEffect(() => {
    if (!restorePendingRef.current) return
    if (loading) return
    if (posts.length === 0) return

    const y = restoreScrollYRef.current ?? 0

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: y, left: 0, behavior: 'auto' })

        try {
          sessionStorage.removeItem(FEED_SNAPSHOT_KEY)
        } catch {}

        restorePendingRef.current = false
        restoreScrollYRef.current = null
      })
    })
  }, [posts.length, loading])

  // -------------------------
  // Infinite Scroll
  // -------------------------
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const loadMore = useCallback(() => {
    return fetchFeedPage(nextPageRef.current)
  }, [fetchFeedPage])

  useInfiniteScroll({
    target: sentinelRef,
    hasNextPage: !feedLast,
    isFetchingNextPage: loading,
    onLoadMore: loadMore,
    rootMargin: '300px',
    throttleMs: 500,
  })

  // -------------------------
  // 상세 이동 시 snapshot 저장
  // -------------------------
  const goDetailFromFeed = useCallback(
    (post: UIPost) => {
      if (typeof window !== 'undefined') {
        const qs = searchParams.toString()
        const url = qs ? `${pathname}?${qs}` : pathname

        const snap: FeedSnapshotV1 = {
          v: 1,
          url,
          tab,
          pick,
          scrollY: window.scrollY ?? 0,
          posts: posts.slice(0, SNAPSHOT_MAX_POSTS),
          feedPage,
          feedLast,
          savedAt: Date.now(),
        }

        try {
          sessionStorage.setItem(FEED_SNAPSHOT_KEY, JSON.stringify(snap))
        } catch {
          // 용량 초과 등은 무시
        }
      }

      router.push(`/feed/article/${post.id}`)
    },
    [feedLast, feedPage, pathname, pick, posts, router, searchParams, tab],
  )

  return {
    posts,
    setPosts,
    feedPage,
    feedLast,
    loading,
    errorMsg,
    sentinelRef,
    tab,
    pick,
    goDetailFromFeed,
    handleToggleLike,
  }
}
