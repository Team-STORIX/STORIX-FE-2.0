// src/components/home/todayTopicrsoom/TopicRoomCoverSlider.tsx
'use client'

import { useMemo } from 'react'
import { formatTopicRoomSubtitle } from '@/lib/api/topicroom/formatTopicRoomSubtitle'
import {
  TopicRoomCoverCard,
  TopicRoomData,
} from '@/components/home/todayTopicRoom/TopicroomCoverCard'
import { useTodayTopicRooms } from '@/hooks/topicroom/useTodayTopicRooms'

/** 토픽룸 커버 슬라이더(가로 스크롤) */
interface TopicRoomCoverSliderProps {
  rooms?: TopicRoomData[] // ✅ (기존 props 유지 + 홈에서는 props 없이 API 사용)
}

export const TopicRoomCoverSlider = ({ rooms }: TopicRoomCoverSliderProps) => {
  const { data } = useTodayTopicRooms() // ✅

  const roomsFromApi = useMemo<TopicRoomData[]>(() => {
    if (!data) return []
    return data.map((r) => ({
      id: String(r.topicRoomId), // ✅
      imageUrl: r.thumbnailUrl ?? '/image/sample/topicroom-1.webp', // ✅ (썸네일 없으면 기존 더미 이미지 사용)
      title: r.topicRoomName, // ✅
      subtitle: formatTopicRoomSubtitle(r.worksType, r.worksName), // ✅
      memberCount: r.activeUserNumber ?? 0, // ✅
      roomId: r.topicRoomId, // ✅ (입장 링크용)
      worksName: r.worksName, // ✅ (입장 페이지에서 header 구성용)
    }))
  }, [data])

  const roomsToRender = rooms ?? roomsFromApi // ✅ (기존 UI 유지 + 홈에서는 API로)

  return (
    <section className="w-full">
      <div className="flex h-[354px] overflow-x-auto no-scrollbar px-4 -mx-4">
        {roomsToRender.map((room, index) => (
          <div
            key={room.id}
            className={`flex-shrink-0 ${index !== roomsToRender.length - 1 ? 'mr-3' : ''}`}
          >
            <TopicRoomCoverCard room={room} />
          </div>
        ))}
      </div>
    </section>
  )
}
