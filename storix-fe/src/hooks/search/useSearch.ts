// src/hooks/search/useSearch.ts
import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getWorksSearch,
  getTrendingKeywords,
  getRecentKeywords,
  deleteRecentKeyword,
} from '@/lib/api/search/search.api'
import type {
  SearchGenre,
  SearchWorksType,
  WorksSort,
  WorksSearchItem,
} from '@/lib/api/search/search.schema'

/**
 *   요구사항 반영
 * - keyword 빈 문자열이면 요청 X (enabled/guard)
 * - 무한스크롤 종료 조건: 서버 응답 기반(last/empty/content length + number)
 * - 디버깅 로그:
 *   - 요청 파라미터
 *   - 응답 content 길이
 *   - getNextPageParam 판단값
 */

type SliceMeta = {
  number: number
  size: number
  last: boolean
  empty: boolean
  numberOfElements: number
  contentLen: number
}
type PagerResult<T> = {
  items: T[]
  meta: SliceMeta | null
  isLoading: boolean
  isFetching: boolean
  error: unknown
  hasNext: boolean
  requestNext: () => void
  reset: () => void
}
const shouldStop = (meta: {
  last: boolean
  empty: boolean
  contentLen: number
}) => meta.last === true || meta.empty === true || meta.contentLen === 0

export const useWorksSearchInfinite = (
  keyword: string,
  sort: WorksSort = 'NAME',
  worksTypes: SearchWorksType[] = [],
  genres: SearchGenre[] = [],
): PagerResult<WorksSearchItem> => {
  const k = keyword.trim()
  const worksTypesKey = worksTypes.join(',')
  const genresKey = genres.join(',')

  const [page, setPage] = useState(0)
  const pageRef = useRef(0)

  const [items, setItems] = useState<WorksSearchItem[]>([])
  const [meta, setMeta] = useState<SliceMeta | null>(null)
  const [hasNext, setHasNext] = useState(false)

  const requestedPagesRef = useRef<Set<number>>(new Set())
  const seenIdsRef = useRef<Set<number>>(new Set())

  const loadingRef = useRef(false)
  const stopRef = useRef(false)

  useEffect(() => {
    pageRef.current = page
  }, [page])

  const reset = () => {
    setPage(0)
    pageRef.current = 0

    setItems([])
    setMeta(null)
    setHasNext(false)

    requestedPagesRef.current.clear()
    seenIdsRef.current.clear()
    loadingRef.current = false
    stopRef.current = false

    // console.log('[PAGER][works] reset', { keyword: k, sort })
  }

  useEffect(() => {
    reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [k, sort, worksTypesKey, genresKey])

  const shouldFetch =
    k.length > 0 && !stopRef.current && !requestedPagesRef.current.has(page)

  const query = useQuery({
    queryKey: ['search', 'works', k, sort, page, worksTypes, genres],
    enabled: shouldFetch,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: async () => {
      requestedPagesRef.current.add(page)
      //console.log('[PAGER][works] fetch page', { keyword: k, sort, page })
      return getWorksSearch({ keyword: k, sort, page, worksTypes, genres })
    },
  })

  useEffect(() => {
    loadingRef.current = query.isFetching
  }, [query.isFetching])

  useEffect(() => {
    const data = query.data
    if (!data) return

    const r = data.result
    const nextMeta: SliceMeta = {
      number: r.number,
      size: r.size,
      last: r.last,
      empty: r.empty,
      numberOfElements: r.numberOfElements,
      contentLen: r.content.length,
    }

    //console.log('[PAGER][works] response meta', nextMeta)

    if (Array.isArray(r.content) && r.content.length > 0) {
      const appended: WorksSearchItem[] = []
      for (const w of r.content as WorksSearchItem[]) {
        const id = Number((w as any).worksId)
        if (!Number.isFinite(id)) continue
        if (seenIdsRef.current.has(id)) continue
        seenIdsRef.current.add(id)
        appended.push(w)
      }
      if (appended.length > 0) {
        setItems((prev) => prev.concat(appended))
      }
    }

    setMeta(nextMeta)

    const stop = shouldStop(nextMeta)
    stopRef.current = stop
    setHasNext(!stop)

    // console.log('[PAGER][works] stop 판단', { stop, hasNext: !stop })
  }, [query.data])

  useEffect(() => {
    if (query.error) {
      //console.error('[PAGER][works] query error', query.error)
    }
  }, [query.error])

  const requestNext = () => {
    if (k.length === 0) return
    if (stopRef.current) return
    if (loadingRef.current) return

    const next = pageRef.current + 1
    if (requestedPagesRef.current.has(next)) return

    // console.log('[PAGER][works] requestNext', {
    //   current: pageRef.current,
    //   next,
    // })
    setPage(next)
  }

  return {
    items,
    meta,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    hasNext,
    requestNext,
    reset,
  }
}

export const useTrendingKeywords = () =>
  useQuery({
    queryKey: ['search', 'trending'],
    queryFn: getTrendingKeywords,
    retry: false,
    refetchOnWindowFocus: false,
  })

export const useRecentKeywords = () =>
  useQuery({
    queryKey: ['search', 'recent'],
    queryFn: getRecentKeywords,
    retry: false,
    refetchOnWindowFocus: false,
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
