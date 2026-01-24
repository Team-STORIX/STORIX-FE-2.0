// src/components/topicroom/CardTopicroomInsideCover.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { TopicRoomData } from '@/components/home/todayTopicRoom/TopicroomCoverCard'

interface TopicRoomCoverCardProps {
  room: TopicRoomData
}

export const CardTopicRoomInsideCover = ({ room }: TopicRoomCoverCardProps) => {
  const roomId = room.roomId ?? Number(room.id)
  const worksName = room.worksName ?? ''
  const href =
    Number.isFinite(roomId) && roomId > 0
      ? {
          pathname: `/home/topicroom/${roomId}`,
          query: worksName ? { worksName } : {},
        }
      : '/home/topicroom'
  return (
    <div className="relative h-[204px] w-full flex-shrink-0 overflow-hidden rounded-2xl bg-gray-100">
      {/* 배경 이미지 */}
      <Image
        src={room.imageUrl}
        alt={room.title}
        fill
        className="object-cover object-top"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.30)_0%,rgba(0,0,0,0.30)_100%)]" />
      {/* 텍스트 영역 */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3 pb-4 ">
        {/* HOT / 인원 뱃지 */}
        <div className="mb-2 flex items-center gap-1.5">
          <span className="inline-flex items-center rounded-full bg-pink-500 px-1 py-0.5 caption-3 text-white">
            <FireIcon />
            <p className="ml-0.5">HOT</p>
          </span>
          <span className="inline-flex items-center rounded-full bg-white px-1 py-0.5 caption-3 text-[var(--color-magenta-300)]">
            <Image
              src={'/icons/icon-topicroom-people.svg'}
              alt={'참여 인원'}
              width={12}
              height={12}
              className="inline-block"
            />
            <p className="ml-0.5">{room.memberCount}</p>
          </span>
        </div>

        {/* 제목 / 부제목 */}
        <div className="flex-1 min-w-0 max-w-[300px] space-y-0.5 text-white text-left">
          <p className="heading-2 w-full truncate">{room.subtitle}</p>
          <p className="body-1">{room.title}</p>
        </div>
      </div>

      {/* 오른쪽 아래 플로팅 화살표 버튼 */}
      <Link
        href={href}
        className="
          absolute bottom-3 right-3
          flex h-10 w-10 items-center justify-center
          rounded-full bg-pink-500 text-white shadow-lg
        "
      >
        <EnterRoomIcon />
      </Link>
    </div>
  )
}

/* ===== 아이콘들 ===== */

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
  >
    <rect x="3.50391" width="3.00235" height="3" fill="#FF4093" />
    <path
      d="M5 4C7.76138 4 9.99993 6.06671 10 8.616V10.001L0.574668 10.0001V9.99376H0V8.43554H0.00488663C0.107644 5.96991 2.30409 4 5 4Z"
      fill="#FF4093"
    />
  </svg>
)

const EnterRoomIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
  >
    <rect x="9.1875" width="7.3125" height="1.5" fill="#ffffff" />
    <rect y="8.25391" width="11.3164" height="1.5" fill="#ffffff" />
    <rect
      x="7.53906"
      y="4.47656"
      width="5.34329"
      height="1.5"
      transform="rotate(45 7.53906 4.47656)"
      fill="#ffffff"
    />
    <rect
      x="11.3164"
      y="9.75391"
      width="5.34329"
      height="1.5"
      transform="rotate(135 11.3164 9.75391)"
      fill="#ffffff"
    />
    <rect
      x="18"
      y="1.50781"
      width="14.9922"
      height="1.5"
      transform="rotate(90 18 1.50781)"
      fill="#ffffff"
    />
    <rect x="9.1875" y="16.5" width="7.3125" height="1.5" fill="#ffffff" />
  </svg>
)

const FireIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
  >
    <path
      d="M2 7C2 6.125 2.20833 5.34583 2.625 4.6625C3.04167 3.97917 3.5 3.40417 4 2.9375C4.5 2.47083 4.95833 2.11458 5.375 1.86875L6 1.5V3.15C6 3.45833 6.10417 3.70208 6.3125 3.88125C6.52083 4.06042 6.75417 4.15 7.0125 4.15C7.15417 4.15 7.28958 4.12083 7.41875 4.0625C7.54792 4.00417 7.66667 3.90833 7.775 3.775L8 3.5C8.6 3.85 9.08333 4.33542 9.45 4.95625C9.81667 5.57708 10 6.25833 10 7C10 7.73333 9.82083 8.40208 9.4625 9.00625C9.10417 9.61042 8.63333 10.0875 8.05 10.4375C8.19167 10.2375 8.30208 10.0188 8.38125 9.78125C8.46042 9.54375 8.5 9.29167 8.5 9.025C8.5 8.69167 8.4375 8.37708 8.3125 8.08125C8.1875 7.78542 8.00833 7.52083 7.775 7.2875L6 5.55L4.2375 7.2875C3.99583 7.52917 3.8125 7.79583 3.6875 8.0875C3.5625 8.37917 3.5 8.69167 3.5 9.025C3.5 9.29167 3.53958 9.54375 3.61875 9.78125C3.69792 10.0188 3.80833 10.2375 3.95 10.4375C3.36667 10.0875 2.89583 9.61042 2.5375 9.00625C2.17917 8.40208 2 7.73333 2 7ZM6 6.95L7.0625 7.9875C7.20417 8.12917 7.3125 8.2875 7.3875 8.4625C7.4625 8.6375 7.5 8.825 7.5 9.025C7.5 9.43333 7.35417 9.78125 7.0625 10.0688C6.77083 10.3563 6.41667 10.5 6 10.5C5.58333 10.5 5.22917 10.3563 4.9375 10.0688C4.64583 9.78125 4.5 9.43333 4.5 9.025C4.5 8.83333 4.5375 8.64792 4.6125 8.46875C4.6875 8.28958 4.79583 8.12917 4.9375 7.9875L6 6.95Z"
      fill="white"
    />
  </svg>
)
