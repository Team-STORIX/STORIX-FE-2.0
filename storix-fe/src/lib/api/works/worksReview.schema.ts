// src/lib/api/works/worksReview.schema.ts
import { z } from 'zod'
import { SliceSchema } from './works.schema'

/** 내 리뷰 조회 */
export const WorksMyReviewSchema = z.object({
  reviewId: z.number(),
  content: z.string().optional(),
  isSpoiler: z.boolean().optional(),
  rating: z
    .preprocess((v) => (v == null ? v : Number(v)), z.number())
    .nullable()
    .optional(),
})

/** 다른 유저 리뷰 리스트 아이템(UI에서 쓰는 최소 필드만) */
export const WorksReviewItemSchema = z.object({
  reviewId: z.number(),
  userName: z.string().optional(),
  content: z.string().optional(),
  rating: z
    .preprocess((v) => (v == null ? v : Number(v)), z.number())
    .nullable()
    .optional(),
})

/** 다른 유저 리뷰 리스트(무한스크롤) */
export const WorksReviewSliceSchema = SliceSchema(WorksReviewItemSchema)

/** 리뷰 단건 조회 */
export const WorksReviewDetailSchema = z.object({
  reviewId: z.number(),
  userName: z.string().optional(),
  content: z.string().optional(),
  isSpoiler: z.boolean().optional(),
  rating: z
    .preprocess((v) => (v == null ? v : Number(v)), z.number())
    .nullable()
    .optional(),
  likeCount: z
    .preprocess((v) => (v == null ? v : Number(v)), z.number())
    .nullable()
    .optional(),
  isLiked: z.boolean().optional(),
})

export type WorksMyReview = z.infer<typeof WorksMyReviewSchema>
export type WorksReviewItem = z.infer<typeof WorksReviewItemSchema>
export type WorksReviewSlice = z.infer<typeof WorksReviewSliceSchema>
export type WorksReviewDetail = z.infer<typeof WorksReviewDetailSchema>
