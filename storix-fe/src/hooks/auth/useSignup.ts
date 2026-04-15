// src/hooks/auth/useSignup.ts
import { useMutation } from '@tanstack/react-query'
import { signup } from '@/lib/api/auth/signup.api'
import { useAuthStore } from '@/store/auth.store'
import type { SignupRequest } from '@/lib/api/auth/auth.schema'
import { AxiosError } from 'axios'

// 회원가입 후 프로필 이미지 업로드 작업을 caller 에서 이어가기 위해
// 네비게이션 X, accessToken 만 전역 스토어에 심음
export const useSignup = () => {
  const setAccessToken = useAuthStore((s) => s.setAccessToken)
  const clearAuth = useAuthStore((s) => s.clearAuth)

  return useMutation({
    mutationFn: async (data: SignupRequest) => {
      const onboardingToken = useAuthStore.getState().onboardingToken
      if (!onboardingToken) throw new Error('Onboarding token is missing')
      return signup(data, onboardingToken)
    },

    onSuccess: (response) => {
      const token = response.result.accessToken
      setAccessToken(token)
    },

    onError: (error: AxiosError) => {
      console.error('[SIGNUP] FAIL', {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
      })
      clearAuth()
      alert('회원가입에 실패했습니다. 다시 시도해주세요.')
    },
  })
}
