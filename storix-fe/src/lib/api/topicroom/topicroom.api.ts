import { apiClient } from '@/lib/api/axios-instance'
import { z } from 'zod'

const ApiResponseSchema = z.object({
  isSuccess: z.boolean().optional(),
  code: z.string().optional(),
  message: z.string().optional(),
  result: z.any().optional(),
})

const TopicRoomItemSchema = z.object({
  topicRoomId: z.number(),
  topicRoomName: z.string(),
  worksType: z.string().optional(),
  worksName: z.string(),
  thumbnailUrl: z.string().nullable().optional(),
  activeUserNumber: z.number().optional(),
  lastChatTime: z.string().optional(),
  isJoined: z.boolean().optional(),
})

export type TopicRoomItem = z.infer<typeof TopicRoomItemSchema>

const SearchWrappedSchema = z.object({
  result: z.object({
    content: z.array(TopicRoomItemSchema),
  }),
})

const TodaySchema = z.array(TopicRoomItemSchema)

export async function createTopicRoom(body: {
  worksId: number
  topicRoomName: string
}) {
  const res = await apiClient.post('/api/v1/topic-rooms', body, {
    headers: { accept: '*/*' },
  })
  const parsed = ApiResponseSchema.parse(res.data)
  // swagger: result: number(=topicRoomId)
  const roomId = Number(parsed.result)
  if (!roomId || Number.isNaN(roomId))
    throw new Error('createTopicRoom: roomId 파싱 실패')
  return roomId
}

export async function joinTopicRoom(roomId: number) {
  const res = await apiClient.post(`/api/v1/topic-rooms/${roomId}/join`, null, {
    headers: { accept: '*/*' },
  })
  return ApiResponseSchema.parse(res.data)
}

export async function leaveTopicRoom(roomId: number) {
  const res = await apiClient.delete(`/api/v1/topic-rooms/${roomId}/leave`, {
    headers: { accept: '*/*' },
  })
  return ApiResponseSchema.parse(res.data)
}

export async function getTodayTopicRooms() {
  const res = await apiClient.get('/api/v1/topic-rooms/today', {
    headers: { accept: '*/*' },
  })
  const parsed = ApiResponseSchema.parse(res.data)
  return TodaySchema.parse(parsed.result)
}

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

  const parsed = ApiResponseSchema.parse(res.data)

  // swagger: result.result.content 구조
  const unwrapped = SearchWrappedSchema.safeParse(parsed.result)
  if (!unwrapped.success) return [] as TopicRoomItem[]
  return unwrapped.data.result.content
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
