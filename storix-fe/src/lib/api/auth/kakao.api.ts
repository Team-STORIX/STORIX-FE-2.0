import { apiClient } from '../axios-instance'
import {
  KakaoLoginResponseSchema,
  type KakaoLoginResponse,
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
