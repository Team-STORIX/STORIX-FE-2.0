// src/api/profile/readerFavorites.api.ts
import { apiClient } from '@/api/axios-instance'

export type SortLatest = 'LATEST'

/** 서버 공통 래퍼 */
export type ApiEnvelope<T> = {
  isSuccess: boolean
  code: string
  message: string
  result: T
  timestamp: string
}

/** Spring Page 형태(서버 스펙 그대로) */
export type PageableSort = {
  unsorted: boolean
  sorted: boolean
  empty: boolean
}

export type Pageable = {
  unpaged: boolean
  pageNumber: number
  paged: boolean
  pageSize: number
  offset: number
  sort: PageableSort
}

export type PageResult<T> = {
  numberOfElements: number
  pageable: Pageable
  size: number
  content: T[]
  number: number
  sort: PageableSort
  first: boolean
  last: boolean
  empty: boolean
}

/** 관심 작품 아이템 */
export type FavoriteWork = {
  worksId: number
  worksName: string
  artistName: string
  thumbnailUrl: string
  worksType: string
  isReviewed: boolean
  rating?: string
}

/** 관심 작가 아이템 */
export type FavoriteArtist = {
  artistId: number
  profileImageUrl: string
  artistName: string
  profileDescription: string
}

/** [독자] 관심 작품 리스트 조회 응답(result) */
export type FavoriteWorksResponse = {
  totalFavoriteWorksCount: number
  result: PageResult<FavoriteWork>
}

/** [독자] 관심 작가 리스트 조회 응답(result) */
export type FavoriteArtistsResponse = {
  totalFavoriteArtistCount: number
  result: PageResult<FavoriteArtist>
}

/**
 * GET /api/v1/profile/reader/favorite/works
 * - 무한스크롤: page 증가
 * - 다음 페이지 여부: result.last 로 판단
 */
export async function getReaderFavoriteWorks(params: {
  page?: number
  sort?: SortLatest
}) {
  const { data } = await apiClient.get<ApiEnvelope<FavoriteWorksResponse>>(
    '/api/v1/profile/reader/favorite/works',
    {
      params: {
        sort: params.sort ?? 'LATEST',
        page: params.page ?? 0,
      },
    },
  )
  return data.result
}

/**
 * GET /api/v1/profile/reader/favorite/artist
 * - 무한스크롤: page 증가
 * - 다음 페이지 여부: result.last 로 판단
 */
export async function getReaderFavoriteArtists(params: {
  page?: number
  sort?: SortLatest
}) {
  const { data } = await apiClient.get<ApiEnvelope<FavoriteArtistsResponse>>(
    '/api/v1/profile/reader/favorite/artist',
    {
      params: {
        sort: params.sort ?? 'LATEST',
        page: params.page ?? 0,
      },
    },
  )
  return data.result
}
export type ReaderFavoriteWork = FavoriteWork
export type ReaderFavoriteArtist = FavoriteArtist
