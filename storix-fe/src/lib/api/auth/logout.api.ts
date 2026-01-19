// src/api/auth/logout.api.ts
import { apiClient } from '@/lib/api/axios-instance'
import type { ApiResponse } from '@/lib/api/types'

export const logoutUser = async (): Promise<
  ApiResponse<Record<string, never>>
> => {
  const res = await apiClient.post('/api/v1/auth/user/logout', {})
  return res.data as ApiResponse<Record<string, never>>
}
