// src/api/feed/readerFeed.api.ts
import { apiClient } from '@/lib/api/axios-instance'

export type FeedSort = 'LATEST'

export type FeedBoardImage = {
  boardId: number
  imageUrl: string
  sortOrder: number
}

export type FeedWorks = {
  worksId: number
  thumbnailUrl: string
  worksName: string
  artistName: string
  worksType: string
  genre: string
  hashtags: string[]
}

export type FeedBoardItem = {
  profile: {
    userId: number
    profileImageUrl: string | null
    nickName: string
  }
  board: {
    userId: number
    boardId: number
    isWorksSelected: boolean
    worksId: number
    lastCreatedTime: string
    content: string
    likeCount: number
    replyCount: number
    isLiked: boolean
  }
  images: FeedBoardImage[]
  works: FeedWorks | null
}

export type FeedPageResult = {
  content: FeedBoardItem[]
  number: number
  first: boolean
  last: boolean
  empty: boolean
  numberOfElements: number
  size: number
}

export type FeedPageResponse = {
  isSuccess: boolean
  code: string
  message: string
  result: FeedPageResult
  timestamp: string
}

export const getFeedBoards = async (params?: {
  sort?: FeedSort
  page?: number
}) => {
  const sort = params?.sort ?? 'LATEST'
  const page = params?.page ?? 0

  const res = await apiClient.get<FeedPageResponse>(
    '/api/v1/feed/reader/board',
    {
      params: { sort, page },
    },
  )

  return res.data
}
