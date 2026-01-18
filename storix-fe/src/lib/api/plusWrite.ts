// src/lib/api/plusWrite.ts
import { apiClient } from '@/api/axios-instance'

export type CreateReviewBody = {
  worksId: number
  rating: string // "0.5" ~ "5.0":contentReference[oaicite:6]{index=6}
  isSpoiler: boolean
  content: string
}

export type CreateBoardBody = {
  isWorksSelected: boolean
  worksId?: number
  isSpoiler: boolean
  content: string
  files?: { objectKey: string }[] // 없으면 필드 자체 생략 가능:contentReference[oaicite:7]{index=7}
}

export async function createReaderReview(body: CreateReviewBody) {
  const { data } = await apiClient.post('/api/v1/plus/reader/review', body, {
    headers: { accept: '*/*' },
  })
  return data
}

export async function createReaderBoard(body: CreateBoardBody) {
  // ✅ files가 없으면 아예 빼서 전송
  const payload: CreateBoardBody = { ...body }
  if (!payload.files || payload.files.length === 0) delete payload.files

  const { data } = await apiClient.post('/api/v1/plus/reader/board', payload, {
    headers: { accept: '*/*' },
  })
  return data
}
