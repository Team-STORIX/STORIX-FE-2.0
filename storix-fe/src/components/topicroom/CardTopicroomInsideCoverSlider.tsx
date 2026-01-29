// src/components/topicroom/CardTopicroomInsideCoverSlider.tsx
'use client'

import { useMemo } from 'react'
import { CardTopicRoomInsideCover } from '@/components/topicroom/CardTopicroomInsideCover'
import { TopicRoomData } from '@/components/home/todayTopicRoom/TopicroomCoverCard'
/* 토픽룸 커버 슬라이더(세로 스크롤) */
interface CardTopicroomInsideCoverSliderProps {
  rooms: TopicRoomData[]
}

const extractWorksNameFromSubtitle = (subtitle?: string) => {
  if (!subtitle) return ''
  const m = subtitle.match(/<([^>]+)>/) // TopicRoomCoverSlider에서 만든 subtitle 포맷과 동일
  return m?.[1]?.trim() ?? ''
}

export const CardTopicroomInsideCoverSlider = ({
  rooms,
}: CardTopicroomInsideCoverSliderProps) => {
  // TopicRoomCoverSlider와 동일하게 "입장에 필요한 roomId/worksName"을 normalize
  const roomsToRender = useMemo<TopicRoomData[]>(() => {
    return rooms.map((r) => {
      const roomId = r.roomId ?? Number(r.id)
      const worksName = r.worksName ?? extractWorksNameFromSubtitle(r.subtitle)
      return {
        ...r,
        roomId: Number.isFinite(roomId) ? roomId : r.roomId,
        worksName,
      }
    })
  }, [rooms])

  return (
    <section className="w-full">
      <div className="flex flex-col h-full w-full gap-4 no-scrollbar px-4 mb-4">
        {roomsToRender.map((room) => (
          <CardTopicRoomInsideCover key={room.id} room={room} />
        ))}
      </div>
    </section>
  )
}
