// src/store/auth.store.ts

import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { useLikesStore } from './likes.store'
import { useProfileStore } from './profile.store'

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

        setAccessToken: (token) => {
          set({
            accessToken: token,
            isAuthenticated: true,
            onboardingToken: null,
          })
        },

        setOnboardingToken: (token) => {
          set({
            onboardingToken: token,
            isAuthenticated: false,
            accessToken: null,
          })
        },

        setMarketingAgree: (agree) => set({ marketingAgree: agree }),

        clearAuth: () => {
          useLikesStore.getState().clearLikes()
          useProfileStore.getState().clearMe()

          set({
            accessToken: null,
            onboardingToken: null,
            isAuthenticated: false,
            marketingAgree: false,
          })
        },

        setLoading: (loading) => set({ isLoading: loading }),
      }),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => {
          if (typeof window === 'undefined') {
            return {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
          }
          return sessionStorage
        }),
        partialize: (state) => ({
          accessToken: state.accessToken,
          onboardingToken: state.onboardingToken,
          marketingAgree: state.marketingAgree,
        }),
        onRehydrateStorage: () => (state) => {
          if (!state) return
          state.isAuthenticated = !!state.accessToken
        },
      },
    ),
    { name: 'auth-store' },
  ),
)
