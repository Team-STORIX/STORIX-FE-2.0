// src/hooks/topicroom/useTopicRoomSearch.ts
import { useQuery } from '@tanstack/react-query'
import { searchTopicRooms } from '@/lib/api/topicroom' //   이미 만든 topicroom search API 사용

export const useTopicRoomSearch = (keyword: string) => {
  const k = keyword.trim()

  return useQuery({
    queryKey: ['topicroom', 'search', k], //
    enabled: !!k, //
    queryFn: () => searchTopicRooms({ keyword: k, page: 0, size: 20 }), //
  })
}
