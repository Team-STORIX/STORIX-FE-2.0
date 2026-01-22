// src/hooks/library/useLibraryRecentKeywords.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getLibraryRecentKeywords,
  deleteLibraryRecentKeyword,
} from '@/lib/api/library/library.api'

export const useLibraryRecentKeywords = () => {
  return useQuery({
    queryKey: ['libraryRecentKeywords'],
    queryFn: getLibraryRecentKeywords,
    refetchOnWindowFocus: false,
    staleTime: 60_000,
  })
}

export const useDeleteLibraryRecentKeyword = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (keyword: string) => deleteLibraryRecentKeyword({ keyword }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['libraryRecentKeywords'] })
    },
  })
}
