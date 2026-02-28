// src/app/feed/FeedPageClient.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'

import Topbar from './components/topbar'
import HorizontalPicker, {
  type PickerItem,
} from './components/horizontalPicker'
import FeedList from './components/feedList'
import NavBar from '@/components/common/NavBar'

import { getFavoriteWorks } from '@/api/feed/readerFavoriteWorks.api'
import { useOpenMenu } from '@/hooks/useOpenMenu'
import { useReportFlow } from '@/hooks/useReportFlow'
import { useDeleteFlow } from '@/hooks/useDeleteFlow'
import ReportFlow from '@/components/common/report/ReportFlow'
import DeleteFlow from '@/components/common/delete/DeleteFlow'
import { useProfileStore } from '@/store/profile.store'
import { apiClient } from '@/api/axios-instance'

import { useFeedData } from './hooks/useFeedData'
export type { UIPost } from './hooks/useFeedData'
import type { UIPost } from './hooks/useFeedData'

type Tab = 'works' | 'writers'

// 게시글 신고 API
const reportBoard = async (boardId: number, reportedUserId: number) => {
  const res = await apiClient.post(
    `/api/v1/feed/reader/board/${boardId}/report`,
    { reportedUserId },
  )
  return res.data
}

// 게시글 삭제 API
const deleteBoard = async (boardId: number) => {
  const res = await apiClient.delete(`/api/v1/feed/reader/board/${boardId}`)
  return res.data
}

export default function FeedPageClient() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const returnTo = encodeURIComponent(
    `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`,
  )

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
  // Picker: 관심작품 목록
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
        setFavoriteWorks([
          { id: 'all', name: '전체' },
          ...content.map((w) => ({
            id: String(w.worksId),
            name: w.worksName,
            thumbnailUrl: w.thumbnailUrl,
          })),
        ])
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
  // Feed 데이터 (훅)
  // -------------------------
  const {
    posts,
    setPosts,
    loading,
    errorMsg,
    sentinelRef,
    goDetailFromFeed,
    handleToggleLike,
  } = useFeedData()

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
  // 메뉴/신고/삭제 Flow
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
              const worksId = Number.parseInt(post.workId ?? '', 10)
              if (!Number.isFinite(worksId) || worksId <= 0) return
              router.push(`/library/works/${worksId}?returnTo=${returnTo}`)
            }}
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
