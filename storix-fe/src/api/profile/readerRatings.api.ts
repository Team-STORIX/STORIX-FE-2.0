// src/api/profile/readerRatings.api.ts
import { apiClient } from '@/api/axios-instance'

export type RatingCountsMap = Record<string, number>

export type GetReaderRatingsResponse = {
  isSuccess: boolean
  code: string
  message: string
  result: {
    ratingCounts: RatingCountsMap
  }
  timestamp: string
}

export const getReaderRatings = async () => {
  const res = await apiClient.get<GetReaderRatingsResponse>(
    '/api/v1/profile/reader/ratings',
  )
  return res.data
}
