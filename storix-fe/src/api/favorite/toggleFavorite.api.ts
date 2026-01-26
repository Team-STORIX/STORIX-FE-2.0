// src/api/favorite/toggleFavorite.api.ts
import { apiClient } from '@/api/axios-instance'

export type ApiEnvelope<T> = {
  isSuccess: boolean
  code: string
  message: string
  result: T
  timestamp: string
}

/** 서버 스펙 result 형태 */
type ToggleWorkResult = { isFavoriteWorks: boolean }
type ToggleArtistResult = { isFavoriteArtist: boolean }

/** 원본(의미가 명확한) 함수들 */
export async function postFavoriteWork(worksId: number) {
  const { data } = await apiClient.post<ApiEnvelope<ToggleWorkResult>>(
    `/api/v1/favorite/works/${worksId}`,
  )
  return data.result
}

export async function deleteFavoriteWork(worksId: number) {
  const { data } = await apiClient.delete<ApiEnvelope<ToggleWorkResult>>(
    `/api/v1/favorite/works/${worksId}`,
  )
  return data.result
}

export async function postFavoriteArtist(artistId: number) {
  const { data } = await apiClient.post<ApiEnvelope<ToggleArtistResult>>(
    `/api/v1/favorite/artist/${artistId}`,
  )
  return data.result
}

export async function deleteFavoriteArtist(artistId: number) {
  const { data } = await apiClient.delete<ApiEnvelope<ToggleArtistResult>>(
    `/api/v1/favorite/artist/${artistId}`,
  )
  return data.result
}

/**
 *   LikesClient가 기대하는 이름(alias)
 * - 기존 코드 변경 최소화를 위해 그대로 export 해줌
 */
export const addFavoriteWork = postFavoriteWork
export const removeFavoriteWork = deleteFavoriteWork
export const addFavoriteArtist = postFavoriteArtist
export const removeFavoriteArtist = deleteFavoriteArtist
