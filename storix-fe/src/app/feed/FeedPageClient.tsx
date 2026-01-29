// src/app/feed/FeedPageClient.tsx
'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import Topbar from './components/topbar'
import HorizontalPicker, { PickerItem } from './components/horizontalPicker'
import FeedList from './components/feedList'
import NavBar from '@/components/common/NavBar'

import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import {
  getFeedBoards,
  type FeedBoardItem as AllFeedBoardItem,
} from '@/api/feed/readerFeed.api'
import { toggleBoardLike } from '@/api/feed/readerBoard.api'

// ✅ NEW: 관심작품 picker API
import { getFavoriteWorks } from '@/api/feed/readerFavoriteWorks.api'
// ✅ NEW: worksId 전용 피드 API
import {
  getFeedBoardsByWorksId,
  type FeedBoardItem as WorksFeedBoardItem,
} from '@/api/feed/readerWorksFeed.api'

// ✅ menu + flows + api
import { useOpenMenu } from '@/hooks/useOpenMenu'
import { useReportFlow } from '@/hooks/useReportFlow'
import { useDeleteFlow } from '@/hooks/useDeleteFlow'
import ReportFlow from '@/components/common/report/ReportFlow'
import DeleteFlow from '@/components/common/delete/DeleteFlow'
import { useProfileStore } from '@/store/profile.store'
import { apiClient } from '@/api/axios-instance'
import axios from 'axios'

type Tab = 'works' | 'writers'

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

const FALLBACK_PROFILE = '/profile/profile-default.svg'

// ✅ 스크롤/피드상태 복원용 key
const FEED_SNAPSHOT_KEY = 'storix_feed_snapshot_v1'

// 너무 커지지 않게 저장 개수 제한
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

/** all-feed / works-feed 둘 다 같은 shape로 매핑 가능하게 */
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
      : {
          coverImage: '',
          title: '',
          author: '',
          type: '',
          genre: '',
        },

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

// ✅ 게시글 신고 API
const reportBoard = async (boardId: number, reportedUserId: number) => {
  const res = await apiClient.post(
    `/api/v1/feed/reader/board/${boardId}/report`,
    {
      reportedUserId,
    },
  )
  return res.data
}

// ✅ 게시글 삭제 API
const deleteBoard = async (boardId: number) => {
  const res = await apiClient.delete(`/api/v1/feed/reader/board/${boardId}`)
  return res.data
}

export default function FeedPageClient() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const tab: Tab = searchParams.get('tab') === 'writers' ? 'writers' : 'works'
  const pick = searchParams.get('pick') ?? 'all'

  const replaceQuery = (next: { tab?: Tab; pick?: string }) => {
    const params = new URLSearchParams(searchParams.toString())
    if (next.tab) params.set('tab', next.tab)
    if (typeof next.pick === 'string') params.set('pick', next.pick)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const onChangeTab = (nextTab: Tab) =>
    replaceQuery({ tab: nextTab, pick: 'all' })
  const onPick = (id: string) => replaceQuery({ pick: id })

  // -------------------------
  // Picker: 관심작품 목록(서버)
  // -------------------------
  const [favoriteWorks, setFavoriteWorks] = useState<PickerItem[]>([
    { id: 'all', name: '전체' },
  ])
  const [favLoading, setFavLoading] = useState(false)

  useEffect(() => {
    let alive = true

    const run = async () => {
      setFavLoading(true)
      try {
        const res = await getFavoriteWorks({ page: 0, sort: 'LATEST' })
        if (!alive) return

        const content = res?.result?.content ?? []
        const items: PickerItem[] = [
          { id: 'all', name: '전체' },
          ...content.map((w) => ({
            id: String(w.worksId),
            name: w.worksName,
            thumbnailUrl: w.thumbnailUrl,
          })),
        ]

        setFavoriteWorks(items)
      } catch {
        if (!alive) return
        setFavoriteWorks([{ id: 'all', name: '전체' }])
      } finally {
        if (!alive) return
        setFavLoading(false)
      }
    }

    run()
    return () => {
      alive = false
    }
  }, [])

  // -------------------------
  // Feed: 무한스크롤(전체 vs worksId)
  // -------------------------
  const [posts, setPosts] = useState<UIPost[]>([])
  const [feedPage, setFeedPage] = useState(0)
  const [feedLast, setFeedLast] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [likePending, setLikePending] = useState<Record<number, boolean>>({})

  const handleToggleLike = useCallback(
    async (post: UIPost) => {
      const boardId = post.id
      if (likePending[boardId]) return

      const prevLiked = post.isLiked
      const prevCount = post.likeCount

      setLikePending((m) => ({ ...m, [boardId]: true }))
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
        setLikePending((m) => {
          const { [boardId]: _, ...rest } = m
          return rest
        })
      }
    },
    [likePending],
  )

  const mode = useMemo(() => {
    if (tab === 'works' && pick !== 'all') return 'WORKS' as const
    return 'ALL' as const
  }, [tab, pick])

  const worksIdNumber = useMemo(() => {
    if (mode !== 'WORKS') return null
    const n = Number(pick)
    return Number.isFinite(n) ? n : null
  }, [mode, pick])

  const resetFeed = useCallback(() => {
    setPosts([])
    setFeedPage(0)
    setFeedLast(false)
    setErrorMsg(null)
  }, [])

  const fetchFeedPage = useCallback(
    async (page: number) => {
      if (loading) return
      if (mode === 'WORKS' && worksIdNumber == null) {
        setErrorMsg('작품 선택 값이 올바르지 않습니다.')
        setFeedLast(true)
        return
      }

      setLoading(true)
      setErrorMsg(null)

      try {
        if (mode === 'ALL') {
          const res = await getFeedBoards({ page, sort: 'LATEST' })
          const content = res.result.content ?? []
          const mapped = content.map(mapToUIPost)

          setPosts((prev) => (page === 0 ? mapped : [...prev, ...mapped]))
          setFeedLast(res.result.last)
          setFeedPage(page)
          return
        }

        const res = await getFeedBoardsByWorksId({
          worksId: worksIdNumber!,
          page,
          sort: 'LATEST',
        })
        const content = res.result.content ?? []
        const mapped = content.map(mapToUIPost)

        setPosts((prev) => (page === 0 ? mapped : [...prev, ...mapped]))
        setFeedLast(res.result.last)
        setFeedPage(page)
      } catch {
        setErrorMsg(
          '피드 불러오기에 실패했습니다. 네트워크/인증을 확인해주세요.',
        )
      } finally {
        setLoading(false)
      }
    },
    [loading, mode, worksIdNumber],
  )

  // -------------------------
  // ✅ (핵심) 돌아왔을 때: posts/page/last + scrollY 복원
  // -------------------------
  const restoredOnceRef = useRef(false)
  const restoreScrollYRef = useRef<number | null>(null)
  const restorePendingRef = useRef(false)

  const currentUrl = useMemo(() => {
    const qs = searchParams.toString()
    return qs ? `${pathname}?${qs}` : pathname
  }, [pathname, searchParams])

  const tryRestoreSnapshot = useCallback(() => {
    if (typeof window === 'undefined') return false

    try {
      const raw = sessionStorage.getItem(FEED_SNAPSHOT_KEY)
      if (!raw) return false

      const snap = JSON.parse(raw) as FeedSnapshotV1
      if (!snap || snap.v !== 1) return false

      // 너무 오래된 건 무시(예: 10분)
      if (Date.now() - snap.savedAt > 10 * 60 * 1000) return false

      // URL이 같거나, 최소 tab/pick이 같으면 복원(둘 중 하나만 맞아도 되게)
      const okByUrl = snap.url === currentUrl
      const okByTabPick = snap.tab === tab && snap.pick === pick

      if (!okByUrl && !okByTabPick) return false

      // posts 복원 (너무 크면 컷)
      const safePosts = Array.isArray(snap.posts)
        ? snap.posts.slice(0, SNAPSHOT_MAX_POSTS)
        : []
      setPosts(safePosts)
      setFeedPage(typeof snap.feedPage === 'number' ? snap.feedPage : 0)
      setFeedLast(Boolean(snap.feedLast))
      setErrorMsg(null)

      restoreScrollYRef.current =
        typeof snap.scrollY === 'number' ? snap.scrollY : 0
      restorePendingRef.current = true

      return true
    } catch {
      return false
    }
  }, [currentUrl, pick, tab])

  // ✅ tab/pick(=mode/worksIdNumber) 변경 시: 첫 진입은 복원 시도 → 성공하면 fetch 생략
  useEffect(() => {
    if (!restoredOnceRef.current) {
      restoredOnceRef.current = true
      const restored = tryRestoreSnapshot()
      if (restored) return
    }

    resetFeed()
    fetchFeedPage(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, worksIdNumber])

  // ✅ posts가 그려진 뒤 스크롤 복원
  useEffect(() => {
    if (!restorePendingRef.current) return
    if (loading) return
    if (posts.length === 0) return

    const y = restoreScrollYRef.current ?? 0

    // 2프레임 정도 기다렸다가 스크롤 (레이아웃 안정화)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: y, left: 0, behavior: 'auto' })

        // ✅ 복원 완료: snapshot 삭제(다음에도 계속 강제복원되는 것 방지)
        try {
          sessionStorage.removeItem(FEED_SNAPSHOT_KEY)
        } catch {}

        restorePendingRef.current = false
        restoreScrollYRef.current = null
      })
    })
  }, [posts.length, loading, posts])

  // -------------------------
  // Infinite Scroll Hook
  // -------------------------
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useInfiniteScroll({
    target: sentinelRef,
    hasNextPage: !feedLast,
    isLoading: loading,
    onLoadMore: () => fetchFeedPage(feedPage + 1),
    rootMargin: '300px',
    throttleMs: 500,
  })

  // -------------------------
  // Picker items (탭별)
  // -------------------------
  const writersItems: PickerItem[] = useMemo(() => {
    const set = new Set<string>()
    for (const p of posts) {
      if (!p.isWorksSelected) continue
      if (p.work.author) set.add(p.work.author)
    }
    return [
      { id: 'all', name: '전체' },
      ...Array.from(set, (name) => ({ id: name, name })),
    ]
  }, [posts])

  const items = tab === 'works' ? favoriteWorks : writersItems

  // =========================================================
  // ✅ 메뉴/신고/삭제 Flow
  // =========================================================
  const me = useProfileStore((s) => s.me)
  const myUserId = me?.userId

  const menu = useOpenMenu<number>()

  const {
    isReportOpen,
    reportTarget,
    reportDoneOpen,
    openReportModal,
    closeReportModal,
    confirmReport,
    closeReportDone,
    toastOpen,
    toastMessage,
    closeToast,
  } = useReportFlow<UIPost>({
    onConfirm: async (target) => {
      try {
        const data = await reportBoard(target.id, target.writerUserId)
        if (data?.isSuccess === false)
          throw new Error(data?.message ?? '신고에 실패했어요.')
        menu.close()
        return { status: 'ok' as const }
      } catch (e) {
        if (axios.isAxiosError(e) && e.response?.status === 400) {
          menu.close()
          return {
            status: 'duplicated' as const,
            message: '이미 신고한 게시글입니다.',
          }
        }
        throw e
      }
    },
    doneDurationMs: 1500,
    duplicatedMessage: '이미 신고한 게시글입니다.',
    toastDurationMs: 1500,
  })

  const {
    isDeleteOpen,
    deleteTarget,
    deleteDoneOpen,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
    closeDeleteDone,
  } = useDeleteFlow<UIPost>({
    onConfirm: async (target) => {
      const data = await deleteBoard(target.id)
      if (data?.isSuccess === false)
        throw new Error(data?.message ?? '삭제에 실패했어요.')
      setPosts((prev) => prev.filter((p) => p.id !== target.id))
      menu.close()
    },
    doneDurationMs: 1500,
  })

  // -------------------------
  // ✅ (핵심) 상세 이동 시 snapshot 저장 + push
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
          // 용량 초과 등은 무시하고 그냥 이동
        }
      }

      router.push(`/feed/article/${post.id}`)
    },
    [feedLast, feedPage, pathname, pick, posts, router, searchParams, tab],
  )

  return (
    <div className="relative w-full min-h-full pb-[169px] bg-white">
      <div className="sticky top-0 z-10 bg-white">
        <Topbar activeTab={tab} onChange={onChangeTab} />
      </div>

      {tab !== 'writers' && (
        <HorizontalPicker items={items} selectedId={pick} onSelect={onPick} />
      )}

      {tab === 'writers' ? (
        <div className="flex flex-col items-center" style={{ marginTop: 196 }}>
          <img
            src="/icons/big-star-pink.svg"
            alt=""
            width={100}
            height={100}
            draggable={false}
          />
          <div className="mt-[22px] text-center">
            <p className="heading-2 text-[var(--gray-900,#100F0F)]">
              오픈 준비 중이에요
            </p>
            <p className="heading-2 text-[var(--gray-900,#100F0F)]">
              조금만 기다려주세요
            </p>
          </div>
        </div>
      ) : (
        <>
          {tab === 'works' && favLoading && (
            <div
              className="px-4 py-2 text-[12px]"
              style={{ color: 'var(--color-gray-500)' }}
            >
              관심 작품 불러오는 중...
            </div>
          )}

          <FeedList
            tab={tab}
            pick={pick}
            posts={posts}
            currentUserId={myUserId}
            menu={menu}
            onOpenReport={(post) => {
              openReportModal(post)
              menu.close()
            }}
            onOpenDelete={(post) => {
              openDeleteModal(post)
              menu.close()
            }}
            onToggleLike={(post) => handleToggleLike(post)}
            onClickWorksArrow={(post) => {
              // TODO
            }}
            // ✅ 추가: 상세 이동을 FeedPageClient가 제어(=snapshot 저장)
            onClickDetail={(post: UIPost) => {
              goDetailFromFeed(post)
            }}
          />

          <div ref={sentinelRef} className="h-10" />

          {errorMsg && (
            <div
              className="px-4 py-3 text-[13px]"
              style={{ color: 'var(--color-gray-600)' }}
            >
              {errorMsg}
            </div>
          )}
          {loading && (
            <div
              className="px-4 py-3 text-[13px]"
              style={{ color: 'var(--color-gray-600)' }}
            >
              불러오는 중...
            </div>
          )}
        </>
      )}

      <ReportFlow<UIPost>
        isReportOpen={isReportOpen}
        reportTarget={reportTarget}
        onCloseReport={closeReportModal}
        onConfirmReport={confirmReport}
        reportDoneOpen={reportDoneOpen}
        onCloseDone={closeReportDone}
        getProfileImage={(t) => t.user.profileImage}
        getNickname={(t) => t.user.nickname}
        toastOpen={toastOpen}
        toastMessage={toastMessage}
        onCloseToast={closeToast}
      />

      <DeleteFlow<UIPost>
        isDeleteOpen={isDeleteOpen}
        deleteTarget={deleteTarget}
        onCloseDelete={closeDeleteModal}
        onConfirmDelete={confirmDelete}
        deleteDoneOpen={deleteDoneOpen}
        onCloseDone={closeDeleteDone}
        getProfileImage={(t) => t.user.profileImage}
        getNickname={(t) => t.user.nickname}
      />

      <NavBar active="feed" />
    </div>
  )
}
