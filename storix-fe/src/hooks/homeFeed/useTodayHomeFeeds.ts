// src/hooks/homeFeed/useTodayHomeFeeds.ts
import { useQuery } from '@tanstack/react-query'
import { getTodayHomeFeeds } from '@/lib/api/homeFeed'

export const useTodayHomeFeeds = () => {
  return useQuery({
    queryKey: ['home', 'feeds', 'today'], //
    queryFn: () => getTodayHomeFeeds(),
  })
}
