// src/api/profile/readerActivity.api.ts
import { apiClient } from '@/api/axios-instance'

export type SortType = 'LATEST'

export type PageResult<T> = {
  numberOfElements: number
  size: number
  content: T[]
  number: number
  first: boolean
  last: boolean
  empty: boolean
}

export type ApiEnvelope<T> = {
  isSuccess: boolean
  code: string
  message: string
  result: T
  timestamp: string
}

export type ActivityProfile = {
  userId: number
  profileImageUrl: string | null
  nickName: string
}

export type ActivityImage = {
  boardId: number
  imageUrl: string
  sortOrder: number
}

export type ActivityWorks = {
  worksId: number
  thumbnailUrl: string
  worksName: string
  artistName: string
  worksType: string
  genre: string
  hashtags: string[]
}

export type ActivityBoard = {
  userId: number
  boardId: number
  isWorksSelected: boolean
  worksId: number | null
  lastCreatedTime: string
  content: string
  likeCount: number
  isSpoiler?: boolean
  replyCount: number
  isLiked: boolean
}

/** [독자] 내가 쓴 게시글/좋아요 글 조회 아이템 */
export type ActivityBoardItem = {
  profile: ActivityProfile
  board: ActivityBoard
  images: ActivityImage[]
  works: ActivityWorks | null
  isSpoiler?: boolean
}

/** [독자] 내가 쓴 댓글 조회 아이템 */
export type ActivityReplyItem = {
  profile: ActivityProfile
  reply: {
    replyId: number
    userId: number
    boardId: number
    comment: string
    lastCreatedTime: string
    likeCount: number
    isLiked: boolean
  }
}

export async function getMyActivityBoards(params?: {
  page?: number
  sort?: SortType
}) {
  const { page = 0, sort = 'LATEST' } = params ?? {}
  const res = await apiClient.get<ApiEnvelope<PageResult<ActivityBoardItem>>>(
    '/api/v1/profile/reader/activity/board',
    { params: { page, sort } },
  )
  return res.data.result
}

export async function getMyActivityLikes(params?: {
  page?: number
  sort?: SortType
}) {
  const { page = 0, sort = 'LATEST' } = params ?? {}
  const res = await apiClient.get<ApiEnvelope<PageResult<ActivityBoardItem>>>(
    '/api/v1/profile/reader/activity/like',
    { params: { page, sort } },
  )
  return res.data.result
}

export async function getMyActivityReplies(params?: {
  page?: number
  sort?: SortType
}) {
  const { page = 0, sort = 'LATEST' } = params ?? {}
  const res = await apiClient.get<ApiEnvelope<PageResult<ActivityReplyItem>>>(
    '/api/v1/profile/reader/activity/reply',
    { params: { page, sort } },
  )
  return res.data.result
}
