// src/hooks/library/useLibrarySearchWorks.ts
import { useInfiniteQuery } from '@tanstack/react-query'
import { getLibrarySearchWorks } from '@/lib/api/library/library.api'

export const useLibrarySearchWorksInfinite = (keyword: string) => {
  return useInfiniteQuery({
    queryKey: ['librarySearchWorks', keyword],
    enabled: !!keyword,
    queryFn: ({ pageParam }) =>
      getLibrarySearchWorks({ keyword, page: Number(pageParam) }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      // ✅ lastPage 자체가 Page/Slice 형태 (slice 래핑 없음)
      if (lastPage.last || lastPage.empty) return undefined
      return (lastPage.number ?? 0) + 1
    },
  })
}
