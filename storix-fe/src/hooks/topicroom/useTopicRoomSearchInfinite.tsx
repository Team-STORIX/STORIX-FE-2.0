// src/hooks/topicroom/useTopicRoomSearchInfinite.ts
import { useInfiniteQuery } from '@tanstack/react-query'
import { searchTopicRoomsSlice } from '@/lib/api/topicroom'

export const useTopicRoomSearchInfinite = (keyword: string, size = 20) => {
  const k = keyword.trim()

  return useInfiniteQuery({
    queryKey: ['topicroom', 'search', 'infinite', k, size], // ✅
    enabled: !!k, // ✅
    queryFn: ({ pageParam }) =>
      searchTopicRoomsSlice({ keyword: k, page: Number(pageParam), size }), // ✅
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      // ✅ nextPage 계산: last/empty/number 기반으로 통일
      if (lastPage.last || lastPage.empty) return undefined
      const current = lastPage.number ?? 0
      return current + 1
    },
  })
}
