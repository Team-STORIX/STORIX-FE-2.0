import { apiClient } from '../axios-instance'
import {
  KakaoLoginResponseSchema,
  SocialLoginResponseSchema,
  type KakaoLoginResponse,
  type SocialLoginResponse,
} from './auth.schema'

// 카카오 인가 URL 생성 (클라이언트에서 직접 빌드 — static export 호환)
export const getKakaoAuthUrl = async (): Promise<string> => {
  const clientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID
  const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI
  if (!clientId || !redirectUri) {
    throw new Error('Kakao OAuth env (NEXT_PUBLIC_KAKAO_CLIENT_ID/REDIRECT_URI) is missing')
  }
  return (
    `https://kauth.kakao.com/oauth/authorize` +
    `?response_type=code` +
    `&client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&prompt=select_account`
  )
}

// 카카오 로그인 (백엔드 API 호출)
export const kakaoLogin = async (code: string): Promise<KakaoLoginResponse> => {
  const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI
  //|| 'http://localhost:3000/login'

  const response = await apiClient.get('/api/v1/auth/oauth/kakao/login', {
    params: {
      code,
      redirectUri,
    },
  })

  // Zod로 응답 검증
  return KakaoLoginResponseSchema.parse(response.data)
}

// 카카오 네이티브 로그인 — iOS/Android SDK가 내려준 accessToken + idToken 을 BE로 전달.
// withCredentials: true (로그인 성공 시 refreshToken 쿠키 수신)
export const kakaoNativeLogin = async (args: {
  accessToken: string
  idToken: string
}): Promise<SocialLoginResponse> => {
  const response = await apiClient.post(
    '/api/v1/auth/oauth/kakao-native/login',
    { accessToken: args.accessToken, idToken: args.idToken },
    { withCredentials: true },
  )
  return SocialLoginResponseSchema.parse(response.data)
}
