// src/hooks/topicroom/useTopicRoomInfoById.ts
import { useQuery } from '@tanstack/react-query'
import { findTopicRoomInfoById } from '@/lib/api/topicroom'

export const useTopicRoomInfoById = (params: {
  keyword: string
  topicRoomId: number
}) => {
  const keyword = params.keyword
  const topicRoomId = params.topicRoomId

  return useQuery({
    queryKey: ['topicroom', 'info', keyword, topicRoomId], //
    enabled: !!keyword && !!topicRoomId, //
    queryFn: () => findTopicRoomInfoById(keyword, topicRoomId),
  })
}
