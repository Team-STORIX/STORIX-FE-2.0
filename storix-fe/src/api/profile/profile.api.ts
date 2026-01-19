// src/api/profile/profile.api.ts
import { apiClient } from '@/api/axios-instance'
import type { ApiResponse } from '@/api/types'

export type MeProfileResult = {
  userId: number
  role: string
  profileImageUrl: string
  nickName: string
  level: number
  point: number
  profileDescription: string
}

export const getMyProfile = async (): Promise<ApiResponse<MeProfileResult>> => {
  const res = await apiClient.get('/api/v1/profile/me')
  return res.data as ApiResponse<MeProfileResult>
}

export const updateProfileNickname = async (
  nickName: string,
): Promise<ApiResponse<string>> => {
  const res = await apiClient.post('/api/v1/profile/nickname', { nickName })
  return res.data as ApiResponse<string>
}

export const updateProfileDescription = async (
  profileDescription: string,
): Promise<ApiResponse<string>> => {
  const res = await apiClient.post('/api/v1/profile/description', {
    profileDescription,
  })
  return res.data as ApiResponse<string>
}

export const updateProfileImage = async (
  objectKey: string,
): Promise<ApiResponse<string>> => {
  const res = await apiClient.post('/api/v1/profile/image', { objectKey })
  return res.data as ApiResponse<string>
}
