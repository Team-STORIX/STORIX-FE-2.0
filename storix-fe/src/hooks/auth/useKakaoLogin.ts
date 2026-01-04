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
        setAccessToken(readerLoginResponse.accessToken)
        router.push('/')
      } else if (!isRegistered && readerPreLoginResponse) {
        setOnboardingToken(readerPreLoginResponse.onboardingToken)
        router.push('/onboarding')
      }
    },
    onError: (error: AxiosError) => {
      console.error('카카오 로그인 실패:', error)
      alert('로그인에 실패했습니다. 다시 시도해주세요.')
    },
  })
}
