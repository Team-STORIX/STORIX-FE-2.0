// src/hooks/favorite/useFavoriteWork.ts
'use client'

import { useEffect, useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  favoriteWork,
  getFavoriteWorkStatus,
  unfavoriteWork,
} from '@/lib/api/favorite'

export function useFavoriteWork(worksId?: number) {
  const queryClient = useQueryClient()

  const enabled =
    typeof worksId === 'number' && Number.isFinite(worksId) && worksId > 0

  const queryKey = useMemo(
    () => ['favorite', 'works', 'status', worksId] as const,
    [worksId],
  )

  const statusQuery = useQuery({
    queryKey,
    queryFn: () => getFavoriteWorkStatus(worksId!), // ✅ enabled로 가드
    enabled: !!enabled,
  })

  const addMutation = useMutation({
    mutationFn: () => favoriteWork(worksId!), // ✅ enabled로 가드
  })

  const removeMutation = useMutation({
    mutationFn: () => unfavoriteWork(worksId!), // ✅ enabled로 가드
  })

  // ✅ mutation 성공 시 invalidateQueries (onSuccess 금지 규칙 준수)
  useEffect(() => {
    if (addMutation.isSuccess || removeMutation.isSuccess) {
      queryClient.invalidateQueries({ queryKey }) // ✅
      addMutation.reset() // ✅
      removeMutation.reset() // ✅
    }
  }, [
    addMutation.isSuccess,
    removeMutation.isSuccess,
    queryClient,
    queryKey,
    addMutation,
    removeMutation,
  ])

  const toggleFavorite = async () => {
    if (!enabled) return
    const current = statusQuery.data ?? false
    if (current) {
      await removeMutation.mutateAsync()
    } else {
      await addMutation.mutateAsync()
    }
  }

  return {
    isFavorite: statusQuery.data ?? false,
    isLoading: statusQuery.isLoading,
    isMutating: addMutation.isPending || removeMutation.isPending,
    toggleFavorite,
  }
}
