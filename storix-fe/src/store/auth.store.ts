// src/store/auth.store.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface AuthState {
  accessToken: string | null
  onboardingToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  marketingAgree: boolean

  setAccessToken: (token: string) => void
  setOnboardingToken: (token: string) => void
  setMarketingAgree: (agree: boolean) => void
  clearAuth: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        accessToken: null,
        onboardingToken: null,
        isAuthenticated: false,
        isLoading: false,
        marketingAgree: false,

        setAccessToken: (token: string) =>
          set({
            accessToken: token,
            isAuthenticated: true,
            onboardingToken: null,
          }),

        setOnboardingToken: (token: string) =>
          set({
            onboardingToken: token,
            isAuthenticated: false,
            accessToken: null,
          }),

        setMarketingAgree: (agree: boolean) =>
          set({
            marketingAgree: agree,
          }),

        clearAuth: () =>
          set({
            accessToken: null,
            onboardingToken: null,
            isAuthenticated: false,
            marketingAgree: false,
          }),

        setLoading: (loading: boolean) =>
          set({
            isLoading: loading,
          }),
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          // ✅ 가입 직후 토큰 유지(핵심)
          accessToken: state.accessToken,
          isAuthenticated: state.isAuthenticated,

          // 기존 유지
          onboardingToken: state.onboardingToken,
          marketingAgree: state.marketingAgree,
        }),
      },
    ),
    { name: 'auth-store' },
  ),
)
