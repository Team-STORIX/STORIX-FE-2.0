// src/hooks/auth/useNativeSocialLogin.ts
//
// 네이티브(iOS/Android) 환경에서의 Kakao/Naver 소셜 로그인.
// - SDK 로그인 → accessToken(+idToken) 획득
// - BE native 엔드포인트(POST /oauth/{provider}-native/login) 호출
// - 성공 시 기존 웹 플로우와 동일한 isRegistered 분기로 이어짐
//
// 주의: iOS WKWebView 에서 JS alert() 를 Safari view 전환 직후에 호출하면
//      CAPWebViewDelegationHandler 의 completion handler 가 소실되어 크래시.
//      → alert() 대신 console 로깅 + 상태 반환.

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { AxiosError } from 'axios'
import { kakaoNativeLogin } from '@/lib/api/auth/kakao.api'
import { naverNativeLogin } from '@/lib/api/auth/naver.api'
import type { SocialLoginResponse } from '@/lib/api/auth/auth.schema'
import {
  nativeSocialAuthProvider,
  type SocialProviderId,
} from '@/lib/auth/social'
import { useAuthStore } from '@/store/auth.store'

const callBackend = async (
  provider: SocialProviderId,
): Promise<SocialLoginResponse> => {
  if (provider === 'kakao') {
    const { accessToken, idToken } =
      await nativeSocialAuthProvider.loginWithKakao()
    return kakaoNativeLogin({ accessToken, idToken })
  }
  const { accessToken } = await nativeSocialAuthProvider.loginWithNaver()
  return naverNativeLogin({ accessToken })
}

export const useNativeSocialLogin = () => {
  const router = useRouter()
  const setAccessToken = useAuthStore((s) => s.setAccessToken)
  const setOnboardingToken = useAuthStore((s) => s.setOnboardingToken)

  return useMutation({
    mutationFn: (provider: SocialProviderId) => callBackend(provider),
    onSuccess: (data: SocialLoginResponse) => {
      const { isRegistered, readerLoginResponse, readerPreLoginResponse } =
        data.result

      if (isRegistered && readerLoginResponse?.accessToken) {
        setAccessToken(readerLoginResponse.accessToken)
        router.replace('/home')
        return
      }
      if (!isRegistered && readerPreLoginResponse?.onboardingToken) {
        setOnboardingToken(readerPreLoginResponse.onboardingToken)
        router.replace('/agreement')
        return
      }
      // 두 분기 모두 매칭 실패 — 디버깅용 로그
      console.error('[native-login] unexpected response shape:', data)
    },
    onError: (error: AxiosError) => {
      // iOS Safari view 전환 직후 alert() 는 크래시 유발. 로그만.
      console.error('[native-login] failed:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      })
    },
  })
}
