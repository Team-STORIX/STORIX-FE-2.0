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
/** 다른 유저 리뷰 리스트 아이템(UI에서 쓰는 최소 필드만)
 * ✅ 서버 응답: { profile: {...}, review: {...} } 형태를 UI에서 쓰는 flat 형태로 normalize
 */
const WorksReviewItemOutputSchema = z.object({
  reviewId: z.number(),
  userName: z.string().optional(),
  content: z.string().optional(),
  isSpoiler: z.boolean().optional(),
  rating: z
    .preprocess((v) => (v == null ? v : Number(v)), z.number())
    .nullable()
    .optional(),
  // ✅ 필요해질 수 있어 같이 보관(현재 UI에서 안 써도 무해)
  userId: z.number().optional(),
  profileImageUrl: z.string().nullable().optional(),
})

export const WorksReviewItemSchema = z.preprocess((input) => {
  // ✅ 최신 응답 형태: { profile: { userId, profileImageUrl, nickName }, review: { reviewId, isSpoiler, content } }
  if (input && typeof input === 'object') {
    const obj = input as any
    if (obj.profile && obj.review) {
      return {
        reviewId: obj.review?.reviewId,
        userName: obj.profile?.nickName,
        content: obj.review?.content,
        isSpoiler: obj.review?.isSpoiler,
        rating: obj.review?.rating,
        userId: obj.profile?.userId,
        profileImageUrl: obj.profile?.profileImageUrl,
      }
    }
  }

  // ✅ 혹시 기존(flat) 형태가 섞여와도 그대로 통과
  return input
}, WorksReviewItemOutputSchema)

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
