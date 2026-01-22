// src/api/feed/readerBoardDelete.api.ts
import { apiClient } from '@/lib/api/axios-instance'
import type { ApiResponse } from '@/lib/api/types'

export const deleteBoard = async (
  boardId: number,
): Promise<ApiResponse<{}>> => {
  const res = await apiClient.delete(`/api/v1/feed/reader/board/${boardId}`)
  return res.data as ApiResponse<{}>
}

export const deleteReply = async (args: {
  boardId: number
  replyId: number
}): Promise<ApiResponse<{}>> => {
  const { boardId, replyId } = args
  const res = await apiClient.delete(
    `/api/v1/feed/reader/board/${boardId}/reply/${replyId}`,
  )
  return res.data as ApiResponse<{}>
}
