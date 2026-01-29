// src/components/home/todayTopicrsoom/TopicRoomCoverSlider.tsx
'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { formatTopicRoomSubtitle } from '@/lib/api/topicroom/formatTopicRoomSubtitle'
import {
  TopicRoomCoverCard,
  TopicRoomData,
} from '@/components/home/todayTopicRoom/TopicroomCoverCard'
import { useTodayTopicRooms } from '@/hooks/topicroom/useTodayTopicRooms'

/** 토픽룸 커버 슬라이더(가로 스크롤) */
interface TopicRoomCoverSliderProps {
  rooms?: TopicRoomData[] //   (기존 props 유지 + 홈에서는 props 없이 API 사용)
}

export const TopicRoomCoverSlider = ({ rooms }: TopicRoomCoverSliderProps) => {
  const { data } = useTodayTopicRooms()

  const roomsFromApi = useMemo<TopicRoomData[]>(() => {
    if (!data) return []
    return data.map((r) => ({
      id: String(r.topicRoomId),
      imageUrl: r.thumbnailUrl ?? '/image/sample/topicroom-1.webp',
      title: r.topicRoomName,
      subtitle: formatTopicRoomSubtitle(r.worksType, r.worksName),
      memberCount: r.activeUserNumber ?? 0,
      roomId: r.topicRoomId, // (입장 링크용)
      worksName: r.worksName, // (입장 페이지에서 header 구성용)
    }))
  }, [data])

  const roomsToRender = rooms ?? roomsFromApi

  const sliderRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const [activeIdx, setActiveIdx] = useState(0)

  // 현재 viewport에서 "가장 많이 보이는 카드"를 active로 잡음(스냅 위치랑 잘 맞음)
  const updateActiveByVisibility = useCallback(() => {
    const el = sliderRef.current
    if (!el) return

    const containerRect = el.getBoundingClientRect()
    const children = Array.from(el.children) as HTMLElement[]
    if (children.length === 0) return

    let bestIdx = 0
    let bestVisible = -1

    children.forEach((child, idx) => {
      const r = child.getBoundingClientRect()
      const visibleW = Math.max(
        0,
        Math.min(r.right, containerRect.right) -
          Math.max(r.left, containerRect.left),
      )
      if (visibleW > bestVisible) {
        bestVisible = visibleW
        bestIdx = idx
      }
    })

    setActiveIdx(bestIdx)
  }, [])

  // 스크롤 중엔 rAF로 과한 setState 방지
  const handleScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      updateActiveByVisibility()
    })
  }, [updateActiveByVisibility])

  useEffect(() => {
    updateActiveByVisibility()
    const onResize = () => updateActiveByVisibility()

    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [updateActiveByVisibility])

  return (
    <section className="w-full">
      <div
        ref={sliderRef}
        onScroll={handleScroll}
        className="flex h-[354px] overflow-x-auto no-scrollbar px-4 -mx-4 gap-3 snap-x snap-mandatory scroll-smooth"
      >
        {roomsToRender.map((room, index) => {
          const snapClass = index === 2 ? 'snap-end' : 'snap-start'

          return (
            <div
              key={room.id}
              className={[
                'flex-shrink-0 snap-always',
                snapClass,
                activeIdx === index ? 'opacity-100' : 'opacity-50',
                'transition-opacity duration-200',
              ].join(' ')}
            >
              <TopicRoomCoverCard room={room} />
            </div>
          )
        })}
      </div>
    </section>
  )
}
