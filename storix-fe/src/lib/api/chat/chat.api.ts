// src/lib/api/chat/chat.api.ts
import { apiClient } from '@/lib/api/axios-instance'
import { ApiEnvelopeSchema, ChatRoomMessagePageSchema } from './chat.schema'

// -----------------------------
// GET /api/v1/chat/rooms/{roomId}/messages (채팅방 과거 메시지 조회)
// -----------------------------
const MessagesEnvelopeSchema = ApiEnvelopeSchema(ChatRoomMessagePageSchema)

export async function getChatRoomMessages(params: {
  roomId: number
  page?: number
  size?: number
  sort?: string
}) {
  const res = await apiClient.get(
    `/api/v1/chat/rooms/${params.roomId}/messages`,
    {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 20,
        sort: params.sort ?? 'createdAt,DESC',
      },
      headers: { accept: '*/*' },
    },
  )

  const parsed = MessagesEnvelopeSchema.parse(res.data)
  return parsed.result
}
