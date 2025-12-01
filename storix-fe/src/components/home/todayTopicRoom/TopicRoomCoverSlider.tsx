// src/components/home/todayTopicrsoom/TopicRoomCoverSlider.tsx
'use client'

import Image from 'next/image'
import type { FC } from 'react'

/** 토픽룸 카드에 들어갈 데이터 타입 */
export interface TopicRoomData {
  id: string
  imageUrl: string
  title: string
  subtitle: string
  memberCount: number
}

/** 개별 토픽룸 카드 */
const TopicRoomCoverCard: FC<{ room: TopicRoomData }> = ({ room }) => {
  return (
    <div className="relative h-full w-[266px] flex-shrink-0 overflow-hidden rounded-2xl bg-[var(--color-primary-dark)]">
      {/* 배경 이미지 */}
      <Image
        src={room.imageUrl}
        alt={room.title}
        fill
        className="object-cover"
      />

      {/* 텍스트 영역 */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3 pb-4 ">
        {/* HOT / 인원 뱃지 */}
        <div className="mb-2 flex items-center gap-1.5">
          <span className="inline-flex items-center rounded-full bg-pink-500 px-2 py-0.5 text-[11px] font-semibold text-white">
            HOT
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[11px] text-gray-900">
            <UserIcon />
            {room.memberCount}
          </span>
        </div>

        {/* 제목 / 부제목 */}
        <div className="space-y-0.5 text-white text-left">
          <p className="heading-2 ">{room.title}</p>
          <p className="body-1 ">{room.subtitle}</p>
        </div>
      </div>

      {/* 오른쪽 아래 플로팅 화살표 버튼 */}
      <button
        type="button"
        className="
          absolute bottom-3 right-3
          flex h-10 w-10 items-center justify-center
          rounded-full bg-pink-500 text-white shadow-lg
        "
      >
        <ArrowRightIcon />
      </button>
    </div>
  )
}

/** 토픽룸 커버 슬라이더(가로 스크롤) */
export const TopicRoomCoverSlider: FC<{ rooms: TopicRoomData[] }> = ({
  rooms,
}) => {
  return (
    <section className="w-full">
      <div className="flex h-[354px] gap-3 overflow-x-auto no-scrollbar">
        {rooms.map((room) => (
          <TopicRoomCoverCard key={room.id} room={room} />
        ))}
      </div>
    </section>
  )
}

/* ===== 아이콘들 ===== */

const UserIcon: FC = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    aria-hidden="true"
    className="text-pink-500"
  >
    <circle cx="12" cy="9" r="3" fill="currentColor" />
    <path
      d="M6 18c0-2.2 2.2-4 6-4s6 1.8 6 4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

const ArrowRightIcon: FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M9 6l6 6-6 6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
