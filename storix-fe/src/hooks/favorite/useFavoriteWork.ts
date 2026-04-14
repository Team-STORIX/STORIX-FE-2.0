// src/hooks/favorite/useFavoriteWork.ts
'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  favoriteWork,
  getFavoriteWorkStatus,
  unfavoriteWork,
} from '@/lib/api/favorite'

type UseFavoriteWorkOptions = {
  onAdded?: (worksId: number) => void
  onRemoved?: (worksId: number) => void
}

export function useFavoriteWork(
  worksId?: number,
  options?: UseFavoriteWorkOptions,
) {
  const queryClient = useQueryClient()

  const enabled =
    typeof worksId === 'number' && Number.isFinite(worksId) && worksId > 0

  const queryKey = useMemo(
    () => ['favorite', 'works', 'status', worksId] as const,
    [worksId],
  )

  // 콜백을 ref로 관리하여 useEffect 의존성에서 제외
  const optionsRef = useRef(options)
  optionsRef.current = options

  const statusQuery = useQuery({
    queryKey,
    queryFn: () => getFavoriteWorkStatus(worksId!), // enabled로 가드
    enabled: !!enabled,
  })

  const addMutation = useMutation({
    mutationFn: () => favoriteWork(worksId!), // enabled로 가드
  })

  const removeMutation = useMutation({
    mutationFn: () => unfavoriteWork(worksId!), // enabled로 가드
  })

  // mutation 성공 감지 (onSuccess 금지 규칙 준수: useEffect로 처리)
  useEffect(() => {
    if (!enabled) return

    if (addMutation.isSuccess) {
      optionsRef.current?.onAdded?.(worksId!)
      queryClient.invalidateQueries({ queryKey })
      addMutation.reset()
    }
    if (removeMutation.isSuccess) {
      optionsRef.current?.onRemoved?.(worksId!)
      queryClient.invalidateQueries({ queryKey })
      removeMutation.reset()
    }
  }, [
    enabled,
    worksId,
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
