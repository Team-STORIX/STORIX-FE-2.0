// src/components/common/board/BoardCard.tsx
'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useOpenMenu } from '@/hooks/useOpenMenu'
import { useReportFlow } from '@/hooks/useReportFlow'
import { useDeleteFlow } from '@/hooks/useDeleteFlow'
import ReportFlow from '@/components/common/report/ReportFlow'
import DeleteFlow from '@/components/common/delete/DeleteFlow'
import { useProfileStore } from '@/store/profile.store'
import type { ReportConfirmOutcome } from '@/hooks/useReportFlow'

const FALLBACK_PROFILE = '/profile/profile-default.svg'

export type BoardCardData = {
  boardId: number
  profile: {
    profileImageUrl: string | null
    nickName: string
  }
  board: {
    userId: number
    lastCreatedTime: string
    content: string
    likeCount: number
    replyCount: number
    isLiked: boolean
    // ✅ NEW
    isSpoiler?: boolean
  }
  images?: { imageUrl: string; sortOrder: number }[]
  works?: null | {
    thumbnailUrl: string
    worksName: string
    artistName: string
    worksType: string
    genre: string
    hashtags: string[]
  }
}

type Props = {
  data: BoardCardData
  to?: string
  clickable?: boolean
  worksTo?: string
  onReportConfirm?: (args: {
    boardId: number
    reportedUserId: number
  }) => Promise<ReportConfirmOutcome> | ReportConfirmOutcome
  onToggleLike?: (boardId: number) => void | Promise<void>
  onDeleteConfirm?: (args: { boardId: number }) => Promise<void> | void
}

/**
 * ✅ 해시태그 1줄 제한:
 * - 컨테이너 너비 안에 "완전히 들어가는" 태그만 보여줌
 * - 중간에 잘릴 것 같은 태그는 아예 숨김
 */
function HashtagRowOneLine({ tags }: { tags: string[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const measureRef = useRef<HTMLDivElement | null>(null)
  const [visibleCount, setVisibleCount] = useState(tags.length)

  const recompute = () => {
    const container = containerRef.current
    const measure = measureRef.current
    if (!container || !measure) return

    const containerW = container.clientWidth
    const nodes = Array.from(measure.children) as HTMLElement[]

    let used = 0
    let count = 0
    const gap = 4

    for (let i = 0; i < nodes.length; i++) {
      const w = nodes[i].offsetWidth
      const next = count === 0 ? w : used + gap + w
      if (next <= containerW) {
        used = next
        count++
      } else {
        break
      }
    }

    setVisibleCount(count)
  }

  useEffect(() => {
    setVisibleCount(tags.length)
    requestAnimationFrame(recompute)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags.join('|')])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => recompute())
    ro.observe(el)
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const visibleTags = useMemo(
    () => tags.slice(0, visibleCount),
    [tags, visibleCount],
  )

  if (!tags.length) return null

  return (
    <div className="w-full max-w-full overflow-hidden" ref={containerRef}>
      <div className="inline-flex gap-1 whitespace-nowrap">
        {visibleTags.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className="shrink-0 px-2 py-[6px] rounded text-[10px] font-medium leading-[140%] tracking-[0.2px]
              border border-[var(--color-gray-100)] bg-[var(--color-gray-50)] text-[var(--color-gray-800)]"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* 측정용(화면 밖) */}
      <div
        ref={measureRef}
        className="absolute -left-[9999px] -top-[9999px] inline-flex gap-1 whitespace-nowrap pointer-events-none opacity-0"
        aria-hidden="true"
      >
        {tags.map((tag, index) => (
          <span
            key={`m-${tag}-${index}`}
            className="shrink-0 px-2 py-[6px] rounded text-[10px] font-medium leading-[140%] tracking-[0.2px]
              border border-[var(--color-gray-100)] bg-[var(--color-gray-50)] text-[var(--color-gray-800)]"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function BoardCard({
  data,
  to,
  clickable = true,
  worksTo = '/feed',
  onReportConfirm,
  onDeleteConfirm,
  onToggleLike,
}: Props) {
  const router = useRouter()
  const { boardId } = data
  const link = to ?? `/feed/article/${boardId}`

  const meProfile = useProfileStore((s) => s.me)
  const myUserId = meProfile?.userId
  const isMine = myUserId != null && data.board.userId === myUserId

  const menu = useOpenMenu<number>()

  const report = useReportFlow<{
    boardId: number
    reportedUserId: number
    profileImage: string
    nickname: string
  }>({
    onConfirm: async (t) => {
      return await onReportConfirm?.({
        boardId: t.boardId,
        reportedUserId: t.reportedUserId,
      })
    },
    doneDurationMs: 5000,
    toastDurationMs: 1500,
    duplicatedMessage: '이미 신고한 게시글입니다.',
  })

  const del = useDeleteFlow<{
    boardId: number
    profileImage: string
    nickname: string
  }>({
    onConfirm: async (t) => {
      await onDeleteConfirm?.({ boardId: t.boardId })
    },
    doneDurationMs: 5000,
  })

  const sortedImages =
    data.images
      ?.slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((x) => x.imageUrl) ?? []

  // ✅ 스포일러 상태(카드 단위)
  const [spoilerRevealed, setSpoilerRevealed] = useState(false)
  const isSpoilerActive = data.board.isSpoiler === true
  const isSpoilerHidden = isSpoilerActive && !spoilerRevealed
  const revealSpoiler = () => setSpoilerRevealed(true)

  return (
    <>
      <div
        className={[
          'relative',
          'py-5',
          clickable ? 'cursor-pointer hover:opacity-95 transition-opacity' : '',
        ].join(' ')}
        style={{
          borderBottom: '1px solid var(--color-gray-100)',
          backgroundColor: 'var(--color-white)',
        }}
        onClick={() => {
          if (!clickable) return
          router.push(link)
        }}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
        onKeyDown={(e) => {
          if (!clickable) return
          if (e.key === 'Enter' || e.key === ' ') router.push(link)
        }}
      >
        {/* 상단 프로필/메뉴 */}
        <div
          className="px-4 flex items-center justify-between h-[41px]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-[var(--color-gray-200)]">
              <Image
                src={data.profile.profileImageUrl ?? FALLBACK_PROFILE}
                alt="프로필"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col">
              <p
                className="text-[16px] font-medium leading-[140%]"
                style={{ color: 'var(--color-gray-900)' }}
              >
                {data.profile.nickName}
              </p>
              <p
                className="mt-[2px] text-[12px] font-medium leading-[140%]"
                style={{ color: 'var(--color-gray-300)' }}
              >
                {data.board.lastCreatedTime}
              </p>
            </div>
          </div>

          <div className="relative" ref={menu.bindRef(boardId)}>
            <button
              type="button"
              className="w-6 h-6 cursor-pointer transition-opacity hover:opacity-70"
              onClick={(e) => {
                e.stopPropagation()
                menu.toggle(boardId)
              }}
              aria-label="메뉴"
            >
              <Image
                src="/icons/menu-3dots.svg"
                alt="메뉴"
                width={24}
                height={24}
              />
            </button>

            {menu.openId === boardId && (
              <div
                className="absolute right-0 top-[30px] z-[999] bg-white rounded-[4px]"
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="block w-[96px] h-[36px] rounded-[4px] overflow-hidden"
                  style={{ boxShadow: '0 0 8px rgba(0,0,0,0.25)' }}
                  onClick={(e) => {
                    e.stopPropagation()

                    const profileImage =
                      data.profile.profileImageUrl ?? FALLBACK_PROFILE
                    const nickname = data.profile.nickName

                    if (isMine) {
                      del.openDeleteModal({ boardId, profileImage, nickname })
                    } else {
                      report.openReportModal({
                        boardId,
                        reportedUserId: data.board.userId,
                        profileImage,
                        nickname,
                      })
                    }

                    requestAnimationFrame(() => menu.close())
                  }}
                  aria-label={isMine ? '삭제하기' : '신고하기'}
                >
                  <img
                    src={
                      isMine
                        ? '/icons/delete-dropdown.svg'
                        : '/icons/comment-dropdown.svg'
                    }
                    alt={isMine ? '삭제하기' : '신고하기'}
                    width={96}
                    height={36}
                    className="block w-[96px] h-[36px] object-contain bg-white"
                    draggable={false}
                  />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ✅ 작품정보는 '절대 가리지 않음' (스포일러 영역 밖) */}
        {data.works && (
          <div className="mt-5 px-4" onClick={(e) => e.stopPropagation()}>
            <div
              className="p-3 rounded-xl flex gap-3"
              style={{
                border: '1px solid var(--color-gray-100)',
                backgroundColor: 'var(--color-white)',
              }}
            >
              <div className="w-[62px] h-[83px] rounded bg-[var(--color-gray-200)] flex-shrink-0 overflow-hidden relative">
                <Image
                  src={data.works.thumbnailUrl}
                  alt="표지"
                  fill
                  sizes="62px"
                  className="object-cover"
                />
              </div>

              <div className="flex w-full items-stretch min-w-0">
                <div className="flex flex-col justify-between min-w-0 w-full">
                  <p
                    className="text-[16px] font-medium leading-[140%] truncate"
                    style={{ color: 'var(--color-black)' }}
                  >
                    {data.works.worksName}
                  </p>

                  <p
                    className="text-[12px] font-medium leading-[140%]"
                    style={{ color: 'var(--color-gray-500)' }}
                  >
                    {data.works.artistName} · {data.works.worksType} ·{' '}
                    {data.works.genre}
                  </p>

                  <HashtagRowOneLine
                    tags={(data.works.hashtags ?? []).map((t) =>
                      t?.startsWith('#') ? t : `#${t}`,
                    )}
                  />
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(worksTo)
                  }}
                  className="ml-auto pl-3 flex items-center justify-center cursor-pointer transition-opacity hover:opacity-70 shrink-0"
                  aria-label="작품 상세 보기"
                >
                  <Image
                    src="/icons/icon-arrow-forward-small.svg"
                    alt="작품 상세"
                    width={24}
                    height={24}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ✅ 스포일러 적용 영역: 이미지 + 본문만 */}
        <div className="relative">
          <div className={isSpoilerHidden ? 'select-none' : ''}>
            {/* 이미지 */}
            {sortedImages.length > 0 && (
              <div className="mt-4 px-4">
                <div className="overflow-x-auto">
                  <div className="flex gap-3">
                    {sortedImages.slice(0, 3).map((src, idx) => (
                      <div
                        key={`${boardId}-img-${idx}`}
                        className="w-[236px] h-[236px] rounded-[12px] overflow-hidden flex-shrink-0"
                        style={{
                          border: '1px solid var(--color-gray-100)',
                          background: 'lightgray',
                        }}
                      >
                        <Image
                          src={src}
                          alt={`피드 이미지 ${idx + 1}`}
                          width={236}
                          height={236}
                          className={[
                            'w-full h-full object-cover',
                            isSpoilerHidden ? 'blur-md' : '',
                          ].join(' ')}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 본문 */}
            <div className="mt-3 px-4">
              <p
                className={[
                  'text-[14px] font-medium leading-[140%] line-clamp-3',
                  isSpoilerHidden ? 'blur-md' : '',
                ].join(' ')}
                style={{ color: 'var(--color-gray-800)' }}
              >
                {data.board.content}
              </p>
            </div>
          </div>

          {/* ✅ 스포일러 덮개: 이미지+본문까지만 덮음 */}
          {isSpoilerHidden && (
            <div
              className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer !shadow-none outline-none ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0"
              style={{
                boxShadow: 'none',
                filter: 'none',
                WebkitFilter: 'none',
                outline: 'none',
              }}
              onClick={(e) => {
                e.stopPropagation()
                revealSpoiler()
              }}
              onPointerDown={(e) => e.stopPropagation()}
              role="button"
              tabIndex={0}
              aria-label="스포일러 보기"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  revealSpoiler()
                }
              }}
            >
              {/* 배경 덮개 */}
              <div
                className="absolute inset-0 shadow-none"
                style={{
                  background: 'rgba(255,255,255,0.70)',
                  boxShadow: 'none',
                  filter: 'none',
                  WebkitFilter: 'none',
                }}
              />

              {/* 안내 박스 (그림자 완전 제거) */}
              <div
                className="relative px-4 py-3 rounded-[12px] text-center shadow-none"
                style={{
                  border: '1px solid var(--color-gray-100)',
                  background: 'var(--color-white)',
                  boxShadow: 'none',
                  filter: 'none',
                  WebkitFilter: 'none',
                }}
              >
                <p
                  className="text-[14px] font-semibold leading-[140%]"
                  style={{ color: 'var(--color-gray-900)' }}
                >
                  스포일러가 포함된 게시글입니다
                </p>
                <p
                  className="mt-1 text-[12px] font-medium leading-[140%]"
                  style={{ color: 'var(--color-gray-500)' }}
                >
                  탭해서 내용을 확인하세요
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ✅ 좋아요/댓글: 항상 노출 */}
        <div
          className="mt-5 px-4 flex items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center">
            <button
              type="button"
              className="inline-flex items-center cursor-pointer transition-opacity hover:opacity-80"
              aria-label="좋아요"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onToggleLike?.(boardId)
              }}
            >
              <Image
                src={
                  data.board.isLiked
                    ? '/icons/icon-like-pink.svg'
                    : '/icons/icon-like.svg'
                }
                alt="좋아요"
                width={24}
                height={24}
              />
            </button>

            {data.board.likeCount > 0 && (
              <span
                className="ml-1 text-[14px] font-bold leading-[140%]"
                style={{ color: 'var(--color-gray-500)' }}
              >
                {data.board.likeCount}
              </span>
            )}
          </div>

          <div className="flex items-center ml-4">
            <Image
              src="/icons/icon-comment.svg"
              alt="댓글"
              width={24}
              height={24}
            />
            {data.board.replyCount > 0 && (
              <span
                className="ml-1 text-[14px] font-bold leading-[140%]"
                style={{ color: 'var(--color-gray-500)' }}
              >
                {data.board.replyCount}
              </span>
            )}
          </div>
        </div>
      </div>

      <ReportFlow<{
        boardId: number
        reportedUserId: number
        profileImage: string
        nickname: string
      }>
        isReportOpen={report.isReportOpen}
        reportTarget={report.reportTarget}
        onCloseReport={report.closeReportModal}
        onConfirmReport={report.handleReportConfirm}
        reportDoneOpen={report.reportDoneOpen}
        onCloseDone={report.closeReportDone}
        getProfileImage={(t) => t.profileImage}
        getNickname={(t) => t.nickname}
        toastOpen={report.toastOpen}
        toastMessage={report.toastMessage}
        onCloseToast={report.closeToast}
      />

      <DeleteFlow<{
        boardId: number
        profileImage: string
        nickname: string
      }>
        isDeleteOpen={del.isDeleteOpen}
        deleteTarget={del.deleteTarget}
        onCloseDelete={del.closeDeleteModal}
        onConfirmDelete={del.handleDeleteConfirm}
        deleteDoneOpen={del.deleteDoneOpen}
        onCloseDone={del.closeDeleteDone}
        getProfileImage={(t) => t.profileImage}
        getNickname={(t) => t.nickname}
      />
    </>
  )
}
