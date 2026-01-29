// src/lib/api/topicroom/topicroom.schema.ts
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

/** Spring Slice/Page 형태(무한스크롤/페이지네이션용) */
export const SliceSchema = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    content: z.array(item),
    number: z.number(),
    last: z.boolean(),
    empty: z.boolean(),
    first: z.boolean().optional(),
    size: z.number().optional(),
    numberOfElements: z.number().optional(),
    pageable: z.any().optional(),
    sort: z.any().optional(),
  })

/** TopicRoom item (today/popular/search/me 공통) */
export const TopicRoomItemSchema = z.object({
  topicRoomId: z.number(),
  topicRoomName: z.string(),
  worksType: z.string().nullish(), // ✅ (undefined | null 허용)
  worksName: z.string(),
  thumbnailUrl: z.string().nullish(), // ✅
  activeUserNumber: z.number().nullish(), // ✅
  lastChatTime: z.string().nullish(), // ✅
  isJoined: z.boolean().nullish(), // ✅
})

export type TopicRoomItem = z.infer<typeof TopicRoomItemSchema>

/** 토픽룸 생성 응답: result가 number|string 형태로 올 수 있음 */
export const TopicRoomIdSchema = z.preprocess((v) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : v
}, z.number())

/** 토픽룸 검색: swagger가 result.result.content 로 내려오는 구조 */
export const TopicRoomSearchWrappedSchema = z.object({
  result: z.object({
    content: z.array(TopicRoomItemSchema),
  }),
})

/** 참여 중인 토픽룸: result가 Page/Slice 형태 */
export const MyTopicRoomSliceSchema = SliceSchema(TopicRoomItemSchema)
export type MyTopicRoomSlice = z.infer<typeof MyTopicRoomSliceSchema>

/** 토픽룸 참여자 목록 */
export const TopicRoomMemberSchema = z
  .object({
    userId: z.preprocess((v) => Number(v), z.number()), // ✅ 숫자/문자열 모두 대응
    nickName: z.string().optional(), // ✅
    nickname: z.string().optional(), // ✅ 백엔드 키 변동 대비
    profileImageUrl: z.string().nullable().optional(), // ✅ null/undefined 허용
    profileImage: z.string().nullable().optional(), // ✅ 백엔드 키 변동 대비
  })
  .transform((m) => ({
    userId: m.userId,
    nickName: m.nickName ?? m.nickname ?? '', // ✅ 최종적으로 nickName 보장
    profileImageUrl: m.profileImageUrl ?? m.profileImage ?? null, // ✅
  }))

/** 토픽룸 사용자 신고 (POST /api/v1/topic-rooms/{roomId}/report) */
export const TopicRoomReportRequestSchema = z.object({
  reportedUserId: z.number(),
  reason: z.string(), // ✅ 서버 enum이 확정되면 z.enum([...])로 강화
  otherReason: z.string().nullish(), // ✅ 기타 사유(최대 100자) - UI에서 제한
})

export type TopicRoomReportRequest = z.infer<
  typeof TopicRoomReportRequestSchema
>

export type TopicRoomMember = z.infer<typeof TopicRoomMemberSchema>
export const TopicRoomSearchSliceSchema = SliceSchema(TopicRoomItemSchema)
export type TopicRoomSearchSlice = z.infer<typeof TopicRoomSearchSliceSchema>
export const TopicRoomReportResultSchema = z.string()
export type TopicRoomReportResult = z.infer<typeof TopicRoomReportResultSchema>
