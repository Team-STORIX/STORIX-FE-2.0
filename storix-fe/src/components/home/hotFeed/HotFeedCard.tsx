// src/components/home/hotfeed/HotFeedCard.tsx
'use client'

import Image from 'next/image'
import type { TodayFeedItem } from '@/lib/api/homeFeed' // ✅

type HotFeedCardProps = {
  className?: string
  data?: TodayFeedItem // ✅
}

/**
 * ✅ 스크린샷 스타일:
 * - 상단: 프로필 + 닉네임
 * - 중단: 제목(콘텐츠 앞부분) + 본문 미리보기
 * - 하단: 좋아요/댓글 아이콘(FeedList.tsx와 동일) + 카운트
 */
export const HotFeedCard = ({ className, data }: HotFeedCardProps) => {
  const nickName = data?.profile.nickName ?? ''
  const profileUrl =
    data?.profile.profileImageUrl ?? '/profile/profile-default.svg'

  const raw = data?.board.content ?? ''
  const title = raw.slice(0, 18) + (raw.length > 18 ? '...' : '') // ✅ title 슬롯(간단 분리)
  const preview =
    raw.length > 18
      ? raw.slice(18, 18 + 70) + (raw.length > 18 + 70 ? '...' : '')
      : '' // ✅

  const likeCount = data?.board.likeCount ?? 0
  const replyCount = data?.board.replyCount ?? 0
  const isLiked = !!data?.board.isLiked

  return (
    <div
      className={[
        'flex flex-col w-[353px] h-[164px] rounded-xl shadow-sm flex-shrink-0',
        'border border-gray-100 bg-white',
        'px-3 py-4 gap-3',
        className ?? '',
      ].join(' ')} // ✅
    >
      {/* 상단: 프로필 */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
          <Image
            src={profileUrl}
            alt="프로필"
            width={32}
            height={32}
            className="w-8 h-8 object-cover mr-1"
          />
        </div>
        <p className="body-2 text-black">{nickName}</p>
      </div>

      {/* 본문 */}
      <div>
        <p className="body-1 text-black line-clamp-1">{title}</p>
        <p className="mt-1 min-h-[32px] caption-1 text-gray-500 line-clamp-2">
          {preview}
        </p>
      </div>

      {/* 하단: 반응 */}
      <div className="mt-auto flex items-center gap-3">
        <div className="flex items-center">
          <Image
            src={isLiked ? '/icons/icon-like-pink.svg' : '/icons/icon-like.svg'} // ✅ FeedList.tsx 동일
            alt="좋아요"
            width={24}
            height={24}
          />
          <span className="ml-1 caption-4 text-[var(--color-gray-500)]">
            {likeCount}
          </span>
        </div>

        <div className="flex items-center">
          <Image
            src="/icons/icon-comment.svg" // ✅ FeedList.tsx 동일
            alt="댓글"
            width={24}
            height={24}
          />
          <span className="ml-1 caption-4 text-[var(--color-gray-500)]">
            {replyCount}
          </span>
        </div>
      </div>
    </div>
  )
}
