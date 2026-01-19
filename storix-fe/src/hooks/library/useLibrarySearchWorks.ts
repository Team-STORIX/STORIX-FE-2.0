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
      const slice = lastPage.slice
      if (slice.last || slice.empty) return undefined
      return (slice.number ?? 0) + 1
    },
  })
}
