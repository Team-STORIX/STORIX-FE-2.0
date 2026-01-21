// src/lib/api/topicroom/topicroom.schema.ts
import { z } from 'zod'

// ✅ 공통 Envelope/Slice는 프로젝트 내 기존 패턴과 동일하게 사용
export const ApiEnvelopeSchema = <T extends z.ZodTypeAny>(result: T) =>
  z.object({
    isSuccess: z.boolean(),
    code: z.string().optional(),
    message: z.string().optional(),
    result,
    timestamp: z.string().optional(),
  })

export const SliceSchema = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    content: z.array(item),
    number: z.number().optional(),
    size: z.number().optional(),
    numberOfElements: z.number().optional(),
    last: z.boolean().optional(),
    empty: z.boolean().optional(),
    pageable: z.any().optional(),
    sort: z.any().optional(),
    first: z.boolean().optional(),
  })

// ✅ 서버에서 topicRoomId가 number/string으로 올 수 있어 number로 통일
export const TopicRoomIdSchema = z.preprocess((v) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : v
}, z.number())

// ✅ UI에서 쓰는 필드만 정확히 정의 (필요시 확장)
export const TopicRoomItemSchema = z.object({
  topicRoomId: z.number(),
  topicRoomName: z.string(),
  worksName: z.string(),
  worksType: z.string().optional(),
  thumbnailUrl: z.string().nullable().optional(),
  activeUserNumber: z.number().optional(),
  lastChatTime: z.string().optional(),
  isJoined: z.boolean().optional(),
})

// swagger 상 search result가 { result: { content: [] } } 형태로 내려오는 케이스 대응
export const TopicRoomSearchWrappedSchema = z.object({
  result: z.object({
    content: z.array(TopicRoomItemSchema),
  }),
})
