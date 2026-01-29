// src/components/topicrsoom/CardTopicroomInsideCoverSlider.tsx
'use client'

import { CardTopicRoomInsideCover } from '@/components/topicroom/CardTopicroomInsideCover'
import { TopicRoomData } from '../home/todayTopicRoom/TopicroomCoverCard'

/* 토픽룸 커버 슬라이더(세로 스크롤) */
interface CardTopicroomInsideCoverSliderProps {
  rooms: TopicRoomData[]
}

export const CardTopicroomInsideCoverSlider = ({
  rooms,
}: CardTopicroomInsideCoverSliderProps) => {
  return (
    <section className="w-full">
      <div className="flex flex-col h-full w-full gap-4 no-scrollbar px-4 mb-4">
        {rooms.map((room) => (
          <CardTopicRoomInsideCover key={room.id} room={room} />
        ))}
      </div>
    </section>
  )
}
