// src/api/search/search.api.ts

import { apiClient } from '@/api/axios-instance'
import {
  WorksSearchRawResponseSchema,
  ArtistsSearchRawResponseSchema,
  WorksSearchResponseSchema,
  ArtistsSearchResponseSchema,
  TrendingResponseSchema,
  RecentResponseSchema,
  DeleteRecentResponseSchema,
  type WorksSort,
} from './search.schema'

/*
 * ✅ 핵심
 * - works/artists는 실응답이 result가 2중 구조(res.data.result.result)
 * - api 레이어에서 slice로 "정규화"해서 밖으로는 항상 res.result.content 로 읽게 만든다.
 * - 무한요청 디버깅을 위해 요청/응답 메타를 로그로 남긴다.
 */

// 반환 타입을 FE가 쓰기 좋게 평탄화된 형태로 정의
export interface SearchResultNormalized {
  slice: {
    content: any[]
    number: number
    last: boolean
    empty: boolean
  }
  fallbackRecommendation?: string | null
}

export const getWorksSearch = async (params: {
  keyword: string
  sort?: WorksSort
  page?: number
}) => {
  const { keyword, sort = 'NAME', page = 0 } = params
  const k = keyword.trim()

  const res = await apiClient.get('/api/v1/search/works', {
    params: { keyword: k, sort, page },
  })

  // 1) Raw 구조로 파싱
  const rawParsed = WorksSearchRawResponseSchema.parse(res.data)

  // 2) 기존 FE 호환용으로 slice로 정규화
  const normalized = {
    ...rawParsed,
    result: rawParsed.result.result,
  }

  // 3) normalized 형태로 다시 한번 보증
  const parsed = WorksSearchResponseSchema.parse(normalized)

  return parsed
}

export const getArtistsSearch = async (params: {
  keyword: string
  page?: number
}) => {
  const { keyword, page = 0 } = params
  const k = keyword.trim()

  const res = await apiClient.get('/api/v1/search/artists', {
    params: { keyword: k, page },
  })

  const rawParsed = ArtistsSearchRawResponseSchema.parse(res.data)

  const normalized = {
    ...rawParsed,
    result: rawParsed.result.result,
  }

  const parsed = ArtistsSearchResponseSchema.parse(normalized)

  return parsed
}

export const getTrendingKeywords = async () => {
  const res = await apiClient.get('/api/v1/search/trending')
  const parsed = TrendingResponseSchema.parse(res.data)

  return parsed
}

export const getRecentKeywords = async () => {
  const res = await apiClient.get('/api/v1/search/recent')
  const parsed = RecentResponseSchema.parse(res.data)

  return parsed
}

export const deleteRecentKeyword = async (keyword: string) => {
  const k = keyword.trim()

  const res = await apiClient.delete('/api/v1/search/recent', {
    params: { keyword: k },
  })

  const parsed = DeleteRecentResponseSchema.parse(res.data)

  return parsed
}
