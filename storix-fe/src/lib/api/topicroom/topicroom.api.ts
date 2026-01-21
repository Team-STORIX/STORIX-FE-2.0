// src/lib/api/topicroom/topicroom.api.ts
import { apiClient } from '@/lib/api/axios-instance'
import { z } from 'zod'
import {
  ApiEnvelopeSchema,
  TopicRoomIdSchema,
  TopicRoomItemSchema,
  TopicRoomSearchWrappedSchema,
} from './topicroom.schema'

export type TopicRoomItem = z.infer<typeof TopicRoomItemSchema>

/** 토픽룸 생성 */
const CreateTopicRoomResponseSchema = ApiEnvelopeSchema(TopicRoomIdSchema)

export async function createTopicRoom(body: {
  worksId: number
  topicRoomName: string
}) {
  const res = await apiClient.post('/api/v1/topic-rooms', body, {
    headers: { accept: '*/*' },
  })

  const parsed = CreateTopicRoomResponseSchema.parse(res.data)
  return parsed.result // ✅ number(topicRoomId)
}

/** 토픽룸 입장 */
export async function joinTopicRoom(roomId: number) {
  const res = await apiClient.post(`/api/v1/topic-rooms/${roomId}/join`, null, {
    headers: { accept: '*/*' },
  })
  return ApiEnvelopeSchema(z.any()).parse(res.data)
}

/** 토픽룸 퇴장 */
export async function leaveTopicRoom(roomId: number) {
  const res = await apiClient.delete(`/api/v1/topic-rooms/${roomId}/leave`, {
    headers: { accept: '*/*' },
  })
  return ApiEnvelopeSchema(z.any()).parse(res.data)
}

/** 오늘의 토픽룸 */
const TodayResponseSchema = ApiEnvelopeSchema(z.array(TopicRoomItemSchema))

export async function getTodayTopicRooms() {
  const res = await apiClient.get('/api/v1/topic-rooms/today', {
    headers: { accept: '*/*' },
  })
  const parsed = TodayResponseSchema.parse(res.data)
  return parsed.result
}

/** 토픽룸 검색 */
const SearchResponseSchema = ApiEnvelopeSchema(
  z.union([
    // swagger: result.result.content
    TopicRoomSearchWrappedSchema,
    // 혹시 바로 slice/content로 내려오는 케이스
    z.object({ content: z.array(TopicRoomItemSchema) }),
  ]),
)

export async function searchTopicRooms(params: {
  keyword: string
  page?: number
  size?: number
  sort?: string[] // 예: ["topicRoomName,ASC"]
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

  const parsed = SearchResponseSchema.parse(res.data)

  // ✅ swagger: result.result.content
  if ('result' in parsed.result) {
    return parsed.result.result.content
  }

  // ✅ 폴백: { content: [] }
  return parsed.result.content
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
