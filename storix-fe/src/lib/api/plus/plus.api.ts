// src/api/plus/plus.api.ts
import { apiClient } from '@/lib/api/axios-instance'
import {
  BoardImagePresignRequest,
  BoardImagePresignResponseSchema,
  ReaderBoardCreateRequest,
  ReaderBoardCreateResponseSchema,
  ReaderReviewCreateRequest,
  ReaderReviewCreateResponseSchema,
} from './plus.schema'

/** ✅ 독자 리뷰 등록 */
export async function postReaderReview(payload: ReaderReviewCreateRequest) {
  const { data } = await apiClient.post('/api/v1/plus/reader/review', payload)
  return ReaderReviewCreateResponseSchema.parse(data)
}

/** ✅ 독자 게시글 등록 */
export async function postReaderBoard(payload: ReaderBoardCreateRequest) {
  const { data } = await apiClient.post('/api/v1/plus/reader/board', payload)
  return ReaderBoardCreateResponseSchema.parse(data)
}

/** ✅ 게시글 이미지 presigned url 발급 */
export async function postBoardImagePresignedUrls(
  payload: BoardImagePresignRequest,
) {
  const { data } = await apiClient.post('/api/v1/image/board', payload)
  return BoardImagePresignResponseSchema.parse(data)
}

/** ✅ presigned url로 S3에 PUT 업로드 */
export async function uploadToPresignedUrl(url: string, file: File) {
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  })
  if (!res.ok) throw new Error(`S3 upload failed: ${res.status}`)
}
