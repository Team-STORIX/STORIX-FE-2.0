// src/api/auth/artist-login.api.ts
import { apiClient } from '@/lib/api/axios-instance'

export type ArtistLoginRequest = {
  loginId: string
  password: string
}

export type ArtistLoginResponse = {
  isSuccess: boolean
  code: string
  message: string
  result?: {
    accessToken?: string
  }
  timestamp: string
}

export async function artistLoginUser(body: ArtistLoginRequest) {
  const res = await apiClient.post<ArtistLoginResponse>(
    '/api/v1/auth/users/artist/login',
    body,
  )
  return res.data
}
