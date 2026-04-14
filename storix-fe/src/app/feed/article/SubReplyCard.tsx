// src/app/feed/article/[id]/SubReplyCard.tsx
'use client'

import Image from 'next/image'
import type { ReplyItem } from '@/lib/api/feed/readerBoardDetail.api'

const FALLBACK_PROFILE = '/profile/profile-default.svg'

interface SubReplyCardProps {
  myUserId: number | null
  item: ReplyItem
  isMenuOpen: boolean
  onToggleMenu: () => void
  menuRef: (el: HTMLDivElement | null) => void
  onToggleLike: () => void
  onOpenDelete: () => void
  onOpenReport: () => void
}

export default function SubReplyCard({
  myUserId,
  item,
  isMenuOpen,
  onToggleMenu,
  menuRef,
  onToggleLike,
  onOpenDelete,
  onOpenReport,
}: SubReplyCardProps) {
  const profileImage = item.profile.profileImageUrl ?? FALLBACK_PROFILE
  const isMine = myUserId != null && item.reply.userId === myUserId

  return (
    <div className="flex items-start">
      {/* 화살표 아이콘: 14×14, 카드와 상단 정렬 */}
      <img
        src="/feed/comment-arrow.svg"
        alt=""
        width={14}
        height={14}
        aria-hidden
        style={{ marginTop: 3, flexShrink: 0 }}
      />

      {/* 카드: 화살표에서 12px 오른쪽, border-radius 8, 배경 #F9F6F7 */}
      <div
        style={{
          marginLeft: 12,
          flex: 1,
          borderRadius: 8,
          background: 'var(--Grayscale-50, #F9F6F7)',
          padding: '12px 16px',
        }}
      >
        <div className="flex flex-col gap-3">
          {/* 헤더: 프로필 + 닉네임 + 시간 + 점3개 */}
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-[var(--color-gray-200)] flex-shrink-0">
                <Image
                  src={profileImage}
                  alt="프로필"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-2 flex items-center body-2">
                <p style={{ color: 'var(--color-gray-900)' }}>
                  {item.profile.nickName}
                </p>
                <span className="mx-1" style={{ color: 'var(--color-gray-300)' }}>
                  ·
                </span>
                <p style={{ color: 'var(--color-gray-300)' }}>
                  {item.reply.lastCreatedTime}
                </p>
              </div>
            </div>

            <div
              className="relative"
              ref={menuRef}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="p-1 transition-opacity hover:opacity-70 cursor-pointer"
                aria-label="대댓글 메뉴"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onToggleMenu()
                }}
              >
                <Image
                  src="/common/icons/menu-3dots.svg"
                  alt="메뉴"
                  width={24}
                  height={24}
                />
              </button>

              {isMenuOpen && (
                <button
                  type="button"
                  className="absolute right-0 top-8 z-50 block w-[96px] h-[36px] rounded-[4px] overflow-hidden transition-opacity hover:opacity-90"
                  style={{ boxShadow: '0 0 8px rgba(0,0,0,0.25)' }}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (isMine) onOpenDelete()
                    else onOpenReport()
                  }}
                  aria-label={isMine ? '삭제하기' : '신고하기'}
                >
                  <img
                    src={
                      isMine
                        ? '/common/icons/delete-dropdown.svg'
                        : '/common/icons/comment-dropdown.svg'
                    }
                    alt={isMine ? '삭제하기' : '신고하기'}
                    width={96}
                    height={36}
                    className="block w-[96px] h-[36px] bg-white"
                    draggable={false}
                  />
                </button>
              )}
            </div>
          </div>

          {/* 대댓글 내용 */}
          <p className="body-2" style={{ color: 'var(--color-gray-900)' }}>
            {item.reply.comment}
          </p>

          {/* 액션: 좋아요만 (대대댓글 불가이므로 메시지 아이콘 없음) */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="transition-opacity hover:opacity-70 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                onToggleLike()
              }}
              aria-label="좋아요"
            >
              <Image
                src={
                  item.reply.isLiked
                    ? '/common/icons/icon-like-pink.svg'
                    : '/common/icons/icon-like.svg'
                }
                alt="좋아요"
                width={24}
                height={24}
              />
            </button>

            {item.reply.likeCount > 0 && (
              <span
                className="text-[14px] font-bold leading-[140%]"
                style={{ color: 'var(--color-gray-500)' }}
              >
                {item.reply.likeCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
