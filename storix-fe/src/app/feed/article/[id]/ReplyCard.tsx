// src/app/feed/article/[id]/ReplyCard.tsx
'use client'

import Image from 'next/image'
import type { ReplyItem } from '@/api/feed/readerBoardDetail.api'

const FALLBACK_PROFILE = '/profile/profile-default.svg'

interface ReplyCardProps {
  boardId: number
  myUserId: number | null
  item: ReplyItem
  isMenuOpen: boolean
  onToggleMenu: () => void
  menuRef: (el: HTMLDivElement | null) => void
  onClickDetail: () => void
  onToggleLike: () => void
  onOpenDelete: () => void
  onOpenReport: () => void
}

export default function ReplyCard({
  myUserId,
  item,
  isMenuOpen,
  onToggleMenu,
  menuRef,
  onToggleLike,
  onOpenDelete,
  onOpenReport,
}: ReplyCardProps) {
  const profileImage = item.profile.profileImageUrl ?? FALLBACK_PROFILE
  const isMine = myUserId != null && item.reply.userId === myUserId

  return (
    <article
      className="px-4 py-3 flex flex-col gap-3 bg-white"
      style={{ borderBottom: '1px solid var(--color-gray-100)' }}
    >
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-[var(--color-gray-200)] flex-shrink-0">
            <Image
              src={profileImage}
              alt="댓글 프로필"
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
            aria-label="댓글 메뉴"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onToggleMenu()
            }}
          >
            <Image
              src="/icons/menu-3dots.svg"
              alt="댓글 메뉴"
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
                    ? '/icons/delete-dropdown.svg'
                    : '/icons/comment-dropdown.svg'
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

      <p className="body-2" style={{ color: 'var(--color-gray-900)' }}>
        {item.reply.comment}
      </p>

      <div className="flex items-center">
        <button
          type="button"
          className="transition-opacity hover:opacity-70 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            onToggleLike()
          }}
          aria-label="댓글 좋아요"
        >
          <Image
            src={
              item.reply.isLiked
                ? '/icons/icon-like-pink.svg'
                : '/icons/icon-like.svg'
            }
            alt="좋아요"
            width={24}
            height={24}
          />
        </button>

        {item.reply.likeCount > 0 && (
          <span
            className="ml-1 text-[14px] font-bold leading-[140%]"
            style={{ color: 'var(--color-gray-500)' }}
          >
            {item.reply.likeCount}
          </span>
        )}
      </div>
    </article>
  )
}
