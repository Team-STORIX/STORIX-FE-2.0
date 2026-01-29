// src/api/plus/plus.schema.ts
import { z } from 'zod'

/** 공통 응답 래퍼 */
export const createApiResponseSchema = <T extends z.ZodTypeAny>(result: T) =>
  z.object({
    isSuccess: z.boolean(),
    code: z.string(),
    message: z.string(),
    result,
    timestamp: z.string().optional(),
  })

/** ✅ 리뷰 등록 */
export const ReaderReviewCreateRequestSchema = z.object({
  worksId: z.number(),
  rating: z.union([z.string(), z.number()]).transform(String), // "0.5" 형태 보장
  isSpoiler: z.boolean(),
  content: z.string(),
})

export const ReaderReviewCreateResultSchema = z.object({
  worksId: z.number(),
  userId: z.number(),
  reviewId: z.number(),
})

export const ReaderReviewCreateResponseSchema = createApiResponseSchema(
  ReaderReviewCreateResultSchema,
)

/** ✅ 게시글 등록 */
export const ReaderBoardCreateRequestSchema = z.object({
  isWorksSelected: z.boolean(),
  worksId: z.number(),
  isSpoiler: z.boolean(),
  content: z.string(),
  files: z
    .array(
      z.object({
        objectKey: z.string(),
      }),
    )
    .default([]),
})

export const ReaderBoardCreateResponseSchema = createApiResponseSchema(z.any())

/** ✅ 게시글 이미지 presigned url 발급 */
export const BoardImagePresignRequestSchema = z.object({
  files: z.array(
    z.object({
      contentType: z.string(),
    }),
  ),
})

export const BoardImagePresignResultSchema = z.array(
  z.object({
    url: z.string(),
    objectKey: z.string(),
    expiresInSeconds: z.number(),
  }),
)

export const BoardImagePresignResponseSchema = createApiResponseSchema(
  BoardImagePresignResultSchema,
)

export type ReaderReviewCreateRequest = z.infer<
  typeof ReaderReviewCreateRequestSchema
>
export type ReaderBoardCreateRequest = z.infer<
  typeof ReaderBoardCreateRequestSchema
>
export type BoardImagePresignRequest = z.infer<
  typeof BoardImagePresignRequestSchema
>
