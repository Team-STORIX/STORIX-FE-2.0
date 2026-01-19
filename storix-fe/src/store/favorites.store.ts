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

/**
 * ✅ 여기서 “초기 더미 관심값”을 통일해서 박아둠
 * - hi: 80
 * - 아지: 88
 */
const DEFAULT_FAVORITE_WORK_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const DEFAULT_FAVORITE_ARTIST_IDS = [80, 88, 101, 102, 103]

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteWorkIds: DEFAULT_FAVORITE_WORK_IDS,
      favoriteArtistIds: DEFAULT_FAVORITE_ARTIST_IDS,

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
          favoriteWorkIds: DEFAULT_FAVORITE_WORK_IDS,
          favoriteArtistIds: DEFAULT_FAVORITE_ARTIST_IDS,
        })),
    }),
    {
      name: 'storix_favorites_v1',
      version: 0,
    },
  ),
)
