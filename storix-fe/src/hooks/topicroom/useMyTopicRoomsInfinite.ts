// src/hooks/topicroom/useMyTopicRoomsInfinite.ts
import { useInfiniteQuery } from '@tanstack/react-query'
import { getMyTopicRooms } from '@/lib/api/topicroom'

type Params = {
  size?: number
  sort?: string[]
  enabled?: boolean
}

export const useMyTopicRoomsInfinite = ({
  size = 3,
  sort = ['topicRoom.lastChatTime,DESC'],
  enabled = true,
}: Params = {}) => {
  return useInfiniteQuery({
    queryKey: ['topicroom', 'me', 'list', 'infinite', size, sort.join('|')], // ✅
    enabled: !!enabled, // ✅
    queryFn: ({ pageParam }) =>
      getMyTopicRooms({ page: Number(pageParam), size, sort }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      // ✅ nextPage 계산: last/empty/number 기반으로 통일
      if (lastPage.last || lastPage.empty) return undefined
      const current = lastPage.number ?? 0
      return current + 1
    },
  })
}
