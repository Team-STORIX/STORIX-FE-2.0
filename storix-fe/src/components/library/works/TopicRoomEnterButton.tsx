'use client'

import Image from 'next/image'
import ForwardArrowSmallIcon from '@/public/common/icons/ForwardArrowSmallIcon'

type Props = {
  isCheckingRoom: boolean
  hasTopicRoom: boolean
  onClick: () => void
}

export default function TopicRoomEnterButton({
  isCheckingRoom,
  hasTopicRoom,
  onClick,
}: Props) {
  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 flex justify-center px-4 pb-[calc(env(safe-area-inset-bottom)+16px)]">
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClick}
          disabled={isCheckingRoom}
          className={`body-2-bold flex flex-1 items-center justify-center rounded-full px-6 py-4 text-white ${
            hasTopicRoom ? 'bg-[var(--color-magenta-300)]' : 'bg-gray-800'
          } disabled:bg-black`}
          style={{
            boxShadow: hasTopicRoom
              ? '8px 9px 22px 0 rgba(209, 29, 107, 0.16)'
              : '8px 9px 22px 0 rgba(48, 47, 48, 0.16)',
          }}
        >
          <Image
            src="/common/icons/fire.svg"
            alt="fire"
            width={24}
            height={24}
            className="mb-0.5 inline-block"
            priority
          />
          <p>{isCheckingRoom ? '확인 중...' : '토픽룸 입장'}</p>
          <ForwardArrowSmallIcon />
        </button>
      </div>
    </div>
  )
}
