// src/lib/api/hashtag/hashtag.api.ts
import { apiClient } from '@/lib/api/axios-instance'
import { RecommendedHashtagEnvelopeSchema } from './hashtag.schema'

/** ✅ 사용자 맞춤 해시태그 추천 */
export async function getRecommendedHashtags() {
  const res = await apiClient.get('/api/v1/hashtags/recommendations', {
    headers: { accept: '*/*' },
  })

  const parsed = RecommendedHashtagEnvelopeSchema.parse(res.data)
  return parsed.result
}
