// src/hooks/plus/usePlusWorksSearch.ts
import { useInfiniteQuery } from '@tanstack/react-query'
import { getPlusWorksSearch } from '@/lib/api/plus/plus.api'

type Params = {
  keyword: string
  size?: number
}

/**   [+] 작품 검색 (무한스크롤) */
export function usePlusWorksSearch({ keyword, size = 20 }: Params) {
  const k = keyword.trim()

  return useInfiniteQuery({
    queryKey: ['plus', 'worksSearch', k, size], // ✅
    queryFn: ({ pageParam }) =>
      getPlusWorksSearch({ keyword: k, page: pageParam as number, size }),
    initialPageParam: 0,
    enabled: !!k, //
    retry: false, // ✅
    refetchOnWindowFocus: false, // ✅
    refetchOnReconnect: false, // ✅
    getNextPageParam: (lastPage) => {
      const slice = lastPage.result
      if (slice.last || slice.empty) return undefined
      const current = slice.number ?? 0
      return current + 1
    },
  })
}
