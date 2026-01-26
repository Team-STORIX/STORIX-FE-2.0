// src/lib/api/homeFeed/homeFeed.api.ts
import { apiClient } from '@/lib/api/axios-instance'
import { TodayFeedEnvelopeSchema } from './homeFeed.schema'

/**   오늘의 피드 조회 */
export async function getTodayHomeFeeds() {
  const res = await apiClient.get('/api/v1/home/feeds/today', {
    headers: { accept: '*/*' },
  })

  const parsed = TodayFeedEnvelopeSchema.parse(res.data)
  return parsed.result
}
