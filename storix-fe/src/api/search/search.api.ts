// src/api/search/search.api.ts
import { apiClient } from '@/api/axios-instance'
import {
  WorksSearchResponseSchema,
  ArtistsSearchResponseSchema,
  TrendingResponseSchema,
  RecentResponseSchema,
  DeleteRecentResponseSchema,
  type WorksSort,
} from './search.schema'

export const getWorksSearch = async (params: {
  keyword: string
  sort?: WorksSort
  page?: number
}) => {
  const { keyword, sort = 'NAME', page = 0 } = params
  const res = await apiClient.get('/api/v1/search/works', {
    params: { keyword: keyword.trim(), sort, page },
  })
  return WorksSearchResponseSchema.parse(res.data)
}

export const getArtistsSearch = async (params: {
  keyword: string
  page?: number
}) => {
  const { keyword, page = 0 } = params
  const res = await apiClient.get('/api/v1/search/artists', {
    params: { keyword: keyword.trim(), page },
  })
  return ArtistsSearchResponseSchema.parse(res.data)
}

export const getTrendingKeywords = async () => {
  const res = await apiClient.get('/api/v1/search/trending')
  return TrendingResponseSchema.parse(res.data)
}

export const getRecentKeywords = async () => {
  const res = await apiClient.get('/api/v1/search/recent')
  return RecentResponseSchema.parse(res.data)
}

export const deleteRecentKeyword = async (keyword: string) => {
  const res = await apiClient.delete('/api/v1/search/recent', {
    params: { keyword: keyword.trim() },
  })
  return DeleteRecentResponseSchema.parse(res.data)
}
