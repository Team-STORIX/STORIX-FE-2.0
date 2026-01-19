// src/hooks/library/useLibraryReview.ts
import { useInfiniteQuery } from '@tanstack/react-query'

import {
  getLibraryReview,
  type LibraryReviewSort,
} from '@/lib/api/library/library.api'

type UseLibraryReviewInfiniteParams = {
  sort?: LibraryReviewSort
}

export const useLibraryReviewInfinite = ({
  sort = 'LATEST',
}: UseLibraryReviewInfiniteParams = {}) => {
  return useInfiniteQuery({
    queryKey: ['libraryReview', sort],
    queryFn: ({ pageParam }) =>
      getLibraryReview({ sort, page: Number(pageParam) }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const slice = lastPage.result
      if (slice.last || slice.empty) return undefined

      const current = slice.number ?? 0
      return current + 1
    },

    // ✅ “새로고침/직접 invalidate 할 때만” 다시 가져오게
    refetchOnWindowFocus: false,
    staleTime: 30_000,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: 0,
  })
}
