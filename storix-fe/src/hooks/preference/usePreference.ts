// src/hooks/preference/usePreference.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getPreferenceExploration,
  getPreferenceResults,
  getPreferenceStats,
  postPreferenceAnalyze,
} from '@/lib/api/preference'
import type { PreferenceAnalyzeRequest } from '@/lib/api/preference'

export const usePreferenceExploration = () => {
  return useQuery({
    queryKey: ['preference', 'exploration'],
    queryFn: getPreferenceExploration,
    staleTime: 0,
    refetchOnWindowFocus: false,
  })
}

export const usePreferenceResults = (enabled = true) => {
  return useQuery({
    queryKey: ['preference', 'results'],
    queryFn: getPreferenceResults,
    enabled,
    staleTime: 0,
    refetchOnWindowFocus: false,
  })
}

export const usePreferenceStats = (enabled = true) => {
  return useQuery({
    queryKey: ['preference', 'stats'],
    queryFn: getPreferenceStats,
    enabled,
    staleTime: 0,
    refetchOnWindowFocus: false,
  })
}

export const usePreferenceAnalyze = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (p: PreferenceAnalyzeRequest) => postPreferenceAnalyze(p),
    onSettled: async () => {
      // ✅ onSuccess 금지 룰 준수: onSettled에서 invalidate만
      await qc.invalidateQueries({ queryKey: ['preference', 'results'] })
      await qc.invalidateQueries({ queryKey: ['preference', 'stats'] })
    },
  })
}
