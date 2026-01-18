import { apiClient } from '@/lib/api/axios-instance'
import { z } from 'zod'

const WorksDetailSchema = z.object({
  worksId: z.number(),
  worksName: z.string(),
  worksType: z.string(),
  thumbnailUrl: z.string().nullable().optional(),
  author: z.string().nullable().optional(),
  illustrator: z.string().nullable().optional(),
  originalAuthor: z.string().nullable().optional(),
  genre: z.string().nullable().optional(),
  platform: z.string().nullable().optional(),
  ageClassification: z.string().nullable().optional(),
  avgRating: z.number().nullable().optional(),
  description: z.string().nullable().optional(),
  hashtags: z.array(z.string()).optional(),
})

const ApiResponseSchema = z.object({
  isSuccess: z.boolean().optional(),
  code: z.string().optional(),
  message: z.string().optional(),
  result: z.any().optional(),
})

export type WorksDetail = z.infer<typeof WorksDetailSchema>

export async function getWorksDetail(worksId: number): Promise<WorksDetail> {
  const res = await apiClient.get(`/api/v1/works/${worksId}`, {
    headers: { accept: '*/*' },
  })

  const parsed = ApiResponseSchema.parse(res.data)
  return WorksDetailSchema.parse(parsed.result)
}
