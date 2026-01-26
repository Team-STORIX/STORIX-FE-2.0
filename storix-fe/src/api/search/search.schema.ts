// src/api/search/search.schema.ts
import { z } from 'zod'

/**
 *   works/artists 실응답 구조(확정):
 * {
 *   isSuccess, code, message,
 *   result: {
 *     result: { content, pageable, number, size, last, empty, ... },
 *     fallbackRecommendation: string
 *   },
 *   timestamp
 * }
 *
 * 그런데 FE는 기존에 result가 "페이지 객체"라고 가정하고 쓰는 곳이 많아서,
 * - Raw(실응답) 스키마로 먼저 파싱한 뒤
 * - API 레이어에서 result를 내부 result로 정규화해서 내려주는 방식으로 유지한다.
 */

// 공통 응답 래퍼
const ApiResponseSchema = <T extends z.ZodTypeAny>(resultSchema: T) =>
  z.object({
    isSuccess: z.boolean(),
    code: z.string(),
    message: z.string(),
    result: resultSchema,
    timestamp: z.string().optional(),
  })

/** ---- works/artists 페이지 객체(실응답 기준) ---- */
const PageableSchema = z
  .object({
    pageNumber: z.coerce.number(),
    pageSize: z.coerce.number(),
    //   기존: sort: z.array(z.any()).default([]),
    sort: z.any().optional(),
    offset: z.coerce.number(),
    unpaged: z.boolean(),
    paged: z.boolean(),
  })
  .passthrough()

const SortItemSchema = z
  .object({
    direction: z.string().optional(),
    property: z.string().optional(),
    ignoreCase: z.boolean().optional(),
    nullHandling: z.string().optional(),
    ascending: z.boolean().optional(),
    descending: z.boolean().optional(),
  })
  .passthrough()

const SliceSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z
    .object({
      content: z.array(itemSchema).default([]),
      number: z.coerce.number(),
      size: z.coerce.number(),
      numberOfElements: z.coerce.number(),
      first: z.boolean(),
      last: z.boolean(),
      empty: z.boolean(),

      pageable: PageableSchema,
      //   기존: sort: z.array(SortItemSchema).default([]),
      sort: z.any().optional(),
    })
    .passthrough()

/** Works item */
export const WorksSearchItemSchema = z
  .object({
    worksId: z.coerce.number(),
    worksName: z.string(),
    artistName: z.string(),
    reviewsCount: z.coerce.number(),
    avgRating: z.coerce.number(),
    thumbnailUrl: z.string().nullable().optional(),
    worksType: z.string(),
  })
  .passthrough()

/** Artists item */
export const ArtistsSearchItemSchema = z
  .object({
    artistId: z.coerce.number(),
    artistName: z.string(),
    profileUrl: z.string().nullable().optional(),
  })
  .passthrough()

/**   Raw(실응답) 스키마 */
export const WorksSearchRawResponseSchema = ApiResponseSchema(
  z.object({
    result: SliceSchema(WorksSearchItemSchema),
    fallbackRecommendation: z.string().nullable().optional(),
  }),
)

export const ArtistsSearchRawResponseSchema = ApiResponseSchema(
  z.object({
    result: SliceSchema(ArtistsSearchItemSchema),
    fallbackRecommendation: z.string().nullable().optional(),
  }),
)

/**   Normalized(기존 FE 호환) 스키마: result가 곧 Slice */
export const WorksSearchResponseSchema = ApiResponseSchema(
  SliceSchema(WorksSearchItemSchema),
)
export const ArtistsSearchResponseSchema = ApiResponseSchema(
  SliceSchema(ArtistsSearchItemSchema),
)

/** ---- trending/recent (아직 실응답 JSON을 못 봐서 result 중첩만 방어적으로 언랩) ---- */
const unwrapResultOnce = (raw: unknown) => {
  const obj = raw as any
  if (!obj || typeof obj !== 'object') return raw
  return {
    ...obj,
    result: obj?.result?.result ?? obj?.result,
  }
}

const ApiResponseUnwrapSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.preprocess(unwrapResultOnce, ApiResponseSchema(dataSchema))

/** Trending */
export const TrendingKeywordSchema = z
  .object({
    keyword: z.string(),
    rank: z.coerce.number(),
    status: z.string().optional(),
  })
  .passthrough()

export const TrendingResponseSchema = ApiResponseUnwrapSchema(
  z
    .object({
      trendingKeywords: z.array(TrendingKeywordSchema).default([]),
    })
    .passthrough(),
)

/** Recent */
export const RecentResponseSchema = ApiResponseUnwrapSchema(
  z
    .object({
      recentKeywords: z.array(z.string()).default([]),
    })
    .passthrough(),
)

/** Delete recent */
export const DeleteRecentResponseSchema = ApiResponseUnwrapSchema(z.any())

export type WorksSort = 'NAME' | 'RATING' | 'REVIEW'
export type WorksSearchItem = z.infer<typeof WorksSearchItemSchema>
export type ArtistsSearchItem = z.infer<typeof ArtistsSearchItemSchema>
export type TrendingKeyword = z.infer<typeof TrendingKeywordSchema>
