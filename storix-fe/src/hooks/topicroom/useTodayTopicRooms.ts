// src/hooks/topicroom/useTodayTopicRooms.ts
import { useQuery } from '@tanstack/react-query'
import { getTodayTopicRooms } from '@/lib/api/topicroom'

export const useTodayTopicRooms = () => {
  return useQuery({
    queryKey: ['topicroom', 'today'], // ✅
    queryFn: () => getTodayTopicRooms(),
    refetchOnWindowFocus: false,
    staleTime: 30_000,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: 0,
  })
}
