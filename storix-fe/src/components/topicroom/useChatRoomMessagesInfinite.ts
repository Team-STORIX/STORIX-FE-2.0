// src/hooks/topicroom/useChatRoomMessagesInfinite.ts
import { useInfiniteQuery } from '@tanstack/react-query'
import { getChatRoomMessages } from '@/lib/api/chat'

export const useChatRoomMessagesInfinite = (params: {
  roomId: number
  size?: number
  sort?: string[]
}) => {
  const roomId = params.roomId
  const size = params.size ?? 20
  const sort = params.sort ?? ['createdAt,DESC']

  return useInfiniteQuery({
    queryKey: ['chat', 'room', 'messages', roomId, size, sort.join('|')], // ✅ 안정적
    enabled: !!roomId, // ✅
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getChatRoomMessages({
        roomId,
        page: pageParam as number,
        size,
        sort,
      }),
    getNextPageParam: (lastPage) => {
      // ✅ nextPage 계산은 last/empty/number 기반으로 통일
      if (lastPage.last || lastPage.empty) return undefined
      return lastPage.number + 1
    },
  })
}
