//src/hooks/auth/useSignup.ts

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { signup } from '@/api/auth/signup.api'
import { useAuthStore } from '@/store/auth.store'
import type { SignupRequest } from '@/api/auth/auth.schema'
import { AxiosError } from 'axios'

export const useSignup = () => {
  const router = useRouter()
  const { setAccessToken, onboardingToken } = useAuthStore()

  return useMutation({
    mutationFn: (data: SignupRequest) => {
      if (!onboardingToken) {
        throw new Error('Onboarding token is missing')
      }
      return signup(data, onboardingToken)
    },
    onSuccess: (response) => {
      // 회원가입 성공 -> 자동 로그인
      setAccessToken(response.result.accessToken)
      router.replace('/manual') // 또는 메인 페이지
    },
    onError: (error: AxiosError) => {
      console.error('회원가입 실패:', error)
      alert('회원가입에 실패했습니다. 다시 시도해주세요.')
    },
  })
}
