// src/store/favorites.store.ts
'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type FavoritesState = {
  favoriteWorkIds: number[]
  favoriteArtistIds: number[]

  addFavoriteWork: (id: number) => void
  removeFavoriteWork: (id: number) => void
  setFavoriteWorkIds: (ids: number[]) => void

  addFavoriteArtist: (id: number) => void
  removeFavoriteArtist: (id: number) => void
  setFavoriteArtistIds: (ids: number[]) => void

  resetFavorites: () => void
}

const STORAGE_KEY = 'storix_favorites_v2'

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      // ✅ API 기반이므로 초기값은 빈 배열
      favoriteWorkIds: [],
      favoriteArtistIds: [],

      addFavoriteWork: (id) =>
        set((s) =>
          s.favoriteWorkIds.includes(id)
            ? s
            : { ...s, favoriteWorkIds: [...s.favoriteWorkIds, id] },
        ),

      removeFavoriteWork: (id) =>
        set((s) => ({
          ...s,
          favoriteWorkIds: s.favoriteWorkIds.filter((x) => x !== id),
        })),

      setFavoriteWorkIds: (ids) =>
        set(() => ({ favoriteWorkIds: Array.from(new Set(ids)) })),

      addFavoriteArtist: (id) =>
        set((s) =>
          s.favoriteArtistIds.includes(id)
            ? s
            : { ...s, favoriteArtistIds: [...s.favoriteArtistIds, id] },
        ),

      removeFavoriteArtist: (id) =>
        set((s) => ({
          ...s,
          favoriteArtistIds: s.favoriteArtistIds.filter((x) => x !== id),
        })),

      setFavoriteArtistIds: (ids) =>
        set(() => ({ favoriteArtistIds: Array.from(new Set(ids)) })),

      resetFavorites: () =>
        set(() => ({
          favoriteWorkIds: [],
          favoriteArtistIds: [],
        })),
    }),
    {
      name: STORAGE_KEY,
      version: 2,

      /**
       * ✅ migrate를 제공해서 "예전 스키마(v0/v1)"가 있어도
       * 최소한 배열 형태로 안전하게 정리해서 부팅되게 함
       */
      migrate: (persistedState: any, version) => {
        // persistedState가 없거나 이상하면 초기화
        if (!persistedState || typeof persistedState !== 'object') {
          return { favoriteWorkIds: [], favoriteArtistIds: [] }
        }

        const workIds = Array.isArray(persistedState.favoriteWorkIds)
          ? persistedState.favoriteWorkIds
          : []

        const artistIds = Array.isArray(persistedState.favoriteArtistIds)
          ? persistedState.favoriteArtistIds
          : []

        return {
          ...persistedState,
          favoriteWorkIds: workIds,
          favoriteArtistIds: artistIds,
        }
      },
    },
  ),
)
