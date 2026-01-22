// src/hooks/search/useWorksSearch.ts

import { useQuery } from '@tanstack/react-query'
import { getWorksSearch } from '@/lib/api/search/search.api'
import type { WorksSort } from '@/lib/api/search/search.schema'

export function useWorksSearch(params: {
  keyword: string
  sort?: WorksSort
  page?: number
}) {
  const { keyword, sort = 'NAME', page = 0 } = params
  const k = keyword.trim()

  return useQuery({
    queryKey: ['search', 'works', k, sort, page],
    enabled: !!k,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: () => getWorksSearch({ keyword: k, sort, page }),
  })
}
