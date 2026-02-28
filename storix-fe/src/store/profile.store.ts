// src/store/profile.store.ts
import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import type { MeProfileResult } from '@/api/profile/profile.api'

type ProfileState = {
  me: MeProfileResult | null
  setMe: (me: MeProfileResult) => void
  patchMe: (partial: Partial<MeProfileResult>) => void
  clearMe: () => void
}

export const useProfileStore = create<ProfileState>()(
  devtools(
    persist(
      (set, get) => ({
        me: null,

        setMe: (me) => set({ me }),

        patchMe: (partial) => {
          const prev = get().me
          if (!prev) return
          set({ me: { ...prev, ...partial } })
        },

        clearMe: () => set({ me: null }),
      }),
      {
        name: 'profile-storage',
        storage: createJSONStorage(() => {
          if (typeof window === 'undefined') {
            return { getItem: () => null, setItem: () => {}, removeItem: () => {} }
          }
          return sessionStorage
        }),
        partialize: (s) => ({ me: s.me }),
      },
    ),
    { name: 'profile-store' },
  ),
)
