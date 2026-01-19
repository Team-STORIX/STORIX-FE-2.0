// src/lib/api/library/library.api.ts
import { z } from 'zod'
import { apiClient } from '@/lib/api/axios-instance'
import {
  ApiEnvelopeSchema,
  LibraryRecentKeywordsSchema,
  LibraryReviewResultSchema,
  LibrarySearchWorkSchema,
  SliceSchema,
} from './library.schema'

export type LibraryReviewSort = 'LATEST' | 'DESC_RATING' | 'ASC_RATING'

/**
 * 1) 서재 내 작품 검색 (무한스크롤)
 * GET /api/v1/library/search/works?keyword=&page=
 */
const LibrarySearchWorksResponseSchema = ApiEnvelopeSchema(
  z.object({
    slice: SliceSchema(LibrarySearchWorkSchema),
  }),
)

export const getLibrarySearchWorks = async (params: {
  keyword: string
  page?: number
}) => {
  const { keyword, page = 0 } = params
  const res = await apiClient.get('/api/v1/library/search/works', {
    params: { keyword, page },
  })

  const parsed = LibrarySearchWorksResponseSchema.parse(res.data)
  return parsed.result
}

/**
 * 2) 최근 검색어 조회
 * GET /api/v1/library/search/recent
 */
const LibraryRecentResponseSchema = ApiEnvelopeSchema(
  LibraryRecentKeywordsSchema,
)

export const getLibraryRecentKeywords = async () => {
  const res = await apiClient.get('/api/v1/library/search/recent')
  const parsed = LibraryRecentResponseSchema.parse(res.data)
  return parsed.result
}

/**
 * 3) 최근 검색어 삭제 (mutation)
 * DELETE /api/v1/library/search/recent?keyword=
 */
export const deleteLibraryRecentKeyword = async (params: {
  keyword: string
}) => {
  const res = await apiClient.delete('/api/v1/library/search/recent', {
    params,
  })

  // result가 {}일 수도 있어서 느슨하게 처리
  const parsed = ApiEnvelopeSchema(z.any()).parse(res.data)
  return parsed.result
}

/**
 * 4) 내 리뷰 작품 정보 조회 (무한스크롤)
 * GET /api/v1/library/review?sort=&page=
 */
const LibraryReviewResponseSchema = ApiEnvelopeSchema(LibraryReviewResultSchema)

export const getLibraryReview = async (params: {
  sort?: LibraryReviewSort
  page?: number
}) => {
  const { sort = 'LATEST', page = 0 } = params
  const res = await apiClient.get('/api/v1/library/review', {
    params: { sort, page },
  })
  const parsed = LibraryReviewResponseSchema.parse(res.data)
  return parsed.result
}
