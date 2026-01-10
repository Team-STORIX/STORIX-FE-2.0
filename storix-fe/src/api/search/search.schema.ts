// src/api/search/search.schema.ts
import { z } from 'zod'

// 공통 응답 래퍼
const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    isSuccess: z.boolean(),
    code: z.string(),
    message: z.string(),
    result: dataSchema,
    timestamp: z.string().optional(),
  })

/** Works item */
export const WorksSearchItemSchema = z.object({
  worksId: z.coerce.number(),
  worksName: z.string(),
  artistName: z.string(),
  reviewsCount: z.coerce.number(),
  avgRating: z.coerce.number(),
  thumbnailUrl: z.string().nullable().optional(),
  worksType: z.string(),
})

/** Artists item */
export const ArtistsSearchItemSchema = z.object({
  artistId: z.coerce.number(),
  artistName: z.string(),
  profileUrl: z.string().nullable().optional(),
})

/** Slice 형태(무한스크롤) */
const SliceSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z
    .object({
      content: z.array(itemSchema).default([]),
      number: z.number().optional(), // 현재 페이지
      last: z.boolean().optional(), // 마지막 여부
      hasNext: z.boolean().optional(), // 있으면 사용
      size: z.number().optional(),
      numberOfElements: z.number().optional(),
      first: z.boolean().optional(),
      empty: z.boolean().optional(),
    })
    .passthrough()

export const WorksSearchResponseSchema = ApiResponseSchema(
  SliceSchema(WorksSearchItemSchema),
)
export const ArtistsSearchResponseSchema = ApiResponseSchema(
  SliceSchema(ArtistsSearchItemSchema),
)

/** Trending */
export const TrendingKeywordSchema = z.object({
  keyword: z.string(),
  rank: z.coerce.number(),
  status: z.string(),
})
export const TrendingResponseSchema = ApiResponseSchema(
  z.object({
    trendingKeywords: z.array(TrendingKeywordSchema),
  }),
)

/** Recent */
export const RecentResponseSchema = ApiResponseSchema(
  z.object({
    recentKeywords: z.array(z.string()),
  }),
)

/** Delete recent */
export const DeleteRecentResponseSchema = ApiResponseSchema(z.any())

export type WorksSort = 'NAME' | 'RATING' | 'REVIEW'
export type WorksSearchItem = z.infer<typeof WorksSearchItemSchema>
export type ArtistsSearchItem = z.infer<typeof ArtistsSearchItemSchema>
export type TrendingKeyword = z.infer<typeof TrendingKeywordSchema>
