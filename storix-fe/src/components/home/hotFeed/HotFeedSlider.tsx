// src/components/home/hotfeed/HotFeedSlider.tsx
'use client' // ✅

import { HotFeedCard } from '@/components/home/hotFeed/HotFeedCard'
import { useTodayHomeFeeds } from '@/hooks/homeFeed/useTodayHomeFeeds' // ✅

export default function HotFeedSlider() {
  const { data, isLoading } = useTodayHomeFeeds() // ✅

  return (
    <section>
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 -mx-4">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <HotFeedCard key={i} className="bg-gray-100" /> // ✅ 로딩 스켈레톤(기존 더미 유지)
            ))
          : (data ?? []).map((item) => (
              <HotFeedCard
                key={item.board.boardId} // ✅
                data={item} // ✅
              />
            ))}
      </div>
    </section>
  )
}
