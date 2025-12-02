// src/components/home/todayTopicrsoom/TopicRoomCoverSlider.tsx
'use client'

import {
  TopicRoomCoverCard,
  TopicRoomData,
} from '@/components/home/todayTopicRoom/TopicroomCoverCard'

/** 토픽룸 커버 슬라이더(가로 스크롤) */
interface TopicRoomCoverSliderProps {
  rooms: TopicRoomData[]
}

export const TopicRoomCoverSlider = ({ rooms }: TopicRoomCoverSliderProps) => {
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
