// src/hooks/search/useSearch.ts
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  getWorksSearch,
  getArtistsSearch,
  getTrendingKeywords,
  getRecentKeywords,
  deleteRecentKeyword,
} from '@/api/search/search.api'

const getNextPage = (lastPage: any, allPages: any[]) => {
  const r = lastPage?.result
  if (!r) return undefined
  if (typeof r.last === 'boolean' && r.last) return undefined
  if (typeof r.hasNext === 'boolean' && !r.hasNext) return undefined
  if (typeof r.number === 'number') return r.number + 1
  return allPages.length
}

export const useWorksSearchInfinite = (
  keyword: string,
  sort: 'NAME' | 'RATING' | 'REVIEW' = 'NAME',
) =>
  useInfiniteQuery({
    queryKey: ['search', 'works', keyword, sort],
    enabled: keyword.trim().length > 0,
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getWorksSearch({ keyword, sort, page: Number(pageParam) }),
    getNextPageParam: (lastPage, allPages) => getNextPage(lastPage, allPages),
  })

export const useArtistsSearchInfinite = (keyword: string) =>
  useInfiniteQuery({
    queryKey: ['search', 'artists', keyword],
    enabled: keyword.trim().length > 0,
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getArtistsSearch({ keyword, page: Number(pageParam) }),
    getNextPageParam: (lastPage, allPages) => getNextPage(lastPage, allPages),
  })

export const useTrendingKeywords = () =>
  useQuery({
    queryKey: ['search', 'trending'],
    queryFn: getTrendingKeywords,
  })

export const useRecentKeywords = () =>
  useQuery({
    queryKey: ['search', 'recent'],
    queryFn: getRecentKeywords,
  })

export const useDeleteRecentKeyword = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (keyword: string) => deleteRecentKeyword(keyword),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['search', 'recent'] })
    },
  })
}
