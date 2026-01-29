// src/lib/api/preference/preference.schema.ts
import { z } from 'zod'
import { GenreKeySchema } from '@/lib/api/auth/auth.schema'

// ✅ 공통 응답 래퍼(필요 필드만 정확히)
const ApiEnvelopeSchema = <T extends z.ZodTypeAny>(resultSchema: T) =>
  z.object({
    isSuccess: z.boolean(),
    code: z.string(),
    message: z.string(),
    result: resultSchema,
    timestamp: z.string().optional(),
  })

/** GET /api/v1/preference/exploration */
export const PreferenceExplorationWorkSchema = z
  .object({
    worksId: z.coerce.number(),
    worksName: z.string(),
    thumbnailUrl: z.string().nullable().optional(),
    artistName: z.string(),
    platform: z.string(),
    genre: z.string(),
    description: z.string(),
    hashtags: z.array(z.string()).default([]),
  })
  .passthrough()

export const PreferenceExplorationResponseSchema = ApiEnvelopeSchema(
  z.array(PreferenceExplorationWorkSchema).default([]),
)

/** POST /api/v1/preference/exploration */
export const PreferenceAnalyzeRequestSchema = z.object({
  worksId: z.number(),
  isLiked: z.boolean(),
})
export type PreferenceAnalyzeRequest = z.infer<
  typeof PreferenceAnalyzeRequestSchema
>

export const PreferenceAnalyzeResponseSchema = ApiEnvelopeSchema(z.string())

/** GET /api/v1/preference/stats */
export const PreferenceStatItemSchema = z.object({
  genre: GenreKeySchema,
  score: z.coerce.number(),
})
export const PreferenceStatsResponseSchema = ApiEnvelopeSchema(
  z.array(PreferenceStatItemSchema).default([]),
)

/** GET /api/v1/preference/results */
export const PreferenceResultWorkSchema = z
  .object({
    worksId: z.coerce.number(),
    worksName: z.string(),
    author: z.string(),
    illustrator: z.string(),
    originalAuthor: z.string(),
    thumbnailUrl: z.string().nullable().optional(),
    worksType: z.string(),
    genre: GenreKeySchema,
  })
  .passthrough()

export const PreferenceResultsSchema = z.object({
  likedWorks: z.array(PreferenceResultWorkSchema).default([]),
  dislikedWorks: z.array(PreferenceResultWorkSchema).default([]),
})

export const PreferenceResultsResponseSchema = ApiEnvelopeSchema(
  PreferenceResultsSchema,
)

export type PreferenceExplorationWork = z.infer<
  typeof PreferenceExplorationWorkSchema
>
export type PreferenceResultWork = z.infer<typeof PreferenceResultWorkSchema>
export type PreferenceStatItem = z.infer<typeof PreferenceStatItemSchema>
