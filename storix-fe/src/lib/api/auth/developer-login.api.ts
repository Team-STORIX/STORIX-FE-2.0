import { apiClient } from '@/lib/api/axios-instance'

export type DeveloperLoginResponse = {
  isSuccess: boolean
  code: string
  message: string
  result: {
    accessToken: string
  }
  timestamp: string
}

export async function developerLogin(pendingId: string) {
  const res = await apiClient.post<DeveloperLoginResponse>(
    '/api/v1/auth/developer/login',
    { pendingId },
    { withCredentials: true },
  )
  return res.data
}
