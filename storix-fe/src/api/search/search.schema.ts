// src/api/search/search.schema.ts
import { z } from 'zod'

const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    isSuccess: z.boolean(),
    code: z.string(),
    message: z.string(),
    result: dataSchema,
    timestamp: z.string(),
  })

export const WorksSearchItemSchema = z.object({
  worksId: z.number(),
  worksName: z.string(),
  artistName: z.string(),
  reviewsCount: z.coerce.number(),
  avgRating: z.coerce.number(),
  thumbnailUrl: z.string().nullable().optional(),
  worksType: z.string(),
})

export const ArtistsSearchItemSchema = z.object({
  artistId: z.number(),
  artistName: z.string(),
  profileUrl: z.string().nullable().optional(),
})

export const WorksSearchResultSchema = z
  .object({
    content: z.array(WorksSearchItemSchema).default([]),
    number: z.number().optional(),
    last: z.boolean().optional(),
    hasNext: z.boolean().optional(),
  })
  .passthrough()

export const ArtistsSearchResultSchema = z
  .object({
    content: z.array(ArtistsSearchItemSchema).default([]),
    number: z.number().optional(),
    last: z.boolean().optional(),
    hasNext: z.boolean().optional(),
  })
  .passthrough()

export const WorksSearchResponseSchema = ApiResponseSchema(
  WorksSearchResultSchema,
)
export const ArtistsSearchResponseSchema = ApiResponseSchema(
  ArtistsSearchResultSchema,
)

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

export const RecentResponseSchema = ApiResponseSchema(
  z.object({
    recentKeywords: z.array(z.string()),
  }),
)

export const DeleteRecentResponseSchema = ApiResponseSchema(z.any())

export type WorksSearchResponse = z.infer<typeof WorksSearchResponseSchema>
export type ArtistsSearchResponse = z.infer<typeof ArtistsSearchResponseSchema>
export type TrendingResponse = z.infer<typeof TrendingResponseSchema>
export type RecentResponse = z.infer<typeof RecentResponseSchema>
