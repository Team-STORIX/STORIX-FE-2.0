import { apiClient } from '../axios-instance'
import {
  SocialLoginResponseSchema,
  type SocialLoginResponse,
} from './auth.schema'

// 네이버 로그인 (백엔드 API 호출 — web code 교환)
// 현재 운영 플로우는 PendingClient 에서 fetch 로 직접 호출하고 있어 참고용으로만 둔다.
export const naverLogin = async (args: {
  code: string
  state: string
}): Promise<SocialLoginResponse> => {
  const response = await apiClient.get('/api/v1/auth/oauth/naver/login', {
    params: { code: args.code, state: args.state },
    withCredentials: true,
  })
  return SocialLoginResponseSchema.parse(response.data)
}

// 네이버 네이티브 로그인 — iOS/Android SDK가 내려준 accessToken 을 BE로 전달.
export const naverNativeLogin = async (args: {
  accessToken: string
}): Promise<SocialLoginResponse> => {
  const response = await apiClient.post(
    '/api/v1/auth/oauth/naver-native/login',
    { accessToken: args.accessToken },
    { withCredentials: true },
  )
  return SocialLoginResponseSchema.parse(response.data)
}
