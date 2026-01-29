// src/hooks/topicroom/usePopularTopicRooms.ts
import { useQuery } from '@tanstack/react-query'
import { getPopularTopicRooms } from '@/lib/api/topicroom'

export const usePopularTopicRooms = () => {
  return useQuery({
    queryKey: ['topicroom', 'popular'], // ✅
    queryFn: () => getPopularTopicRooms(),
  })
}
