// src/hooks/auth/useSignup.ts
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { signup } from '@/api/auth/signup.api'
import { useAuthStore } from '@/store/auth.store'
import type { SignupRequest } from '@/api/auth/auth.schema'
import { AxiosError } from 'axios'

export const useSignup = () => {
  const router = useRouter()

  const onboardingToken = useAuthStore((s) => s.onboardingToken)
  const setAccessToken = useAuthStore((s) => s.setAccessToken)
  const clearAuth = useAuthStore((s) => s.clearAuth)

  return useMutation({
    mutationFn: async (data: SignupRequest) => {
      if (!onboardingToken) {
        // ✅ 여기서 바로 안내 띄우고 로그인으로 보냄
        const msg = '인증 정보가 없습니다. 재로그인이 필요합니다.'
        console.error(msg)

        clearAuth()
        alert(msg)
        router.replace('/login')

        // ✅ mutation 흐름도 중단
        throw new Error(msg)
      }

      return signup(data, onboardingToken)
    },

    onSuccess: async (response) => {
      const token = response.result.accessToken
      setAccessToken(token)

      // ✅ 온보딩(회원가입) 완료 직후: manual 노출 → manual에서 home으로
      router.replace('/manual')
    },

    onError: (error: unknown) => {
      // ✅ onboardingToken 누락으로 우리가 던진 에러면 여기서 중복 alert/redirect 안 함
      if (error instanceof Error && error.message.includes('재로그인이 필요')) {
        return
      }

      console.error('회원가입 실패:', error)

      // AxiosError면 메시지 조금 더 보기 좋게 뽑기(선택)
      const serverMsg =
        (error as AxiosError<any>)?.response?.data?.message ||
        (error as AxiosError<any>)?.response?.data?.error ||
        null

      clearAuth()
      alert(serverMsg ?? '회원가입에 실패했습니다. 다시 시도해주세요.')
    },
  })
}
