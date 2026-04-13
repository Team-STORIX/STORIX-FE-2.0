import { apiClient } from '../axios-instance'
import {
  KakaoLoginResponseSchema,
  type KakaoLoginResponse,
} from './auth.schema'

// Apple 로그인 (백엔드 API 호출 — 카카오/네이버와 동일한 응답 구조)
export const appleLogin = async (code: string): Promise<KakaoLoginResponse> => {
  const response = await apiClient.get('/api/v1/auth/oauth/apple/login', {
    params: { code },
  })

  return KakaoLoginResponseSchema.parse(response.data)
}
