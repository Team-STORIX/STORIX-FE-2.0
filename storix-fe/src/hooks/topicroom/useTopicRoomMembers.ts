// src/hooks/topicroom/useTopicRoomMembers.ts
import { useQuery } from '@tanstack/react-query'
import { getTopicRoomMembers } from '@/lib/api/topicroom'

export const useTopicRoomMembers = (roomId: number) => {
  return useQuery({
    queryKey: ['topicroom', 'members', roomId], //
    enabled: Number.isFinite(roomId) && roomId > 0, //
    queryFn: () => getTopicRoomMembers(roomId),
    refetchOnWindowFocus: false,
    staleTime: 30_000,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: 0,
  })
}
