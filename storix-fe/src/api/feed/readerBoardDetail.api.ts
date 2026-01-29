// src/api/feed/readerBoardDetail.api.ts
import { apiClient } from '@/api/axios-instance'
import type { FeedSort, FeedBoardItem, PageResult } from './readerBoard.api'

type ApiResponse<T> = {
  isSuccess: boolean
  code: string
  message: string
  result: T
  timestamp: string
}

export type ReplyItem = {
  profile: {
    userId: number
    profileImageUrl: string | null
    nickName: string
  }
  reply: {
    replyId: number
    userId: number
    comment: string
    lastCreatedTime: string
    likeCount: number
    isLiked: boolean
  }
}

export type BoardDetailResult = {
  board: FeedBoardItem
  comment: PageResult<ReplyItem>
}

export const getBoardDetail = async (params: {
  boardId: number
  page: number
  sort?: FeedSort
}) => {
  const { data } = await apiClient.get<ApiResponse<BoardDetailResult>>(
    `/api/v1/feed/reader/board/${params.boardId}`,
    { params: { sort: params.sort ?? 'LATEST', page: params.page } },
  )
  return data.result
}

export const toggleReplyLike = async (params: {
  boardId: number
  replyId: number
}) => {
  const { data } = await apiClient.post<
    ApiResponse<{ isLiked: boolean; likeCount: number }>
  >(`/api/v1/feed/reader/board/${params.boardId}/reply/${params.replyId}/like`)
  return data.result
}

export const createReply = async (params: {
  boardId: number
  comment: string
}) => {
  const { data } = await apiClient.post<
    ApiResponse<{
      profile: {
        userId: number
        profileImageUrl: string | null
        nickName: string
      }
      content: { replyId: number; content: string; likeCount: number }
    }>
  >(`/api/v1/feed/reader/board/${params.boardId}/reply`, {
    comment: params.comment,
  })
  return data.result
}

/**   deleteReply는 딱 1개만! */
export const deleteReply = async (params: {
  boardId: number
  replyId: number
}) => {
  const { data } = await apiClient.delete<ApiResponse<{}>>(
    `/api/v1/feed/reader/board/${params.boardId}/reply/${params.replyId}`,
  )
  return data.result
}
