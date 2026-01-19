// src/lib/api/favorite.api.ts
import { apiClient } from '@/lib/api/axios-instance'

type ApiResponse<T> = {
  isSuccess: boolean
  code: string
  message: string
  result: T
  timestamp: string
}

export async function getFavoriteWork(worksId: number) {
  const { data } = await apiClient.get<
    ApiResponse<{ isFavoriteWorks: boolean }>
  >(`/api/v1/favorite/works/${worksId}`)
  return data.result.isFavoriteWorks
}

export async function favoriteWork(worksId: number) {
  const { data } = await apiClient.post<
    ApiResponse<{ isFavoriteWorks: boolean }>
  >(`/api/v1/favorite/works/${worksId}`)
  return data.result.isFavoriteWorks
}

export async function unfavoriteWork(worksId: number) {
  const { data } = await apiClient.delete<
    ApiResponse<{ isFavoriteWorks: boolean }>
  >(`/api/v1/favorite/works/${worksId}`)
  return data.result.isFavoriteWorks
}

export async function getFavoriteArtist(artistId: number) {
  const { data } = await apiClient.get<
    ApiResponse<{ isFavoriteArtist: boolean }>
  >(`/api/v1/favorite/artist/${artistId}`)
  return data.result.isFavoriteArtist
}

export async function favoriteArtist(artistId: number) {
  const { data } = await apiClient.post<
    ApiResponse<{ isFavoriteArtist: boolean }>
  >(`/api/v1/favorite/artist/${artistId}`)
  return data.result.isFavoriteArtist
}

export async function unfavoriteArtist(artistId: number) {
  const { data } = await apiClient.delete<
    ApiResponse<{ isFavoriteArtist: boolean }>
  >(`/api/v1/favorite/artist/${artistId}`)
  return data.result.isFavoriteArtist
}
