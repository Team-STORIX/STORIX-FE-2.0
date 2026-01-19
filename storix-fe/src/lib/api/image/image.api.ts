// src/api/image/image.api.ts
import { apiClient } from '@/lib/api/axios-instance'
import type { ApiResponse } from '@/lib/api/types'

export type ImageContentType = 'image/jpeg' | 'image/png' | 'image/webp'

type PresignedProfileUploadResult = {
  url: string // presignedPutUrl
  objectKey: string
  expiresInSeconds: number
}

export const createProfileImagePresignedPutUrl = async (
  contentType: ImageContentType,
): Promise<ApiResponse<PresignedProfileUploadResult>> => {
  const res = await apiClient.post('/api/v1/image/profile', {
    file: { contentType },
  })
  return res.data as ApiResponse<PresignedProfileUploadResult>
}
