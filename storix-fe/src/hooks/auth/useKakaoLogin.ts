import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { kakaoLogin } from '@/api/auth/kakao.api'
import { useAuthStore } from '@/store/auth.store'
import type { KakaoLoginResponse } from '@/api/auth/auth.schema'
import { AxiosError } from 'axios'

export const useKakaoLogin = () => {
  const router = useRouter()
  const { setAccessToken, setOnboardingToken } = useAuthStore()

  return useMutation({
    mutationFn: (code: string) => kakaoLogin(code),
    onSuccess: (data: KakaoLoginResponse) => {
      const { isRegistered, readerLoginResponse, readerPreLoginResponse } =
        data.result

      if (isRegistered && readerLoginResponse) {
        // 기존 회원 - 로그인 성공
        setAccessToken(readerLoginResponse.accessToken)
        router.push('/') // 메인 페이지로 이동
      } else if (!isRegistered && readerPreLoginResponse) {
        // 신규 회원 - 온보딩 필요
        setOnboardingToken(readerPreLoginResponse.onboardingToken)
        router.push('/onboarding') // 온보딩 페이지로 이동
      }
    },
    onError: (error: AxiosError) => {
      console.error('카카오 로그인 실패:', error)
      alert('로그인에 실패했습니다. 다시 시도해주세요.')
    },
  })
}
