// src/app/feed/FeedPageClient.tsx
'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import Topbar from './components/topbar'
import HorizontalPicker, { PickerItem } from './components/horizontalPicker'
import FeedList from './components/feedList'
import NavBar from '@/components/common/NavBar'

import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { getFeedBoards, type FeedBoardItem } from '@/api/feed/readerFeed.api'

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

  // ✅ 핵심: 작품 선택 여부 (API board.isWorksSelected)
  isWorksSelected: boolean

  // ✅ useReportFlow(BaseReportTarget) 만족시키기 위해 존재
  profileImage: string
  nickname: string

  // ✅ 작성자 userId
  writerUserId: number

  isAuthorPost?: boolean
  user: { profileImage: string; nickname: string }
  createdAt: string

  // ✅ 작품 미선택 글이면 아래 값들은 빈 값으로 내려감(= FeedList에서 작품 영역 숨길 수 있게)
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

const mapToUIPost = (item: FeedBoardItem): UIPost => {
  const { profile, board, images, works } = item

  const isWorksSelected = board.isWorksSelected === true && works != null

  return {
    id: board.boardId,

    // ✅ 작품 미선택이면 workId를 빈 값으로 (picker/필터에서 자연스럽게 제외 가능)
    workId: isWorksSelected ? String(board.worksId) : '',

    // ✅ 핵심 플래그
    isWorksSelected,

    profileImage: profile.profileImageUrl ?? FALLBACK_PROFILE,
    nickname: profile.nickName,

    // ✅ 신고 대상 유저 id
    writerUserId: profile.userId ?? board.userId,

    isAuthorPost: false,
    user: {
      profileImage: profile.profileImageUrl ?? FALLBACK_PROFILE,
      nickname: profile.nickName,
    },

    createdAt: board.lastCreatedTime,

    // ✅ 작품 미선택이면 "기본값"으로 채우지 말고 '빈 값'으로 둔다
    //    (기본값을 채우면 작품 카드가 계속 렌더링되며, 지금 너가 겪는 문제가 딱 그거임)
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
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((x) => x.imageUrl),
  }
}

// ✅ 게시글 신고 API
const reportBoard = async (boardId: number, reportedUserId: number) => {
  const res = await apiClient.post(
    `/api/v1/feed/reader/board/${boardId}/report`,
    { reportedUserId },
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
  // API fetch (무한스크롤)
  // -------------------------
  const [posts, setPosts] = useState<UIPost[]>([])
  const [feedPage, setFeedPage] = useState(0)
  const [feedLast, setFeedLast] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const fetchFeedPage = useCallback(
    async (page: number) => {
      if (loading) return
      setLoading(true)
      setErrorMsg(null)

      try {
        const res = await getFeedBoards({ page, sort: 'LATEST' })
        const content = res.result.content ?? []
        const mapped = content.map(mapToUIPost)

        setPosts((prev) => (page === 0 ? mapped : [...prev, ...mapped]))
        setFeedLast(res.result.last)
        setFeedPage(page)
      } catch (e) {
        setErrorMsg(
          '피드 불러오기에 실패했습니다. 네트워크/인증을 확인해주세요.',
        )
      } finally {
        setLoading(false)
      }
    },
    [loading],
  )

  useEffect(() => {
    fetchFeedPage(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
  // Picker 목록
  // ✅ 작품 미선택 글은 picker에 포함시키지 않게
  // -------------------------
  const worksItems: PickerItem[] = useMemo(() => {
    const map = new Map<string, string>()
    for (const p of posts) {
      if (!p.isWorksSelected) continue
      if (p.workId && p.work.title) map.set(p.workId, p.work.title)
    }
    return [
      { id: 'all', name: '전체' },
      ...Array.from(map, ([id, name]) => ({ id, name })),
    ]
  }, [posts])

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

  const items = tab === 'works' ? worksItems : writersItems

  // =========================================================
  // ✅ 메뉴/신고/삭제 Flow
  // =========================================================
  const me = useProfileStore((s) => s.me)
  const myUserId = me?.userId

  const menu = useOpenMenu<number>()

  // 신고 flow (✅ 400이면 duplicated 토스트)
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

        // ✅ 백엔드가 200인데 isSuccess:false 를 줄 수도 있어서 방어
        if (data?.isSuccess === false) {
          throw new Error(data?.message ?? '신고에 실패했어요.')
        }

        menu.close()
        return { status: 'ok' as const }
      } catch (e) {
        // ✅ 중복신고(400) => 훅의 toast로 처리
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

  // 삭제 flow
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

      if (data?.isSuccess === false) {
        throw new Error(data?.message ?? '삭제에 실패했어요.')
      }

      // ✅ UI 목록에서 제거
      setPosts((prev) => prev.filter((p) => p.id !== target.id))

      menu.close()
    },
    doneDurationMs: 1500,
  })

  return (
    <div className="relative w-full min-h-full pb-[169px] bg-white">
      <div className="sticky top-0 z-10 bg-white">
        <Topbar activeTab={tab} onChange={onChangeTab} />
      </div>

      <HorizontalPicker items={items} selectedId={pick} onSelect={onPick} />

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
        onToggleLike={(post) => {
          // TODO: 좋아요 토글 API 연결 시 여기서 처리
        }}
        onClickWorksArrow={(post) => {
          router.push(`/library/works/${post.workId}`)
        }}
      />

      {/* ✅ sentinel */}
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

      {/* ✅ Flow UI 렌더 */}
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
