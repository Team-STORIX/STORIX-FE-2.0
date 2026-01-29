// src/lib/api/topicroom/topicroom.api.ts
import { apiClient } from '@/lib/api/axios-instance'
import { z } from 'zod'
import {
  ApiEnvelopeSchema,
  MyTopicRoomSliceSchema,
  TopicRoomIdSchema,
  TopicRoomItemSchema,
  TopicRoomMemberSchema,
  TopicRoomReportRequestSchema,
  TopicRoomReportResultSchema,
  TopicRoomSearchWrappedSchema,
  TopicRoomSearchSliceSchema,
} from './topicroom.schema'

export type TopicRoomItem = z.infer<typeof TopicRoomItemSchema>
export type MyTopicRoomSlice = z.infer<typeof MyTopicRoomSliceSchema>
export type TopicRoomMember = z.infer<typeof TopicRoomMemberSchema>

//   공통
const AnyEnvelopeSchema = ApiEnvelopeSchema(z.any())

// -----------------------------
// POST /api/v1/topic-rooms (토픽룸 생성)
// -----------------------------
const CreateTopicRoomResponseSchema = ApiEnvelopeSchema(TopicRoomIdSchema)

export async function createTopicRoom(body: {
  worksId: number
  topicRoomName: string
}) {
  const res = await apiClient.post('/api/v1/topic-rooms', body, {
    headers: { accept: '*/*' },
  })
  const parsed = CreateTopicRoomResponseSchema.parse(res.data)
  return parsed.result
}

// -----------------------------
// POST /api/v1/topic-rooms/{roomId}/join (토픽룸 입장)
// -----------------------------
const CommonEnvelopeSchema = ApiEnvelopeSchema(z.any())

export async function joinTopicRoom(roomId: number) {
  const res = await apiClient.post(`/api/v1/topic-rooms/${roomId}/join`, null, {
    headers: { accept: '*/*' },
  })
  return CommonEnvelopeSchema.parse(res.data)
}

// -----------------------------
// DELETE /api/v1/topic-rooms/{roomId}/leave (토픽룸 퇴장)
// -----------------------------
export async function leaveTopicRoom(roomId: number) {
  const res = await apiClient.delete(`/api/v1/topic-rooms/${roomId}/leave`, {
    headers: { accept: '*/*' },
  })
  return CommonEnvelopeSchema.parse(res.data)
}

// -----------------------------
// GET /api/v1/topic-rooms/today (오늘의 토픽룸)
// -----------------------------
const TopicRoomListEnvelopeSchema = ApiEnvelopeSchema(
  z.array(TopicRoomItemSchema),
)

export async function getTodayTopicRooms() {
  const res = await apiClient.get('/api/v1/topic-rooms/today', {
    headers: { accept: '*/*' },
  })
  const parsed = TopicRoomListEnvelopeSchema.parse(res.data)
  return parsed.result
}

// -----------------------------
// GET /api/v1/topic-rooms/popular (지금 핫한 토픽룸)
// -----------------------------
export async function getPopularTopicRooms() {
  const res = await apiClient.get('/api/v1/topic-rooms/popular', {
    headers: { accept: '*/*' },
  })
  const parsed = TopicRoomListEnvelopeSchema.parse(res.data)
  return parsed.result
}

// -----------------------------
// GET /api/v1/topic-rooms/search (토픽룸 검색)
// - swagger: result.result.content
// -----------------------------
const SearchEnvelopeSchema = ApiEnvelopeSchema(TopicRoomSearchWrappedSchema)

export async function searchTopicRooms(params: {
  keyword: string
  page?: number
  size?: number
  sort?: string[]
}) {
  const res = await apiClient.get('/api/v1/topic-rooms/search', {
    params: {
      keyword: params.keyword,
      page: params.page ?? 0,
      size: params.size ?? 10,
      sort: params.sort ?? ['topicRoomName,ASC'],
    },
    headers: { accept: '*/*' },
  })

  const parsed = SearchEnvelopeSchema.parse(res.data)
  return parsed.result.result.content
}

export async function searchTopicRoomsSlice(params: {
  keyword: string
  page?: number
  size?: number
  sort?: string[]
}) {
  const page = params.page ?? 0
  const size = params.size ?? 20

  const content = await searchTopicRooms({
    keyword: params.keyword,
    page,
    size,
    sort: params.sort,
  })

  //   API가 page meta를 안 주는 구조라, FE에서 slice 형태로 감싸서 통일
  const slice = {
    content,
    number: page, //
    empty: content.length === 0, //
    last: content.length < size, //   (size보다 적게 오면 마지막으로 간주)
  }

  return TopicRoomSearchSliceSchema.parse(slice) //
}

// -----------------------------
// GET /api/v1/topic-rooms/{roomId}/members (참여자 목록)
// -----------------------------
const MembersEnvelopeSchema = ApiEnvelopeSchema(z.array(TopicRoomMemberSchema))

export async function getTopicRoomMembers(roomId: number) {
  const res = await apiClient.get(`/api/v1/topic-rooms/${roomId}/members`, {
    headers: { accept: '*/*' },
  })
  const parsed = MembersEnvelopeSchema.parse(res.data)
  return parsed.result
}
// -----------------------------
// GET /api/v1/topic-rooms/me (참여 중인 토픽룸 조회)
// - page/size/sort 지원
// - result가 Page/Slice 형태
// -----------------------------
const MyTopicRoomsEnvelopeSchema = ApiEnvelopeSchema(MyTopicRoomSliceSchema)

export async function getMyTopicRooms(params?: {
  page?: number
  size?: number
  sort?: string[]
}) {
  const res = await apiClient.get('/api/v1/topic-rooms/me', {
    params: {
      page: params?.page ?? 0,
      size: params?.size ?? 3,
      sort: params?.sort ?? ['topicRoom.lastChatTime,DESC'],
    },
    headers: { accept: '*/*' },
  })
  const parsed = MyTopicRoomsEnvelopeSchema.parse(res.data)
  return parsed.result
}

/**
 * 작품 상세에서 “이미 존재하면 바로 입장”을 위해:
 * - search는 keyword만 받으므로 worksName으로 검색 후
 * - worksName 정확히 같은 항목을 찾아 topicRoomId 반환
 */
export async function findTopicRoomIdByWorksName(worksName: string) {
  if (!worksName.trim()) return null
  const list = await searchTopicRooms({ keyword: worksName, page: 0, size: 10 })
  const exact = list.find((r) => r.worksName === worksName)
  return exact?.topicRoomId ?? null
}

export async function findTopicRoomInfoById(
  keyword: string,
  topicRoomId: number,
) {
  const list = await searchTopicRooms({ keyword, page: 0, size: 20 })
  return list.find((r) => r.topicRoomId === topicRoomId) ?? null
}

// -----------------------------
// POST /api/v1/topic-rooms/{roomId}/report (토픽룸 사용자 신고)
// -----------------------------
const ReportEnvelopeSchema = ApiEnvelopeSchema(TopicRoomReportResultSchema)

export async function reportTopicRoomUser(
  roomId: number,
  body: {
    reportedUserId: number
    reason: string
    otherReason?: string | null
  },
) {
  //   요청 바디 검증(필수 필드 누락 방지)
  const parsedBody = TopicRoomReportRequestSchema.parse(body) //

  const res = await apiClient.post(
    `/api/v1/topic-rooms/${roomId}/report`,
    parsedBody,
    { headers: { accept: '*/*' } },
  )

  const parsed = ReportEnvelopeSchema.parse(res.data)
  return parsed.result
}
