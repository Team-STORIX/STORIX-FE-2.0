// src/hooks/preference/usePreferenceExploration.ts
import { useQuery } from '@tanstack/react-query'
import { getPreferenceExploration } from '@/lib/api/preference'

type Options = {
  enabled?: boolean
}

export function usePreferenceExploration(options?: Options) {
  const enabled = options?.enabled ?? true

  return useQuery({
    queryKey: ['preference', 'exploration'],
    queryFn: getPreferenceExploration,
    enabled,
  })
}
