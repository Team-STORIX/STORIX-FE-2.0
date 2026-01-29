// src/hooks/works/useWorksReviews.ts
'use client'

import { useEffect } from 'react'
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  deleteMyReview,
  getWorksMyReview,
  getWorksReviewDetail,
  getWorksReviews,
  postUpdateMyReview,
  postWorksReviewLike,
  postWorksReviewReport,
} from '@/lib/api/works'

export const useWorksMyReview = (worksId: number) => {
  return useQuery({
    queryKey: ['works', 'review', 'me', worksId],
    enabled: Number.isFinite(worksId) && worksId > 0,
    queryFn: () => getWorksMyReview(worksId),
  })
}

export const useWorksReviewsInfinite = (worksId: number) => {
  return useInfiniteQuery({
    queryKey: ['works', 'review', 'list', worksId],
    enabled: Number.isFinite(worksId) && worksId > 0,
    queryFn: ({ pageParam }) =>
      getWorksReviews({ worksId, page: Number(pageParam) }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.last || lastPage.empty) return undefined
      return (lastPage.number ?? 0) + 1
    },
  })
}

export const useWorksReviewDetail = (reviewId: number) => {
  return useQuery({
    queryKey: ['works', 'review', 'detail', reviewId],
    enabled: Number.isFinite(reviewId) && reviewId > 0,
    queryFn: () => getWorksReviewDetail(reviewId),
  })
}

/**
 * mutations
 * - 훅 옵션 onSuccess 사용 금지(A안) → isSuccess 변화 감지해서 invalidate
 */

export const useLikeWorksReview = (params: { worksId: number }) => {
  const qc = useQueryClient()
  const m = useMutation({
    mutationFn: (reviewId: number) => postWorksReviewLike(reviewId),
  })

  useEffect(() => {
    if (!m.isSuccess) return
    qc.invalidateQueries({
      queryKey: ['works', 'review', 'list', params.worksId],
    })
    qc.invalidateQueries({ queryKey: ['works', 'review', 'detail'] })
  }, [m.isSuccess, qc, params.worksId])

  return m
}

export const useReportWorksReview = () => {
  const m = useMutation({
    mutationFn: (p: { reviewId: number; payload?: unknown }) =>
      postWorksReviewReport(p),
  })
  return m
}

export const useUpdateMyReview = (params: { worksId: number }) => {
  const qc = useQueryClient()
  const m = useMutation({
    mutationFn: (p: { reviewId: number; payload: unknown }) =>
      postUpdateMyReview(p),
  })

  useEffect(() => {
    if (!m.isSuccess) return
    qc.invalidateQueries({
      queryKey: ['works', 'review', 'me', params.worksId],
    })
    qc.invalidateQueries({
      queryKey: ['works', 'review', 'list', params.worksId],
    })
    qc.invalidateQueries({ queryKey: ['works', 'review', 'detail'] })
  }, [m.isSuccess, qc, params.worksId])

  return m
}

export const useDeleteMyReview = (params: { worksId: number }) => {
  const qc = useQueryClient()
  const m = useMutation({
    mutationFn: (reviewId: number) => deleteMyReview(reviewId),
  })

  useEffect(() => {
    if (!m.isSuccess) return
    qc.invalidateQueries({
      queryKey: ['works', 'review', 'me', params.worksId],
    })
    qc.invalidateQueries({
      queryKey: ['works', 'review', 'list', params.worksId],
    })
  }, [m.isSuccess, qc, params.worksId])

  return m
}
