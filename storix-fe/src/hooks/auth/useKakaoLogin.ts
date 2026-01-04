// src/hooks/auth/useKakaoLogin.ts
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
      console.log('✅ 카카오 로그인 응답:', data)

      const { isRegistered, readerLoginResponse, readerPreLoginResponse } =
        data.result

      if (isRegistered && readerLoginResponse) {
        // 기존 회원 - 로그인 성공
        console.log('✅ 기존 회원 - accessToken 저장')
        setAccessToken(readerLoginResponse.accessToken)
        router.push('/profile') // profile로 이동!
      } else if (!isRegistered && readerPreLoginResponse) {
        // 신규 회원 - 온보딩 필요
        console.log(
          '✅ 신규 회원 - onboardingToken 저장:',
          readerPreLoginResponse.onboardingToken,
        )
        setOnboardingToken(readerPreLoginResponse.onboardingToken)
        router.push('/agreement') // agreement로 이동!
      } else {
        console.error('⚠️ 예상치 못한 응답 형식:', data)
        alert('로그인 처리 중 오류가 발생했습니다.')
      }
    },
    onError: (error: AxiosError) => {
      console.error('❌ 카카오 로그인 실패:', error)
      console.error('에러 상세:', error.response?.data)
      alert('로그인에 실패했습니다. 다시 시도해주세요.')
      router.push('/login') // 실패 시 로그인 페이지로
    },
  })
}
