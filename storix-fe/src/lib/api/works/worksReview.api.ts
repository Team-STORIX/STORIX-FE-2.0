// src/lib/api/works/worksReview.api.ts
import { z } from 'zod'
import { apiClient } from '@/lib/api/axios-instance'
import { ApiEnvelopeSchema } from './works.schema'
import {
  WorksMyReviewSchema,
  WorksReviewDetailSchema,
  WorksReviewSliceSchema,
} from './worksReview.schema'

/**
 * GET /api/v1/works/{worksId}/review/me
 */
const WorksMyReviewResponseSchema = ApiEnvelopeSchema(WorksMyReviewSchema)

export const getWorksMyReview = async (worksId: number) => {
  const res = await apiClient.get(`/api/v1/works/${worksId}/review/me`)
  const parsed = WorksMyReviewResponseSchema.parse(res.data)
  return parsed.result
}

/**
 * GET /api/v1/works/{worksId}/review?page=
 * (swagger에 페이지네이션 명시 - 무한스크롤)
 */
const WorksReviewsResponseSchema = ApiEnvelopeSchema(WorksReviewSliceSchema)

export const getWorksReviews = async (params: {
  worksId: number
  page?: number
}) => {
  const { worksId, page = 0 } = params
  const res = await apiClient.get(`/api/v1/works/${worksId}/review`, {
    params: { page },
  })
  const parsed = WorksReviewsResponseSchema.parse(res.data)
  return parsed.result
}

/**
 * GET /api/v1/works/review/{reviewId}
 */
const WorksReviewDetailResponseSchema = ApiEnvelopeSchema(
  WorksReviewDetailSchema,
)

export const getWorksReviewDetail = async (reviewId: number) => {
  const res = await apiClient.get(`/api/v1/works/review/${reviewId}`)
  const parsed = WorksReviewDetailResponseSchema.parse(res.data)
  return parsed.result
}

/**
 * POST /api/v1/works/review/{reviewId}/like
 */
export const postWorksReviewLike = async (reviewId: number) => {
  const res = await apiClient.post(`/api/v1/works/review/${reviewId}/like`)
  // result가 비어있을 수도 있어서 느슨하게
  const parsed = ApiEnvelopeSchema(z.any()).parse(res.data)
  return parsed.result
}

/**
 * POST /api/v1/works/review/{reviewId}/report
 * (swagger에서 바디가 있을 수 있으니 optional payload 허용)
 */
export const postWorksReviewReport = async (params: {
  reviewId: number
  payload?: unknown
}) => {
  const { reviewId, payload } = params
  const res = await apiClient.post(
    `/api/v1/works/review/${reviewId}/report`,
    payload ?? {},
  )
  const parsed = ApiEnvelopeSchema(z.any()).parse(res.data)
  return parsed.result
}

/** POST /api/v1/works/{worksId}/review
 * 내 리뷰 작성 (swagger 바디 스펙에 맞춰 payload 전달)
 */

const UpdateMyReviewPayloadSchema = z.object({
  rating: z.string(), // ✅ swagger 기준 string
  isSpoiler: z.boolean(),
  content: z.string(),
})
type UpdateMyReviewPayload = z.infer<typeof UpdateMyReviewPayloadSchema>

/**
 * POST /api/v1/works/review/{reviewId}
 * 내 리뷰 수정 (swagger 바디 스펙에 맞춰 payload 전달)
 */
export const postUpdateMyReview = async (params: {
  reviewId: number
  payload: UpdateMyReviewPayload // ✅
}) => {
  const { reviewId, payload } = params
  const safePayload = UpdateMyReviewPayloadSchema.parse(payload) // ✅
  const res = await apiClient.post(
    `/api/v1/works/review/${reviewId}`,
    safePayload,
  )
  const parsed = ApiEnvelopeSchema(z.any()).parse(res.data)
  return parsed.result
}

/**
 * DELETE /api/v1/works/review/{reviewId}
 */
export const deleteMyReview = async (reviewId: number) => {
  const res = await apiClient.delete(`/api/v1/works/review/${reviewId}`)
  const parsed = ApiEnvelopeSchema(z.any()).parse(res.data)
  return parsed.result
}
