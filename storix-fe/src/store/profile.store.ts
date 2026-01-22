// src/store/profile.store.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { MeProfileResult } from '@/lib/api/profile/profile.api'

type ProfileState = {
  me: MeProfileResult | null
  setMe: (me: MeProfileResult) => void
  patchMe: (partial: Partial<MeProfileResult>) => void
  clearMe: () => void
}

export const useProfileStore = create<ProfileState>()(
  devtools(
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
    { name: 'profile-store' },
  ),
)
