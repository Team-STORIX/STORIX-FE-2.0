// src/lib/api/chat/chat.schema.ts
import { z } from 'zod'

/** 공통 API 래퍼(isSuccess/code/message/result/timestamp) */
export const ApiEnvelopeSchema = <T extends z.ZodTypeAny>(result: T) =>
  z.object({
    isSuccess: z.boolean(),
    code: z.string(),
    message: z.string(),
    result,
    timestamp: z.string().optional(),
  })

/** 과거 메시지 item */
export const ChatRoomMessageSchema = z.object({
  id: z.preprocess((v) => Number(v), z.number()), // ✅
  roomId: z.preprocess((v) => Number(v), z.number()), // ✅
  senderId: z.preprocess((v) => Number(v), z.number()), // ✅
  senderName: z.string(),
  message: z.string(),
  messageType: z.string(), // ✅ ENTER/TALK/EXIT 등 서버 enum 확정되면 z.enum으로 강화 가능
  createdAt: z.string().optional().nullish(), // ✅
})

export type ChatRoomMessage = z.infer<typeof ChatRoomMessageSchema>

/**
 * Spring Page 형태(과거 메시지 조회용)
 * - nextPage 계산을 last/empty/number 기반으로 통일하기 위해
 *   number/last/empty는 default로 안전하게 둠 (필드 누락 시 파싱 실패 방지) ✅
 */
export const ChatRoomMessagePageSchema = z.object({
  content: z.array(ChatRoomMessageSchema),
  number: z.number().default(0), // ✅
  last: z.boolean().default(false), // ✅
  empty: z.boolean().default(false), // ✅
  first: z.boolean().optional(),
  size: z.number().optional(),
  numberOfElements: z.number().optional(),
  totalElements: z.number().optional(),
  totalPages: z.number().optional(),
  pageable: z.any().optional(),
  sort: z.any().optional(),
})

export type ChatRoomMessagePage = z.infer<typeof ChatRoomMessagePageSchema>
