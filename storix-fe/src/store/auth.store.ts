// src/store/auth.store.ts

import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'

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

        setAccessToken: (token) =>
          set({
            accessToken: token,
            isAuthenticated: true,
            onboardingToken: null,
          }),

        setOnboardingToken: (token) =>
          set({
            onboardingToken: token,
            isAuthenticated: false,
            accessToken: null,
          }),

        setMarketingAgree: (agree) => set({ marketingAgree: agree }),

        clearAuth: () =>
          set({
            accessToken: null,
            onboardingToken: null,
            isAuthenticated: false,
            marketingAgree: false,
          }),

        setLoading: (loading) => set({ isLoading: loading }),
      }),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => sessionStorage), // ✅ 세션스토리지로
        partialize: (state) => ({
          accessToken: state.accessToken, // ✅ 추가
          onboardingToken: state.onboardingToken, // 유지
          marketingAgree: state.marketingAgree, // 유지
        }),
      },
    ),
    { name: 'auth-store' },
  ),
)
