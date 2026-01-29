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
 *   서버 응답: { profile: {...}, review: {...} } 형태를 UI에서 쓰는 flat 형태로 normalize
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
  //   필요해질 수 있어 같이 보관(현재 UI에서 안 써도 무해)
  userId: z.number().optional(),
  profileImageUrl: z.string().nullable().optional(),
})

export const WorksReviewItemSchema = z.preprocess((input) => {
  //   최신 응답 형태: { profile: { userId, profileImageUrl, nickName }, review: { reviewId, isSpoiler, content } }
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

  //   혹시 기존(flat) 형태가 섞여와도 그대로 통과
  return input
}, WorksReviewItemOutputSchema)

/** 다른 유저 리뷰 리스트(무한스크롤) */
export const WorksReviewSliceSchema = SliceSchema(WorksReviewItemSchema)

/** 리뷰 단건 조회 */
//  서버 응답이 flat / nested 형태로 섞여올 수 있어 UI에서 쓰는 flat 형태로 normalize
const WorksReviewDetailOutputSchema = z.object({
  reviewId: z.number(),
  userName: z.string().optional(),
  profileImageUrl: z.string().nullable().optional(),
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
  createdAt: z.string().optional(),
  lastCreatedTime: z.string().optional(),
  worksId: z.number().optional(),
  worksName: z.string().optional(),
  artistName: z.string().optional(),
  worksType: z.string().optional(),
  thumbnailUrl: z.string().optional(),
})

export const WorksReviewDetailSchema = z.preprocess((input) => {
  if (input && typeof input === 'object') {
    // 서버가 result를 중첩해서 내려주는 케이스 방어 ({ result: { result: ... } })
    let obj: any = input
    for (let i = 0; i < 3; i++) {
      if (obj && typeof obj === 'object' && 'result' in obj) {
        const next = (obj as any).result
        if (next && typeof next === 'object') obj = next
        else break
      } else {
        break
      }
    }

    // 최신/가능성 높은 응답 형태: { profile: {...}, works: {...}, review: {...} }
    if (obj.profile && obj.review) {
      return {
        reviewId: obj.review?.reviewId,
        userName: obj.profile?.nickName ?? obj.profile?.userName,
        profileImageUrl: obj.profile?.profileImageUrl,
        content: obj.review?.content,
        isSpoiler: obj.review?.isSpoiler,
        rating: obj.review?.rating,
        likeCount: obj.review?.likeCount,
        isLiked: obj.review?.isLiked,
        createdAt: obj.review?.createdAt ?? obj.review?.createdDate,
        lastCreatedTime: obj.review?.lastCreatedTime,
        worksId: obj.works?.worksId ?? obj.review?.worksId,
        worksName: obj.works?.worksName ?? obj.works?.title,
        artistName: obj.works?.artistName,
        worksType: obj.works?.worksType,
        thumbnailUrl: obj.works?.thumbnailUrl,
      }
    }

    // 혹시 { works: {...}, ...review fields... } 형태
    if (obj.works && (obj.reviewId || obj.review?.reviewId)) {
      return {
        reviewId: obj.reviewId ?? obj.review?.reviewId,
        userName: obj.userName,
        profileImageUrl: obj.profileImageUrl,
        content: obj.content,
        isSpoiler: obj.isSpoiler,
        rating: obj.rating,
        likeCount: obj.likeCount,
        isLiked: obj.isLiked,
        createdAt: obj.createdAt ?? obj.createdDate,
        lastCreatedTime: obj.lastCreatedTime,
        worksId: obj.works?.worksId,
        worksName: obj.works?.worksName ?? obj.works?.title,
        artistName: obj.works?.artistName,
        worksType: obj.works?.worksType,
        thumbnailUrl: obj.works?.thumbnailUrl,
      }
    }
  }

  // flat 형태는 그대로 통과
  return input
}, WorksReviewDetailOutputSchema)

export type WorksMyReview = z.infer<typeof WorksMyReviewSchema>
export type WorksReviewItem = z.infer<typeof WorksReviewItemSchema>
export type WorksReviewSlice = z.infer<typeof WorksReviewSliceSchema>
export type WorksReviewDetail = z.infer<typeof WorksReviewDetailSchema>
