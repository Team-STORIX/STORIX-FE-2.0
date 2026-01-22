// src/components/topicroom/TopicRoomSearchList.tsx
'use client'

import Image from 'next/image'
import { type ParticipationChatItem } from '@/components/topicroom/ParticipationChat'

type Props = {
  list: ParticipationChatItem[]
  onItemClick: (id: number | string) => void
}

export default function TopicRoomSearchList({ list, onItemClick }: Props) {
  if (!list.length) return null

  return (
    <section className="border-bottom">
      <div className="flex flex-col space-y-4">
        {list.map(
          ({ id, thumbnail, title, subtitle, memberCount, timeAgo }) => {
            const rightText = timeAgo
              ? `${memberCount}명 · ${timeAgo}`
              : `${memberCount}명`

            return (
              <button
                key={id}
                type="button"
                onClick={() => onItemClick(id)}
                className="flex w-full items-center px-4 gap-3 text-left cursor-pointer"
              >
                {/* 왼쪽 원형 썸네일 */}
                <div className="flex-none h-[60px] w-[60px] overflow-hidden rounded-full">
                  <Image
                    src={thumbnail}
                    alt={title}
                    width={60}
                    height={60}
                    className="h-full w-full rounded-full object-cover object-top"
                  />
                </div>

                {/* 가운데 텍스트들 */}
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <p className="body-1 leading-tight text-gray-900 flex-1 min-w-0 w-full truncate">
                      {subtitle}
                    </p>
                    <div className="whitespace-nowrap caption-1 text-gray-500">
                      {rightText}
                    </div>
                  </div>
                  <p className="mt-1 caption-1 text-gray-500 w-full truncate">
                    {title}
                  </p>
                </div>
              </button>
            )
          },
        )}
      </div>
    </section>
  )
}
