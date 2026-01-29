// src/hooks/hashtag/useRecommendedHashtags.ts
import { useQuery } from '@tanstack/react-query'
import { getRecommendedHashtags } from '@/lib/api/hashtag'

export const useRecommendedHashtags = () => {
  return useQuery({
    queryKey: ['hashtags', 'recommendations'], //
    queryFn: () => getRecommendedHashtags(),
  })
}
