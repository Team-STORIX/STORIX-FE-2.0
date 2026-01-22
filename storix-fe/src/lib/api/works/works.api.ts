import { apiClient } from '@/lib/api/axios-instance'
import { z } from 'zod'
import { ApiEnvelopeSchema } from './works.schema'

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

  // ✅ swagger/서버에 따라 string으로 내려올 수도 있어서 안전 변환
  avgRating: z
    .preprocess((v) => (v == null ? v : Number(v)), z.number())
    .nullable()
    .optional(),

  // ✅ swagger 최신 스펙에서 작품 상세에서 사용하는 값
  reviewCount: z
    .preprocess((v) => (v == null ? v : Number(v)), z.number())
    .nullable()
    .optional(),

  description: z.string().nullable().optional(),
  hashtags: z.array(z.string()).optional(),
})

const WorksDetailResponseSchema = ApiEnvelopeSchema(WorksDetailSchema)

export type WorksDetail = z.infer<typeof WorksDetailSchema>

export async function getWorksDetail(worksId: number): Promise<WorksDetail> {
  const res = await apiClient.get(`/api/v1/works/${worksId}`, {
    headers: { accept: '*/*' },
  })

  const parsed = WorksDetailResponseSchema.parse(res.data)
  return parsed.result
}
